---
layout: post
title: "Ask a Jedi - Why isn't my session expired when I logout?"
date: "2008-05-01T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/01/Ask-a-Jedi-Why-isnt-my-session-expired-when-I-logout
guid: 2799
---

Mark asks a question which I think touches on a basic misunderstanding many people have with ColdFusion and sessions:

<blockquote>
<p>
I am developing an AJAX RSS feed reader for a portal. I've read several proposed
methods of handling sessions, but I don't any address my specific need.
In order for the client script to retrieve external feeds I have setup a proxy
which simply checks whether it is given a valid URL, it grabs the feed and
caches it for a minute so that common feeds don't spawn external GETs more than
once a minute. Also, If users leave their portal page open, the client will
update the feeds every few minutes.

What I don't want is the portal session timeout to be affected by the feeds being retrieved via the proxy, so I put it in its own subfolder with its own Application.cfm.
For some measure of security, I want to require that the client has a cookie with a valid, unexpired session. In order to check this cross-application (proxy->portal) I'm using this in Application.cfm:

&lt;cfset a = ArrayNew(1) /&gt;<br>
&lt;cfset sessionClass = a.getClass().forName('coldfusion.runtime.SessionScope') /&gt;<br>
&lt;cfset sess = StructNew() /&gt;<br>
&lt;cfset sess.expired = sessionClass.getMethod('expired', a) /&gt;<br>
&lt;cfset tracker = createObject("java","coldfusion.runtime.SessionTracker")&gt;<br>
&lt;cfset sessions = tracker.getSessionCollection('PORTAL')&gt;<br>
&lt;cfset expired = sess.expired.invoke(sessions['PORTAL_'&PORTAL_Session], a)&gt;<br>

Now I should be able to check whether expired is true/false, right? ..Nope. Expired only seems to change when the timeout has been reached, apparently it is not set to true
when the user clicks logout.
</p>
</blockquote>

So first off - it is critical you understand that - out of the box - there is no way for you end a user's session. Just because a user clicked "Logout", it does not end his session. I assume your logout code does something like this:

<code>
&lt;cfset structDelete(session, "loggedin")&gt;
</code>

While this removes data from the session, and may remove the only key you ever set, this did nothing to end the session. The user still has a session and will continue to have one until timed out by the server.

You <i>may</i> be able to find an API in ColdFusion to truly kill the session, but it isn't officially supported. I like to play around with the undocumented APIs too, but I always recommend <b>against</b> this. You have no guarantee it will work.

So obviously there are multiple other ways you can solve this. I think the cookie approach is best. In your main application, I'd simply set a cookie called "LASTHIT". On every request, set it to now. 

In your sub application, see if LASTHIT was set more than 20 minutes ago. If so, consider the request invalid.