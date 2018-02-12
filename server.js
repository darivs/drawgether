var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server läuft...');

app.get('/', function(req,res){
    res.sendFile(__dirname + '/client/index.html');
})

app.use(express.static(__dirname + '/client'));

io.sockets.on('connection', function(socket) {
    socket.name = "";
    console.log('Verbunden: ' + connections.length + ' Spieler verbunden');
    
    // Disconnect
    socket.on('disconnect', function(socket) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('1 Spieler hat das Spiel verlassen, Spieler verbunden: ' + connections.length);
    });
    
    socket.on('mouse', function(data){
        //console.log(data);
        io.sockets.emit('draw', {x:data.x, y:data.y});
    });
    
    socket.on('chat message', function(data){
        if  (socket.name != ""){
            io.sockets.emit('write', {msg:data.msg, username:socket.name});
        } else {
            socket.to(socket.id).emit('noname', "Du hast keinen Namen");
        }
    });
    
    socket.on('username', function(data){
        var nameused = false;
        for (i = 0; i < connections.length; i++){
            console.log(connections[i].name + " jo");
            if (connections[i].name == data.username)
                {
                    nameused = true;
                }
        }
        if (nameused == false){
            //console.log("test " + socket.name);
            socket.name = data.username;
            connections.push(socket);
            io.sockets.emit('userconnected-msg', {username:socket.name, conns:connections.length});
        }
    })
});