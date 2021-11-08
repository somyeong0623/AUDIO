var Owlbot = require('owlbot-js');
  
var client = Owlbot('59641d32a0d3eb47e6e015dad90efcf45e32eec6');
 
client.define('owl').then(function(result){
   console.log(result);
});