---
layout: post
title: "Simple Chat in Spry"
date: "2006-12-14T07:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/14/Simple-Chat-in-Spry
guid: 1711
---

Last night I decided to try an experiment. I had read a good article over at Dynamic AJAX: <a href="http://www.dynamicajax.com/fr/JSON_AJAX_Web_Chat-271_290_324.html">JSON AJAX Web Chat Tutorial</a>. I decided to see if I could build something like that using Spry. Turned out it wasn't that hard. Let me show you what I did...
<!--more-->
First off - I want to thank the original author over at Dynamic AJAX for the idea. I borrowed his CSS and techniques and just changed the back end from PHP to ColdFusion. I also, obviously, decided to use Spry to see if it would help me out any. 

I'm not going to go over each line of code, but will focus on the interesting parts. The application works by requesting the chat history from the back end. It passes in a "lastID" value which lets the back end return only the chats that are newer than the last one it received. On the back end, I use the application scope to store the chats. Now this isn't a great idea. The original article used a database and I would recommend that as well, but I wanted to write something folks could download and play with on their own servers. 

So let's look at the code a bit. The function I run to get the chat data is this:

<code>
function loadChat() {
	Spry.Utils.loadURL("GET",  "chatdata.cfm?start=" +  encodeURIComponent(lastToken), true, chatResp);  
}
</code>

The loadURL function has been covered in this blog before. Essentially it is a simply Spry utility to hit a URL. I tell Spry to run chatResp when finished. That function looks like this:

<code>
function chatResp(request) {
	var result = request.xhRequest.responseText; 
	var xmldom = Spry.Utils.stringToXMLDoc(result);	
	var chats=xmldom.getElementsByTagName("chat");

	var lastId = "";
	var cdiv = document.getElementById('div_chat');
	for(var i=0;i&lt;chats.length;i++) {
		var chatNode = chats.item(i);
		var message = "";
		var user = "";
		
		lastId = chatNode.getAttribute("id");
		
		message = chatNode.getElementsByTagName("message")[0].childNodes[0].nodeValue;	
		user = chatNode.getElementsByTagName("user")[0].childNodes[0].nodeValue;	
		time = chatNode.getElementsByTagName("time")[0].childNodes[0].nodeValue;	
		
		if(user != "" && message != "" && time != "") {
			cdiv.innerHTML += "&lt;span class='chat_time'&gt;[" + time + "]&lt;/span&gt; ";
			cdiv.innerHTML += "&lt;span class='chat_talk'&gt;" + user + " said: " + message + "&lt;/span&gt;&lt;br&gt;";
			cdiv.scrollTop = cdiv.scrollHeight;
		}
	}

	if(lastId != "") lastToken = parseInt(lastId)+1;
	setTimeout('loadChat()', pingDur*1000);
}
</code>

Now this function was a pain in the rear. Why? I've never dealt with XML before in JavaScript. While it looks simple enough, I had a heck of a time trying to find decent documentation. It took me twice as long to just find examples as it took for me to understand and use it. I really wish Spry would have a function to make that easier. But anyway - as you can see I parse the result XML and then simply add it to my DIV. Note the cool use of automatically scrolling the DIV to the end. Again - that comes from the guys at Dynamic AJAX. 

The back end is pretty trivial as well. Both getting and adding chats uses the same CFM. I'd probably split that up normally but this was a quick demo. Here is the contents of that file:

<code>
&lt;cfparam name="url.start" default="1"&gt;

&lt;cfif structKeyExists(url, "add") and structKeyExists(url, "user")&gt;

	&lt;cfset chat = structNew()&gt;
	&lt;cfset chat.user = htmlEditFormat(url.user) & " (" & cgi.remote_addr & ")"&gt;
	&lt;cfset chat.message = htmlEditFormat(url.add)&gt;
	&lt;cfset chat.time = now()&gt;
	
	&lt;cflock scope="application" type="exclusive" timeout="30"&gt;
		&lt;cfset arrayAppend(application.chatdata, chat)&gt;
	&lt;/cflock&gt;
	
&lt;cfelse&gt;

	&lt;cfsavecontent variable="chatdata"&gt;
	&lt;chats&gt;
		&lt;cflock scope="application" type="readonly" timeout="60"&gt;
		&lt;cfloop index="x" from="#max(url.start, arrayLen(application.chatdata)-100)#" to="#arrayLen(application.chatdata)#"&gt;
			&lt;cfoutput&gt;
			&lt;chat id="#x#"&gt;
				&lt;user&gt;#application.chatdata[x].user#&lt;/user&gt;
				&lt;message&gt;#application.chatdata[x].message#&lt;/message&gt;
				&lt;time&gt;#timeFormat(application.chatdata[x].time)#&lt;/time&gt;
			&lt;/chat&gt;
			&lt;/cfoutput&gt;
		&lt;/cfloop&gt;
		&lt;/cflock&gt;
	&lt;/chats&gt;
	&lt;/cfsavecontent&gt;
	
	&lt;cfcontent type="text/xml"&gt;&lt;cfoutput&gt;#chatdata#&lt;/cfoutput&gt;
	
&lt;/cfif&gt;
</code>

Nothing too sexy here, although note the use of locking around the code that works with the chat data. Only one thing is kind of neat - note that I return, at most, 100 rows of chats. I do this using the MAX function in the loop.  This ensures that if you come into the chat late you won't be bombed with a huge amount of text. 

So thats it. Feel free to use this but remember to give credit to Dynamic AJAX. I do have a demo online - but for some reason the CFM is very slow on my box. There is no reason why it should be (as you can see above the code is very simple), but just keep it in mind when you test it out. 

<a href="http://ray.camdenfamily.com/demos/chat">Chat Demo</a>

<b>Update:</b> I've had a few folks jump in and note how slow the chat is. Yes, I know. Switching to a DB would make it run quicker - but as I said, I wanted something folks could play with it. I'm also dealing with a box that is getting a bit slow with age and will be moving in a week or so. I did a few small JavaScript updates so I've updated the zip.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fchat1%{% endraw %}2Ezip'>Download attached file.</a></p>