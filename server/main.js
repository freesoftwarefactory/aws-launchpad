/**
	Provides a simple api gateway interface.

	author:  Cristian Salazar <christiansalazarh@gmail.com>
*/
var fs = require("fs");
var http = require("http");
var url = require("url");
var def = JSON.parse(fs.readFileSync("../local-server.json"));

/**
	find a route and parse path variables. (see "Processing Paths" on README.md)
*/
var findRoute = function(routes, path){
	for(var pathExpression in routes){
		if (routes.hasOwnProperty(pathExpression)) {
			var m="";
			if(m = path.match(new RegExp(pathExpression,"i"))){
				var route = routes[pathExpression];
				var values = {};
				route.vars.forEach(function(varname,i){
					Object.defineProperty( values , varname , 
					        { value: m[i+1], writable: true, 
								enumerable: true, configurable: true });
				});
				route.values = values;
				return route;
			}
		}
	}
	return null;
};

/**
	parse values taken into a given object:

	{ 
		"development" : true,
		"params" : { "path" : { "sysid" : "{sysid}" } }					
	}

	values:

	{ "{sysid}" : "123" , "{other}" : "ABC" }
*/
var replaceVariables = function(object, values){
	return JSON.parse(JSON.stringify(object).replace(
			/{[a-z\s0-9\.\-\_]+}/gi,function(fullvar, nameOnly){
			return values[fullvar] ? values[fullvar] : "fullvar";
	}));
};

/**
	execute the route depending on the "request.method". 
*/
var executeRoute = function(route, request, response){
	var methodInfo = route[request.method];
	if((null == methodInfo) || (undefined==methodInfo)){
		// method not supported
		console.log("[method "+request.method
			+" not supported in your route definition]");
		return;	
	}	
	var event = replaceVariables(methodInfo.event, route.values);
	var context = methodInfo.context;
	// execute the lambda function:
	var path = process.env.PWD+"/../lambda/"+route.lambda.name+"/src";
	console.log("execute: "+route.lambda.name,"("+path+")");
	// this environment var can be used inside lambda functions
	process.env.LAMBDA_DIR=path;
	var lambda = require(path);
	return new Promise((resolve,reject) => {
		// TODO: use route.lambda.handler insted of hardwired "handler()"
		lambda.handler(event,context,function(err,data){
			if(err){
				reject(err);	
			}else{
				resolve({ route: route, event: event, 
					method : methodInfo, payload: data,
						request: request, response: response });	
			}
		});
	});
};

/*entry point*/

console.log("http://localhost:"+def.port+" (control+c)");

process.on('uncaughtException', function(err) {
	console.log("(unhandled exception)",err)
});

http.createServer(function(request, response) {
	var path = url.parse(request.url).pathname;
	try{
	var route = findRoute(def.routes,path);	
	if(route){
		try{
			executeRoute(route, request, response).then(function(r){
				r.response.writeHead(200, r.method.responseHeaders);
				r.response.write(
					("string" == (typeof r.payload)) ? r.payload 
						: JSON.stringify(r.payload));
				r.response.end();
			}).catch(function(err){
				console.log("executeRoute Promise.catch",err);
			});	
		}catch(ex){
			console.log("exception at route level:",ex,"route:",route);
			response.end();	
		}					
	}else{
		console.log("invalid path",path);
		response.end();
	}}catch(ex){
		console.log("exception (path="+path+")",ex);	
		response.end();
	}
}).listen(def.port);

