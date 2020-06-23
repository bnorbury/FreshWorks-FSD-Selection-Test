var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var mysql = require('mysql');
  var dbcon = mysql.createConnection({
    host: 'localhost'
    , user: 'ben'
    , password: 'hunter2'
    , database: 'duck_tracker'
  });
  
  var ducksFed = 0;
  
  //verify the data is valid
  dbcon.connect((err) => {
    if (err) {
      //res.status('500').send({ error: err, message: err.message });
      return false;
    }
    
    //save the duck feeding data
    dbcon.query("SELECT duck_count from duck_feedings", (err, results, fields) => {
      if (err) {
        //res.status('500').send({ error: err, message: err.message });
        return false;
      }
      
      results.forEach(element=>{
        ducksFed += element.duck_feedings;
      });
      dbcon.release();
    });
  });
  
  if ( ducksFed ) {
    //insert an 's' in the text if the duck count is plural
    res.send(ducksFed + ' Duck' + ( ducksFed != 1 ? 's' : '') + ' has been fed.');
  } else {    
    res.send('No ducks have been fed yet.');
  }
  
});

module.exports = router;
