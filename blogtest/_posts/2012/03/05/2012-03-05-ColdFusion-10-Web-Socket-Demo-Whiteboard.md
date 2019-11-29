---
layout: post
title: "ColdFusion 10 Web Socket Demo - Whiteboard"
date: "2012-03-05T23:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/03/05/ColdFusion-10-Web-Socket-Demo-Whiteboard
guid: 4550
---

My past set of blog entries on ColdFusion 10 and web sockets has focused on a simple chat application that I slowly improved over time with various features (and security fixes). Today I thought I'd release a demo of a simpler application - a basic whiteboard. The whiteboard makes use of HTML5 Canvas and web sockets to allow multiple people to draw at the same time. It doesn't do anything fancy like say who is drawing what or allow for erasing, but it does allow for awesome collaborative art like this:

<p/>
<!--more-->
<img src="https://static.raymondcamden.com/images/ScreenClip34.png" />

<p>

So, how does it work? Let's look at the code:

<p>

First - do not forget that web sockets must be defined in your Application.cfc file. You define your channels and any listeners. In this example, we don't have a CFC listener so it's rather simple:

<p>

<code>
component {
	this.name="websocket_whiteboard";

	this.wschannels = [
		{% raw %}{name="whiteboard"}{% endraw %}
	];

}
</code>

<p>

My main file begins with the cfwebsocket tag:

<p>

<code>
&lt;cfwebsocket name="whiteboardWS" subscribeTo="whiteboard" 
			 onMessage="msgHandler"&gt;
</code>

<p>

Remember - the purpose of this tag is to tell ColdFusion to output the relevant client-side code to support web sockets. It also automatically subscribes the user to the whiteboard channel and declares that messages should run a handler named msgHandler. Now let's look at the JavaScript:

<p>

<code>

var pointX, pointY;
var oldX, oldY;
var canvas;
var userid;

function msgHandler(message){
	//notice welcome
	if (message.type == "response" && !userid) {
		userid = message.clientid;	
	}
	if (message.type == "data") {
		var data = JSON.parse(message.data);
		//console.dir(m);
		//console.dir(data);
		if(data.origin == userid) return;
		console.dir(data);
		canvas.beginPath();
		canvas.moveTo(data.from.x, data.from.y);
		canvas.lineTo(data.to.x,data.to.y);
		canvas.stroke();
		canvas.closePath();
	}
}

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

The code consists of two main parts. I've got a canvas that supports mousedown events. For each click, we draw a small circle for the point, and then see if a previous location was drawn. If so, we then draw a line connecting them. The "magic" happens here though:

<p>

<code>
whiteboardWS.publish("whiteboard", {% raw %}{type:"draw",origin:userid, from:{x:pointX,y:pointY}{% endraw %},to:{% raw %}{x:oldX,y:oldY}}{% endraw %});
</code>

<p>

This broadcasts out over the web socket the line that was just drawn. Now take a look at the msgHandler. For the most part, the logic should be simple - take in the commands - the lines - and draw them. But we don't want to draw <i>our</i> lines, so we've got a bit of code in there to handle noticing lines broadcast from myself. This is done by listening to a "response" message that comes in on the connection and contains a unique identifier for the user. And that's it. You can find the demo below, and the full source of index.cfm as well.

<p>

<a href="http://fivetag-cf10beta.securecb1cf10.ezhostingserver.com/whiteboard/"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

<code>
&lt;cfwebsocket name="whiteboardWS" subscribeTo="whiteboard" 
			 onMessage="msgHandler"&gt;

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
var pointX, pointY;
var oldX, oldY;
var canvas;
var userid;

function msgHandler(message){
	//notice welcome
	if (message.type == "response" && !userid) {
		userid = message.clientid;	
	}
	if (message.type == "data") {
		var data = JSON.parse(message.data);
		//console.dir(m);
		//console.dir(data);
		if(data.origin == userid) return;
		console.dir(data);
		canvas.beginPath();
		canvas.moveTo(data.from.x, data.from.y);
		canvas.lineTo(data.to.x,data.to.y);
		canvas.stroke();
		canvas.closePath();
	}
}

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
&lt;/script&gt;
&lt;style&gt;
#whiteboard {
	border-style: solid;
	border-width: thin;
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;canvas id="whiteboard" width="500" height="500"&gt;&lt;/canvas&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>