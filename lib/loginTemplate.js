module.exports={
  html:function(){
    return `

<link rel="stylesheet" type="text/css" href="static/login/css/login.css">

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
  }
};
