---
layout: post
title: "Diagnosing an error - Form entries are incomplete or invalid."
date: "2010-10-15T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/10/15/Diagnosing-an-error-Form-entries-are-incomplete-or-invalid
guid: 3972
---

Last night a reader of mine wrote with an interesting issue. His error handler was firing off quite a few emails (<a href="http://www.raymondcamden.com/index.cfm/2010/10/14/Proof-of-Concept--Throttling-automatic-emails-in-ColdFusion">this would help!</a>) but the error wasn't quite clear. I've recreated the error below and I'll explain how I went about diagnosing it. The short summary is that - once again - ColdFusion's ancient automatic form checker was the culprit, which luckily is easy to get around in ColdFusion 9. But first - let's look at the errors that were generated.
<!--more-->
<p/>

Ok, first - here is a snapshot of what the error looked like:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen16.png" />

<p/>

When I saw this, I immediately noticed that both the Message and the StackTrace talked about form validation. This was my first clue that something with ColdFusion's built in form validation was being triggered. You can read about this feature <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSc3ff6d0ea77859461172e0811cbec22c24-7a7b.html">here</a>. For the most part, no one uses this nor do they even think about it until they accidentally name a field something_required and accidentally trigger it. 

<p/>

Now I asked the developer if he had anything named like that and he said not. But this is an important point. <b>Even if you don't name anything something_required, if a remote request sends that, it will trigger the error.</b> So to be clear, I can force that error on your server right now by just writing my own form. It isn't a big deal for sure, but it is something to remember. Here is where things got weird though. In his error handler he was dumping out the form and it was empty! I noticed his code looked like so:

<p/>

<code>
&lt;cfif isDefined("form.fieldnames")&gt;
	&lt;cfdump var="#form#" label="FORM"&gt;
&lt;/cfif&gt;
</code>

<p/>

So - at this point - I was still pretty lost. I asked him to add this to his error handler:

<p/>

<code>
&lt;cfdump var="#getHTTPRequestData()#"&gt;
</code>

<p/>

This then revealed form data within the content of the request. I then realized the issue. ColdFusion wasn't populating form.fieldnames. If he had just dumped the form scope itself it would have worked. So for some reason, when a form validation error occurs, form.fieldnames will not exist. Confused yet? Let's look at a complete example. First, my Application.cfc.

<p/>

<code>
&lt;cfcomponent output="false"&gt;

	&lt;cfset this.name = "demo2"&gt;
	&lt;cfset this.sessionManagement = true&gt;
	
	
	&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="onError"&gt;
		&lt;cfargument name="exception"&gt;
		&lt;cfargument name="event"&gt;
		&lt;cfdump var="#arguments#" abort&gt;
	&lt;/cffunction&gt;    

&lt;/cfcomponent&gt;
</code>

<p/>

Next - this is the file being hit by the remote server.

<p/>

<code>
Testing from test3.cfm

&lt;cfdump var="#getHTTPRequestData()#"&gt;
</code>

<p/>

Right now it just echos back data. And finally, here is my tester:

<p/>

<code>
&lt;h1&gt;testing from test1&lt;/h1&gt;

&lt;cfhttp url="http://localhost/test3.cfm" method="post" result="result"&gt;
	&lt;cfhttpparam type="formfield" name="stuff" value="ray"&gt;
&lt;/cfhttp&gt;

&lt;cfoutput&gt;#result.fileContent#&lt;/cfoutput&gt;
</code>

<p/>

Notice the form field is just stuff. Ok, so here is the result of a good post.

<p/>


<img src="https://static.raymondcamden.com/images/cfjedi/screen17.png" />

<p/>

And now - let's break it. Here is my new tester:

<p/>

<code>
&lt;h1&gt;testing from test1&lt;/h1&gt;

&lt;cfhttp url="http://localhost/test3.cfm" method="post" result="result"&gt;
	&lt;cfhttpparam type="formfield" name="stuff_required" value="ray"&gt;
&lt;/cfhttp&gt;

&lt;cfoutput&gt;#result.fileContent#&lt;/cfoutput&gt;
</code>

<p/>

As you can see - I just renamed the field to include something to trip up ColdFusion's validation.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen18.png" />

<p/>

As you can see - even this is a bit confusing. Why is my form value in there? No idea. So what to do?

<p/>

First off - in ColdFusion 9 you can fix this in two seconds: 

<p/>

<code>
&lt;cfset this.serverSideFormValidation = false&gt;
</code>

<p/>

I see no reason to <b>never</b> use this line of code - unless you actually are using that old feature and if so... um... stop. Now unfortunately the user was still on ColdFusion 8. Luckily you can just look at the exception and not email if it happens. Here is an example.

<p/>

<code>
&lt;cffunction name="onError"&gt;
	&lt;cfargument name="exception"&gt;
	&lt;cfargument name="event"&gt;
	&lt;cfif arguments.exception.message is not "Form entries are incomplete or invalid."&gt;
		&lt;cfdump var="#arguments#" abort&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;    
</code>

<p/>

Since the remote site wasn't doing anything valid on the server anyway, this is probably a fine response. (Although I'd also consider noting the IP and blocking it at the network level.)

<p/>

Anyway - I hope this helps others!