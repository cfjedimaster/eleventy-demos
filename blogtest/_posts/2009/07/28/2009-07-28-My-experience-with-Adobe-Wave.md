---
layout: post
title: "My experience with Adobe Wave"
date: "2009-07-28T23:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/28/My-experience-with-Adobe-Wave
guid: 3466
---

I meant to get this out before vacation, but alas, time went by a bit quicker than I expected. This should <b>not</b> be considered a "How To" when it comes to Adobe Wave and ColdFusion. Considering that Wave is still in beta, most likely the API/process will change significantly over time (assuming Wave leaves beta). Also note that I - probably like most people - did not adequately read the docs, so some of what follows may not be exactly kosher with the docs. Please keep that in mind when reading. With that in mind, here are some quick tips and code examples.
<!--more-->
First and foremost, for complete information on Wave, see the page at Labs: <a href="http://labs.adobe.com/technologies/wave/">http://labs.adobe.com/technologies/wave/</a>. This provides links to the forums, docs, etc. 

Next, if you want to actually use Wave as a publisher (sign up is <a href="https://ps-wave.adobe.com/portal/PublisherAdmin.html">here</a>), note that Adobe's verification system requires that you have an email address with the same domain as the server that will be pushing out Wave notifications. This was a problem for me as I never created an email server for ColdFusion Bloggers. Personally I (and others!) think this is a somewhat onerous requirement. Luckily I was able to complain to the right people and skip that, but most folks will not be able to do that. If you have not yet set up an email domain, then head over to Google and get their free email server service. 

Once you've verified your account, you can then begin working with a feed. <b>Be clear on this:</b> It is not an RSS feed. I'd be a lot happier with Wave if it would work with RSS feeds, but it does not. In this case, the word feed is used in the more generic sense. Feed types can be broadcast or point to point (think messages to individual users). Most folks will probably pick broadcast and it's what I used for ColdFusion Bloggers. 

Topics kind of confused me. I had thought I should maybe pick a few topics to cover the type of items ColdFusion Bloggers may send out. But I then realized that I could only broadcast with one topic at a time. If you plan on having a simple notification system like ColdFusion Bloggers, then just make one simple topic.

The next step is the code - and here is where I stumbled quite a bit. Before you can send a notification, you must first get an API token. I had thought that the API token was a simple publisher thing. I looked in the publisher site for a way to generate it but didn't have any luck. Turns out I had misunderstood the process. From what I've learned on the forums, the basic idea is:

a) on first hit, first request an API key
b) make your call, and if it fails, get a new API key and try again

Basically, the API key will work for a while, but not forever. ColdFusion Bloggers is <b>not</b> doing this yet. From what I know, API keys are going to last quite some time, but I've got to update my code to properly handle this. 

Here is the CFC I whipped up (and <b>please</b> ensure you understand the directives above and note that my code doesn't handle it yet) for ColdFusion Bloggers:

<code>
&lt;cfcomponent output="false"&gt;

	&lt;cffunction name="init" access="public" output="false"&gt;
		&lt;cfargument name="apikey" type="string" required="true"&gt;
		&lt;cfargument name="topic" type="string" required="false" hint="If passed, will be used as default."&gt;

		&lt;cfset variables.apikey = arguments.apikey&gt;

		&lt;cfif structKeyExists(arguments, "topic")&gt;
			&lt;cfset variables.topic = arguments.topic&gt;
		&lt;/cfif&gt;
		&lt;cfreturn this&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="broadcast" access="public" output="false" returnType="void"&gt;
		&lt;cfargument name="message" type="string" required="true"&gt;
		&lt;cfargument name="topic" type="string" required="false"&gt;
		&lt;cfargument name="link" type="string" required="false"&gt;
		
		&lt;!--- ignoring the result for now ---&gt;
		&lt;cfset var result = ""&gt;
		
		&lt;cfhttp method="post" url="https://p000-wave.adobe.com/notificationgateway/1.0/notification" result="result"&gt;
			&lt;cfhttpparam type="formfield" name="X-apitoken" value="#variables.apikey#"&gt;
			&lt;cfif not structKeyExists(arguments, "topic")&gt;
				&lt;cfif structKeyExists(variables, "topic")&gt;
					&lt;cfhttpparam type="formfield" name="topic" value="#variables.topic#"&gt;
				&lt;cfelse&gt;
					&lt;cfthrow message="If a topic argument is not passed, one must be set in the constructor."&gt;
				&lt;/cfif&gt;
			&lt;cfelse&gt;
				&lt;cfhttpparam type="formfield" name="topic" value="#arguments.topic#"&gt;
			&lt;/cfif&gt;
			&lt;cfhttpparam type="formfield" name="message" value="#arguments.message#"&gt;
			&lt;cfif structKeyExists(arguments, "link")&gt;
				&lt;cfhttpparam type="formfield" name="link" value="#arguments.link#"&gt;
			&lt;/cfif&gt;
		&lt;/cfhttp&gt;

	&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

The code is rather simple - one simple CFHTTP hit. I pass in a message and a link. The topic is set once when I initialize the code on Application startup. Calling it then becomes as easy as:

<code>
&lt;cfset application.wave.broadcast(message="Yo!", link="http://www.foo.com")&gt;
</code>

I tied this into both the ping code and the general blog scanner for the site and it failed quite nicely. I spent a good day thinking about it in my free time and checking logs, but nothing seemed to explain why Wave kept rejecting my calls. 

Turned out it was the link. I had accidentally passed something like this for a URL: "- http://www.foo.com". Notice the - in front? That invalidates it as a URL. The error returned by Wave was just a generic 400 unless I missed something in my logging. Yep - these are the kind of errors that make you pull your hair out.

Oh - and in case you are wondering - your feed will <b>not</b> show in the "All Feeds" section. That's kind of sucky. The only way for someone to add ColdFusion Bloggers is to click on the install badge. For some reason, I'd expect All Feed to be, well, all feeds. I can seen not listing them all at once, but at least give me a way to see all feeds. Right now I have no idea what else is out there besides what is currently listing. Adobe <i>really</i> needs to address that soon I think.

Anyway, it's working for me now. When I update the code to 'properly' get the API token dynamically, I'll post that. Anyone else going to integrate Wave into their application? It seems like an interesting idea. Not sure if it will fly - but it's interesting.

I will say one thing though - <b>AIR kicks butt.</b> I love the fact that I can put an install badge on my site and that badge will recognize that I've already got Wave running and just add the subscription. Awesome. I'm (mostly) sure that's something any AIR application can do.