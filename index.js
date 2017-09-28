FFMPEG_PATH = "C:\Users\Danilo\Desktop\acrcloud-npm\ffmpeg-20170921-183fd30-win64-static\bin";
FFPROBE_PATH = "C:\Users\Danilo\Desktop\acrcloud-npm\ffmpeg-20170921-183fd30-win64-static\bin";

var acrcloud = require('./src/arc.js');
var telegram = require('telegram-bot-api');
var download = require('download-file');
spawn = require('child_process');

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var last_message = "";
var api = new telegram({
	token: config.token,
	updates: {
		enabled: true,
		get_interval: 1000
	}
});

var acr = new acrcloud({
    host: 'identify-eu-west-1.acrcloud.com',
    access_key: 'fae7c337e2ea71fe0fccc92058318453',
    access_secret: 'a3ZBDu1kJsMVAI25JXNeRe29FB3tKeO9efVh4Btg'
})

api.on("message",function(message){
  console.log(message);

  if (message.voice != undefined){

    api.getFile({file_id : message.voice.file_id },function(data){
      console.log("getting file");
    //fs.writeFile('audio.mp3', data)
    }).then(function(data){
      console.log(data)
      url = "https://api.telegram.org/file/bot"+config.token+"/"+data.file_path;
      download(url,{directory : __dirname ,filename : "audio.oga"},function(){
        console.log("audio downloaded")

        const child = spawn('ffmpeg');


        let path = __dirname  + "/audio.oga";

        acr.identify(path, function (err, metadata) {
            if (err) console.log(err)
            console.log(metadata)
        })
      })
    })

  }
})
