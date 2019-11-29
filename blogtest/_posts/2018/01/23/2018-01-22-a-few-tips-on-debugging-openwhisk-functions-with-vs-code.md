---
layout: post
title: "A Few Tips on Debugging OpenWhisk Functions with VS Code"
date: "2018-01-23"
categories: [serverless]
tags: [openwhisk,visual studio code]
banner_image: 
permalink: /2018/01/23/a-few-tips-on-debugging-openwhisk-functions-with-vs-code
---

A few weeks ago fellow IBMer Niklas Heidloff wrote a great blog post on debugging OpenWhisk actions with Visual Studio Code. Please, please, *please* read his post first: [Debugging Apache OpenWhisk Functions with VS Code](http://heidloff.net/article/debug-apache-openwhisk-functions-vscode) While his post was great, I had a few problems understanding exactly how to make use of his code, in particular, how to work with an existing OpenWhisk project. You can see my conversation with him in his comments. I offered to help write up the process for integrating his work in existing code and the result is the guide below. Note that there are probably multiple different ways of doing this, but this is what worked for me. Ok, ready?

Let's begin with a new OpenWhisk project in Visual Studio Code. In the screen shot below, you can see the project. I've got one action, `hello.js`, in an `actions`. folder. None of this is a requirement. You don't need a subdirectory and you can have any structure, file name, etc that makes sense to you.

![Screen shot](https://static.raymondcamden.com/images/2018/1/dow1.jpg)

My action is a pretty simple "Hello World" type example. It is not using an async response or a zip file, but I'll get to that in a minute. Also, I have *not* actually deployed the code to OpenWhisk. You don't have to do so in order to debug it first.

Step Zero
===

Alright - so to get started, you do not have to clone Niklas' [repo](https://github.com/nheidloff/openwhisk-debug-nodejs). Having his files locally will help in the next few steps, but you can also copy code right from the GitHub site itself. You will only need to copy a few things so I'd probably skip cloning the repo.

Step One
===

The debugger is going to use a local file called `run.js`. Make a new file in your project called `run.js`, and copy it from here: https://raw.githubusercontent.com/nheidloff/openwhisk-debug-nodejs/master/run.js. Note that you can save it anywhere in the project. In the screen shot below it is in root.

![Screen shot](https://static.raymondcamden.com/images/2018/1/dow2.jpg)

Step Two
===

Now you need to create a debug configuration. Click the debug icon in the left hand panel, and in the drop down that currently says "No Configurations", click to open it and select "Add Configuration...":

![Screen shot](https://static.raymondcamden.com/images/2018/1/dow3.jpg)

If you're prompted to select an ennvironment, just select Node. This opens a new JSON file (launch.json). In this file you need to define how Code will debug your file. The configuration will consist of both the file to test as well as another file of parameters. You can find samples of this configuration here: https://raw.githubusercontent.com/nheidloff/openwhisk-debug-nodejs/master/.vscode/launch.json. Let's add one:

```js
{
	// Use IntelliSense to learn about possible attributes.
	// Hover to view descriptions of existing attributes.
	// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
	"version": "0.2.0",
	"configurations": [
        {
            "args": [
                "./actions/hello.js",
                "./payloads/payload1.json"
            ],
            "type": "node",
            "request": "launch",
            "name": "Run hello with payload",
            "program": "${% raw %}{workspaceFolder}{% endraw %}/run.js",
            "outFiles": [
                "${% raw %}{workspaceFolder}{% endraw %}/**/*.js"
            ]
        },


	]
}
```

There are three important parts here.

* In `args`, the first argument is the action to run. The second argument is a JSON file containing parameters for your action. I'll show this in a moment. You need to ensure your paths are correct.
* The second thing to note is `name`. This can be anything, but you probably want to name it something that makes sense. 
* Finally, the `program` value should point to where you saved `run.js`.

Step Three
===

Now let's set up the payload. Payloads are simply your action arguments. What you have here will depend on your action and what you are trying to debug. As before, the use of a `payloads` subdirectory is arbitrary. Here is the one we will use:

```js
{
	"name":"ray"
}
```

Step Four
===

Almost there, I promise! As a final step, you need to add one line to your action:

```js
exports.main = main // necessary for local debugging
```

As the comment says, this is required for debugging. It is also required for zip-based actions. It is completely harmless in this action so we can just add this and forget it, even if we never debug again.

Ok, just to ensure we're on the same page, here's my Code window now:

![Screen shot](https://static.raymondcamden.com/images/2018/1/dow4.jpg)

Let's Debug!
===

Now we have everything we need to debug. To start, I'll simply ensure my new configuration is showing and then hit the green button:

![Screen shot](https://static.raymondcamden.com/images/2018/1/dow5.jpg)

You do not have to actually add any breakpoints if you just want to quickly run the action and see the output. But obviously adding breakpoints let you step through your code line by line and track down bugs and other nefarious issues. 

And yeah - that's it. Async actions? It works the same. Zip actions? It works the same. All you have to do is keep adding configurations to launch.json to add more ways to debug. You could have one per action, or many per action if you want to have multiple different payloads to test with.

Summary
===

So just to quickly go over the above, here is what you need to do:

* Ensure your action has `exports.main = main` at the end.
* Add a configuration that points to your action, a JSON file for arguments, and run.js.
* Copy run.js into your project (one time).
* Make a payload file for arguments.
* Debug like cray cray.