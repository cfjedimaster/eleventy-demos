---
layout: post
title: "Adobe AIR Game - Hamurabi"
date: "2010-10-17T14:10:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2010/10/17/Adobe-AIR-Game-Hamurabi
guid: 3973
---

Today I'm happy to release a little project I've been working on for the past few weeks - a port of the old basic game of <a href="http://en.wikipedia.org/wiki/Hamurabi">Hamurabi</a>. This is a game I used to play on my Apple II a long, long, <i>long</i> time ago. The premis of the game is simple. Given a kingdom with acres of land, bushels of grain, and a population, you decide how much land to buy or sell, how much food to give your people, and how much should be planted. Of course, what those figures mean for your kingdom is notoriously hard to figure out. The game is hard (although I made it a tiny bit easier) and intentionally vague. You will fail. I failed pretty badly too into I completely ported over the old BASIC code and saw the exact numbers used.
<!--more-->
<p>

To make things a bit more interesting, I added a small social aspect to the game. As you play, you will see notices from other players as they play. This makes use of a demo by Mike Fleming (<a href="http://www.thedevshack.com/adobe-air-notification-demo/">Adobe AIR Notification Demo</a>). I modified his code to make his notifications dynamic. The idea was that as you played, you would see how others did and either be encouraged to beat them, or use it as an opportunity to trash talk. And yes - this makes use of the amazing BlazeDS talking to a simple ColdFusion Event Gateway. 

<p>

Another change I made was to prompt you for a title and a name - this leads right into the messaging aspect so the notifications are more personal. 

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-10-17 at 12.37.39 PM.png" />

<p>

The actual game screen is... well... better than 1980s BASIC text input. But not much more so...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-10-17 at 12.41.08 PM.png" />

<p>

To install, simply click the fancy button below:

<p>

<iframe src="http://www.coldfusionjedi.com/demos/hamurabibadge/index_badge.html" width="225" height="190" scrolling="no" frameborder="0"></iframe>

<p>

Ok, so let me talk about a few details - problems I had - things I learned - etc. Consider this an open list of stuff for folks to talk about or tell me how I bad I screwed up. ;)

<p>
<b>BlazeDS and the Flex/Ajax Bridge</b><br/>
Working with BlazeDS and HTMl/AIR apps is - for the most part, simple. I've already talked about Stephen Moretti's <a href="http://nil.checksite.co.uk/index.cfm/2010/1/28/CF-BlazeDS-AJAX-LongPolling-Part1">excellent blog entries</a> on it. I strongly recommend taking a look at that. The biggest issue I ran into was getting my application to <b>send</b> messages. I spent an hour because I simply didn't have a <b>fault handler</b> for my producer. Dumb. Never, ever, ever skip using a fault handler. The second I did that and saw that I wasn't specifying a destination for my messages, it didn't take long to fix. Yeah, may be obvious I guess - but it was a painful lesson.

<p>

And speaking of the bug - I wasn't able to find one lick of HTML code that showed setting up the message the correct way in an Flex Ajax Bridge application. The important line was the setHeaders below:

<p>

<code>
function send(msg) {
	var message = new AsyncMessage(); 
	var data = {};
	data.owner = myid;
	data.message = msg;
	message.setBody(data); 
	message.setHeaders({% raw %}{"gatewayid":gatewayid}{% endraw %});
	producer.send(message); 
	air.trace('done sending msg');		
}
</code>

<p>

<b>UI in an HTML/AIR Application</b><br/>
Man - I never really appreciated the simplicity of Flex's States feature until I needed in HTML. Handling the various states of my application was tricky. I made use of the Dialog control from jQuery UI, but all in all, I'm not terribly pleased with my solution. I really think there should be a more elegant way of handling this. 

<p>

<b>jQuery demos are easy. Applications are non-trivial.</b><br/>
So no surprise here - but as I find myself building "applications" as opposed to just simple demos, I'm finding out that I've got a lot to learn about JavaScript still. I'm reminded of my ColdFusion code back during my 2-4th years of development. I got stuff done. Big stuff. But did I code it well? Hell no. Recognizing that I need to work on my organization is at least a good sign I'd say. 

<p>

<b>Handling sending a message to everyone and ignoring it yourself.</b><br/>
Here is something that was a bit interesting. When I broadcast a message from the application, I want to ensure that I don't display it when it gets echoed back to all the applications. I know there is a unique ID, an originator ID, when I send messages, but I wasn't sure how I could access it on the client side. So for that, I made use of a JavaScript function that "fakes" UUIDs. I assigned one to myself and send it along with the message. When I get a message I check that before displaying it. I bet there is a better way of doing this.

<p>

Anyway, take a spin with the application and use the Download link if you want to see the complete source behind the application.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FHamurabi%{% endraw %}2Ezip'>Download attached file.</a></p>