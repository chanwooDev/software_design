module.exports={
    html:function(){
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
}