---
layout: post
title: "Ask a Jedi: Tracking Users"
date: "2007-06-12T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/12/Ask-a-Jedi-Tracking-Users
guid: 2114
---

Rob sent in an interesting question this morning concerning tracking users and their activities. It is a rather long read, but please check it out and let me know what you think. (Also, I've been getting a <b>lot</b> of email from Australia lately. I knew there were a bunch of ColdFusion developers down there, but who knew there were so many! I'm going to have to buy some Coopers and fly down there some time.)
<!--more-->
First - let me paste in his question:

<blockquote>
I've been trying to figure out is a tracking feature that allows me to track the users around the application, I'm sure you can imagine the benefits of knowing
what the little monsters have been up to when you're not around.

This tracker should have two sides to it, firstly a 'track' for each user in the application, it logs everything they do around the app and when they do it into
an array or something or that nature, then when the session ends or they log out
of the application, this data will be passed into persistence.

The second element of the tracker is from an application admin point of view. I'd love to
have a list of users that are currently active on the application, what their current activity is and suchlike.

Both of these elements are fairly simple to implement on their own, but I'm after your thoughts on where they should be stored and whether they should be contained within a single cfc, as they essemtialy perform very similar tasks keeping them as two separate components feels a little bit like over kill.

As I see it we could either place the first cfc which stores all the users activities into their session scope, and
the cfc that lists current users on the system into the application scope. Then when a user does an activity, we add it to the first cfc and update the second.
The second option is to keep all the core function in a single component in the application scope, we then have a structure, each key representing a user
and the value being an array of all their activities. We then place an identifier for their track into their session scope, so when they log out or the
session ends, we can identity their track in the application scope and move it to persistence.
</blockquote>

So first off - before we discuss if this should be one CFC or two (and bear in mind, this is all about opinion, either solution <b>will</b> work), you may want to ask yourself if storing it in CFC memory (RAM) is actually what you really want. While it certainly makes it easy to get at, you aren't going to have any history. You will be able to see what people are doing now - or even through the lifetime of your Application scope, but what about two weeks ago? Two months ago? I'd first ask if you shouldn't be doing simple database logging instead. This would give you wonderful historical data. You <b>may</b> be implying that by your "move it into persistence" comment at the end. But this would worry me (by this I mean doing it at the end). If the server crashes, then you will have lost your current data.

If you do decide to log - the catch to this is <i>what</i> you should log. You mentioned you wanted to log their actions. So lets say you log something like this to the database:

<code>
User Bob visited page: Jobs
</code>

And then later on you modify this to be:

<code>
User Bob hit page: Jobs/Main
</code>

Suddenly you have a data integrity issue as the two records won't match up. This issue is surmountable though - just spend some time really nailing down how you will log and try to ensure it will be forwards compatible with future changes.

Now lets ignore that. Because whether you log to files or use RAM, your question still applies. I definitely agree that one CFC in the Application scope makes the most sense here. I try to keep my CFCs are organized as possible, and this "User Activity" function seems to call for it's own CFC. 

For fun - I decided to whip up a demo. Consider the below CFC:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="init" returnType="usermonitor" access="public" output="false"&gt;
	&lt;cfset variables.users = structNew()&gt;
&lt;/cffunction&gt;

&lt;cffunction name="addUserActivity" returnType="void" access="public" output="false"
			hint="Adds a user activity."&gt;
	&lt;cfargument name="key" type="string" required="true"&gt;
	&lt;cfargument name="activity" type="string" required="true"&gt;
	
	&lt;cfif structKeyExists(variables.users, arguments.key)&gt;
		&lt;cfset arrayAppend(variables.users[arguments.key].activities, arguments.activity)&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getCurrentActivity" returnType="struct" access="public" output="false"
			hint="For all users, return the latest activity."&gt;
	&lt;cfset var result = structNew()&gt;
	&lt;cfset var user = ""&gt;
	
	&lt;cfloop item="user" collection="#variables.users#"&gt;
		&lt;cfset result[user] = variables.users[user].activities[arrayLen(variables.users[user].activities)]&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn result&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getUserActivity" returnType="array" access="public" output="false"
			hint="Gets a user activity history."&gt;
	&lt;cfargument name="key" type="string" required="true"&gt;

	&lt;cfif structKeyExists(variables.users, arguments.key)&gt;
		&lt;cfreturn variables.users[arguments.key].activities&gt;
	&lt;cfelse&gt;
		&lt;cfthrow message="Invalid User"&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getUserCount" returnType="numeric" access="public" output="false"
			hint="Returns the number of users in our list."&gt;
	&lt;cfreturn structCount(variables.users)&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getUsers" returnType="string" access="public" output="false"
			hint="Returns the user list."&gt;
	&lt;cfreturn structKeyList(variables.users)&gt;
&lt;/cffunction&gt;

&lt;cffunction name="registerUser" returnType="void" access="public" output="false"
			hint="Adds a user to our list."&gt;
	&lt;cfargument name="key" type="string" required="true"&gt;
	
	&lt;cfset variables.users[arguments.key] = structNew()&gt;
	&lt;cfset variables.users[arguments.key].data = structNew()&gt;
	&lt;cfset variables.users[arguments.key].activities = arrayNew(1)&gt;
	
&lt;/cffunction&gt;

&lt;cffunction name="unregisterUser" returnType="void" access="public" output="false"
			hint="Removes a user from our list."&gt;
	&lt;cfargument name="key" type="string" required="true"&gt;
	
	&lt;cfset structDelete(variables.users, arguments.key)&gt;
&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

This CFC works much as you described it - storing users and activities. I added some nice convenience functions as well. So not only can you get users, you can get a simple count as well. The function getCurrentActivity will give you the last activity of all users, which is a nice way to get a snapshot of their activities. I updated my Application.cfc to create this CFC, and used onSessionStart/End to register/unregister my user:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cfset this.name = "um_test4"&gt;
&lt;cfset this.applicationTimeout = createTimeSpan(0,2,0,0)&gt;
&lt;cfset this.sessionManagement = true&gt;


&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
	&lt;cfset application.usermonitor = createObject("component", "usermonitor")&gt;
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;

&lt;cffunction name="onMissingTemplate" returnType="boolean" output="false"&gt;
	&lt;cfargument name="targetpage" type="string" required="true"&gt;
	
	&lt;!--- log it ---&gt;
	&lt;cflog file="missingfiles" text="#arguments.targetpage#"&gt;
	&lt;cflocation url="/apptest/404.cfm?f=#urlEncodedFormat(arguments.targetpage)#" addToken="false"&gt;
	
&lt;/cffunction&gt;

&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;cfset application.usermonitor.addUserActivity(session.urltoken,"Viewing page #thePage#")&gt;
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;

&lt;cffunction name="onRequestEnd" returnType="void" output="false"&gt;
	&lt;cfargument name="thePage" type="string" required="true"&gt;
&lt;/cffunction&gt;


&lt;cffunction name="onError" returnType="void" output="false"&gt;
	&lt;cfargument name="exception" required="true"&gt;
	&lt;cfargument name="eventname" type="string" required="true"&gt;
	
	&lt;cfdump var="#arguments#"&gt;&lt;cfabort&gt;
&lt;/cffunction&gt;


&lt;cffunction name="onSessionStart" returnType="void" output="false"&gt;
	&lt;cfset application.usermonitor.registerUser(session.urltoken)&gt;
&lt;/cffunction&gt;


&lt;cffunction name="onSessionEnd" returnType="void" output="false"&gt;
	&lt;cfargument name="sessionScope" type="struct" required="true"&gt;
	&lt;cfargument name="appScope" type="struct" required="false"&gt;
	
	&lt;cfset arguments.appScope.unregisterUser(arguments.sessionScope.urltoken)&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

Lastly I built a simple little test page:

<code>

Current Users: 
&lt;cfdump var="#application.usermonitor.getUsers()#"&gt;

&lt;p&gt;

User Count:
&lt;cfdump var="#application.usermonitor.getUserCount()#"&gt;

&lt;p&gt;

My Activity History:

&lt;cfdump var="#application.usermonitor.getUserActivity(session.urltoken)#"&gt;

&lt;p&gt;

Current Actitivity:

&lt;cfdump var="#application.usermonitor.getCurrentActivity()#"&gt;
</code>

I wrote all of this in 10 minutes, so do not consider it "tested" (nor more than say - oh - Windows), but if it helps any, enjoy.