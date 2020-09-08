const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 4009

const { auth } = require("./middleware/auth")
const { User } = require("./models/User")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

const config = require('./config/key')

//application/json
app.use(bodyParser.json())
app.use(cookieParser())

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!!!~'))


app.post('/api/users/register', (req, res) => {
    
    console.log('enter register')

    const user = new User(req.body)
    user.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {

    console.log('/login step1')
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email}, (err, user) => {
        if(!user)
            return res.json({loginSuccess: false, message: "제공된 이메일에 해당하는 유저가 없습니다."})
        
        console.log('/login step2')   
        //있다면 비밀번호가 같은지 확인 한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            console.log('/login step3-1')   
            if(err) return res.json({success: false, err})
            console.log('/login step3-2')

            if(!isMatch)
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

            console.log('/login step3')
            //비밀번호 까지 맞다면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //토큰을 저장한다. 어디에? 쿠키, LOCAL STORAGE ...
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id})
                
            })

        })
    })
})


app.get('/api/users/auth', auth, (req, res) => {
    //여기 까지 미들웨어를 통과해 왔다는 예기는 Authentication 이 True 라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name:req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})


app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, 
        {token:""}, (err, user) => {

            if (err) return res.json({success: false, err});
            return res.status(200).send({success: true})

        })
})

app.listen(port, () => console.log(`example app listening on port ${port}`))


