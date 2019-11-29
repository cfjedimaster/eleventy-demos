---
layout: post
title: "Dealing with cookie-less sessions"
date: "2007-04-29T20:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/29/Dealing-with-cookieless-sessions
guid: 1989
---

Axel asked a question about Vista Gadgets that I thought I would discuss here.

<blockquote>
Sessions with MS Vista. I'm building a VISTA gadget calling an
external CFM page using flash forms. It looks really cool, in particular in a flyout window. Now when I need to log into the app, I realized that the VISTA Gadget space seem not to have any session handler.  Any idea? 
</blockquote>

The first thing you need to do is uninstall Vista. (No, I jest.) So with knowing nothing about Vista Gadgets (frankly widgets and gadgets bore me) I'd have to assume that they are acting like a cookie-less browser. 

ColdFusion sessions require cookies in order to track your browser and associate it with a session... normally. If your browser doesn't support cookies, you have two ways you can handle it.

All sessions come with a few default variables. One of them is URLToken. This is a string of the form cfid=XXX&cftoken=XXX (or cfid=xxx&cftoken=xxx&jsessionid=xxx). As you can see, it is in a format appropriate for query strings. This allows you to append it to the end of a link:

<code>
&lt;a href="dharma.cfm?#session.urltoken#"&gt;Secret Dharma Files&lt;/a&gt;
</code>

Another option is <a href="http://www.cfquickdocs.com/?getDoc=URLSessionFormat">urlSessionFormat()</a>. You can wrap your links with this function and ColdFusion will determine if it needs to add the session information or not. Here is an example of that:

<code>
&lt;a href="#urlSessionFormat('dharma.cfm?')#"&gt;Secret Dharma Files&lt;/a&gt;
</code>
 
The important thing to note though is that <i>all</i> links have to use one of these methods. That means both "simple" links like I used above as well as form tags. It would also include AJAX links if the back end needs session information in order to return the correct data.