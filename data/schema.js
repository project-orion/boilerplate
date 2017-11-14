const path = require('path')

const Sequelize = require('sequelize')
const DB_CONFIG = require(path.join(__dirname, '../config')).default('database')

const sequelize = new Sequelize(
    DB_CONFIG.database,
    DB_CONFIG.username,
    DB_CONFIG.password,
    {
        host: DB_CONFIG.host,
        dialect: DB_CONFIG.dialect,
        logging: true //Change if debugging is needed.
    }
)

const TestTablePeople = sequelize.define('test_table_people', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
})

exports.sequelize = sequelize
exports.TestTablePeople = TestTablePeople
