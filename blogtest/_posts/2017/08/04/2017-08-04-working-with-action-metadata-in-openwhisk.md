---
layout: post
title: "Working with Action Metadata in OpenWhisk"
date: "2017-08-04T09:45:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/08/04/working-with-action-metadata-in-openwhisk
---

Yesterday I was giving a presentation at KCDC and one of the attendees asked a great question: 

<blockquote>
Can an action know if it is being executed within a sequence?
</blockquote>

Now, immediately I said that doing this was a bad idea. The whole point of serverless functions is for them to do one thing only in a stateless manner. If you find yourself writing code that cares whether or not it's being executed in a sequence than you are probably doing something wrong. 

That being said... I thought it was an interesting question anyway. And yes, I can say that you should "Never do X", but I don't want to say that there may *never* be a time when we have to do X, and maybe learning how to do it can help us learn more about OpenWhisk in general, right? 

Let's begin with the docs. Under the section on creating actions, there is this: <a href="https://console.bluemix.net/docs/openwhisk/openwhisk_actions.html#accessing-action-metadata-within-the-action-body">Accessing action metadata within the action body</a>. It details that you have access to various environment variables for the currently executing action. They are:

* __OW_API_HOST
* __OW_API_KEY
* __OW_NAMESPACE
* __OW_ACTION_NAME (ding ding, we have a winner!)
* __OW_ACTIVATION_ID 
* __OW_DEADLINE

If any of these don't make sense based on the name itself, just check the docs. Accessing those environment variables will change depending on the language you are using for your action. Here is a simple JavaScript action that echoes them all back.

<pre><code class="language-javascript">function main(args) {

    let result = {};

    for(let key in process.env) {
        if(key.indexOf('__OW_') === 0) {
            result[key] = process.env[key];
        }
    }

    return {
        result:result
    }

}
</code></pre>

And here is an example of the output:

<pre><code class="language-javascript">{
    "result": {
        "__OW_ACTION_NAME": "/rcamden@us.ibm.com_My Space/safeToDelete/meta1",
        "__OW_ACTIVATION_ID": "161045c19b8649e18ab94a85f1713b93",
        "__OW_API_HOST": "https://openwhisk.ng.bluemix.net:443",
        "__OW_API_KEY": "this is so secret you can never guess it",
        "__OW_DEADLINE": "1501858941808",
        "__OW_NAMESPACE": "rcamden@us.ibm.com_My Space"
    }
}
</code></pre>

Ok, so, the first thing I thought was - would the action name change if an action was being run in a sequence? Remember that a sequence is also an action. You create it by passing a flag and telling it the list of actions to run, but when you are done, you invoke it as any other action. I made a new action, let's call it <code>meta2</code>, and I placed it in a sequence called <code>metaSeq</code>. When running either action, the name inside meta2 was still meta2.

That's expected I think, and desired, so that's good. 

On a whim though - I tried something else. I looked at the activation IDs being used. And here I saw something interesting. When I looked at __OW_ACTIVATION_ID inside the action (and by look I mean <code>console.log</code>) and then fetched it via the CLI, I saw this in the <strong>sequence</strong> call:

<pre><code class="language-javascript">"annotations": [
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
		"value": "rcamden@us.ibm.com_My Space/safeToDelete/meta2"
	},
	{
		"key": "causedBy",
		"value": "sequence"
	}
],
</code></pre>

Note the "causedBy" key. This is - obviously - not there when I run meta2 outside the sequence. So I tried actually fetching it in my code:

<pre><code class="language-javascript">const openwhisk = require(&#x27;openwhisk&#x27;);

function main(args) {
    let myActivation = process.env.__OW_ACTIVATION_ID;
    let ow = openwhisk();
    console.log(&#x27;try to load &#x27;+myActivation);

    return new Promise((resolve, reject) =&gt; {
        try {
            ow.activations.get({% raw %}{activation:myActivation}{% endraw %}).then(activation =&gt; {
                resolve({% raw %}{result:activation}{% endraw %});
            }).catch(err =&gt; {
                console.log(&#x27;in error&#x27;, err);
                reject({% raw %}{err:err}{% endraw %});  
            });
        } catch(e) {
            console.log(&#x27;main catch&#x27;,e);
            reject({% raw %}{err:e}{% endraw %});
        }
    });

}
</code></pre>

Unfortunately, this runs into a chicken/egg problem. At the time this code runs, even though I have an activation ID, I can't actually fetch it yet via the API (the Node module is simply using the REST API). Maybe if I added a slight delay of a second or so it would work, but now we're going too far down the rabbit hole to even be slightly sensible. (And yes, I did try waiting, because why not, and nope, it doesn't work, the action has to be complete before you can fetch the activation from it itself.)

So despite this being rooted in something I wouldn't do in the first place, I hope this was useful in terms of showing the kind of information an action can know about itself. Leave me a comment below if you've got any suggestions or questions!