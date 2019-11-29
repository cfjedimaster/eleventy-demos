---
layout: post
title: "Session Tracking a Security Risk?"
date: "2005-12-31T11:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/31/Session-Tracking-a-Security-Risk
guid: 1002
---

Over on the bluedragon interest list, a user had asked about how to get all the current sessions in an application. This is something I've been asking for in CF for <i>years</i>, although you can certainly do it yourself if you want. In fact, it is even easier now with onSessionStart/End. However, I'm lazy, and I'd still like a getSessions() function. (It is part of my plea - let me know everything that ColdFusion knows.)

So anyway - Charlie linked to a presentation showing methods of doing this - but also noted that it was a security risk. I asked for a reference for this  and he shared this from the <a href="http://servlets.com/soapbox/servlet21.html">servlet spec</a>:

<blockquote>
Also deprecated in 2.1 is the HttpSession.getSessionContext() method. In 2.0, this method returned an
HttpSessionContext object that could be used for perusing the current sessions (and corresponding session IDs) managed
by the server. This method wasn't useful for much except debugging -- but that's not why it's deprecated. The reason is
that session IDs must be carefully guarded. They're kind of like social security numbers. Any unscrupulous individual
with access to another user's session ID can, with a forged cookie, join the session of that user. Thus, in 2.1,
getSessionContext() now returns an empty HttpSessionContext containing no session information. The entire
HttpSessionContext class has been deprecated as well.
</blockquote>

Charlie mentioned that he didn't want to get into a long, drawn out argument on the list (I don't blame him), so I thought I'd start the discussion here. To be honest, I don't "get" this. How would someone take another user's session ID? Well, if we did have a getSessions() function, you could imagine linking to a detail page. That link could contain the session ID. A user could examine that URL and then try to change their own cookies.

However - this is a bug in coding. You could say that cfquery is just as much of a risk. If I screw up, a very similar security risk exists. Maybe you could make the argument that we shouldn't help people add security risks. But the risk seems to be pretty contrived. You need to go out of your way to create it. It really comes down to the basic URL/Form security risk. If you pass any kind of primary key you need to ensure the user has the right to the data behind that key.

What do other people think?