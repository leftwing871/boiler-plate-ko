const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000

mongoose.connect('mongodb+srv://master:Master1!@boilerplate.wulgc.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`example app listening on port ${port}`))


