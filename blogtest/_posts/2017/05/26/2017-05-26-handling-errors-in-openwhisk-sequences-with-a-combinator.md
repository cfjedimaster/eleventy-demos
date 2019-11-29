---
layout: post
title: "Handling Errors in OpenWhisk Sequences with a Combinator"
date: "2017-05-26T09:04:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/05/26/handling-errors-in-openwhisk-sequences-with-a-combinator
---

As I build more powerful sequences in [OpenWhisk](http://openwhisk.org/), one of the issues I've run into is how to handle "routing" in sequences. Basically, given a sequence of A=&gt;B=&gt;C=&gt;, there may be times when:

* B may throw an error
* B may be all I need to do and we can skip C
* A decides it wants to skip B
* B may throw an error but I want to keep trying for a while

All of this is technically feasible, but not necessarily simple to set up. Remember that there is a Node package for working with OpenWhisk. In theory, I could build an action that makes use of this package and does all of the above directly in code. But what I'm more interested is how this could be set up at a "meta" level. Basically, I want to do all of this in an abstract manner and leave my actions as pure code.

Unfortunately what I've described above isn't quite possible yet, but you can get close to it with the Combinators package. At the time I'm writing this, the combinators package isn't documented in the reference, but you can get information about the package using:

	wsk package get --summary /whisk.system/combinators

Instead of copying and pasting the result in, I'll format it a bit. Here are the actions:

* <strong>/whisk.system/combinators/eca</strong> Event-Condition-Action: run condition action and if result is successful, run action.    (parameters: $actionName, $conditionName)
* <strong>/whisk.system/combinators/retry</strong> Retry invoking an action until success or attempt count is exhausted, which ever comes first. (parameters: $actionName, $attempts)
* <strong>/whisk.system/combinators/forwarder</strong> Forward parameters around another action. (parameters: $actionArgs, $actionName, $forward)
* <strong>/whisk.system/combinators/trycatch</strong> Wraps an action with a try-catch. If the action fails, invokes a second action to handle the error. (parameters: $catchName, $tryName)

For today, I'm going to focus on the trycatch action. As it says in the description, it wraps an action and lets you call an action on an error occurring. So imagine this action:

<pre><code class="language-javascript">function main(args) {

	if(args.error == null) args.error = false;

	if(!args.error) {
		return {% raw %}{result:1}{% endraw %}
	} else {
		throw new Error('Oh Crap');
	}

}
</code></pre>

As you can see it just takes one argument, error, and if it is true, it will throw an error. Let's run it:

	 wsk action invoke safeToDelete/divide -b

And the result. (By the way, ignore the name 'divide' - I was thinking about doing something else.)

<pre><code class="language-javascript">{
    "activationId": "bcf71f2dae4e464a9541638728468e11",
    "annotations": [
        {
            "key": "limits",
            "value": {
                "logs": 10,
                "memory": 256,
                "timeout": 60000
            }
        },
        {
            "key": "path",
            "value": "rcamden@us.ibm.com_My Space/safeToDelete/divide"
        }
    ],
    "duration": 18,
    "end": 1495808497997,
    "logs": [],
    "name": "divide",
    "namespace": "rcamden@us.ibm.com_My Space",
    "publish": false,
    "response": {
        "result": {
            "result": 1
        },
        "status": "success",
        "success": true
    },
    "start": 1495808497979,
    "subject": "rcamden@us.ibm.com",
    "version": "0.0.6"
}
</code></pre>

And now let's try with an error:

	wsk action invoke safeToDelete/divide -b --param error true

<pre><code class="language-javascript">{
    "activationId": "3804923a0b1540caa9027ad974045a43",
    "annotations": [
        {
            "key": "limits",
            "value": {
                "logs": 10,
                "memory": 256,
                "timeout": 60000
            }
        },
        {
            "key": "path",
            "value": "rcamden@us.ibm.com_My Space/safeToDelete/divide"
        }
    ],
    "duration": 11,
    "end": 1495808578214,
    "logs": [],
    "name": "divide",
    "namespace": "rcamden@us.ibm.com_My Space",
    "publish": false,
    "response": {
        "result": {
            "error": "An error has occurred: Error: Oh Crap"
        },
        "status": "action developer error",
        "success": false
    },
    "start": 1495808578203,
    "subject": "rcamden@us.ibm.com",
    "version": "0.0.6"
}
</code></pre>

Alright - pretty much exactly as expected. So now let's try with the trycatch action. It takes two arguments - the name of the action to try and the name of the action to run on error. Here's how you would call it:

	wsk action invoke /whisk.system/combinators/trycatch --param '$tryName' /_/safeToDelete/divide --param '$catchName' /_/safeToDelete/error -b

Make note of a few things here. The use of `/_/` is an alias to my namespace. The combinator action isn't running in my local namespace so this helps let it know where the actions exist. I could make a bound copy of the action to have my own copy, but that's not really necessary. Next, make note of the single quotes around the params. When I forgot them, my shell had issues with the dollar signs in front of the params. Thanks to [Carlos Santana](https://twitter.com/csantanapr) (once again) for the help. When run, the output is the same (technically not the exact same, the metadata is different, but the *result* is the same).

<pre><code class="language-javascript">{
    "activationId": "bd67ad9ce7904ed5b2e73dc1fb9ddc52",
    "annotations": [
        {
            "key": "limits",
            "value": {
                "logs": 10,
                "memory": 256,
                "timeout": 60000
            }
        },
        {
            "key": "path",
            "value": "whisk.system/combinators/trycatch"
        }
    ],
    "duration": 257,
    "end": 1495808743463,
    "logs": [],
    "name": "trycatch",
    "namespace": "rcamden@us.ibm.com_My Space",
    "publish": false,
    "response": {
        "result": {
            "result": 1
        },
        "status": "success",
        "success": true
    },
    "start": 1495808743206,
    "subject": "rcamden@us.ibm.com",
    "version": "0.0.36"
}
</code></pre>

And here is an example where we force an error:

	wsk action invoke /whisk.system/combinators/trycatch --param '$tryName' /_/safeToDelete/divide --param '$catchName' /_/safeToDelete/error -b --param error true

<pre><code class="language-javascript">{
    "activationId": "19e301526ab24bd59dc01f6814eb46fb",
    "annotations": [
        {
            "key": "limits",
            "value": {
                "logs": 10,
                "memory": 256,
                "timeout": 60000
            }
        },
        {
            "key": "path",
            "value": "whisk.system/combinators/trycatch"
        }
    ],
    "duration": 764,
    "end": 1495808966619,
    "logs": [],
    "name": "trycatch",
    "namespace": "rcamden@us.ibm.com_My Space",
    "publish": false,
    "response": {
        "result": {
            "status": "Um a very bad thing just happened - sorry?"
        },
        "status": "success",
        "success": true
    },
    "start": 1495808965855,
    "subject": "rcamden@us.ibm.com",
    "version": "0.0.36"
}
</code></pre>

Pay special attention to the status. The result is now marked as successful. My error came from the action I built to handle it:

<pre><code class="language-javascript">function main(args) {
	console.log('error action', JSON.stringify(args));

	return {% raw %}{status:"Um a very bad thing just happened - sorry?"}{% endraw %};

}
</code></pre>

Obviously I could do a bit more here but you get the basic idea. This could also be added as part of a greater sequence. Unfortunately, there isn't a nice way to handle "A, B and maybe stop or go to C". The `eca` action comes close, but requires you to throw an error in B, which is wrong in my opinion. The good news is that there is some improvement to this space coming soon. Watch my blog for updates. :)