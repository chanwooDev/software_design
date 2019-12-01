module.exports={
  create_form:function(id,location,type){
    return `
    <!-- Comments Form -->
    <div class="card my-4">
      <h5 class="card-header">Leave a Comment:</h5>
      <div class="card-body">
       <form action="/comment/createprocess?id=${id}&location=${location}&type=${type}" method="post" enctype="multipart/form-data">
        <div class="form-group">
          <textarea name = "comment" class="form-control" rows="3" placeholder="comment here"></textarea>
        </div>

        <button type="submit" class="btn btn-primary">Post</button>
       </form>
      </div>
    </div>
    `;
  },
  comment_form:function(author,comment){
    var list = '';
    var i = 0;
    var current;
    list =  `<div class="media mb-4">
                <img class="d-flex mr-3 rounded-circle" src="http://placehold.it/50x50" alt="">
                <div class="media-body">
                  <h5 class="mt-0">${author}</h5>
                  ${comment}
                </div>
              </div>`;

    return list;
  },
  upload_form:function(){
    return `
    <form action='/upload/process' method='post' enctype="multipart/form-data")>
         <input type='file' name='userfile'>
         <input type='submit'>
    </form>
    `;
  },
  circleList:function(filelist){
    var list1 = '<div class="col-lg-6"><ul class="list-unstyled mb-0">';
    var list2 = '<div class="col-lg-6"><ul class="list-unstyled mb-0">';
    var i = 0;
    while(i<filelist.length){
      if(i%2 == 0){
        list1 = list1 + `<li><a href="/circle?location=${filelist[i]}&type=introduce">${filelist[i]}</a></li>`;
        i=i+1;
      }
      else{
        list2 = list2 + `<li><a href="/circle?location=${filelist[i]}&type=introduce">${filelist[i]}</a></li>`;
        i=i+1;
      }
    }
    list1 = list1 + '</ul></div>';
    list2 = list2 + '</ul></div>';
    return (list1+list2);
  },
  createStar: function(score){
    switch(score){

      case 1: return `<small class="text-muted">&#9733; &#9734; &#9734; &#9734; &#9734;</small><br>`;
      case 2: return `<small class="text-muted">&#9733; &#9733; &#9734; &#9734; &#9734;</small><br>`;
      case 3: return `<small class="text-muted">&#9733; &#9733; &#9733; &#9734; &#9734;</small><br>`;
      case 4: return `<small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9734;</small><br>`;
      case 5: return `<small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9733;</small><br>`;
    }
  }
};
