import express, {NextFunction, Request, Response} from "express";
import {param, query, validationResult} from "express-validator";

const productRouter = express.Router()

const testMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.hello = 'hello'
    next()
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.query.token === '123') next()
    else res.sendStatus(401)
}

// productRouter.use(authMiddleware)
// productRouter.use(testMiddleware)

productRouter
    .get('/:name?', param('name').notEmpty(), (req, res) => {
        const result = validationResult(req)
        if (result.isEmpty()) {
            // @ts-ignore
            const name = req.params.name
            return res.send({value: name})
        }
        res.send({errors: result.array()})
    })
/*    .get('/all', (req, res) => {
        // @ts-ignore
        res.send({value: req.hello + ' from my code'})
    })*/


export default productRouter