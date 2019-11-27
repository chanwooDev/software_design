var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');
var compression = require('compression')
//////Templates
var loginTemplate = require('./lib/loginTemplate.js');
var borderTemplate = require('./lib/borderTemplate.js');
var circleTemplate = require('./lib/circleTemplate.js');
var homeTemplate = require('./lib/homeTemplate.js');
var viewerTemplate = require('./lib/viewerTemplate.js');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/comment',express.static('public'));
app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

app.get('/', function(request, response){

  if(false){  // 쿠키 체크
    alert("로그인이 필요합니다");
    response.redirect('/');
  }
  var html = homeTemplate.html();
  response.send(html);
});
app.get('/login_page', function(request, response){
  var html = loginTemplate.html();
  response.send(html);
});

app.post('/login_process', function(request, response){
  fs.readdir('./data/loginData', function(error, filelist){
  })

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
  var html = circleTemplate.html(request.query.id);
  response.send(html);
});

app.get('/board_page', function(request, response){
  console.log('im in board');
  var html = borderTemplate.html(request.query.id);
  response.send(html);
});

// app.get('/viewer', function(request, response){
//   console.log('viewer!!');
//   var html = viewerTemplate.html(request.query.id);
//   response.send(html);
// });

app.get('/comment', function(request, response){
  var comment = new Array();

  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
  });

 ////readFileSync 로만 작동....
  for(var i=0; i<request.list.length; i++){
    var fname = request.list[i];
    comment[i] = fs.readFileSync(`./data/${fname}`, 'utf8');
  }

  var html = viewerTemplate.html(request.query.id,request.list,comment);
  response.send(html);
});


app.post('/comment_createprocess', function(request, response){
  var post = request.body;
  var author = post.author;
  var description = post.comment;
  fs.writeFile(`data/${author}`, description, 'utf8', function(err) {
    response.redirect('/comment');
  });
});

app.listen(3000);
