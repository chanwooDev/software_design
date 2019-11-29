
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
var viewerTemplate = require('./lib/viewerTemplate.js');
var showApplyList = require('./lib/showApplyList.js');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');

var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'circle',
  port : '3306'
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
        var circleCategory = homeTemplate.circlesList(circlesArray);
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

app.get('/advertisement_create',function(request,response){
  if(request.cookies.authority === "Master"){
    var html = boardTemplate.html('','','','','','',`
         <div class="card my-4">
           <form action="/board_page/create_process" method="post">
               <div class="card my-4">
                    <h5 class="card-header">게시글 작성</h5>
                     <div class="card-body">
                     <input type="text" class="form-control" name="title" placeholder="title">
               <textarea class="form-control" name="description" rows="10"placeholder="description"></textarea>
             <button type="submit" class="btn btn-primary">Submit</button>
               </div>
            </div>
           </form>
         </div>
        `,'');
    response.send(html);
  }
  else{
    response.send(`<script type = "text/javascript">alert("동아리장만 전체게시판을 작성할 수 있습니다.");
    location.href='/';</script>`);
  }
})

app.get('/circles', function(request, response){
    db.query("SELECT * FROM user WHERE name=?",[request.cookies.name],function(err,result){
      if(!err){
        var buttonOption = '';
        var buttonProcess = '';
        if((result[0].authority === "Master") && (result[0].circle === `${request.query.id}`)){
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
          var circleCategory = homeTemplate.circlesList(circlesArray);
          var html = circleTemplate.html(`${request.query.id}`,buttonOption,buttonProcess,circleCategory);
          response.send(html);
       });
      }
  });
});

app.get('/showApplyList',function(request,response){
  var applyList='';
  db.query(`SELECT * FROM circleJoin`,function(error,result){
    if(result[0]){
      for(var i=0; i<result.length; i++){
        if(result[i].circle === request.query.id){
          applyList = applyList + showApplyList.showList(result[i].name,'가입');
        }
      }
    };
    db.query(`SELECT * FROM circleWithdraw`,function(error,results){
      if(results[0]){
        console.log("withdraw exist!");
        for(var i=0; i<results.length; i++){
          console.log(results[i].circle);
          console.log(request.query.id);
          if(results[i].circle === request.query.id){
            applyList = applyList + showApplyList.showList(results[i].name,'탈퇴');
          }
        }
      };
      console.log(applyList);
      var html = showApplyList.html(applyList);
      response.send(html);
    });
  });
});

app.get('/join_apply',function(request,response){
  db.query('insert into circleJoin (circle,name) values(?,?)', [request.query.id,request.cookies.name], function (err, rows, fields) {
    if (!err) {
      console.log(request.query.id);
         response.send(`
         <script type = "text/javascript">alert("가입을 신청하였습니다.");
         location.href='/circles/?id=${request.query.id}';
         </script>
         `);
    } else {
         console.log("circle join process err");
    }
  });
});

app.get('/withdraw_apply',function(request,response){
  db.query('insert into circleWithdraw (circle,name) values(?,?)', [request.query.id,request.cookies.name], function (err, rows, fields) {
    if (!err) {
      console.log(request.query.id);
         response.send(`
         <script type = "text/javascript">alert("탈퇴를 신청하였습니다.");
         location.href='/circles/?id=${request.query.id}';
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
          location.href='/showApplyList/?id=${circle}';
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
          location.href='/showApplyList/?id=${circle}';
          </script>`);
        });
      }
    });
  });
});

app.get('/circle_main', function(request, response){
  var html = circleTemplate.html();
  response.send(html);
});

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

app.get('/logout_process',function(request,response){
  response.clearCookie(request.cookies);
  response.send(`<script type = "text/javascript">alert("로그아웃 되었습니다.");
                  location.href='/login';</script>`);
});

app.listen(3000);

