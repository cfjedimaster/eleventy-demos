---
layout: post
title: "Using CFLOGIN for Authentication of REST Based Queries"
date: "2006-12-13T16:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/13/Using-CFLOGIN-for-Authentication-of-REST-Based-Queries
guid: 1710
---

A reader sent me an interesting question today. He was building a REST based service and wanted to add authentication. He didn't want to use web server based security. He just wanted to know what username/password the remote person was passing in with their HTTP request.

The first thing he tried was <a href="http://www.cfquickdocs.com/?getDoc=GetHttpRequestData">getHTTPRequestData()</a>. This is an interesting, although probably rarely used, function that returns information about the current request.

If you run this function on a request that had authentication information, you can actually see authorization data in the header, but it is not in a readable format. 

So on a whim I tried something. On the page getting the request I added:

<code>
&lt;cflogin&gt;
	&lt;cfdump var="#cflogin#"&gt;
&lt;/cflogin&gt;
</code>

This was wrapped inside a cfsavecontent that was being stored to an HTML file so I could see the result. (Remember, I'm testing the result of someone POSTing, so I was firing the page that did the post.) Low and behold - the username and password were there!

I didn't expect it to work as I thought it would only work when the web server explicitly prompted for a username and password, but it seems like CFLOGIN works no matter what when the information is passed. (Of course, it also works if you pass in URL/Form vars with the name j_username and j_password.) 

So - maybe CFLOGIN isn't as bad as I said. This is a pretty nice use for it.