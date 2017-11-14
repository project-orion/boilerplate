import {
    action,
    testPerson,
} from './types'

import config from './config'
const serverUrl = config('app').serverURL

export function fetchPerson(url: string): action {
    return {
        type: 'FETCH_PERSON',
        promise: (dispatch, getState) => {
            dispatch(loading())

            fetch(serverUrl + url).then((res: any) => {
                return res.json()
            }).then( (json: testPerson) => {
                dispatch(receivedPerson(json))
            }).catch( (err: any) => {
                console.log(err)
                dispatch(fetchFailed(err))
            })
        },
    }
}

export function loading(): action {
    return {
        type: 'LOADING',
    }
}

export function receivedPerson(response: testPerson): action {
    return {
        type: 'FETCH_PERSON_SUCCESS',
        value: response,
    }
}

export function fetchFailed(err: any): action {
    return {
        type: 'FETCH_FAILURE',
        value: err,
    }
}
