---
layout: post
title: "Ask a Jedi: What is the proper way to handle session/cgi variables in CFCs?"
date: "2008-04-15T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/15/Ask-a-Jedi-What-is-the-proper-way-to-handle-sessioncgi-variables-in-CFCs
guid: 2768
---

Samer asks:

<blockquote>
<p>
I know CFCs should never access SESSION/CGI variables, and these variables should be passed as arguments.
In my case i have a lot of CFCs that calls another CFC "for logging" which reads SESSION and CGI variables, is there
a way not to pass these variables as arguments in all CFCs? 
</p>
</blockquote>

I think you touch on multiple things here - and each thing you touch on will have multiple answers with a lot of it being "it depends." So get ready Samer for an overload from me and my readers. Let me begin by breaking this up into what I see as the main concerns.
<!--more-->
<ol>
<li>CFCs and accessing Session/CGI variables
<li>Multiple CFCs using some common other CFC
</ol>

Let's start with issue one. First off - I know I've done it myself, but I try to refrain from saying never. The issue isn't with Session variables in a CFC, but with outside variables in general. You should try to make your CFCs as encapsulated as possible. I assume most folks 'get' that concept so I won't cover it a lot - but I bring it up to remind folks that it isn't just Session variables you wouldn't want to use (normally), but anything that hinders encapsulation. 

That being said, from time to time I've used Session variables in my Controller CFCs in Model-Glue applications. I kept my model layer as pure as possible, but found a need to directly reference session items in the controller layer. I did try to make it as 'nice' as possible. So for example, any time I needed a user object stored in the session scope, I'd call a getCurrentUser() method. That method directly accessed the session scope. That way in case things changed I'd only have one thing to change. 

I'd also argue that a logging CFC is a good example of something that can break encapsulation. I certainly wouldn't bother passing in CGI info when setting up a logger CFC as the CGI scope is <i>always</i> there. 

Point 2 - this is <b>exactly</b> where something like <a href="http://www.coldspringframework.org/">ColdSpring</a> comes into play. Whenever you get an application that has multiple CFCs and CFCs that depend on each other, you want to look into a framework to make the dependencies easier to handle. Do <b>not</b> do like I did and delay picking it up. As I've said <a href="http://www.raymondcamden.com/index.cfm/2008/3/27/Im-an-idiot-for-not-using">before</a>, I wish I had picked up ColdSpring a lot earlier as it would have made my life a lot easier.