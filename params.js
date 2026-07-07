require('dotenv').config();

const params = {
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: Number(process.env.PORT) || 3004,
    get url() {
      return `http://${this.host}:${this.port}`;
    },
  },
};

module.exports = params;
