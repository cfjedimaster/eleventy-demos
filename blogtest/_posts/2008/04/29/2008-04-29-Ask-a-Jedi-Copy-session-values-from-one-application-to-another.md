---
layout: post
title: "Ask a Jedi: Copy session values from one application to another"
date: "2008-04-29T13:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/29/Ask-a-Jedi-Copy-session-values-from-one-application-to-another
guid: 2795
---

Chong asks:

<blockquote>
<p>
I am trying to copy a session variable from one application scope to another.
Could you please enlighten me if this is possible and what is the best practise
method for doing so?
</p>
</blockquote>
<!--more-->
The short answer to this question is no. There is no <i>defined</i> way of doing so. In fact, working with Applications and Sessions at a high level is something that ColdFusion doesn't support in general. The ServerMonitor API gives you <i>some</i> access into this, but I've always wished ColdFusion made this more formal. For example, I think I should be able to do the following:

<code>
&lt;cfset someapp = getApplication("someotherapp")&gt;
&lt;cfset thesessios = someapp.getSessions()&gt;
</code>

Now you <i>can</i> do this via undocumented API calls, but to me, that isn't a real answer. 

So considering that we can't get access at a level like that - how can we solve the problem anyway? Here are a few ideas.

<ul>
<li>One possibility is to use cookies. Assuming both applications are on the same site, or perhaps the same root site, then a cookie could be used so the application A could 'speak' to application B. Cookies aren't 100% safe of course, but for sending simple messages it could be used. Technically this only works though if the user returns to B.
<li>You could use database tables to store the information. Let's say app A and app B share a common DSN. You could easily record a message when in app A that app B will pick up. The issue here is connecting a session in app A to a session in app B. You need some unique value, like an email address, that both applications would be able to use to sync up the users. 
<li>You could use the Server scope in a similar fashion. This has the drawback though of losing the data if the server restarts. 
<li>Another option would be to perhaps consider migrating the separate applications into one main application. Each 'sub app' can handle keeping its own data separate into a particular portion of the Application and Session scope.
</ul>

Anyone else doing this? In general I've never had to worry about it. I ran into this a bit at <a href="http://www.riaforge.org">RIAForge</a>. RIAForge uses my blogware, forum, wiki, and bug tracker apps. (Geeze, when do I have time to play GTA??) Each of these applications have their own sessions and application scopes. In order to ease the process for users on the site I used my own hacked up SSO (single sign on) code. This doesn't copy session values over, but basically tries to re-authenticate the user in the new Application space. Not the best code I've written, but it works (afaik).