module.exports={
    html:function(applyList){
        return `
        <!doctype html>
        <html>

            <!-- Bootstrap core CSS -->
            <link href="/static/home/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

            <!-- Custom styles for this template -->
            <link href="/static/home/css/blog-home.css" rel="stylesheet">


            <head>
                <title>가입/탈퇴 신청 목록</title>
                <meta charset="utf-8">
            </head>
            <body>
            <!-- Navigation -->
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
              <div class="container">
                <a class="navbar-brand" href="#">Start Bootstrap</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                  <ul class="navbar-nav ml-auto">
                    <li class="nav-item active">
                      <a class="nav-link" href="/">Home
                        <span class="sr-only">(current)</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="/logout_process">Logout</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="/facility_reservation">Facility reservation</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#">Contact</a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
                <h1>가입/탈퇴 신청 목록</h1>
                <ol>
                    ${applyList}
                </ol>
            </body>
        </html>
        `;
    },
    showList:function(name,apply){
        var mention=`<li>`;
        mention = mention + `${name} ${apply}</li>`;
        if(apply == "가입")
            mention = mention + `<button onclick="location.href='/join_success/?name=${name}'">승낙</button>`;
        else if(apply == "탈퇴")
            mention = mention + `<button onclick="location.href='/withdraw_success/?name=${name}'">승낙</button>`;
        
        return mention;
    }
}