---
layout: post
title: "ColdFusion 10 Web Socket Demos"
date: "2012-02-20T09:02:00+06:00"
categories: [coldfusion,development,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/02/20/ColdFusion-10-Web-Socket-Demos
guid: 4529
---

One of my favorite new features in ColdFusion 10 is the powerful web socket support. If you've never looked at web sockets before, you can check out the <a href="http://en.wikipedia.org/wiki/Web_socket">Wikipedia entry</a>. Simply put, it is  a simple way to create a two way connection between multiple clients (browsers) and your server. Like most things, ColdFusion makes using web sockets incredibly easy. Let's look at a few demos.
<!--more-->
<p>

First, consider a simple chat application. I <i>hate</i> chat app examples, but while I was learning this feature myself I figured it was the easiest app I could build. 

<p>

I began by defining my web socket in my Application.cfc file:

<p>

<code>
this.wschannels = [
	{% raw %}{name="chat"}{% endraw %}
];
</code>

<p>

To use a web socket and a corresponding JavaScript object, my template began with this line:

<p>

<code>
&lt;cfwebsocket name="chatWS" subscribeTo="chat" 
			 onMessage="msgHandler"&gt;
</code>

<p>

And that's it. Really. Obviously this is a simple case though. Creating a web socket is a bit like creating a cable network. Your application can support any number of channels. This allows you to send different information for different purposes. Since our chat app is trivial, we can create and subscribe to a channel all via the ColdFusion tag. In more complex applications, you would create the socket and subscribe to channels dynamically.

<p>

Sending a message is possible via the JavaScript object we create in the cfwebsocket tag:

<p>

<code>
msg = {
	type: "chat",
	username: username,
	chat: txt
};
chatWS.publish("chat",msg);
</code>

<p>

Messages are ad hoc objects that you can create as you see fit. There are no required values at all. On the flip side, you can use a message handler to display the messages received from the web socket.

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
}
</code>

<p>

You can see this demo here: <a href="http://www.raymondcamden.com/demos/2012/feb/19/chat">http://www.raymondcamden.com/demos/2012/feb/19/chat/</a>. I'm not going to paste the entire code template in since outside of the one ColdFusion tag, the rest is all client-side code. I encourage you to view source to see the complete template. 

<p>

How about a slightly more useful example? I built a simple <a href="http://www.raymondcamden.com/demos/2012/feb/19/chart/">chart demo</a>. It uses jQuery to send your votes (and yes, you can vote more than once) to a CFC....

<p>

<code>

function voteYes() {
	$.get("vote.cfc?method=savevote", {% raw %}{"key":"yes"}{% endraw %}, function() {});
	console.log("Yes");
}	
function voteNo() {
	$.get("vote.cfc?method=savevote", {% raw %}{"key":"no"}{% endraw %}, function() {});
	console.log("No");
}	
</code>

<p>

And then the server side CFC publishes new chart data to the clients:

<p>

<code>
component {

	remote void function savevote(key) {
		//Note, should probably lock this
		if(key == "yes") application.votes.yes++;
		else if(key == "no") application.votes.no++;
		else abort;
		
		msg = {% raw %}{"votes":application.votes}{% endraw %};
		wspublish("vote",msg);
	}

}
</code>

<p>

This example could be redone so that the web socket itself - using a CFC handler - takes care of updating chart data, but at the time of me writing it I wasn't quite sure how to do that. 

<p>

For a third demo, I built a simple shared whiteboard. It uses canvas to draw and "broadcast" lines to all the clients. So for example, here's how we handle drawing/broadcasting:

<p>

<code>

$(document).ready(function() {
	var whiteboard = $("#whiteboard");
	canvas = whiteboard[0].getContext("2d");
	var offset = whiteboard.offset();	

	whiteboard.bind("mousedown", function(e) {
		canvas.beginPath();
		pointX = e.clientX-offset.left;
		pointY = e.clientY-offset.top;
		canvas.arc(pointX,pointY, 2, 0, Math.PI*2,false);
		canvas.strokeStyle = "#000";
		canvas.stroke();
		if(oldX && oldY) {
			canvas.lineTo(oldX,oldY);
			canvas.stroke();
			whiteboardWS.publish("whiteboard", {% raw %}{type:"draw",origin:userid, from:{x:pointX,y:pointY}{% endraw %},to:{% raw %}{x:oldX,y:oldY}}{% endraw %});
		}
		oldX=pointX, oldY=pointY;
	});

})
</code>

<p>

And here's my listener to draw lines from other clients:

<p>

<code>

function msgHandler(message){
	//notice welcome
	if (message.type == "response" && !userid) {
		userid = message.utid;	
	}
	if (message.type == "data") {
		var data = JSON.parse(message.data);
		//console.dir(m);
		if(data.origin == userid) return;
		console.dir(data);
		canvas.beginPath();
		canvas.moveTo(data.from.x, data.from.y);
		canvas.lineTo(data.to.x,data.to.y);
		canvas.stroke();
		canvas.closePath();
	}
}
</code>

<p>


You can play with this one here: <a href="http://www.raymondcamden.com/demos/2012/feb/19/whiteboard/">http://www.raymondcamden.com/demos/2012/feb/19/whiteboard/</a>. 

<p>

For the full source of these demos, grab the download from my <a href="http://www.raymondcamden.com/index.cfm/2012/2/18/ColdFusion-10-Demo-Dump">demo dump</a> of a few days ago.