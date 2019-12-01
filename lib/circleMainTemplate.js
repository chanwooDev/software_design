
module.exports={
  html:function(location, boards, write){
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>

      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="description" content="">
      <meta name="author" content="">

      <title>Shop Homepage - Start Bootstrap Template</title>

      <!-- Bootstrap core CSS -->

      <link href="/static/circle_Main/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

      <!-- Custom styles for this template -->
      <link href="/static/circle_Main/css/shop-homepage.css" rel="stylesheet">


    </head>

    <body>

      <!-- Navigation -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
          <a class="navbar-brand" href="/">Circle Management Service</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item active">
                <a class="nav-link" href="/reserv_main?location=reservatio">Facility reservation</a>
                  <span class="sr-only">(current)</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/logout_process">Logout</a>
              </li>

            </ul>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <div class="container">

        <div class="row">

          <div class="col-lg-3">

            <h1 class="my-4">${location}</h1>
            <div class="list-group">
              <a href="/circle_main?location=${location}&type=1" class="list-group-item">공지사항</a>
              <a href="/circle_main?location=${location}&type=2" class="list-group-item">일반 게시판</a>
              <a href="/circle_main/create?location=${location}" class="list-group-item">Write post</a>
            </div>
          </div>
          <!-- /.col-lg-3 -->

          <div class="col-lg-9">
            <br>
            ${write}

            <div class="row">
              </br>
              ${boards}

            </div>
            <!-- /.row -->

          </div>
          <!-- /.col-lg-9 -->

        </div>
        <!-- /.row -->

      </div>
      <!-- /.container -->

      <br>
      </br>
      <!-- Footer -->
      <footer class="py-5 bg-dark">
        <div class="container">
          <p class="m-0 text-center text-white">Copyright &copy; Your Website 2019</p>
        </div>
        <!-- /.container -->
      </footer>

      <!-- Bootstrap core JavaScript -->

      <script src="/static/circle_Main/vendor/jquery/jquery.min.js"></script>
      <script src="/static/circle_Main/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>


    </body>

    </html>

    `;
  },html_board:function(location, boards, write, title,author,date,image,body,list,comment, create_form){

    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>

      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="description" content="">
      <meta name="author" content="">

      <title>Shop Homepage - Start Bootstrap Template</title>

      <!-- Bootstrap core CSS -->

      <link href="/static/circle_Main/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

      <!-- Custom styles for this template -->
      <link href="/static/circle_Main/css/shop-homepage.css" rel="stylesheet">


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
                <a class="nav-link" href="#">Home
                  <span class="sr-only">(current)</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Services</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <div class="container">

        <div class="row">

          <div class="col-lg-3">

            <h1 class="my-4">${location}</h1>
            <div class="list-group">
            <a href="/circle_main?location=${location}&type=1" class="list-group-item">공지사항</a>
            <a href="/circle_main?location=${location}&type=2" class="list-group-item">일반 게시판</a>
            <a href="/circle_main/create?location=${location}" class="list-group-item">Write post</a>
            </div>



          </div>
          <!-- /.col-lg-3 -->

          <div class="col-lg-9">
            <br>
            ${write}


            <!-- Title -->
                        <h1 class="mt-4">${title}</h1>

                        <!-- Author -->
                        <p class="lead">
                          작성자
                          <a href="#">${author}</a>
                        </p>

                        <hr>

                        <!-- Date/Time -->
                        <p>${date}</p>

                        <hr>

                        <!-- Preview Image -->
                        <img class="img-fluid rounded" src="${image}" alt="">

                        <hr>

                        <!-- Post Content -->
                        <p>
                        ${body}
                        </p>
                        <hr>
                        ${create_form}
                        ${comment}


            <div class="row">
              </br>
              ${boards}

            </div>
            <!-- /.row -->

          </div>
          <!-- /.col-lg-9 -->

        </div>
        <!-- /.row -->

      </div>
      <!-- /.container -->

      <br>
      <!-- Footer -->
      <footer class="py-5 bg-dark">
        <div class="container">
          <p class="m-0 text-center text-white">Copyright &copy; Your Website 2019</p>
        </div>
        <!-- /.container -->
      </footer>

      <!-- Bootstrap core JavaScript -->

      <script src="/static/circle_Main/vendor/jquery/jquery.min.js"></script>
      <script src="/static/circle_Main/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>


    </body>

    </html>

    `;
  }, boardPointer:function(title,author,id,description,location,type){
    return `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="card h-100">
        <a href="/circle_page?id=${id}&location=${location}&type=${type}"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="/circle_page?id=${id}&location=${location}&type=${type}">${title}</a>
          </h4>
          <h5>${author}</h5>
        </div>
      </div>
    </div>
    `
  }, create_form:function(id,location,type){
    return `
    <!-- Comments Form -->
    <div class="card my-4">
      <h5 class="card-header">Leave a Comment:</h5>
      <div class="card-body">
       <form action="/comment/createprocess?id=${id}&location=${location}&type=${type}" method="post">
        <div class="form-group">
          <textarea name = "comment" class="form-control" rows="3" placeholder="comment here"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Post</button>
       </form>
      </div>
    </div>
    `}
};
