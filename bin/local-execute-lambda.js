var lambda = process.argv[2];
var lambdaFile = process.argv[3];

// console.log("running lambda:",lambda,"("+lambdaFile+")");

var index = require(lambdaFile);

var event = null;
var raw_event = require("fs").readFileSync("event",'utf8');
try{
	event = JSON.parse(raw_event);
}catch(ex){
	console.log('INVALID_JSON, EX',ex);
	return;
}

var context = { development : true };

index.handler(event,context,function(err,resp){
	if(err){
		console.log("(ERROR FROM LAMBDA)",err);
	}else{
		console.log(JSON.stringify(resp));
	}
});
