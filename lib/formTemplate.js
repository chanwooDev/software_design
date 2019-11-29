module.exports={
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
  createBtnForm:function(id){
    return `
    <button type="submit" class="btn btn-primary" onclick="location.href='/circle_main?location=그루터기'" >입장</button>
    `;
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
