
module.exports = function(){
  var express = require('express');
  var router = express.Router();
  var multer = require('multer'); // multer모듈 적용 (for 파일업로드)
  var formTemplate = require('../lib/formTemplate.js');


  var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'data/image');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }),
});
  router.use('/data', express.static(__dirname + '/data'));

  router.get('/', function(request, response){
    var multer = require('multer'); // multer모듈 적용 (for 파일업로드)
    var html = formTemplate.upload_form();
    response.send(html);
  });
  router.post('/process', upload.single('userfile'),function(request, response){
    response.redirect('/');
  });
  return router;
};
