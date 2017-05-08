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
	
which must have your endpoint definitions. This example provides you
with a endpoint:

	http://localhost:8100/property/123456

which will execute the local lambda code at: 

	"/your/project/lambda/RetsApiGetProperty/src"

the result from your lambda function will be echoed to the browser as
a "application/json", and provides some basic CORS headers too (as an example)

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

## Processing Paths:

As an example, in order to get values "123" and "ABC" from a provided path:
		
	/property/123/ABC

you should provide a expression similar to this one in lambda-server.json:

```
"routes" : {
	"\/property\/([0-9]+)/([a-z]+)" : { ... },
}, ... 
```

on a successfull execution this method returns something similar to:

```
{ 
	vars: [ '{sysid}', '{other}' ],
 	lambda: 'RetsApiGetProperty',
    method: 'GET',
	event: { development: true, params: { path: [Object] } },
	response: { 'content-type': 'application/json' },
	
	// this attribute is created by this method:
	values: { 
		'{sysid}': '123', 
		'{other}': 'ABC' 
	} 
}
```	

## Variable Names:

The variables taken from the path must follow this rule:

	{[a-z0-9\s\.\_\-]+}

example:

	{abc} {123} {abc123} {abc-123} {abc 123}

