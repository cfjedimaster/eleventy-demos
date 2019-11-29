---
layout: post
title: "Ask a Jedi: Client and Session Storage Questions"
date: "2007-05-15T16:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/15/Ask-a-Jedi-Client-and-Session-Storage-Questions
guid: 2037
---

Slawko (why do my readers always seem to have cool names?) asks an interesting question about Client and Session storage:

<blockquote>
My question is in regards to Sessions.  I think I'm being misslead by a colleague.  My understanding is that Sessions are stored in Server's memory (RAM), and by default timeout is 20 min.  Now there is a setting option in the coldfusion server admin that lets you specify settings for Client Variables. 

This is the part that creates much confusion.  My colleague has set the client variables to recod into a database and says that all the sessions are being stored in that database.  Could you please be so kind and explain if that is really the case or am I being misslead.  What is really happening with the sessions and client variables settings, and what is really the industry standard, if that makes sense.
</blockquote>

So a few things here. I'll try to tackle each one:
<!--more-->
<b>My understanding is that Sessions are stored in Server's memory (RAM)</b>

This is correct.

<b>Now there is a setting option in the coldfusion server admin that lets you specify settings for Client Variables.</b>

Correct. You can set settings for Application, Session, and Client variables.

<b>My colleague has set the client variables to recod into a database and says that all the sessions are being stored in that database.</b>

Incorrect. Client variables <i>can</i> be stored in a database. They can also be stored in the Registry (ick, don't do this) or simple cookie variables. Session data is always stored in RAM. 

<b>What is really happening with the sessions and client variables settings, and what is really the industry standard, if that makes sense.</b>

In general, the ColdFusion Administrator lets you specify the same things for Session and Application variables:

a) Are they allowed at all<br />
b) What default timeout should be used<br />
c) What is the max timeout that can be used<br />

Client variables are a bit different. You have options to enable new client variable databases. You have an option to set the default. Lastly - you can tell ColdFusion how often it should clean up the client databases and remove old information. 

Now for your big one: <b>What is the industry standard?</b>

It is important to remember that the whole concept of a session (note the use of lowercase, when I say Session I'm referring to the ColdFusion scope) is rather nebulous since HTTP just doesn't support it. In general I'd say the commonly accepted view is that a session is:

A collection of requests confined to one unique visitor in a certain period of time. 

In other words - we take one unique user (which is a browser, not a human), look at his requests, and if he doesn't hit us for N minutes, we consider the next request to be a new session.

So with that basic idea in place, every language has it's own way of handling it. Being primarily a ColdFusion guy, I can't speak to how PHP and .Net handles it. I do remember that sessions in PHP seemed a bit hacky, but that was a <b>long</b> time ago when I looked last. (Just trying to hold off the PHP Horde.) If folks want to comment on how it compares, please do.

If I missed anything Slawko, let me know!