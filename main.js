var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');
var compression = require('compression');
var joinTemplate = require('./lib/joinTemplate.js');
var loginTemplate = require('./lib/loginTemplate.js');
var circleMainTemplate = require('./lib/circleMainTemplate.js');
var circleTemplate = require('./lib/circleTemplate.js');
var homeTemplate = require('./lib/homeTemplate.js');
var mysql = require('./mysqlDB.js');

mysql.connect();

var helmet = require('helmet');
var cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

console.log("익스프레스 실행");

app.get('/',function(request,response){
  var html = homeTemplate.html();
  response.send(html);
});

app.get('/login', function(request, response){
  var html = loginTemplate.html();
  response.send(html);
  /*if(false){  // 쿠키 체크
    alert("로그인이 필요합니다");
    response.redirect('/');
  }
  var html = homeTemplate.html();
  response.send(html);*/
});

app.post('/login_process', function(request,response){
  var post=request.body;
  var id=post.ID;
  var pw=post.PW;
  
  var sql="SELECT * FROM user WHERE ID=?";
  mysql.query(sql,[id],function(err,results){
    if(err)
      console.log(err);

    if(!results[0])
      response.send(`
      <script type = "text/javascript">alert("없는 아이디 입니다.");
      location.href='/login';
      </script>
      `);
    else
    {
      var user=results[0];
      if(pw === user.PW){
        response.cookie('authority',results.AUTHORITY);
        response.send(`
            <script type = "text/javascript">alert("로그인 성공");
            location.href='/';
            </script>
            `);
      }
      else
      {
        response.send(`
            <script type = "text/javascript">alert("비밀번호가 다릅니다.");
            location.href='/login';
            </script>
            `);
      }
    }
  });
});

app.get('/join', function(request, response){
  var html = joinTemplate.html();
  response.send(html);
});

app.post('/create_process',function(request,response){
  console.log("createprocess");
  var post = request.body;
  console.log(post);
  var userId = post.ID;
  var userPw = post.password;
  var userName = post.name;
  var userAuthority = post.authority;
  
    mysql.query('insert into user values(?,?,?,?)', [userId, userPw, userName, userAuthority], function (err, rows, fields) {
      if (!err) {
           response.send(`
           <script type = "text/javascript">alert("회원가입 성공");
           location.href='/login';
           </script>
           `);
      } else {
           response.redirect('/join');
      }
    });
    //response.redirect('/login');
  // fs.writeFile(`./UserData/${ID}`, PW, 'utf8', function(err){
  //   response.redirect('/login');
    //response.send(302,{Location:`/?id=${ID}`});
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


app.listen(8000);
