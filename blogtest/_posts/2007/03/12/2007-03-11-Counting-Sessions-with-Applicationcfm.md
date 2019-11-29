---
layout: post
title: "Counting Sessions with Application.cfm"
date: "2007-03-12T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/12/Counting-Sessions-with-Applicationcfm
guid: 1883
---

A reader pinged me this weekend asking about tracking sessions. I thought I'd whip up a quick blog entry demonstrating how one can <i>count</i> sessions with Application.cfm. (By the way, it is a lot easier with Application.cfc. I'll cover that later.) Note the stress on count. This code will only give you a count of the sessions, not data about the sessions.
<!--more-->
Our demo will consider of two files and isn't terribly complex. The first file is the Application.cfm file. 

<code>
&lt;cfapplication name="sessioncounter" sessionManagement=true&gt;

&lt;!--- Do I need to create my app var? ---&gt;
&lt;cfset needInit = false&gt;
&lt;cflock scope="application" type="readOnly" timeout="30"&gt;
	&lt;cfif not structKeyExists(application,"sessions")&gt;
		&lt;cfset needInit = true&gt;
	&lt;/cfif&gt;
&lt;/cflock&gt;

&lt;!--- Yes, I do need to make it. ---&gt;
&lt;cfif needInit&gt;
	&lt;cflock scope="application" type="exclusive" timeout="30"&gt;
		&lt;cfif not structKeyExists(application,"sessions")&gt;
			&lt;cfset application.sessions = structNew()&gt;
		&lt;/cfif&gt;
	&lt;/cflock&gt;
&lt;/cfif&gt;

&lt;!--- Store my last hit. ---&gt;
&lt;cfset application.sessions[session.urltoken] = now()&gt;
</code>

So what's going on here? First thing I do is define the application and enable sessions. That's kind of required if you want to - you know - count sessions. 

How are we going to count sessions? In this example we are going to use a structure. ColdFusion provides a simple way to create a unique key per session - the session.urltoken variable. Note that I have about 10 lines of code here because of all the CFLOCKs. This will be a heck of a lot easier when we switch to Application.cfc. Essentially they server to ensure we only create the Application variable one time. 

The last thing we do is store our session into the Application structure. This one line is pretty critical so I'll repeat it:

<code>
&lt;cfset application.sessions[session.urltoken] = now()&gt;
</code>

What this does is create a key based on session.urltoken, which I mentioned earlier was unique per session. The value is based on the current time. Why? Because I'm using Application.cfm and not Application.cfc, I don't know when your session will time out. By recording the time I can determine if a session is still valid.

So the next part of the puzzle is actually displaying the count. Here is my index.cfm which includes both the UDF and the display of the result. Obviously you would typically have the UDF in a separate file, but I'm combining it here for simplicity's sake.

<code>
&lt;cffunction name="sessionCount" returnType="numeric" output="false"&gt;
	&lt;cfset var s = ""&gt;

	&lt;cfloop item="s" collection="#application.sessions#"&gt;
		&lt;cfif dateDiff("n", application.sessions[s], now()) gt 20&gt;
				&lt;cfset structDelete(application.sessions, s)&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
		
	&lt;cfreturn structCount(application.sessions)&gt;
&lt;/cffunction&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Hello. There are #sessionCount()# users on the system.
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

I'll focus on the UDF since the rest of the template is simply displaying the result of the UDF. So the point of this code is to return the number of sessions. Since we store a key for each session in an application structure, we could simply use the structCount function. Notice that I do indeed use this at the end of the UDF. But what about sessions that are no longer active? We need someway to filter those out. The simplest way to do this is to loop over the items in the structure and look at their value. Remember we stored their the time value of their last hit? That makes it even easier. One thing to note - I'm removing keys that are older than 20 minutes. 20 minutes is the default session timeout value. If the value is different than you would need to change that number.

Also note that I broke one of the "rules" about not using an outside scope in a UDF. Rules are never 100%, and this is a good example of that. Yes I could make this more abstract, but for a simple utility like this I say why make things overly complex?

So that's it. There are some things I want to leave you with. First - as I mentioned more than once - this is a heck of a lot simpler with Application.cfc. Seriously. So if you have CF7 (or the comparable BlueDragon version), then don't use this code. Secondly - while the UDF is rather simple, if you have a lot of sessions then the code could perform a bit slowly. You may want to consider rewriting the UDF to <i>just</i> return the structCount. You could then use a scheduled task to update the Application storage once every five minutes or so. This means your count is potentially a bit high, but what's a little fuzziness between friends?