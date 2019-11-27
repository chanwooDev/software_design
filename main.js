/*jshint esversion: 6 */

var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');
var compression = require('compression');
var loginTemplate = require('./lib/loginTemplate.js');
var circleMainTemplate = require('./lib/circleMainTemplate.js');
var circleTemplate = require('./lib/circleTemplate.js');
var boardTemplate = require('./lib/boardTemplate.js');
var homeTemplate = require('./lib/homeTemplate.js');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');

var mysql = require('mysql');
var board_page = require('./routes/board_page.js')(app);
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'CIRCLE',
  port : '3300'
});
db.connect();

app.use('/board_page', board_page);
app.use('/static', express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(request, response){

  if(false){  // 쿠키 체크
    alert("로그인이 필요합니다");
    response.redirect('/');
  }


  db.query(`SELECT * FROM board`, function(error, result){
    var boards = ``;
    for(var i=0; i<result.length; i++){
      var boardPointer = homeTemplate.boardPointer(result[i].title, result[i].author, result[i].id, result[i].date);
      boards += boardPointer;
    }
    var html = homeTemplate.html(boards);
    response.send(html);
  });
});
app.get('/board_page', function(request, response){
  db.query('SELECT * FROM board', function(error, boards){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM board WHERE id=?`,[request.query.id], function(error2, board){
      if(error2){
        throw error2;
      }
      var html = boardTemplate.html(board[0].title, board[0].author, board[0].date, '', board[0].description, '');
      response.send(html);
    });
  });
});

app.get('/login_page', function(request, response){
  var html = loginTemplate.html();
  response.send(html);
});
app.post('/login_process', function(request, response){
  fs.readdir('./data/loginData', function(error, filelist){


  });
  if(true){     //로그인 맞으면
    //쿠키 생성
    response.redirect('/');

  }
  else{
    alert("아이디 혹은 비밀번호가 틀렸습니다");
    response.redirect('/login_page');
  }
});
app.get('/circles', function(request, response){
  console.log(request.query.id);
  var html = circleTemplate.html();//title,author,date,image,body,list
  response.send(html);
});



app.get('/circle_main', function(request, response){
  var html = circleTemplate.html();
  response.send(html);
});








app.listen(3000);
