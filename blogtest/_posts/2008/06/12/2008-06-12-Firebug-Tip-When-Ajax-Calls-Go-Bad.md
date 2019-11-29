---
layout: post
title: "Firebug Tip - When Ajax Calls Go Bad..."
date: "2008-06-12T12:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/12/Firebug-Tip-When-Ajax-Calls-Go-Bad
guid: 2878
---

Soon to be a new Fox special - this is something that's been bugging me for quite some time. I use Firebug every single day, but I've noticed that it doesn't really keep a history of events. Why do I need a history? I've noticed that in some situations, if my code does an Ajax call to foo.cfm, and foo.cfm throws a ColdFusion exception, then the browser may go to a new page. So for example, imagine this link:
<!--more-->
<code>
&lt;a href="" onclick="doFoo();return false"&gt;Do It&lt;/a&gt;
</code>

Normally this works fine, but if doFoo screws up, the browser 'misses' the return false and can send you to a new page. This makes debugging difficult sometimes. So for example, if doFoo did an Ajax request, I'd actually see the red response in Firebug for a split second before the browser went to the new URL. Firebug would then lose the data as it's in a new request.

The browser error console keeps a history, but what I really need is the response from the Ajax call in Firebug. If I have that, I can look at what ColdFusion returned and see the error. 

Ok, so it turns out there is a way to deal with this. If you open up Firebug, click on Script, and then go to Options, there is a "Break on All Errors" option. It took me a while to find this because there are multiple options link on the page. I've made it obvious here:

<img src="https://static.raymondcamden.com/images/fb.jpg">

Once you activate this, any error will cause the browser to stop. You can then click on the Net tab to examine the XHR request and see the response.