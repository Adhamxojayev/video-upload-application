import Joi from 'joi'

const registerJoi = Joi.object({
    username: Joi.string().alphanum().min(3).max(40).required(),
    fullname: Joi.string().min(5).max(50).required(),
    email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).min(4).required(),
    password: Joi.string().min(8).alphanum()
})

const userJoi = Joi.object({
    username: Joi.string().alphanum().min(2).max(40),
    fullname: Joi.string().alphanum().min(5).max(50)
})

export {
    registerJoi,
    userJoi
}    
