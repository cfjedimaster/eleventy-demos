---
layout: post
title: "Serverless and Persistence"
date: "2017-02-09T10:20:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/02/09/serverless-and-persistence
---

Today's post isn't going to be anything really deep, more of an "A-ha" moment I had while talking with my coworker [Carlos Santana](https://twitter.com/csantanapr). No, not that a-Ha...

![Take on this!](https://static.raymondcamden.com/images/2017/2/aha.jpg)

More a "adjustment of a misunderstanding" of the serverless platform. One of the things I knew right away about serverless is that my code acted as a single, atomic unit, in an ephemeral form. So yes, a server is still involved with serverless, but it's created on the fly, used my code, then disappears when my code is done running. The OpenWhisk [docs](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_reference.html#openwhisk_semantics_stateless) have this to say:

<blockquote>
<strong>Statelessness</strong><br/>
<p>
Action implementations should be stateless, or idempotent. While the system does not enforce this property, there is no guarantee that any state maintained by an action will be available across invocations.
</p>
<p>
Moreover, multiple instantiations of an action might exist, with each instantiation having its own state. An action invocation might be dispatched to any of these instantiations.
</p>
</blockquote>

So the practical side effect of this is that you can't use non-database persistence. No file system and no memory variables. Obviously you could use a cloud-based file system like S3 and obviously you can persist in a database, but you can't do this within the action itself.

Except you can. 

First off - when your action is fired up, OpenWhisk does *not* kill it immediately when done. Rather, it keeps the container used for your code around to see if the action will be fired again soon. You can see this yourself with a simple action:

<pre><code class="language-javascript">
var x = 0;

function main(args) {
	x++;
	return {% raw %}{x:x}{% endraw %};
}

exports.main = main;
</code></pre>

If you run this a few times, quickly, the variable will persist and increment:

![Increment](https://static.raymondcamden.com/images/2017/2/aha2.png)

The practical use for this would be storing the result of a database call in memory. For example, imagine if your action needs data from Cloudant in order to process. You could store that value in a global variable and check to see if it is undefined before you talk to Cloudant again. You can only do this if the data you need isn't dependent on arguments - unless you want to start caching with keys related to function parameters. 

The second "a-Ha" moment is that you absolutely do have a file system. That means your code can CRUD locally to work with binary data. You could also simply leave files there and see if they exist on the next invocation. I'd probably treat this carefully, but if you are using one, or a few, particular files, you could consider leaving them there before fetching them. 

So as a practical example, if you need to work with a file from S3, you could copy it locally, and keep it there. When the action is run next time, see if it exists before copying from S3.

A real example of this is the *incredible* demo Daniel Krook made called [openchecks](https://github.com/krook/openchecks). It's an OpenWhisk sample app demonstrating how to build a serverless check scanning/depositing system. As I said, it's *really, really cool* and you should check it out.

Anyway, I hope this helps. As I said, this is something that I assume most people working daily with serverless already grasp, but it was eye-opening to me and just adds another interesting level to what you can do with the platform!