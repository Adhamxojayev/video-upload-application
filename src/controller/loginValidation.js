import fs from 'fs'
import md5 from 'md5'
import path from 'path'

const loginValidation = (req,res) => {
    try {
        let data = req.body
        let users = fs.readFileSync(path.join(process.cwd(), 'src', 'database', 'users.json'), 'utf-8')
        users = users ? JSON.parse(users) : []
        let user = users.find(user => user.username == data.username && user.password == md5(data.password))
        if(user) {
            res.cookie('userId', user.userId)
            res.status(201).json({status:201, message: 'welcome'})
        }
        else throw new Error('username or password entered incorrectly')

    } catch (err) {
        res.status(401).json({status:401, message: err.message})
    }
}

export default loginValidation