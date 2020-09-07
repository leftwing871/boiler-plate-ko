const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000

const { User } = require("./models/User")
const bodyParser = require("body-parser")

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

const config = require('./config/key')

//application/json
app.use(bodyParser.json())

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!!!~'))


app.post('/register', (req, res) => {
    
    const user = new User(req.body)
    user.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => console.log(`example app listening on port ${port}`))


