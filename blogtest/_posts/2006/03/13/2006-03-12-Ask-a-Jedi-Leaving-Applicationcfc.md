---
layout: post
title: "Ask a Jedi: Leaving Application.cfc"
date: "2006-03-13T06:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/13/Ask-a-Jedi-Leaving-Applicationcfc
guid: 1147
---

It's not quite like leaving Las Vegas, but Marco had this question:

<blockquote>
Hi Ray. Is it possible to convert an application.cfc to application.cfm? And
OnSessionStart, OnApplicationStart, etc? How application.cfm knows that
variables? Thanx for your time.
</blockquote>

The answer is yes and no. You can convert an Application.cfc file to an Application.cfm file, but not all of the methods will carry over. In general, all of the "End" methods (onApplicationEnd, onSessionEnd) will not be transferable. There was a DRK project that made it easy to write code that runs when the session ends, but that project wasn't ever open sourced so you are probably out of luck in that regard. 

So how would you convert a method, like onSessionStart, to a "old school" type format? Consider this method:

<code>
&lt;cffunction name="onSessionStart" returnType="void" output="false"&gt;
    &lt;cfset session.started = now()&gt;
&lt;/cffunction&gt;
</code>

This method simply creates a session variable called "started" with the current time. To rewrite this in the Application.cfm file, you would need to do something like this:

<code>
&lt;cfif not structKeyExists(session, "created")&gt;
    &lt;cfset session.started = now()&gt;
    &lt;cfset session.created = true&gt;
&lt;/cfif&gt;
</code>

What I've done is simply used a check for a new session variable, created. Yes, I could have checked for started, but I figured in a real example, you would have multiple session variables created. Therefore, my old code simply uses a session variable "marker" like created is above.

There is a big (potential) problem here though. The code inside of onSessionStart is automatically locked. My code above is not. 99 percent of the time, folks use onAppplicationStart and onSessionStart code to simply init variables. In that case, you probably don't need to care about the locks. If you do, however, you would need to use multiple lock statements above to ensure thread safety. (One big reason I love Application.cfc so much.)

Any onError method will need to be converted to just cferror tags. Also, onRequestStart and onRequestEnd will need to be converted to simple code inside the Application.cfm (or even better, a file cfincluded) and onRequestEnd.cfm. The method, onRequest, cannot, as far as I know, be duplicated in Application.cfm. (Not without a lot of rewriting.)

Last but not least, any this.name="goo" type statement will need to put into the cfapplication tag itself.

All in all, I'd probably recommend against this, but I'm assuming you have a good reason. In case folks are wondering why my code still uses Application.cfm, the only reason is for CFMX6 backwards compatibility. Eventually I'll probably remove this as the majority of folks upgrade to CFMX7.