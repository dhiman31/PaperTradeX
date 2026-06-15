const authRepository = require('../repository/authRespository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_KEY, JWT_EXP } = require('../config/serverConfig');
const generateOTP = require("../utils/otpGenerator");
const redisClient = require("../config/redisClient");
const { producer } = require("../utils/kafkaProducer");
const createPortfolio = require('./createPortfolio')

class authService {

    constructor() {
        this.authRepo = new authRepository();
    }

    async register(data) {
        try {
            const user = await this.authRepo.register(data);
            return user;
        } catch (error) {
            console.log("Error in auth service");
            throw error;
        }
    }

    async login(data) {
        try {

            if (!data.email || !data.passwordHash) {
                throw new Error("Invalid Request");
            }

            const user = await this.authRepo.findUserByEmail({
                email: data.email
            });

            if (!user) {
                throw new Error("User not found");
            }

            const checkPassword = await bcrypt.compare(
                data.passwordHash,
                user.passwordHash
            );

            if (!checkPassword) {
                throw new Error("Invalid Password");
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    isVerified: user.isVerified
                },
                JWT_KEY,
                {
                    expiresIn: JWT_EXP
                }
            );

            try {
                await createPortfolio(data.id);
            } catch (err) {
                console.log("Failed to create portfolio, will retry later:", err.message);
            }

            return token;

        } catch (error) {
            console.log("Error while login in auth service");
            throw error;
        }
    }

    async verifyToken(token) {
        try {

            const response = jwt.verify(token, JWT_KEY);
            return response;

        } catch (error) {

            console.error("JWT verification failed:", error.message);
            throw new Error("Invalid or expired token");

        }
    }

    async isAuthenticated(token) {
        try {
            const response = await this.verifyToken(token);
            if (!response) {
                throw new Error("Invalid Token");
            }
            const user = await this.authRepo.findUserByEmail({
                email: response.email
            });

            if (!user) {
                throw new Error("User no longer exists");
            }
            return response;
        } catch (error) {
            console.log("Problem in the service layer");
            throw error;
        }
    }

    async deleteAccount(data) {
        try {
            await this.authRepo.deleteAccount(data.id);
            return true;
        } catch (error) {
            console.log("Cannot delete the account");
            throw error;
        }
    }

    async storeOTPRedis(data){
        try {
            await redisClient.set(
                `otp:${data.id}`,
                data.otp,
                {
                EX: 300,
                }
            );
        } catch (error) {
            console.log("Error in storing OTP to REDIS")
            throw error
        }
    }

    async sendToKafka(data){
        try {
            await producer.send({
                topic: "notification-events",
                messages: [
                {
                    value: JSON.stringify({
                    type: "EMAIL_VERIFICATION",
                    email: data.email,
                    otp: data.otp
                    }),
                },
                ],
            });

        } catch (error) {
            console.log("Could not send to Kafka")
            throw error;
        }
    }

    async initiateVerification(data) {
        try {

            const user = await this.authRepo.findUserByEmail({
                email : data.email
            })
            if(user.isVerified){
                throw new Error("Already Verified!!")
            }
            const otp = generateOTP();
            await this.storeOTPRedis({
                id: data.id,
                otp : otp
            })
            await this.sendToKafka({
                email : data.email,
                otp : otp
            })
            return true;
        } catch (error) {
            throw error;
        }
    }

    async verifyEmailViaOTP(data){
        try {
            const storedOTP = await redisClient.get(
                `otp:${data.id}`
            );
            
            // OTP Expired
            if (!storedOTP) {
                throw new Error("OTP Expired");
            }

            // wrong OTP
            if (storedOTP !== data.otp) {
                throw new Error("Invalid OTP");
            }

            // update verification status
            const response = await this.authRepo.updateVerificationStatus({
                id : data.id,
                email : data.email
            })

            // delete the OTP
            await redisClient.del(`otp:${data.id}`);
                return {
                message: "Email Verified Successfully",
            };
        } catch (error) {
            console.log("Error in veryfing the OTP")
            throw error
        }
    }
}

module.exports = authService;