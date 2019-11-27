/*jshint esversion: 6 */

var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');

var compression = require('compression')

var loginTemplate = require('./lib/loginTemplate.js');
var circleMainTemplate = require('./lib/circleMainTemplate.js');
var circleTemplate = require('./lib/circleTemplate.js');
var boardTemplate = require('./lib/boardTemplate.js');
var homeTemplate = require('./lib/homeTemplate.js');
var viewerTemplate = require('./lib/viewerTemplate.js');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');

var push = require('push.js');


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
  push.create('Hello World!');
  if(false){  // 쿠키 체크
    alert("로그인이 필요합니다");
    response.redirect('/');
  }


  db.query(`SELECT * FROM board`, function(error, result){
    var boards = ``;
    for(var i=result.length-1; i>=0; i--){
      var boardPointer = homeTemplate.boardPointer(result[i].title, result[i].author, result[i].id, result[i].date);
      boards += boardPointer;
    }
    var html = homeTemplate.html(boards);
    response.send(html);
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
app.get('/board_page', function(request, response){
  db.query('SELECT * FROM board', function(error, boards){
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM board WHERE id=?`,[request.query.id], function(error2, board){
      if(error2){
        throw error2;
      }
      db.query(`SELECT * FROM comment WHERE id=?`,[request.query.id], function(error3, comments){
        if(error3){
          throw error3;
        }
        var comment = '';
        for(var i=0; i<comments.length; i++){
          comment += viewerTemplate.comment_form(comments[i].author, comments[i].description);
        }
        var create_form = boardTemplate.create_form(request.query.id);
        var html = boardTemplate.html(board[0].title, board[0].author, board[0].date, '', board[0].description, '', comment, create_form);
        response.send(html);
      });
    });
  });
});
app.get('/circles', function(request, response){
  console.log(request.query.id);
  var html = circleTemplate.html();//title,author,date,image,body,list
  response.send(html);
});


app.get('/board_page', function(request, response){
  console.log('im in board');
  var html = borderTemplate.html(request.query.id);
});


app.get('/circle_main', function(request, response){
  var html = circleTemplate.html();
  response.send(html);
});

// app.get('/viewer', function(request, response){
//   console.log('viewer!!');
//   var html = viewerTemplate.html(request.query.id);
//   response.send(html);
// });


app.post('/comment_createprocess', function(request, response){
  var post = request.body;
  var author = post.author;
  var description = post.comment;
  fs.writeFile(`data/${author}`, description, 'utf8', function(err) {
    response.redirect('/comment');
  });
});

app.listen(3000);
