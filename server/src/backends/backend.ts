import {
    Request,
    Response,
    Router,
} from 'express'

import {
    TestTablePeople,
} from './../database'


const options = {
    raw: true,
    logging: false // Change this line if a verbose script is needed.
}

export class TestBackend {
    public router: Router;

    constructor() {
        // Create public Router
        this.router = Router({mergeParams: true});

        // Init all end points of the Router
        this.router.route('/')
            .get(async (request: Request, response: Response) => {
                // Get flat results (Sequelize normally returns complex Instance objects
                // which are later parsed by express when calling response.json()
                const entry = await TestTablePeople.findById(1, {
                    ...options,
                })

                response.json({
                    entry,
                })
            })
    }
}
