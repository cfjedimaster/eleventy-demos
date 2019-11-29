---
layout: post
title: "Great Reminder of Persistence in Serverless"
date: "2017-07-18T09:11:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/07/18/great-reminder-of-persistence-in-serverless
---

Today I ran into a great bug. By "great" I mean it totally confused me but as soon as I realized what I was doing wrong, I knew it would be a great thing to blog about as a reminder to others. I don't think this applies just to OpenWhisk, but to serverless in general.

Ok, so what did I do? I was working on a sample action that simply returned an array of cats. As an added feature, you can filter the cats by passing an argument. Here's the code:

<pre><code class="language-javascript">let cats = [&quot;Luna&quot;,&quot;Cracker&quot;,&quot;Pig&quot;,&quot;Simba&quot;,&quot;Robin&quot;];

function main(args) {

    if(args.filter &amp;&amp; args.filter !== &#x27;&#x27;) {
        cats = cats.filter((cat) =&gt; {
            return (cat.indexOf(args.filter) &gt;= 0);
        });
    }

    return {
        cats:cats
    };
    
}
</code></pre>

Pretty simple, right? Either return cats as is, or filter based on a quick <code>indexOf</code> check. (On reflection, I should probably lcase the filter and the cat name to make the filter a bit easier to use, but whatevs.)

So I fired this up on OpenWhisk, web-enabled it, and ran a quick test. First, I hit:

https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/safeToDelete/arraybug.json

And I got:

<pre><code class="language-javascript">{
	cats: [
		"Luna",
		"Cracker",
		"Pig",
		"Simba",
		"Robin"
	]
}
</code></pre>

Woot. Ok, now filter it like so: 

https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/safeToDelete/arraybug.json?filter=Lu

And the result is perfect:

<pre><code class="language-javascript">{
	cats: [
		"Luna"
	]
}
</code></pre>

Now let's try a filter returning nothing: 

https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/safeToDelete/arraybug.json?filter=x

<pre><code class="language-javascript">{
cats: [ ]
}
</code></pre>

![WOOT](https://static.raymondcamden.com/images/2017/7/jsgod.jpg)

Alright, so final test, let's return everything again with the original URL:

https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/safeToDelete/arraybug.json

<pre><code class="language-javascript">{
cats: [ ]
}
</code></pre>

Um. Err. What the heck, right? So I added a console.log. Reran my code and it was fixed.

Woot!

And then I filtered again. 

And it broke again.

Whatever is the opposite of woot!

And then this is where I remember a blog post I did back in February: [Serverless and Persistence](https://www.raymondcamden.com/2017/02/09/serverless-and-persistence). Specifically this part:

<blockquote>First off - when your action is fired up, OpenWhisk does not kill it immediately when done. Rather, it keeps the container used for your code around to see if the action will be fired again soon. </blockquote>

And then I looked back at my code, specifically the filter. Realization dawned. 

![Oops](https://static.raymondcamden.com/images/2017/7/catohyeah.jpg)

In case it wasn't obvious the issue was two fold:

* OpenWhisk was keeping my code 'warm', in other words, up and ready for repeated calls.
* My code was modifying, and *destroying*, the original array when a filter was used.

Incredibly obvious when you think about it. My fix was to just make a copy of array (and I set the original to a <code>const</code> for good measure).