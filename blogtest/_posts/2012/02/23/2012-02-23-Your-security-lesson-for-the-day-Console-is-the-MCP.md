---
layout: post
title: "Your security lesson for the day - Console is the MCP"
date: "2012-02-23T15:02:00+06:00"
categories: [coldfusion,development,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/02/23/Your-security-lesson-for-the-day-Console-is-the-MCP
guid: 4534
---

I crashed my server a few minutes ago, and while not related, I discovered a little security flaw in my websocket demo that I thought would be fun to share with you guys. My mistakes should be your lessons, right? As with many mistakes, it involved something I knew could be an issue, I just had to find the time to confirm it really was. Before I tell you the flaw, let me show you the code and see if you can pick up the issue.
<!--more-->
<p>

First, a bit of context. The code involved was for my websocket chat demo. It allows for, well, chat, and I wanted to ensure that the messages broadcast by users did not include any HTML. This is how I fixed it:

<p>

<code>
$("#sendmessagebutton").click(function() {
	var txt = $.trim($("#newmessage").val());
	if(txt == "") return;
	txt = txt.replace(/&lt;.*?&gt;/,"");
	msg = {
		type: "chat",
		username: username,
		chat: txt
	};
	chatWS.publish("chat",msg);
	$("#newmessage").val("");
});
</code>

<p>

Nice and simple, right? You take the input, trim it, strip the HTML, and then pass it to my websocket object. The message will now be "clean" of any HTML the user may have tried to send. That worked fine until I tried this...

<p>

<iframe width="640" height="480" src="http://www.youtube.com/embed/n2E4zl5laYc" frameborder="0" allowfullscreen></iframe>

<p>

So what happened there? As a user, I commonly will view source on web apps so I can see how they are built. I assume everyone does. I noticed how the chat system went through the code above. I also noticed how it simply packaged things up and passed it to a chatWS variable. Once I knew that, nothing stopped me from going into my browser console and executing the call manually.

<p>

Does that worry you? I hope so. 

<p>

The moral of the story is - well - the same as it's <i>always</i> been. <b>Don't trust client input.</b> In this case though it didn't occur to me. Why? Because in our websocket implementation, you don't have to write <b>any</b> server side code. Your message just bounces out to all the clients. 

<p>

Luckily this is easily enough to fix. In ColdFusion 10, you can associate a CFC with a websocket channel. One of the methods you can implement is "beforeMessage". This allows you to massage your messages before they go out. Here's how I corrected it:

<p>

<code>
public any function beforeSendMessage(any message, Struct subscriberInfo) {
	if(structKeyExists(message, "type") && message.type == "chat") message.chat=rereplace(message.chat, "&lt;.*?&gt;","","all");
	return message;
}
</code>

<p>

Make sense? (Btw, if you were around for when I crashed my server, this was certainly <i>not</i> why. I have a pretty good handle on why and will report back when I can.)

<p>

<img src="https://static.raymondcamden.com/images/Mcp.PNG" />