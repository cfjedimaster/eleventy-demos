---
layout: post
title: "Working with the Forwarder Action in OpenWhisk"
date: "2017-08-05T06:03:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/08/05/working-with-the-forwarder-action-in-openwhisk
---

One of the issues you run into when working with sequences in OpenWhisk is handling the flow of data from one action to another, especially when integrating actions from other packages where you have no control over the code. In the past, I've discussed how you can use "intermediary" actions to handle transforming the output of an earlier action into an appropriate form for an upcoming action.

A recent [StackOverflow question](https://stackoverflow.com/questions/45497226/how-to-use-openwhisk-forwarder-combinator-to-forward-parameters-around-a-cloudan) brought up another situation. Imagine a sequence where you've got a set of input arguments. The situation described in the SO post is roughly this: Given an email address, you want to see if it exists in Cloudant and if not, insert it. As part of his sequence, he runs an action that does a query for the email address. However, that action only outputs a result set. His original input, the email address, is "lost" because this action only outputs a result set. 

What he needs is the ability to say: "Run this second action in the sequence and can you please forward along these arguments you don't need till later?" Luckily, there's an default OpenWhisk action for that, /whisk.system/combinators/forwarder. The combinators aren't really documented right now but you can use the CLI to look at the API:

<pre><code class="language-javascript">wsk action get /whisk.system/combinators/forwarder --summary
action /whisk.system/combinators/forwarder: Forward parameters around another action.
   (parameters: $actionArgs, $actionName, $forward)
</code></pre>

That may be a bit too obtuse. If you drop the <code>--summary</code>, you get more detail in JSON format. I'll rewrite it here in English format. First, here is a bit more information about the parameters:

* $actionName - Name of action to run to compute condition. Must return error to indicate false predicate.
* $actionArgs - Array of parameters names from input arguments to pass to action.
* $forward - Array of parameters names from input arguments to merge with result of action.

And then there is a sample that describes how to use it with the default echo action. I've taken that and converted into a real CLI call:

<pre><code class="language-javascript">wsk action invoke /whisk.system/combinators/forwarder -b -r --param '$actionName' '/whisk.system/utils/echo' --param '$actionArgs' '["x"]' --param '
$forward' '["y"]' --param x ray --param y foo
</code></pre>

That's a bit complete, so let's break it down bit by bit, starting with the parameters.

* For $actionName, I'm telling forwarder what I want it to run.
* For $actionArgs, I'm supplying a list of arguments that will be passed to the action.
* For $forward, I'm supplying a list of arguments that will be passed to the *next* action, or just the output in general. 
* Finally, everything after those arguments are my "real" arguments to my logic. In this case, x and y.

So in English: I want to run the echo command and pass X to it. When done, take the output of echo and merge it with Y, another argument, to give me a final result. Using the sample above, the output is:

<pre><code class="language-javascript">{
    "x": "ray",
    "y": "foo"
}
</code></pre>

To test this myself, and within a sequence, I built two actions. The first is doubler, it takes in a number and multiplies it by two.

<pre><code class="language-javascript">function main(args) {
    if(!args.number) args.number = 0;
    return {% raw %}{ result: args.number*2 }{% endraw %};
}
</code></pre>

And then I built a second action called "something" (I was struggling to come up with a nice name) that is basically the same as echo:

<pre><code class="language-javascript">function main(args) {

    return {
        result: args
    }

}
</code></pre>

Both of these were pushed up to OpenWhisk. I then created a sequence - but instead of making it with doubler+something, I made it with forwarder+something:

<pre><code class="language-javascript">wsk action create --sequence testFwd /whisk.system/combinators/forwarder,safeToDelete/something
</code></pre>

Basically forwarder is going to replace doubler. To call this sequence, I built a JSON file as I didn't want to supply all the parameters at the CLI. In Windows Bash, $foo tends to break stuff (I escaped it above, but yesterday when I was researching I had forgotten how to do it). Here are my parameters:

<pre><code class="language-javascript">{
    "$actionName":"safeToDelete/doubler",
    "$actionArgs":["number"],
    "$forward":["a","b"],
    "number":8,
    "b":"banana",
    "a":"apple"
}
</code></pre>

I'm saying - I want forwarder to run my doubler and pass in the number argument. When done, I want the result of doubler and I want parameters a and b to be merged. I ran the test like so:

<pre><code class="language-javascript">wsk action invoke testFwd --param-file params.json  -b -r
</code></pre>

And the result was:

<pre><code class="language-javascript">{
    "result": {
        "a": "apple",
        "b": "banana",
        "result": 16
    }
}
</code></pre>

I don't know about you, but I had a heck of a time understanding this until I got it working, so hopefully this will help others. I'll also point out that in the specific use case described by the user, I probably would have done things differently. Instead of using the pre-built Cloudant actions, I'm thinking I would have used the npm package for it myself and built my own. It would have been a bit more work perhaps, but maybe a bit easier to. I could see one action for "insert x if it is new or throw an error" versus 2+ actions doing the same thing. Remember, OpenWhisk is a pretty fluid system and there is usually different ways to solve the same problem.