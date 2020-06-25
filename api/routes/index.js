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
      res.send('No ducks have been fed yet.');
      return false;
    }
    
    //save the duck feeding data
    dbcon.query("SELECT duck_count from duck_feedings", (err, results, fields) => {
      if (err) {
        res.send('No ducks have been fed yet.');
        return false;
      }
      
      for (var i=0;i<results.length;i++){
        ducksFed += results[i].duck_count;
      }
      
      if ( ducksFed ) {
        //insert an 's' in the text if the duck count is plural
        res.send(ducksFed + ' Duck' + ( ducksFed != 1 ? 's have' : ' has') + ' been fed.');
      } else {    
        res.send('No ducks have been fed yet.');
      }
    });
  });
  
});

module.exports = router;
