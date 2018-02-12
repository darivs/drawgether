var socket;
var drawEnabled = false;
var date;

function setup() {
    socket = io();
    var spielfeld = createCanvas(995, 700);
    spielfeld.parent('spielfeld');
    background(255);
    
    socket.on('noname', function(data){
        document.getElementById('chat').innerHTML += '<div id ="chatMessage"> !!! '+ data +'</div>';
    });
    
    socket.on('draw', function(data){
        noStroke();
        fill(50);
        ellipse(data.x, data.y, 15, 15);
    });
    
    socket.on('write', function(data){
        date = new Date();
        if (data.msg != "") {
            document.getElementById('chat').innerHTML += '<div id ="chatMessage">&nbsp;<font size="4.5px">&#91;'+date.getHours()+'&#58;'+date.getMinutes()+'&#93;</font> <b>' + data.username + '</b>: ' + data.msg + '</div>';
        }
    });
    
    socket.on('userconnected-msg', function(data){
        document.getElementById('chat').innerHTML += '<div id ="chatMessage">&nbsp;<font color="#1e1e4b" size="4px"><b><i>' + data.username +' ist beigetreten!</font></i></b></div>';
        document.getElementById('chat').innerHTML += '<div id ="chatMessage">&nbsp;<font color="#1e1e4b" size="4px"><b><i>' + data.conns +' Spieler verbunden!</font></i></b></div>';
    })
}

function draw() {
    if (mouseIsPressed && drawEnabled){
        socket.emit('mouse', {x: mouseX, y: mouseY});
    }
}

function sendMsg(e) {
    e = e || event;
    if (e.keyCode == 13 || e.which == 13) {
        socket.emit('chat message', {msg: document.getElementById('textarea').value});
        document.getElementById('textarea').value = '';
        //document.getElementById('textarea').focus();
    }
}

function fadeInGame(){
    //if (document.getElementById('input-name').value != "") {
        socket.emit('username', {username: document.getElementById('input-name').value});
    //}
    
    drawEnabled = true;
    document.getElementById('spielfeld').style.display = 'block';
    document.getElementById('chat').style.display = 'block';
    document.getElementById('chat').style.background = 'linear-gradient(to bottom right, #008fb3, #ffffff)';
    document.getElementById('textarea').style.display = 'block';
    document.getElementById('h1-header').style.display = 'block';
    document.getElementById('pop-up').style.display = 'none';
    //document.getElementById('body').style.backgroundColor = '#f44250';
    document.getElementById('body').style.background = 'linear-gradient(to right, #008fb3, #00ccff, #008fb3)';
    
}