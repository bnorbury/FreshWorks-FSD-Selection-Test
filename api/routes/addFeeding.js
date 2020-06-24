var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  //default feedingData values if none was passed
  var feedingData = req.body
  
  var validationErrors = [];
  var errorData = {fields: {}};
  
  //make sure that the date and time match the patterns
  if (!feedingData.date || !/^\d\d\/[10]\d\/\d\d\d\d$/.test(feedingData.date)) {
    validationErrors.push('Date'); 
    errorData.fields.date = "Please enter a date that matches the format \"DD/MM/YYYY\".";
  }
  
  if (!feedingData.time || !/^\d?\d\:\d\d [AP]M$/.test(feedingData.time)) {
    validationErrors.push('Time'); 
    errorData.fields.time = "Please enter a time that matches the format \"2:09 PM\".";
  }
  
  //make sure the duck count is > 0
  if (!feedingData.duck_count || feedingData.duck_count < 0) {
    validationErrors.push('Number of Ducks Fed'); 
    errorData.fields.duck_count = "Please enter the number of ducks fed.";
  }
  
  //force the duck count to an integer
  feedingData.duck_count = parseInt(feedingData.duck_count);
  
  //if there was a validation error then abort and send the results back to the client
  if (validationErrors.length) {
    res.send(JSON.stringify({
      'error': true
      , 'errorData': errorData
      , 'message': 'Please correct the following fields then try again: ' + validationErrors.join(', ')
    }));
    return true;
  }
  
  //the other fields are arbitrary strings so they can't be easily verified
  
  var mysql = require('mysql');
  var dbcon = mysql.createConnection({
    host: 'localhost'
    , user: 'ben'
    , password: 'hunter2'
    , database: 'duck_tracker'
  });
  
  
  //verify the data is valid
  dbcon.connect((err) => {
    if (err) {
      res.status('500').send({ error: err, message: err.message });
      return false;
    }
    
    //save the duck feeding data
    dbcon.query("INSERT INTO duck_feedings SET ?", feedingData, (err, results, fields) => {
      if (err) {
        res.status('500').send({ error: err, message: err.message });
        return false;
      }
      //return success
      res.send(JSON.stringify({
        'success': true
        , 'message': 'Thanks for Feeding ' + feedingData.duck_count + ' Duck' + ( feedingData.duck_count!=1?'s':'' ) + '!'
      }));
    });
  });
  
    
});

module.exports = router;
