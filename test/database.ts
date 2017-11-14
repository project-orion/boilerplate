import {assert} from 'chai'

import * as schema from './../data/schema'
import {
    test_table_peopleAttribute,
} from '../models/db'

describe('SEQUELIZE SETUP', () => {
    it('Connection should exist', () => {
        return schema.sequelize.authenticate()
    })

    it('Model creation should work', () => {
        return schema.TestTablePeople.create({
            first_name: 'test_first_name',
            last_name: 'test_last_name',
        }).then((person: test_table_peopleAttribute) => {
            assert(person.first_name === 'test_first_name', 'First name should equal \'test_first_name\'')
        })
    })

    it('Model should fetch and update', () => {
        return schema.TestTablePeople.findOne({
            where: {
                first_name: {
                    $eq: 'test_first_name'
                },
            }
        }).then((person: test_table_peopleAttribute) => {
            assert(person.first_name === 'test_first_name', 'First name should equal \'test_first_name\'')
        })
    })

    it('Model should delete', () => {
        return schema.TestTablePeople.destroy({
            where: {
                first_name: {
                    $eq: 'test_first_name'
                },
            }
        }).then((res: any) => {
            assert(res == 1, 'Response from db should be positive')
        })
    })

    it('Connection should exit', () => {
        return schema.sequelize.close()
    })
})
