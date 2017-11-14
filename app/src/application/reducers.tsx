import {
    action,
    appState,
    testPerson,
} from './types'

const initialAppState: appState = {
    people: [],
    loading: 0,
}

export function reducer(state = initialAppState, action: action): appState {
    switch (action.type) {
        case 'LOADING':
            return {
                ...state,
                loading: state.loading + 1,
            }

        case 'FETCH_PERSON_SUCCESS':
            return {
                ...state,
                people: [
                    ...state.people,
                    {
                        ...action.value.entry,
                        loadedTime: Date.now(),
                    }
                ],
                loading: state.loading - 1,
            }

        case 'FETCH_FAILURE':
            return {
                ...state,
                loading: state.loading - 1,
            }

        default:
            return state
    }
}
