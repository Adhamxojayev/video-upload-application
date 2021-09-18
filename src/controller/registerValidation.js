import {registerJoi} from './validation.js'
import md5 from 'md5'
import path from 'path'
import fs from 'fs'

const registerValidation = (req, res) => {
    try{
        if(!req.body.username) throw new Error('username required')
        let data = registerJoi.validate(req.body)
        if(!(data.value.username.match(data.value.username.toLowerCase()))) throw new Error('username Enter only lowercase')
        if(!data.error){
            let users = fs.readFileSync(path.join(process.cwd(), 'src', 'database', 'users.json'), 'utf-8')
            users = users ? JSON.parse(users) : []
            let user = users.find(user => user.username == data.value.username)
            if(user) throw new Error('such a username exists')
            let newUser = {
                userId: users.length ? users[users.length - 1].userId + 1 : 1,
                username: data.value.username,
                fullname: data.value.fullname,
                email: data.value.email,
                password: md5(data.value.password)
            }
            res.cookie('userId', newUser.userId)
            users.push(newUser)
            fs.writeFileSync(path.join(process.cwd(), 'src', 'database', 'users.json'), JSON.stringify(users,null,4))
            res.status(201).json({status:201, message: 'you are registered' })
        }else{
            res.status(401).json({status:401, message: data.error.details[0].message })
        }
    }catch(err){
        res.status(401).json({status: 401, message: err.message})
    }
}

export default registerValidation