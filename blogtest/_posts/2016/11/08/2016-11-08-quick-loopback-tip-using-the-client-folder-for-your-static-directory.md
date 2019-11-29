---
layout: post
title: "Quick LoopBack Tip - Using the Client Folder for your Static Directory"
date: "2016-11-08T09:36:00-07:00"
categories: [development]
tags: [loopback]
banner_image: 
permalink: /2016/11/08/quick-loopback-tip-using-the-client-folder-for-your-static-directory
---

I'm writing this blog post literally because I want a place to store this tip so I can get it easier later on. When you create a new LoopBack application, the command line automatically creates a folder called <code>client</code> for you. That's a folder where you *may*, if you want to, place a client-side application to use with your APIs. This is totally optional. If you do choose to use it, you may find yourself wanting to run both a web app there as well as the LoopBack server.

In the past, I simply went into that folder and used [httpster](https://github.com/SimbCo/httpster) to fire up a quick web server. However, recently it occurred to me that a) LoopBack runs on top of Express and b) Express has a way to point to a static folder and c) LoopBack provides a shortcut for updating that setting. So long as you're OK with your client stuff being on the same port and server as your API stuff, then here is a quick tip.

Open up <code>server/middleware.json</code> and find this bit:

<pre><code class="language-javascript">"files": {}</code></pre>

And just tweak it to:

<pre><code class="language-javascript">"files": {
    "loopback#static": {
      "params": "$!../client"
    }
}</code></pre>

And that's it. Now when you run your LoopBack app, files under the <code>client</code> folder that don't match routes will be loaded as static resources, including your HTML, JavaScript, and CSS.

Oh - one more thing. Most likely you'll add an index.html to your <code>client</code> folder. Don't forget that the default LoopBack app has a route for <code>/</code>. You can remove that in <code>server/boot/root.js</code>:

<pre><code class="language-javascript">router.get('/', server.loopback.status());</code></pre>