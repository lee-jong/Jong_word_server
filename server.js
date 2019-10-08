const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 4000

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/static', express.static(__dirname + '/images/imgBoard'))
app.use('/static2', express.static(__dirname + '/images/developerBoard'))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

//my sql config
const imgboard = require('./action/imgboard')
imgboard(app)
const developer = require('./action/developer')
developer(app)
const login = require('./action/login')
login(app)
const dataProcessing = require('./action/dataProcessing')
dataProcessing(app)

io.on('connection', function(socket) {
    console.log('user connected', socket.id)

    socket.on('disconnect', function() {
        console.log('user disconnect', socket.id)
    })

    socket.on('call', msg => {
        socket.broadcast.emit('offer', msg)
    })

    socket.on('answer', answer => {
        socket.broadcast.emit('answer', answer)
    })

    socket.on('icecandidate', icecandidate => {
        socket.broadcast.emit('icecandidate', icecandidate)
    })

    socket.on('send', function(name, text) {
        let msg = name + ' : ' + text
        io.emit('receive', msg)
    })
})

http.listen(port, () => {
    console.log(`connected at ${port}`)
})
