import express, { response } from 'express'
import {host, PORT} from './config.js'
import path from 'path'
import cookie from 'cookie-parser'
import ejs from 'ejs'
import register from './auth/register.js'
import login from './auth/login.js'
import multer from 'multer'
import fs from 'fs'
import moment from 'moment'
import 'moment/locale/uz-latn.js';

const app = express()


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookie())


app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(process.cwd(), 'src', 'views'))
app.use(express.static(path.join(process.cwd(),'src', 'public', 'css')))
app.use(express.static(path.join(process.cwd(),'src', 'public', 'icon')))
app.use(express.static(path.join(process.cwd(), 'src', 'videos')))
app.use(register)
app.use(login)

app.get('/home', (req,res) => {
    if(!req.cookies.userId) res.redirect('/login')
    else res.render('index.html')
})
app.get('/', (req,res) => {
    if(!req.cookies.userId) res.redirect('/login')
    else res.render('index.html')
})
app.get('/login', (req,res) => {
    res.render('login.html')
})
app.get('/register', (req,res) => {
    res.render('register.html')
})
app.get('/about', (req,res) => {
    res.render('about.html')
})
app.get('/add-video', (req,res) => {
    res.render('add-video.html')
})
app.get('/video', (req,res) => {
    res.end(fs.readFileSync(path.join(process.cwd(), 'src', 'database', 'videos.json'), 'utf-8'))
})


const storageVideo = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/videos')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storageVideo})

app.post('/add-video', upload.single('video'),(req,res) => {
    try{
        if(req.file.mimetype == 'video/mp4'){
            fs.readFile(path.join(process.cwd(), 'src', 'database', 'videos.json'), 'utf-8', (err, data) => {
                data = data ? JSON.parse(data) : []
                let users = fs.readFileSync(path.join(process.cwd(), 'src', 'database', 'users.json'), 'utf-8')
                users = users ? JSON.parse(users    ) : []
                let user = users.find(val => val.userId == req.cookies.userId)
                let newVideo = {
                    videoId: data.length ? data[data.length - 1].videoId+1 : 1,
                    videoName: req.body.videoName,
                    videoPath: req.file.filename,
                    userId: req.cookies.userId,
                    date: moment().format('LLLL'),
                    user: user
                }
                data.push(newVideo)
                fs.writeFileSync(path.join(process.cwd(), 'src', 'database', 'videos.json'), JSON.stringify(data, null, 4))
            })
        }else{
            fs.unlink(path.join(process.cwd(), req.file.path), (err) =>{
                return err
            })
        }
    }catch(err){
        console.log(err);
    }
})

app.listen(PORT, () => console.log(`server starting http://${host}:${PORT}`))



