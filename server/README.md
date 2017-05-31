# Local Server

Serve your local lambda functions via fully configurable http endpoints.
	
author:  Cristian Salazar <christiansalazarh@gmail.com>

## Launch

	cd yourproject;
	./run-server
	# this serve provides endpoints following your definitions at: local-server.json

## Configure

A sample file is provided: 

	local-server.json 	

```
{
	 "port" : 8100
	,"routes" : {
		"\/property\/([0-9]+)" : {
			"vars"	 : ["{sysid}"],
			"lambda" : { "name" : "RetsApiGetProperty" , "exports" : "handler" },
			"GET" : {
				"event"  : { 
					"development" : true,
					"params" : { "path" : { "sysid" : "{sysid}" } }					
				},
				"context" : {
					
				},
				"responseHeaders" : {
					"Access-Control-Allow-Origin" : "http://coquito.local",
					"content-type" : "application/json"		
				}
			}
		}
	}
}
```

This file define your endpoints. This example provides you with a endpoint:

	http://localhost:8100/property/123456

which will execute the local lambda code at: 

	"/your/project/lambda/RetsApiGetProperty/src"

the result from your lambda function will be echoed to the browser as
a "application/json", and provides some basic CORS headers too (as an example)

## HTTPS

You can server HTTPS endpoint by adding this attributes to your setup in
local-server.json:

```
	,"port" : 8443
	,"secure" : true
	,"privatekey" : "/your/cert/some.key"
	,"certificate" : "/your/cert/some.crt"
```

So, in consecuence you will have a https endpoint:

	https://localhost:8443/

## Processing Paths and Reading Variables from a Path:

Lets suppose you provide some value via path, something like this:

	http://localhost:8100/property/123/ABC

In order to get the provided values ("123" and "ABC") from inside a lambda
function you must provide a setup via file 'lambda-server.json',
using a regular expression similar to this one in your route definition:

```
"routes" : {
	"\/property\/([0-9]+)/([a-z]+)" : { ... },
}, ... 
```

The next step is to provide the var names definition in the 'vars' attribute:

```
...
"\/property\/([0-9]+)/([a-z]+)" : {
	"vars"	 : ["{sysid}","{other}"],
	...
}
```

Take a look at the sample rule definition (see: Configure) it provides
a setup for the 'events' object, this object will be passed to your lambda
function and can receive the values in this way:

```
"event"  : { 
	"development" : true,
	"params" : { "path" : { "sysid" : "{sysid}" } }					
},
```

Note the "event" object and The variable "{sysid}", which has been parsed
and now it has the value '123' taken from the path. This value is passed
to your 'event' object, so in your lambda function you can read it by using
a call similar to this one:

	console.log(event.params.path.sysid); // output: 123

## Variable Names:

The variables taken from the path must follow this rule:

	{[a-z0-9\s\.\_\-]+}

example:

	{abc} {123} {abc123} {abc-123} {abc 123}

