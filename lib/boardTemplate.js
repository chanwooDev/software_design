module.exports={
  html:function(title,author,date,image,body,list,comment, create_form){
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>

      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="description" content="">
      <meta name="author" content="">

      <title>Blog Post - Start Bootstrap Template</title>

      <!-- Bootstrap core CSS -->
      <link href="/static/Circle_Page/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

      <!-- Custom styles for this template -->
      <link href="/static/Circle_Page/css/blog-post.css" rel="stylesheet">

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

          <!-- Post Content Column -->
          <div class="col-lg-8">

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
          </div>

          <!-- Sidebar Widgets Column -->
          <div class="col-md-4">

            <!-- Search Widget -->
            <div class="card my-4">
              <h5 class="card-header">Search</h5>
              <div class="card-body">
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="Search for...">
                  <span class="input-group-btn">
                    <button class="btn btn-secondary" type="button">Go!</button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Categories Widget -->
            <div class="card my-4">
              <h5 class="card-header">Categories</h5>
              <div class="card-body">
                <div class="row">
                  ${list}
                </div>
              </div>
            </div>

            <!-- Side Widget -->
            <div class="card my-4">
              <h5 class="card-header">Side Widget</h5>
              <div class="card-body">
                You can put anything you want inside of these side widgets. They are easy to use, and feature the new Bootstrap 4 card containers!
              </div>
              <button type="submit" class="btn btn-primary" onclick="location.href='/board_page?id=gru'" >입장</button>
            </div>

          </div>

        </div>
        <!-- /.row -->

      </div>
      <!-- /.container -->

      <!-- Footer -->
      <footer class="py-5 bg-dark">
        <div class="container">
          <p class="m-0 text-center text-white">Copyright &copy; Your Website 2019</p>
        </div>
        <!-- /.container -->
      </footer>

      <!-- Bootstrap core JavaScript -->
      <script src="/static/Circle_Page/vendor/jquery/jquery.min.js"></script>
      <script src="/static/Circle_Page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    </body>

    </html>
    `;
  }, list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i<filelist.length){
      list = list+ `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i=i+1;
    }
    list = list+'</ul>';
    return list;
  },
  create_form:function(id){
    return `
    <!-- Comments Form -->
    <div class="card my-4">
      <h5 class="card-header">Leave a Comment:</h5>
      <div class="card-body">
       <form action="/comment/createprocess?id=${id}" method="post">
        <div class="form-group">
          <textarea name = "comment" class="form-control" rows="3" placeholder="comment here"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Post</button>
       </form>
      </div>
    </div>
    `;


  }
};
