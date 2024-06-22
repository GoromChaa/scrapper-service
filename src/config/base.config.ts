require("dotenv").config();

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  AMQP_URI: process.env.AMQP_URI,
};

export default config;
