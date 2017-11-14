import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {
    appState,
    testPerson
} from '../types'
import * as actions from '../actions'

const mapReduxStateToReactProps = (state : appState): appState => {
    return state
}

function reduxify(mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) {
    return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

@reduxify(mapReduxStateToReactProps)
export class App extends React.Component<appState, any> {
    constructor(props: appState) {
        super(props)
    }

    sendFetchAction() {
        this.props.dispatch(actions.fetchPerson('test_backend/'))
    }

    render () {
        let {people, loading} = this.props

        let loadingMessage = loading ? <span>Loading...</span> : null

        const peopleList = people.map((person: testPerson) => {
                return (
                    <li key={person.loadedTime}>
                        <div>
                            <span>First Name: {person.first_name}</span><br/>
                            <span>Last Name: {person.last_name}</span>
                        </div>
                        <div>
                            <span>Loaded Time: {person.loadedTime}</span>
                        </div>
                    </li>
                )
            })

        return (
            <div>
                {loadingMessage}
                <button onClick={() => this.sendFetchAction()}>Fetch Person</button>
                <ul>
                    {peopleList}
                </ul>
            </div>
        )
    }
}
