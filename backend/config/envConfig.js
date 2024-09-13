const dotenv = require('dotenv');

const loadEnv = () => {
    // override with .env.production if NODE_ENV is set to 'production'
    if (process.env.NODE_ENV === 'production') {
        dotenv.config({ path: '.env.production' });
    }
    else {
        dotenv.config();
    }
}

module.exports = loadEnv;