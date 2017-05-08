# Aws Launchpad

This is a very simple launchpad which will help you on your Amazon Aws Projects.

It is focused in providing you with a way to write and test lambda functions
in your local computer before doing such work in the real lambda scenario.

## How to use this launchpad

Once installed, you create a new lambda function in this way:

```
	$ cd your-project/lambda
	
	# the directory name represents the real lambda function name
	$ ./new-lambda myFunction	
	
	$cd myFunction
	# customize your lambda function code (index.js) and/or your sample event
```

## How do i run my lambda function locally ?

You have two ways: Direct Execution, or via Local Http Server

Direct Execution:

A file named 'event' is used as a input for your lambda function, on this
file you put a JSON file structure or anything you pretend to pass to your
lambda function from the 'Integration Request' (see aws web client)

```
	# move into to your lambda function directory
	$ cd your-project/lambda/myFunction
	
	# will execute your local lambda function (the 'event' is parsed)
	./execute
```


Local Http Server:

A local server is provided to you in order to serve your lambda functions
locally, please read more about it (see: Local Server).

## How do i create (or update) my remote lambda function ?

This steps requires you put some special data in the ./set-env file.

```
	# move into to your lambda function directory
	$ cd your-project/lambda/myFunction
	
	# create a new lambda function it in the real world scenario.
	./create

	# will perform a code update of your remote real-world lambda function
	./update
```

## Local Server

A local http server can be executed in order to serve lambda functions
similar to Aws Apigateway.

[Read more](./server/README.md)

## Very simple uh ?

Yes. it is very simple. You're welcome to help to enhance it :)
