---
layout: post
title: "Brackets Tip: Using Live Preview as a Web Server"
date: "2014-01-15T15:01:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2014/01/15/Brackets-Tip-Using-Live-Preview-as-a-Web-Server
guid: 5126
---

<p>
One of the cooler features of <a href="http://www.brackets.io">Brackets</a> is Live Preview. Live Preview allows you to edit CSS and HTML and see updates in real time via your browser. This is incredibly powerful and is the first feature I show off when demonstrating Brackets, but it is also one I don't actually use very often. Why? I don't do a lot of CSS. Typically if I need something to look pretty I just drop in a UI framework and not worry about it. Yesterday though I needed to do a bit of design (yes, I design, honest!) so I fired up Live Preview and worked on a simple HTML page.
</p>
<!--more-->
<p>
When I was done with the design aspect, I switched over to writing the JavaScript I would need. One issue with Live Preview is that it will not open with Dev Tools open in the browser. I live and die by my Dev Tools and as I had finished the design portion, I figured it was no big deal. As soon as I opened Dev Tools, I got the warning about the connection in Brackets:
</p>

<p>
<img src="https://static.raymondcamden.com/images/b1.png" />
</p>

<p>
No big deal. I knew this was going to happen. But on a whim - I tried something. When you start Live Connect, Brackets fires up a HTTP server and pops open a Chrome instance with your app in it. In my case, it was http://127.0.0.1:56738/index.html. I wondered if that server was still running. I reloaded the page and... it worked!
</p>

<p>
Ok, that may not seem like a big deal, but I tend to use the <i>heck</i> out of <a href="https://github.com/SimbCo/httpster">httpster</a> to quickly fire up a web server for a directory. I was preparing to switch to Terminal and do that - but now I realize I don't have to. Even when I don't need to worry about design, I'm going to use Live Preview when I need to run a web server for the code I'm writing. (I do have a web server installed of course, but I'll often work outside of it for small projects, articles, etc.)
</p>

<p>
It would be cool if Brackets had a UI just to fire up the HTTP server and not worry about Live Preview at all. By the way, in case you're curious, this is what happens when I do design.
</p>

<p>
<img src="https://static.raymondcamden.com/images/b2.jpg" />
</p>