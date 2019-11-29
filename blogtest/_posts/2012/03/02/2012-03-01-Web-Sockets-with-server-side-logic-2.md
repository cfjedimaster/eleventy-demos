---
layout: post
title: "Web Sockets with server side logic (2)"
date: "2012-03-02T10:03:00+06:00"
categories: [coldfusion,html5]
tags: []
banner_image: 
permalink: /2012/03/02/Web-Sockets-with-server-side-logic-2
guid: 4548
---

A few days ago I posted an <a href="http://www.raymondcamden.com/index.cfm/2012/2/29/Web-Sockets-with-server-side-logic">update</a> to my websocket chat demo that talked about associating a CFC with the web socket to perform server side operations. While testing the chat, a user (hope he reads this and chimes in to take credit) noted another security issue with the code. I had <a href="http://www.raymondcamden.com/index.cfm/2012/2/23/Your-security-lesson-for-the-day--Console-is-the-MCP">blogged</a> on this topic already, specifically how my chat handler was escaping HTML but could be bypassed easily enough. The user found another hole though. Let's examine it, and then I'll demonstrate the fix.

<p/>
<!--more-->
<p>

When the chat button is pressed, the following code is run:

<p>

<code>
$("#sendmessagebutton").click(function() {
	var txt = $.trim($("#newmessage").val());
	if(txt == "") return;
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

I've removed my HTML escaping code since the server handles it. But pay attention to the message payload. It contains a type, a username, and a chat. The username value is set after you sign in. It's a simple global JavaScript variable. It's also trivial to modify. Just create your own structure and pass it to the web socket object:

<p>

<code>
chatWS.publish("chat", {% raw %}{type:"chat",username:"Bob Newhart", chat:"Howdy"}{% endraw %});
</code>

<p>

The server will gladly accept that and pass it along to others. <b>Not good.</b> Luckily there is a simple enough fix for this. My first change was to remove the username from the packet completely.

<p>

<code>
$("#sendmessagebutton").click(function() {
	var txt = $.trim($("#newmessage").val());
	if(txt == "") return;
	msg = {
		type: "chat",
		chat: txt
	};
	chatWS.publish("chat",msg);
	$("#newmessage").val("");
});
</code>

<p>

If you remember, we had a CFC associated with our web socket that was handling a variety of tasks. One of them supported stripping HTML. Here is the original method:

<p>

<code>
public any function beforeSendMessage(any message, Struct subscriberInfo) {
  	if(structKeyExists(message, "type") && message.type == "chat") message.chat=rereplace(message.chat, "&lt;.*?&gt;","","all");
	return message;
}
</code>

<p>

Notice the second argument we didn't use? This a structure of data associated with the client. We modified this a bit on our initial subscription to include our username. That means we can make use of it again:

<p>

<code>
message["username"]=arguments.subscriberInfo.userinfo.username;
</code>

<p>

This will now get returned in our packet. Check it our yourself below. I've included a zip of the code. (And this is my last chat demo. Honest.)

<p>


<b>OOPS!</b>

<p>

Turns out I have a critical mistake in my fix, but it's one of those awesome screwups that lead to learning. As soon as I posted my demo, a user noted that his chats were being marked as coming from me. I had no idea why. I then modified my CFC to do a bit of logging:

<p>

<code>
var myfile = fileOpen(expandPath("./log.txt"),"append");
fileWriteLine(myfile,serializejson(message) & "----" & serializejson(subscriberInfo));
</code>

<p>

I saw this in the log file:

<p>

<code>
{% raw %}{"chat":"TestAlphaOne","type":"chat"}{% endraw %}----{% raw %}{"userinfo":{"username":"Ray"}{% endraw %},"connectioninfo":{% raw %}{"connectiontime":"March, 02 2012 09:56:18","clientid":1511146919,"authenticated":false}{% endraw %},"channelname":"chat"}

{% raw %}{"chat":"TestAlphaOne","type":"chat"}{% endraw %}----{% raw %}{"userinfo":{"username":"chk"}{% endraw %},"connectioninfo":{% raw %}{"connectiontime":"March, 02 2012 09:57:49","clientid":542107549,"authenticated":false}{% endraw %},"channelname":"chat"}
</code>

<p>

At the time of this test, there were two users. My one message was sent out 2 times. So this is interesting. To me, I thought beforeSendMessage was called once, but it's actually called N times, one for each listener. That's kind of cool. It means you could - possibly - stop a message from going to one user. Of course, it totally breaks my code.

<p>

One possible fix would be to simply see if USERNAME existed in the message packet. But if I did that, an enterprising hacker would simply supply it.

<p>

When I figure this out, I'll post again.

<p>

<b>SECOND EDIT</b> 

Woot! I figured it out. Turns out I should have been using beforePublish. It makes total sense once you remember it exists. It also makes more sense to have my HTML "clean" there too. Things got a bit complex though.

<p>

beforePublish is sent a structure too, but it only contains the clientinfo packet. It does not contain the <b>custom</b> information added by the front-end code. I'm thinking this is for security. But, we have the clientid value and we have a server-side function, wsGetSubscribers. If we combine the two, we can create a way to get the proper username:

<p>

<code>
public any function beforePublish(any message, Struct publisherInfo) {

	if(structKeyExists(message, "type") && message.type == "chat") {
  		//gets the user list, this is an array of names only
  	  	var users = getUserList();
  	  	var myclientid = publisherInfo.connectioninfo.clientid;
		  	  	
  	  	var me = users[arrayFind(wsGetSubscribers('chat'), function(i) {
  	  		return (i.clientid == myclientid);
  	  	})];
	  	  	
		message.chat=rereplace(message.chat, "&lt;.*?&gt;","","all");
	  	  	
  	  	message["username"]=me;
  	}
	  	
	return message;
}
</code> 

<p>

Does that logic make sense? Basically we are just comparing clientids. I've restored the demo so have at it!

<p>

<a href="http://fivetag-cf10beta.securecb1cf10.ezhostingserver.com/chat5"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2012%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fchat5%{% endraw %}2Ezip'>Download attached file.</a></p>