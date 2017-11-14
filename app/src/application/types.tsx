import * as redux from 'redux'
import {
    test_table_peopleAttribute,
} from '../../../models/db'

export interface testPerson extends test_table_peopleAttribute {
    loadedTime: number,
}

export interface appState {
    people: testPerson[],
    loading: number,
    dispatch?: redux.Dispatch<any>,
}

export interface action {
    type: string,
    promise?: (dispatch: any, getState: any) => any,
    value?: any,
}
