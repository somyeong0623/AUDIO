
var fs = require('fs');
// var openApiURL = 'http://aiopen.etri.re.kr:8000/WiseASR/Pronunciation'; //영어 
var openApiURL = 'http://aiopen.etri.re.kr:8000/WiseASR/PronunciationKor'; //한국어 
 
var access_key = '3ca4f231-0a23-4c66-b15c-8c065418f5a9';
var languageCode = 'korean';
var script = '안녕하세요. 오늘도 멋진 하루 되세요.';
var audioFilePath = './hello.wav';
var audioData;
 
var audioData = fs.readFileSync(audioFilePath);
 
var requestJson = {
    'access_key': "3ca4f231-0a23-4c66-b15c-8c065418f5a9",
    'argument': {
        'language_code': languageCode,
        'script': script,
        'audio': audioData.toString('base64')
    }
};
 
var request = require('request');
var options = {
    url: openApiURL,
    body: JSON.stringify(requestJson),
    headers: {'Content-Type':'application/json; charset=UTF-8'}
};
request.post(options, function (error, response, body) {
    console.log('responseCode = ' + response.statusCode);
    console.log('responseBody = ' + body);
});
 