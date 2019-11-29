---
layout: post
title: "A Loading page with CFFLUSH and JavaScript"
date: "2006-11-29T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/29/A-Loading-page-with-CFFLUSH-and-JavaScript
guid: 1679
---

Today there was a <a href="http://www.houseoffusion.com/groups/CF-Talk/message.cfm/messageid:261819">thread</a> on cf-talk about how to make a "Loading" or "Please Wait" style page while ColdFusion is doing something slow. Most of the answers talked about AJAX but I thought I'd show a simpler version that just used a bit of JavaScript.

First I'll create my loading message:

<code>
&lt;p id="loading"&gt;
Please stand by while we do something.
&lt;cfoutput&gt;#repeatString(" ", 250)#&lt;/cfoutput&gt;
&lt;/p&gt;
</code>

Note that I gave an ID to my loading block. This will be used later. Also note the repeatString. Why do I have that? One of the "features" of IE is that it will not render any content until it gets "enough" content. I use this block of spaces simply to slap IE around and force it to render the content. My next line of code is a simple CFFLUSH:

<code>
&lt;cfflush&gt;
</code>

This is what tells ColdFusion to send the current output back to the browser. Now for the slow code. Obviously this will be custom for your application, but for my test I just used some Java:

<code>
&lt;!--- slow process ---&gt;
&lt;cfscript&gt;
go_to = createObject("java", "java.lang.Thread");
go_to.sleep(3000); //sleep time in milliseconds
&lt;/cfscript&gt;
</code>

You can find this code on the <a href="http://www.coldfusioncookbook.com/entry/61/How-do-I-make-a-template-pause(sleep)?">ColdFusion Cookbook entry</a>. 

Now I just need to clean up the loading text. I used this simple JavaScript:

<code>
&lt;script language="javaScript"&gt;
loadingBlock = document.getElementById('loading');
loadingBlock.style.display='none';
&lt;/script&gt;
</code>

And then I wrapped with a message to the user:

<code>
&lt;p&gt;
Thanks for waiting. Here is your important information.
&lt;/p&gt;
</code>