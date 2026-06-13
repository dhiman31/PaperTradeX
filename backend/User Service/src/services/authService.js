const authRepository = require('../repository/authRespository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_KEY, JWT_EXP } = require('../config/serverConfig');

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

    async verifyEmail(data) {
        try {
            await this.authRepo.updateVerificationStatus(data);
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = authService;