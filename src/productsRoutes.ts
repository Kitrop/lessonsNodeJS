import express, {NextFunction, Request, Response} from "express";

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

productRouter.use(authMiddleware)
productRouter.use(testMiddleware)

productRouter
    .get('/', testMiddleware, (req, res) => {
        // @ts-ignore
        res.send({value: req.hello + "!!!"})
    })
    .get('/all', (req, res) => {
        // @ts-ignore
        res.send({value: req.hello + ' from my code'})
    })


export default productRouter