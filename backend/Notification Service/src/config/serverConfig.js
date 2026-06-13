const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    EMAIL_ID : process.env.EMAIL_ID,
    EMAIL_PASS : process.env.EMAIL_PASS,
    KAFKA_BROKER_IP : process.env.KAFKA_BROKER_IP
}