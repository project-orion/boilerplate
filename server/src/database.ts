// This file creates a unique Sequelize instance used by the backend.
// It also imports models and links them to this unique instance of Sequelize.
// These imports are used later on in the code where the various routers and
// end points of the API are defined (that is to say, for now, mainly in ./resources).

import * as Sequelize from 'sequelize'
import * as path from 'path'
import config from './../../config'
const DB_CONFIG = config('database')

// Start a new Sequelize instance which will be globally used
// over the backend.
export const sequelize = new Sequelize(
    DB_CONFIG.database,
    DB_CONFIG.username,
    DB_CONFIG.password,
    {
        host: DB_CONFIG.host,
        dialect: DB_CONFIG.dialect
    }
);

// Import automatically generated models.

export const TestTablePeople = sequelize.import(__dirname + '/../../models/test_table_people')
