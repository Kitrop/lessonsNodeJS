import {body, param} from "express-validator";

export const HTTP_STATUSES = {
    OK200: 200,
    Created201: 201,
    NoContent204: 204,
    NotFound404: 404,
    BadRequest400: 400,
}


export const bodyNameRequired = body('name')
    .matches(/^[^0-9]+$/, "g").withMessage('Incorrect name. The name should consist of letters only').trim()
    .notEmpty().withMessage('Incorrect name. The name cannot be empty').isLength({
        min: 2,
        max: 100
    }).escape()

export const bodyPassRequired = body('password').isStrongPassword().trim().notEmpty().escape()
export const idParamRequired = param('id').notEmpty().escape()

export const putValidation = body().custom((value, { req }) => {
    if (!req.body.name && !req.body.password) {
        throw new Error('Either name or password is required');
    }
    return true;
})


const adas = () => {
    body('name').exists().notEmpty(), body('password').exists().notEmpty(), putValidation
}