---
layout: post
title: "Model-Glue note on events and redirects"
date: "2006-03-25T21:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/25/ModelGlue-note-on-events-and-redirects
guid: 1169
---

So, I hope it's clear that even though I'm writing a series on <a href="http://www.model-glue.com">Model-Glue</a>, and even though I gush about it at every chance I get (it's the bee's knees, ya know), I still make a few mistakes here and there, and I'm still learning it as well. 

Enayet (one of my readers) pointed out a bug in the <a href="http://pg.camdenfamily.com">sample application</a> I'm using for the series. The error occurred when you clicked on the Galleries linked before logging on. You can try this now if you want. I'm leaving it broken until the next entry. Anyway, let's look at the event and I'll tell you what I did wrong.

<code>
    &lt;event-handler name="Galleries"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getAuthenticated" /&gt;
      	&lt;message name="getMyGalleries" /&gt;
      &lt;/broadcasts&gt;
      &lt;views&gt;
      	&lt;include name="body" template="dspGalleries.cfm" /&gt;
	&lt;include name="main" template="dspTemplate.cfm" /&gt;
      &lt;/views&gt;
      &lt;results&gt;
      	&lt;result name="notAuthenticated" do="Logon" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

So let me read this to you how I understood it. 

<ul>
<li>First the message getAuthenticated
<li>If I'm not logged in, getAuthenticated returns a result of notAuthenticated.
<li>Immidiately run the event Logon
<li>Do <b>not</b> do anything else.
</ul>

However, an error was occurring because the view, dspGalleries.cfm, was running and not getting the data it expected. So, I posted a quick note on the Model-Glue listserv (sign up here: <a href="http://lists.topica.com/lists/modelglue">http://lists.topica.com/lists/modelglue</a>). Turns out I was mistaken. Using the logic as I have above, the new event, Logon, was being <i>appended</i> to the current queue. In other words, the views still ran, but were lost when the next event was fired. I confirmed this by adding some simple logging.

So this didn't really seem to make sense to me now - but it's slowly sinking in. Luckily Model-Glue has a simple solution for that. You can add a redirect attribute to your result and this will cause it to run immediately. Here is the modified version.

<code>
    &lt;event-handler name="Galleries"&gt;
      &lt;broadcasts&gt;
      	&lt;message name="getAuthenticated" /&gt;
      	&lt;message name="getMyGalleries" /&gt;
      &lt;/broadcasts&gt;
      &lt;views&gt;
      	&lt;include name="body" template="dspGalleries.cfm" /&gt;
		&lt;include name="main" template="dspTemplate.cfm" /&gt;
      &lt;/views&gt;
      &lt;results&gt;
      	&lt;result name="notAuthenticated" do="Logon" redirect="yes" /&gt;
      &lt;/results&gt;
    &lt;/event-handler&gt;
</code>

I had known about the redirect attribute before, but didn't include it in the series yet as I didn't think it was necessary. I didn't have a proper understanding of it (hope folks knew I wasn't perfect ;). 

As I said - I'm leaving this bug in the sample for now. Those of you who download the application can confirm it and then try the fix above. (I added redirect="yes" to all of the events that needed to be secured, like Home.)