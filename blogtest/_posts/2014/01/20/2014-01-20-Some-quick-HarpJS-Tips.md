---
layout: post
title: "Some quick HarpJS Tips"
date: "2014-01-20T17:01:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2014/01/20/Some-quick-HarpJS-Tips
guid: 5132
---

<p>
I spent some time today converting an older ColdFusion site to static HTML (I'll talk more about that tomorrow) and I thought I'd share some tips that may help others.
</p>
<!--more-->
<p>
<b>Tip One - What to do when you don't see an error.</b><br/>
Today I ran into an odd problem where Harp wouldn't tell me what went wrong with a request. Normally Harp will pass up errors just fine. As an example, here is me screwing up some EJS.
</p>

<p>
<img src="https://static.raymondcamden.com/images/bp11.jpg" />
</p>

<p>
Sometimes it can be a bit hard to <i>find</i> the error if the template is big, but generally you can quickly figure out what you did wrong. But things can get weird. For example, I got this error when I tried to test 404 functionality.
</p>

<code>
There is an error in your 404.ejs file.
</code>

<p>
And that was it. So on a whim, I nuked my 404.ejs file and just wrote "Hello World", and it still didn't work. So what was wrong? The issue was in my layout file. For some reason the request to the 404 error ended up loading my layout and not passing the error there back to the error handler. 
</p>

<p>
So how would you find this? Compile your Harp app. Even if you aren't done yet, try it. When I did, I immediately got an error in the output.
</p>

<img src="https://static.raymondcamden.com/images/bp21.jpg" />

<p>
<b>Tip Two: Debugging Output</b><br/>
I've got two suggestions here. First, if you want to dump data to the browser, don't forget you can use JSON.stringify. As an example, this will dump out the public object (using EJS):
</p>

<code>
&lt;{% raw %}%- JSON.stringify(public) %{% endraw %}&gt;
</code>

<p>
Nice and simple, right? But while this works for quick dumps to the screen, it wasn't as useful for debugging inside functions. I tried document.writeln, but forgot that this was executing on the server side and there <i>was</i> no document! (Again, obvious, but, yeah.) 
</p>

<p>
Then on a whim I tried console.log... and it worked! I know Harp is using Node on the backend, but mentally when I'm doing Harp crap I just don't think of me as being in a Node environment. This is probably obvious to every other Harp user but damn am I happy I had this realization. As I build more complex Harp templates this will be a life saver for me.
</p>

<p>
<b>Final Tip - link to HTML</b><br/>
Harp supports different templating languages (both for HTML and CSS). If you have a file called foo.ejs, you can access it as either foo.html or foo. It is tempting to just use foo. But if your end result is a static site, you probably want to ensure foo.html works. Another mistake I tend to make is <i>not</i> including the html in my links because - again - I think my brain is assuming it won't work until compiled. As I said though - that isn't the case. So try to be consistent and just always include it.
</p>