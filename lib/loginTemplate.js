module.exports={
  login_html:function(){
    return `

<link rel="stylesheet" type="text/css" href="/static/login/css/login.css">

<div class="login-page">
  <div class="form">
    <div class="login-form">
      <form action="/login_process" method="post">
        <input type="text" name="ID" placeholder="ID"/>
        <input type="password" name="PW" placeholder="password"/>
        <button type="submit">login</button>
        <p class="message">Not registered? <a href="/join">Create an account</a></p>
      </form>
    </div>
  </div>
</div>
    `;
  },
  join_html:function(){
      return `
      <link rel="stylesheet" type="text/css" href="/static/login/css/login.css">

      <div class="join-page">
        <div class="form">
          <div class="register-form">
            <form action="/join/create_process" method="post"  id="register">
              <input type="text" name="ID" placeholder="ID"/>
              <input type="password" name="password" placeholder="password"/>
              <input type="text" name="name" placeholder="name"/>
              <div class="col-md-4">
              <label><input type="checkbox" name="authority" value="Master">Master</label>
              </div>
              <div class="col-md-4">
              <label><input type="checkbox" name="authority" value="Member">Member</label>
              </div>
            </form>
            <button  type="submit" form="register">create</button>
            <p class="message">Already registered? <a href="/login">Sign In</a></p>
          </div>
        </div>
      </div>
      `;
  },
  circleCreate_html:function(){
      return `
      <link rel="stylesheet" type="text/css" href="/static/login/css/login.css">

      <div class="circle_create-page">
        <div class="form">
          <div class="circle_create-form">
            <form action="circle_create/create_process" method="post"  id="register">
              <input type="text" name="circle_name" placeholder="Write your Circle name"/>
              <label><input type="checkbox">band</label>
              <label><input type="checkbox">chorus</label>
              <label><input type="checkbox">orchestra</label>
              <label><input type="checkbox">volunteer</label>
              <label><input type="checkbox">academic</label>
              <label><input type="checkbox">etc</label>
            </form>
            <button  type="submit" form="register">Circle Create</button>
          </div>
        </div>
      </div>
      `;
  }
};
