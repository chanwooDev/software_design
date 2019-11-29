
/*jshint esversion: 6 */

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
var circleCreateTemplate = require('./lib/circleCreateTemplate.js');
var circleMainTemplate = require('./lib/circleMainTemplate.js');
var circleTemplate = require('./lib/circleTemplate.js');
var reservationTemplate = require('./lib/reservationTemplate.js');
var boardTemplate = require('./lib/boardTemplate.js');
var homeTemplate = require('./lib/homeTemplate.js');
var formTemplate = require('./lib/formTemplate.js');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');

var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'circle',
  port : '3300'
});
db.connect();
var board_page = require('./routes/board_page.js')(app);
var circle_main = require('./routes/circle_main.js')(app);

app.use('/board_page', board_page);
app.use('/circle_main', circle_main);
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
  }
  else{
    db.query(`SELECT * FROM board`, function(error, result){
      var boards = ``;
      for(var i=result.length-1; i>=0; i--){
        var boardPointer = homeTemplate.boardPointer(result[i].title, result[i].author, result[i].id, result[i].date);
        boards += boardPointer;
      }
      db.query(`SELECT * FROM circles`,function(error,result){//함수로 빼기
        var circlesArray = new Array();
        for(var i=0; i<result.length; i++){
          circlesArray[i] = result[i].name;
        }
        var circleCategory = formTemplate.circleList(circlesArray);
        var html = homeTemplate.html(boards,circleCategory);
        response.send(html);
      });
    });
  }
});

app.get('/join', function(request, response){
  var html = joinTemplate.html();
  response.send(html);
});

app.post('/join/create_process',function(request,response){
  var post = request.body;

  var userId = post.ID;
  var userPw = post.password;
  var userName = post.name;
  var userAuthority = post.authority;

    db.query('insert into user (id, pw, name, authority) values(?,?,?,?)', [userId, userPw, userName, userAuthority], function (err, rows, fields) {
      if (!err) {
           response.send(`
           <script type = "text/javascript">alert("회원가입 성공");
           location.href='/login';
           </script>
           `);
      } else {
           response.redirect('/join');
           console.log("join create error");
      }
    });
});

app.get('/login', function(request, response){
  var html = loginTemplate.html();
  response.send(html);
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
        var url='/';

        if(user.authority === "Master" && user.circle === null){
          url = url + 'circle_create';
        }
        response.send(`
            <script type = "text/javascript">alert("로그인 성공");
            location.href='${url}';
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

app.get('/logout_process',function(request,response){
  response.clearCookie(request.cookies);
  response.send(`<script type = "text/javascript">alert("로그아웃 되었습니다.");
                  location.href='/login';</script>`);
});


app.get('/circle_create',function(request,response){
  var html=circleCreateTemplate.html();
  response.send(html);
});

app.post('/circle_create/create_process',function(request,response){
  var post = request.body;

  var circle_name = post.circle_name;
  var name = request.cookies.name;

  db.query('UPDATE user SET circle=? WHERE name=?', [circle_name,name], function (err, rows, fields) {
    if (!err) {
      db.query('INSERT INTO circles (name) VALUES(?)',[circle_name],function(error,row,fields){
          if(!err){
          response.send(`
          <script type = "text/javascript">alert("동아리 등록 성공");
          location.href='/';</script>
          `);
          }
          else{
            response.send('/circle_create');
          }
      });
    } else {
          response.redirect('/circle_create');
    }
  });
});
app.get('/facility_reservation',function(request,response){
  if(request.cookies.authority === "Master"){
    var html = reservationTemplate.html();//css안먹힘
    response.send(html);
  }
  else{
    response.send(`<script type = "text/javascript">alert("동아리장만 시설예약을 할 수 있습니다.");
    location.href='/';</script>`);
  }
});

app.get('/circle', function(request, response){
    db.query("SELECT * FROM user WHERE name=?",[request.cookies.name],function(err,result){
      if(!err){
        var buttonOption = '';
        if((result[0].authority === "Master") && (result[0].circle === `${request.query.id}`)){
          buttonOption = buttonOption + '신청현황 보기';
        }
        else if(result[0].authority === "Member" || (result[0].authority === "Master" && result[0].circle != `${request.query.id}`)){
          if(result[0].circle === `${request.query.id}`){
            buttonOption = buttonOption + '탈퇴신청';
          }
          else{
            buttonOption = buttonOption + '가입신청';
          }//동아리 복수로 선택할수 있어요?
        }
        db.query(`SELECT * FROM circles`,function(error,result){//함수로 빼기
          var circlesArray = new Array();
          for(var i=0; i<result.length; i++){
            circlesArray[i] = result[i].name;
          }
          var circleCategory = formTemplate.circleList(circlesArray);
            db.query(`SELECT * FROM board WHERE location=?`,[request.query.location], function(error2, board){
            if(error2){
              throw error2;
            }
            console.log(request.query.location);
            if(!board[0]){
              var location = request.query.location;
              response.redirect(`/board_page/create?location=${location}` + '소개');
            }
            else{
              db.query(`SELECT * FROM comment WHERE id=?`,[board[0].id], function(error3, comments){
                if(error3){
                  throw error3;
                }
                var comment = '';
                var average =0;
                for(var i=0; i<comments.length; i++){
                  comment += circleTemplate.comment_form(comments[i].author, comments[i].description, comments[i].score);
                  average += comments[i].score;
                }
                average = average/comments.length;
                var create_form = circleTemplate.create_form(board[0].id, board[0].location,average);
                var html = boardTemplate.html(board[0].title, board[0].author, board[0].date, '', board[0].description, circleCategory, comment, create_form);
                response.send(html);
              });
            }
          });
       });
      }
  });
});

app.get('/circle_main', function(request, response) {

  db.query(`SELECT * FROM board WHERE location = ?`, [request.query.location], function(error, result) {
    var boards = ``;
    for (var i = result.length - 1; i >= 0; i--) {
      var boardPointer = circleMainTemplate.boardPointer(result[i].title, result[i].author, result[i].id, result[i].description, request.query.location);
      boards += boardPointer;
    }

    var html = circleMainTemplate.html(request.query.location, boards, '');
    response.send(html);
  });
});
app.get('/circle_page', function(request, response) {
  console.log(request.query.location); ////////location 쿼리가 안넘어옴
  db.query('SELECT * FROM board', function(error, boards) {
    if (error) {
      throw error;
    }
    db.query(`SELECT * FROM board WHERE id=?`, [request.query.id], function(error2, board) {
      if (error2) {
        throw error2;
      }
      db.query(`SELECT * FROM comment WHERE id=?`, [request.query.id], function(error3, comments) {
        if (error3) {
          throw error3;
        }
        var comment = '';
        for (var i = 0; i < comments.length; i++) {
          comment += viewerTemplate.comment_form(comments[i].author, comments[i].description);
        }
        var create_form = circleMainTemplate.create_form(request.query.id, request.query.location);
        var html = circleMainTemplate.html_board(request.query.location, '', '',board[0].title, board[0].author, board[0].date, '', board[0].description, '', comment, create_form);
        response.send(html);
      });
    });
  });
});
app.post('/comment/createprocess', function(request, response) {
  if (request.query.location === 'main') ///////쿼리스트링 대응 필요
    var page = 'board_page';
  else
    var page = 'circle';
  var post = request.body;
  var id = request.query.id;
  var author = request.cookies.name;
  var description = post.comment;
  var score = 1;
  console.log(post.score);
  if(post.score)
    score = post.score;
  db.query(`INSERT INTO comment (author, description, id, score)
    VALUES(?, ?, ?, ?)`,[author, description, id, score], function(error3, comments){
      if(error3){
        throw error3;
      }
      if(request.query.type)
         response.redirect(`/${page}?id=${id}&location=${request.query.location}`);
      else {
        response.redirect(`/board_page?id=${id}`);
      }
  });
});
app.listen(3000);
