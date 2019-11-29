
module.exports={
  create_form:function(id,location,average){
    return `
    <!-- Comments Form -->
    <div class="card my-4">
      <h5 class="card-header">Leave a Comment:</h5>
      <div class="card-body">
       <form action="/comment/createprocess?id=${id}&location=${location}&type=score" method="post">
        <div class="form-group">
          <textarea name = "comment" class="form-control" rows="3" placeholder="comment here"></textarea>
        </div>
        <div class="row">
          <div class="col-md-4">

            <input type="radio" name="score" value=1><font>1</font>
            <input type="radio" name="score" value=2><font>2</font>
            <input type="radio" name="score" value=3><font>3</font>
            <input type="radio" name="score" value=4><font>4</font>
            <input type="radio" name="score" value=5><font>5</font><br>
            <button type="submit" class="btn btn-primary">Post</button>
          </div>
          <div align="right" class="col-lg-8">
          <h4 class="mt-4">평점:   ${average}/5.0</h4>
          </div>
        </div>
       </form>
      </div>
    </div>
    `;
  },
  comment_form:function(author,comment,score){
    var formTemplate = require('./formTemplate.js');
    var list = '';
    var i = 0;
    var star = formTemplate.createStar(score);
    list =  `<div class="media mb-4">
                <img class="d-flex mr-3 rounded-circle" src="http://placehold.it/50x50" alt="">
                <div class="media-body">

                  <h5 class="mt-0">${author}</h5>
                  ${star}
                  ${comment}
                </div>
              </div>`;

    return list;
  }
};
