var Owlbot = require('owlbot-js');
  
var client = Owlbot(6a4b88df321214974fc1e09f7b0c653151078afc);
 
client.define('owl').then(function(result){
   console.log(result);
});