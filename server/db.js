const Sequelize = require('sequelize');

const sequelize = new Sequelize('base_auth', 'postgres', '0808', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = sequelize;
