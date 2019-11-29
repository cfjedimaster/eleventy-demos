---
layout: post
title: "ColdFusion 10 Web Socket JavaScript APIs"
date: "2012-02-23T07:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/02/23/ColdFusion-10-Web-Socket-JavaScript-APIs
guid: 4533
---

In my <a href="http://www.raymondcamden.com/index.cfm/2012/2/20/ColdFusion-10-Web-Socket-Demos">last post</a>, I demonstrated three examples of websockets under ColdFusion 10. One thing I didn't really touch on was the JavaScript API you can use to work with websockets. These functions are available to any file making use of the cfwebsocket tag. They allow you to:
<!--more-->
<p>

<ul>
<li>Open or close a connection as well as checking if the connection is open (openConnection, closeConnection, isConnectionOpen)
<li>Subscribe or unsubscribe to a channel (remember that the cfwebsocket tag can autosubscribe you - that's what my demos did)
<li>Authenticate you - technically your back end code will do this, but this helps set up your websocket connection as an authenticated one
<li>Get a list of what you're subscribed too (getSubscriptions)
<li>Get a count of the people subscribed to a channel (getSubscriptionCount)
<li>And finally, invokeAndPublish, which lets you use the websocket connection to run a CFC method.
</ul>

<p>

Each of these functions are asynchronous. The docs clearly say this and anyone who doesn't see this may be a bit slow. (-sigh- yes... I missed it.) So as a simple example, I wanted to add a subscriber count to my chat application. I added the following code within my user registration system (the code run when you tell the application your name):

<p>

<code>
window.setInterval(function(){
	chatWS.getSubscriberCount("chat")
},2000);
</code>

<p>

Remember that "chatWS" is a JavaScript object that is my 'hook' to the websocket. 

<p>

Each of the JavaScript methods will use your message handler for results. This means your message handler has to be a bit complex. Previously it handled new user arrivals as well as messages. So now I have to add a bit more logic to handle this result. Here's my message hander:

<p>

<code>
function msgHandler(message){
	//Only care about messages
	if (message.type == "data") {
		var data = JSON.parse(message.data);
		if(data.type == "chat") $("#chatlog").append(data.username + " says: " + data.chat + "\n");
		else $("#chatlog").append(data.chat + "\r");
		$('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
		console.log("Append "+data.chat);
	}
		
	if(message.type == "response" && message.reqType == "getSubscriberCount") {
		$("#userCount").text(message.subscriberCount);
	}
}
</code>

<p>

You can visit the demo here: <a href="http://raymondcamden.com/demos/2012/feb/19/chat/">http://raymondcamden.com/demos/2012/feb/19/chat/#</a>

<p>

p.s. When I first tried to use this feature, I didn't realize the calls were asynchronous, even though the docs say this. I also didn't realize my message handler would get the result. I thought - why not simply get a user count after we get each message. So I put the call in the message handler. Take a while guess what this did to my server.