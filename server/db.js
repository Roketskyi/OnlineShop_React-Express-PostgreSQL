const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: '0808',
    port: 5432,
    database: "base_auth"
});

module.exports = pool;