
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
var joinTemplate = require('./lib/joinTemplate.js');
var viewerTemplate = require('./lib/viewerTemplate.js');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');

var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'CIRCLE',
  port : '3300'
});
db.connect();
var board_page = require('./routes/board_page.js')(app);


app.use('/board_page', board_page);
app.use('/static', express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function(request, response){
  if(!(request.cookies.name)){  // 쿠키 체크
    response.send(`
      <script type = "text/javascript">alert("로그인이 필요합니다.");
      location.href='/login';
      </script>
      `);
      next();
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

  var sql="SELECT * FROM user WHERE id=?";
  db.query(sql,[id],function(err,results){
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
      if(pw === user.pw){
        response.cookie('authority',user.authority);
        response.cookie('name',user.name);
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

app.post('/join/create_process',function(request,response){
  console.log("createprocess");
  var post = request.body;
  console.log(post);
  var userId = post.ID;
  var userPw = post.password;
  var userName = post.name;
  var userAuthority = post.authority;

    db.query('insert into user values(?,?,?,?)', [userId, userPw, userName, userAuthority], function (err, rows, fields) {
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

app.get('/circle_main', function(request, response){
  var html = circleTemplate.html();
  response.send(html);
});

// app.get('/viewer', function(request, response){
//   console.log('viewer!!');
//   var html = viewerTemplate.html(request.query.id);
//   response.send(html);
// });


app.post('/comment/createprocess', function(request, response){
  var post = request.body;
  var id = request.query.id;
  var author = request.cookies.name;
  var description = post.comment;
  db.query(`INSERT INTO comment (author, description, id)
    VALUES(?, ?, ?)`,[author, description, id], function(error3, comments){
      if(error3){
        throw error3;
      }
  });
  response.redirect(`/board_page?id=${id}`);
});
app.listen(3000);
