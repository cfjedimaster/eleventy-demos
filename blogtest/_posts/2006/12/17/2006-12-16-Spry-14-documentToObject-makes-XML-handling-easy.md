---
layout: post
title: "Spry 1.4: documentToObject makes XML handling easy"
date: "2006-12-17T10:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/17/Spry-14-documentToObject-makes-XML-handling-easy
guid: 1718
---

In my <a href="http://ray.camdenfamily.com/index.cfm/2006/12/14/Simple-Chat-in-Spry">chat demo post</a> last week, I talked about how I had trouble figuring out how to work with XML in JavaScript. It wasn't terribly hard, it just took me a while to find some decent docs, as well as to find something that worked in both Firefox and the Devil's Browser.
<!--more-->
One of the cool new features of Spry 1.4 would have really helped me out. There are two new functions, Spry.XML.nodeToObject() and Spry.XML.documentToObject(), which make working with XML a lot easier. 

Kin Blas, one of the Adobe Spry guys, took the time to rewrite part of my chat app and write some cool documentation for what he did as well. Here is the new version of chatResp, my code to handle the result from the back end of the chat demo:

<code>
function chatResp(request) {
	var xml = Spry.XML.documentToObject(request.xhRequest.responseXML);

 	if (xml.chats) {
		// There was a chats node in the XML we just loaded, so iterate over
		// any chat nodes it contains.
		if (xml.chats.chat) {
			// We have one or more chat nodes. If there is a single
			// chat node, xml.chats.chat will be an object that represents
			// that node. If there were multiple chat nodes, then xml.chats.chat
			// will be an array of chat objects.
			//
			// I'm going to cheat a bit here and make sure that we *always* have
			// an array of chats to simplify the logic below. So if xml.chats.chat
			// is not an array, I make it one with a single object in it.
			if (!xml.chats._propertyIsArray("chat")) xml.chats.chat = [ xml.chats.chat ];

			// Grab the number of chats so we don't have to do it for *every*
			// iteration of the loop below. Also, instead of writing out directly
			// to the div through each iteration, it's more of a performance boost
			// to collect a string, and then slam it in when we're done.
			var numChats = xml.chats.chat.length;
			var newContent = "";

			for (var i = 0; i &lt; numChats; i++) {
				// Extract out the values for user, message and time into local variables
				// so we save the JS interpreter some processing time.
				var user    = xml.chats.chat[i].user._value();
				var message = xml.chats.chat[i].message._value();
				var time    = xml.chats.chat[i].time._value();
				var lastId = xml.chats.chat[i]["@id"];

				if (user && message && time) {
					// We have values for everything! Add it to our content string.
					newContent += "&lt;span class='chat_time'&gt;[" + time + "]&lt;/span&gt; ";
                    newContent += "&lt;span class='chat_talk'&gt;" + user + " said: " + message + "&lt;/span&gt;&lt;br&gt;";
					var cdiv = $("div_chat");
					cdiv.innerHTML += newContent;
					cdiv.scrollTop = cdiv.scrollHeight;
				}
			}
	
			if(lastId != "") lastToken = parseInt(lastId)+1;

		}

	}

	setTimeout('loadChat()', pingDur*1000);

}
</code>

There is a lot going on here but since Kin provided great comments, I don't have to add a lot. I do want to point out a few things though. First - lets look at how you get an XML value in the old code:

<code>
message = chatNode.getElementsByTagName("message")[0].childNodes[0].nodeValue;
</code>

Now compare it to the new version:

<code>
var message = xml.chats.chat[i].message._value();
</code>

Nice, eh? I typically use shortcuts when working in arrays, so if I had written I would have ended up with something even shorter:

<code>
var message = thechat.message._value();
</code>

You can view the updated chat demo here:

<a href="http://ray.camdenfamily.com/demos/chat">http://ray.camdenfamily.com/demos/chat</a>

I'll have more 1.4 demos during the week. Enjoy. Oh, and I've attached the code again to this blog entry. I made the ColdFusion side a bit tighter to help decrease the white space returned by the code.

<b>Edited:</b> I forgot something. Kin had sent me yet another update to this code. Look above at this code block:

<code>
if (!xml.chats._propertyIsArray("chat")) xml.chats.chat = [ xml.chats.chat ];
</code>

He explains why this is necessary (in case chat isn't an array but one item). There is a utility method to make this simpler. 

<code>
xml.chats.chat = xml.chats._getPropertyAsArray("chat");
</code>

This will let you treat the data as an array no matter what.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive5%{% endraw %}2Ezip'>Download attached file.</a></p>