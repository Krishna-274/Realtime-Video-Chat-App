const express = require('express');
const app= express();//initialise express
const server = require('http').Server(app);
const io= require('socket.io')(server)
const{v4:uuidv4}= require('uuid');//importing uuid,v4 is function and we are renaming it as uuidv4

app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req ,res) => {
    res.redirect(`/${uuidv4()}`);
})
app.get('/:room',(req, res) => {
    res.render('room',{ roomId: req.params.room})//roomId is parameter
})
io.on('connection', socket => {
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        socket.to(roomId).emit("user-connected", userId);
        socket.on('disconnect',() =>{
            socket.to(roomId).emit("user-disconnected", userId);
            socket.on('message',message => {
                io.to(roomId).emit('createMessage',message)
            })
        })
    })
})




server.listen(3000)