module.exports={
  html:function(){
    return `
    <link rel="stylesheet" type="text/css" href="./css/login.css">

    <div class="login-page">
        <form class="login-form">
          <input type="text" placeholder="username"/>
          <input type="password" placeholder="password"/>
          <button>login</button>
          <p class="message">Not registered? <a href="/join">Create an account</a></p>
        </form>
      </div>
    </div>
    `;
  }
};
