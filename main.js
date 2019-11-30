
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
var circleCreateTemplate = require('./lib/circleCreateTemplate.js');
var circleMainTemplate = require('./lib/circleMainTemplate.js');
var circleTemplate = require('./lib/circleTemplate.js');
var showApplyList = require('./lib/showApplyList.js');
var boardTemplate = require('./lib/boardTemplate.js');
var homeTemplate = require('./lib/homeTemplate.js');
var formTemplate = require('./lib/formTemplate.js');
var reservTemplate = require('./lib/reserveTemplate.js');
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
var reserv_main = require('./routes/reserv_main.js')(app);
app.use('/board_page', board_page);
app.use('/circle_main', circle_main);
app.use('/reserv_main', reserv_main);
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

      db.query(`SELECT * FROM board WHERE location = 'main'`, function(error, result){
      var boards = ``;
      for(var i=result.length-1; i>=0; i--){
        var boardPointer = homeTemplate.boardPointer(result[i].title, result[i].author, result[i].id, result[i].location, result[i].date);
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
  var html = loginTemplate.join_html();
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
  var html = loginTemplate.login_html();
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
  var html=loginTemplate.circleCreate_html();
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
        var buttonProcess = '';
        if((result[0].authority === "Master") && (result[0].circle === `${request.query.location}`)){
          buttonOption = buttonOption + '신청현황 보기';
          buttonProcess = buttonProcess + '/showApplyList';
        }
        else if(result[0].authority === "Member" || (result[0].authority === "Master" && result[0].circle != `${request.query.id}`)){
          if(result[0].circle === `${request.query.id}`){
            buttonOption = buttonOption + '탈퇴신청';
            buttonProcess = buttonProcess + '/withdraw_apply';
          }
          else{
            buttonOption = buttonOption + '가입신청';
            buttonProcess = buttonProcess + '/join_apply'
          }//동아리 복수로 선택할수 있어요?
        }
        db.query(`SELECT * FROM circles`,function(error,result){//함수로 빼기
          var circlesArray = new Array();
          for(var i=0; i<result.length; i++){
            circlesArray[i] = result[i].name;
          }
          var location = request.query.location;
          var type = request.query.type;
          var circleCategory = formTemplate.circleList(circlesArray);
            db.query(`SELECT * FROM board WHERE location=? AND type=?`,[location, type], function(error2, board){
            if(error2){
              throw error2;
            }
            if(!board[0]){
              response.redirect(`/board_page/create?location=${location}&type=introduce`);
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
                var create_form = circleTemplate.create_form(board[0].id, board[0].location,board[0].type,average);
                var html = boardTemplate.html(board[0].title, board[0].author, board[0].date, '', board[0].description, circleCategory, comment, create_form, buttonOption,buttonProcess, request.query.location);
                response.send(html);
              });
            }
          });
       });
      }
  });
});
app.get('/showApplyList',function(request,response){
  var applyList='';
  db.query(`SELECT * FROM circleJoin WHERE circle = ?`,[request.query.location],function(error,result){
    if(result){
      for(var i=0; i<result.length; i++){
        applyList = applyList + showApplyList.showList(result[i].name,'가입');
      }
    };
    db.query(`SELECT * FROM circleWithdraw WHERE circle = ?`, [request.query.location],function(error,results){
      if(results){
        for(var i=0; i<results.length; i++){
            applyList = applyList + showApplyList.showList(results[i].name,'탈퇴');
        }
      };
      var html = showApplyList.html(applyList);
      response.send(html);
    });
  });
});

app.get('/join_apply',function(request,response){
  db.query('insert into circleJoin (circle,name) values(?,?)', [request.query.location,request.cookies.name], function (err, rows, fields) {
    if (!err) {
      console.log(request.query.id);
         response.send(`
         <script type = "text/javascript">alert("가입을 신청하였습니다.");
         location.href='/circle/?location=${request.query.location}&type=introduce';
         </script>
         `);
    } else {
         console.log("circle join process err");
    }
  });
});

app.get('/withdraw_apply',function(request,response){
  db.query('insert into circleWithdraw (circle,name) values(?,?)', [request.query.location,request.cookies.name], function (err, rows, fields) {
    if (!err) {
      console.log(request.query.id);
         response.send(`
         <script type = "text/javascript">alert("탈퇴를 신청하였습니다.");
         location.href='/circle/?location=${request.query.location}&type=introduce';
         </script>
         `);
    } else {
         console.log("circle withdraw process err");
    }
  });
});

app.get('/join_success',function(request,response){
  var name = request.query.name;

  db.query("SELECT * FROM user WHERE name=?",[request.cookies.name],function(err,results){
    var circle = results[0].circle;

    db.query('UPDATE user SET circle=? WHERE name=?', [circle,name], function (err, rows, fields){
      if(!err){
        db.query('DELETE FROM circleJoin WHERE name=?',[name],function(err,result){
          response.send(`<script type = "text/javascript">alert("가입을 승낙하였습니다.");
          location.href='/showApplyList/?location=${circle}&type=introduce';
          </script>`);
        });
      }
    });
  });
});

app.get('/withdraw_success',function(request,response){
  var name = request.query.name;

  db.query("SELECT * FROM user WHERE name=?",[request.cookies.name],function(err,results){
    var circle = results[0].circle;

    db.query('UPDATE user SET circle=? WHERE name=?', [null,name], function (err, rows, fields){
      if(!err){
        db.query('DELETE FROM circleWithdraw WHERE name=?',[name],function(err,result){
          response.send(`<script type = "text/javascript">alert("탈퇴를 승낙하였습니다.");
          location.href='/showApplyList/?location=${circle}';
          </script>`);
        });
      }
    });
  });
});

app.get('/circle_main', function(request, response) {
  db.query(`SELECT * FROM user WHERE circle=?`, [request.query.location], function(error, user) {
    var answer =0;
    for(var i = 0; i<user.length; i++){
        if(user[i].name === request.cookies.name)
          var answer = 1;
    }

    if(!answer){
    response.send(`<script type = "text/javascript">alert("현재 동아리원이 아닙니다");
    location.href='/circle/?location=${request.query.location}&type=introduce';
    </script>`);
    }
    else{
      db.query(`SELECT * FROM board WHERE location = ? AND type = ?`, [request.query.location, request.query.type], function(error, result) {
        var boards = ``;
        for (var i = result.length - 1; i >= 0; i--) {
          var boardPointer = circleMainTemplate.boardPointer(result[i].title, result[i].author, result[i].id, result[i].description, request.query.location, request.query.type);
          boards += boardPointer;
        }
        var html = circleMainTemplate.html(request.query.location, boards, '');
        response.send(html);
      });
    }
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
          comment += formTemplate.comment_form(comments[i].author, comments[i].description);
        }
        var create_form = formTemplate.create_form(request.query.id, request.query.location, request.query.type);
        var html = circleMainTemplate.html_board(request.query.location, '', '',board[0].title, board[0].author, board[0].date, '', board[0].description, '', comment, create_form);
        response.send(html);
      });
    });
  });
});
app.get('/reserv_main', function(request, response) {
///query location = reservation
  db.query(`SELECT * FROM board WHERE location = ?`, [request.query.location], function(error, result) {
    var boards = ``;
    for (var i = result.length - 1; i >= 0; i--) {
      var boardPointer = reservTemplate.boardPointer(result[i].title, result[i].author, result[i].id, result[i].description, request.query.location);
      boards += boardPointer;
    }

    var html = reservTemplate.html(boards, '');
    response.send(html);
  });
});
app.get('/reserv_page', function(request, response) {
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
        var create_form = reservTemplate.create_form(request.query.id, request.query.location);
        var html = reservTemplate.html_board( '', '',board[0].title, board[0].author, board[0].date, '', board[0].description, '', comment, create_form);
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

  var location = request.query.location;
  var type = request.query.type;
  var score = 1;
  if(post.score)
    score = post.score;
  db.query(`INSERT INTO comment (author, description, id, score)
    VALUES(?, ?, ?, ?)`,[author, description, id, score], function(error3, comments){
      if(error3){
        throw error3;
      }
      console.log(request.query.type);
      if(request.query.type)
         response.redirect(`/${page}?id=${id}&location=${location}&type=${type}`);
      else {
        console.log('엥?');
        response.redirect(`/board_page?id=${id}`);
      }
  });
});
app.listen(3000);
