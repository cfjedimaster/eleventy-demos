---
layout: post
title: "Some tips for using Brackets and Theseus"
date: "2013-08-28T12:08:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/08/28/Some-tipes-for-using-Brackets-and-Theseus
guid: 5023
---

I've blogged before about the <a href="https://github.com/adobe-research/theseus">Theseus</a> project, a way to debug client-side and server-side JavaScript, but I never got around to actually testing it. Today the Bracket's blog <a href="http://blog.brackets.io/2013/08/28/theseus-javascript-debugger-for-chrome-and-nodejs/">discussed</a> the most recent 0.4 release and how it works within Brackets. I ran into a few issues (part my misunderstanding and part simple issues) so I thought I'd share some tips and examples of how Theseus works. My thanks go to both Thomas Lieber and Joel Brandt for being helpful!
<!--more-->
In a nutshell, Theseus can help you see what methods are being called, what arguments are being passed to them, and inspect stack traces for your code. This is supported for "regular" client-side code, Node.js on the server, and both together.

Let's consider a simple example, a client-side application. If you watch the video on the blog entry I linked to above, you'll note the narrator says he "enables Theseus" and things just work. I didn't quite get that. I had installed the Theseus extension (remember you can do so very easily by using the Brackets extension manager) but the only menu I had noticed was Debug/Debug Brackets with Theseus. I wasn't interested in debugging Brackets, just my regular code. 

Turns out it was under the File menu, and already enabled:

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-08-28 at 11.24.44 AM.png" />

So given a simple HTML page (and yes, Theseus will work with JavaScript embedded in an HTML page, which is nice!), you can click the Live Development icon and you should be good to go.

Consider the following code. It is a simple example of the HTML5 Datalist control bound to server side data (<a href="http://www.raymondcamden.com/index.cfm/2012/6/14/Example-of-a-dynamic-HTML5-datalist-control">blog post</a>).

<script src="https://gist.github.com/cfjedimaster/6368014.js"></script>

After connecting Brackets to my browser and typing a bit, I can immediately see Theseus working!

<img src="https://static.raymondcamden.com/images/Screenshot_8_28_13_11_28_AM.png" />

But look... it's broken. It reported document.ready. It reported the input calls. But my Ajax calls are not firing. WTF. Stupid open source software. 

Then it occurred to me... wait... is this Ajax event firing right? Turns out my backend application server was dead. Notice how my jQuery code doesn't have an error handler? Yeah, that was a test. If you noticed it, you passed. I rewrote my code:

<script src="https://gist.github.com/cfjedimaster/6368065.js"></script>

And now check it...

<img src="https://static.raymondcamden.com/images/Screenshot_8_28_13_11_31_AM.png" />

So, my next issue was how to use this with Node. While documented at the Theseus GitHub page, if you just read the Bracket's blog you may miss this. You need to install node-theseus via NPM and then run your application at the command line with node-theseus. You then may run into this bug:

<pre>
[node-theseus] caught uncaught exception
Error: listen EADDRINUSE
    at errnoException (net.js:901:11)
    at Server._listen2 (net.js:1039:14)
    at listen (net.js:1061:10)
    at Server.listen (net.js:1127:5)
    at Object.exports.listen (/usr/local/lib/node_modules/node-theseus/node_modules/websocket.io/lib/websocket.io.js:62:10)
    at Object.exports.listen (/usr/local/lib/node_modules/node-theseus/node-theseus.js:88:14)
    at Object.<anonymous> (/usr/local/lib/node_modules/node-theseus/bin/node-theseus:92:14)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
[node-theseus] caught process.exit(), not exiting
Express server listening on port 3000
</pre>

Notice the EADDRINUSE error? This didn't make sense to me as Express did start up and my application was available. Turned out that Theseus was using port 8888 in the background and that port was being used by something else on my machine. Killing that fixed everything.

At this point you still want to connect Brackets to Chrome - you may forget that. And you may - I'm still digging into this - need to switch to "proxy" option under the Brackets File menu as shown above. But it should work great. One thing that tripped me up for a second was this. I have this in my app.js:

app.get('/', routes.index);<br/>
app.get('/data', routes.data);<br/>

I noticed Theseus didn't note this. Turns out - it was noting it in routes.index.js, which kind of makes sense. That's where the actual code here. Here is a screen shot from that file:

<img src="https://static.raymondcamden.com/images/Screenshot_8_28_13_11_39_AM.png" />

There you go. All in all pretty darn fascinating. I definitely recommend checking it out, and if you have trouble like I did, use the <a href="https://groups.google.com/forum/#!forum/theseus-discuss">Theseus Discuss</a> Google Group for help.