---
layout: post
title: "Ask a Jedi: Tracking Users"
date: "2006-08-21T09:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/21/Ask-a-Jedi-Tracking-Users
guid: 1483
---

Paul asked me this morning if there was a simple way to track the users currently using your site. There are a couple of ways you can handle this. Let's consider a simple example where you want to track <i>known</i> (i.e. logged in) users of an application. This means two things:

<ol>
<li>When a user logs on, add her to a list of logged in users.
<li>When a user logs out, remove her from the list.
</ol>
<!--more-->
In general this is trivial to do, but before ColdFusion 7, it was difficult to handle cases where the user did log out, but simply had their session time out. (As a quick aside, there are 'ServiceFactory' methods that let you inspect the current sessions of an application, but this blog will focus on <i>supported</i> methods only.)

First off, let's build a method to store the logged in users. An application variable makes sense for this, so let's default it in the onApplicationStart method of our Application.cfc file:

<code>
&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
&lt;cfset application.users = structNew()&gt;
&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

In the onApplicationStart method above, I created a structure that will store my users. A list or array would work fine as well, but a struct lets me store more information. I'll show an example of that later.

To record the user, all you do is update the structure when the user logs on. This code will be unique per application, but assuming "username" equals their username, you could store them like so:

<code>
&lt;cfset application.users[username] = structNew()&gt;
</code>

I stored the user as a blank structure, but you could store information in there like their real name, age, or whatever. You could also update information as the user browses the site. Consider:

<code>
&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
&lt;cfargument name="thePage" type="string" required="true"&gt;
&lt;cfif userLoggedOn&gt;
    &lt;cfset application.users[username].lasthit = now()&gt;
&lt;/cfif&gt;
&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

In the onRequestStart code above, I checked to see if the user is logged in, and if so, I record when the user last hit the site. (Obviously the variable names and conditionals would change based on your application.) By storing the last hit, I could do interesting things like seeing how active the users are on the site. 

If the user logs out, you will need to remove them from the application variable. In a logout() method, you would do:

<code>
&lt;cfset structDelete(application.users, username)&gt;
</code>

And as I mentioned above, you need something similar to handle the session timing out:

<code>
&lt;cffunction name="onSessionEnd" returnType="void" output="false"&gt;
&lt;cfargument name="sessionScope" type="struct" required="true"&gt;
&lt;cfargument name="appScope" type="struct" required="false"&gt;
&lt;cfif structKeyExists(arguments.appScope, arguments.sessionScope)&gt;
   &lt;cfset structDelete(arguments.appScope, arguments.sessionScope.username)&gt;
&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

The only difference here is that both the session and application scopes are passed as arguments. You can't reference them directly. 

Lastly, to answer the simple question of getting a count of users, a simple structCount(application.users) would return the number of users. If you store other information, you could return the number of boys versus girls, lefties versus right handers, or whatever else you may know about users.