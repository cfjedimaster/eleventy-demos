---
layout: post
title: "Ask a Jedi: cflogout, session variables, and the back button"
date: "2009-01-01T21:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/01/Ask-a-Jedi-cflogout-session-variables-and-the-back-button
guid: 3173
---

Steph has a few questions/concerns about cflogout, sessions, and the back button. His email to me was:

<i>Hi Ray, What's the best practice for logging out users using cflogin and cflogout? I'm using CF7, and I cant figure out how to workaround the following issues listed in livedocs:</i>
<!--more-->
<blockquote>
<p>
Caution: If you use web server-based authentication or any form authentication that uses a Basic HTTP Authorization header, the browser continues to send the authentication information to your application until the user closes the browser, or in some cases, all open browser windows. As a result, after the user logs out and your application uses the cflogout tag, until the browser closes, the cflogin structure in the cflogin tag will contain the logged-out user's UserID and password. If a user logs out and does not close the browser, another user might access pages with the first user's login.
</p>
</blockquote>

<i>Also....</i>

<blockquote>
<p>
In many cases, you can effectively end a session by clearing the Session scope, as shown in the following line. The following list, however, includes important limitations and alternatives:

&lt;cfset StructClear(Session)&gt;<br/>

Clearing the Session scope does not clear the session ID, and future requests from the browser continue to use the same session ID until the browser exits. It also does not log the user out, even if you use Session scope storage
for login information. Always use the cflogout tag to log users out.
</p>
</blockquote>


<i>Well, I use cflogout, but if you use the back button you are still able to access the protected pages, and session variables are maintained.

What's the best way to completely log a user out (kill session variables, etc) while keeping the browser open?</i>

There's a lot going on there, so let me try to pick it apart. First off, the issue mentioned in the live docs quote above (direct link <a href="http://livedocs.adobe.com/coldfusion/7/htmldocs/00001182.htm">here</a>) relates to the fact that ColdFusion's CFLOGIN system will automatically connect to any web server level security enabled. My readers know that I've been a bit ticked at CFLOGIN for some time now. I once lost a whole day trying to debug an issue with BlogCFC that ended up being related to this. There is no way to disable CFLOGIN's ties to web server security. That means trouble if you don't want to use it. This is why I do <b>not</b> recommend using CFLOGIN anymore. I still use it in my OS applications but I'm slowly rolling it out. (The last update to <a href="http://soundings.riaforge.org">Soundings</a> removed it.) 

So with that in mind - I'd just stick to simple session variables. That removes any problems with the web server level security. It's no longer an issue. But then that leaves your last issue:

<blockquote>
<p>
Well, I use cflogout, but if you use the back button you are still able to access the protected pages, and session variables are maintained.
</p>
</blockquote>

Technically, the session variables weren't maintained. What you are seeing is simply the browser's cache being used to redisplay an old page. The session variables on the server were really cleared. 

So how do we stop the pages from being cached? You have to remember that the browser, not you, is the ultimate judge on what it will and will not cache. We can tell the browser to not cache, but that doesn't mean the browser won't ignore your request. The user could also just save the HTML to the desktop. It would be dumb for a user to save a sensitive page of credit card information to their desktop, but I bet we all know a few users who would do that. 

With that in mind then, the code to tell the browser to not cache is rather simple, and is described at the <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a> entry: <a href="http://www.coldfusioncookbook.com/entry/54/How-can-I-prevent-a-browser-from-caching-my-page?">How can I prevent a browser from caching my page?</a>

<code>
&lt;cfheader name="cache-control" value="no-cache, no-store, must-revalidate"&gt;
&lt;cfheader name="pragma" value="no-cache"&gt;
&lt;cfheader name="expires" value="#getHttpTimeString(now())#"&gt;
</code>

Steph, hope this helps!