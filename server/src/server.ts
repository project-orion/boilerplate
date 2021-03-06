import * as express from 'express'
import * as bodyParser from 'body-parser'

// Import the various backends of the application, each of which
// has a router that defines various end points.
import {
    TestBackend,
} from './backends/backend'

const PORT = 3001

const allowCrossDomains = (req: express.Request, res: express.Response, next: () => void) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Content-Type', 'application/json')
    next()
}

// Create our backend server
const backend = express()
backend.use(bodyParser.json())
backend.use(allowCrossDomains)

// Link various routers
const testBackend = new TestBackend()
backend.use('/test_backend', testBackend.router)

// Start the backend
const server = backend.listen(PORT, () => {
    console.log('Backend server now listening on port ' + PORT + '.')
})

module.exports = server
