var express = require('express');
var router = express.Router();

/* GET employeelist. */
router.get('/employeelist', function(req, res) {
  var db = req.db;
  var collection = db.get('employeelist');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

/* POST to addemployee. */
router.post('/addemployee', function(req, res) {
  var db = req.db;
  var collection = db.get('employeelist');
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* DELETE to deleteemployee. */
router.delete('/deleteemployee/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('employeelist');
  var employeeToDelete = req.params.id;
  collection.remove({ '_id' : employeeToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});



module.exports = router;
