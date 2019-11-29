---
layout: post
title: "Ask a Jedi: Where in the heck is this PATH variable coming from?"
date: "2008-01-02T16:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/02/Ask-a-Jedi-Where-in-the-heck-is-this-PATH-variable-coming-from
guid: 2570
---

<a href="http://www.danvega.org/blog/index.cfm">Dan Vega</a> had an interesting issue today. He noticed that following code would work, even though he didn't create the variable:

<code>
&lt;cfoutput&gt;
#path#
&lt;/cfoutput&gt;
</code>

My buddy <a href="http://www.cfsilence.com/blog/client">Todd Sharp</a> wasn't able to reproduce this yet I was. Turns out there was a simple explanation. The path value existed in the CGI scope. I was able to confirm this by just doing:

<code>
&lt;cfoutput&gt;
#path# versus #cgi.path#
&lt;/cfoutput&gt;
</code>

So why couldn't Todd duplicate it? Turns out the path value was supplied by the web server as a CGI variable on the web servers Dan and I tried, but not Todd's, and since the CGI scope is one of the scopes tested when you don't fully scope a variable, the result just worked.

A few interesting things to note about the CGI scope. If you cfdump it, you won't see a PATH value. So why did it work? Since CGI variables are provided by the web server and Adobe doesn't know which CGI vars may exist, I believe that they simply used a set of common variables for the dump. 

Another odd thing with the CGI scope is that you can output <i>any</i> variable. If you do:

<cfoutput>
#cgi.whyisraysosexy#
</cfoutput>

You will get a blank string. I believe (again, I need confirmation from Adobe on this) they did this because of the fuzzyness in what CGI variables may exist on your web server.

You could consider this an example of why you should always scope your variables, but frankly, I don't bother. I scope everything but Variables in normal CFML templates, and scope everything in CFCs. I only bother scoping Variables stuff in CFCs to help differentiate between the local (unnamed) scope and the Variables scope.

<b>Edit:</b> Turns out - CGI variables depend on the server <i>and</i> the web browser.

<b>Second Edit</b> - Here is quote from the CFML Reference, page 14:

<blockquote>
<p>
By default, when you use the cfdump tag to display the CGI scope, or when you request debug output of the CGI
scope, ColdFusion attempts to display a fixed list of standard CGI environment variables. Because the available
variables depend on the server, browser, and the types of interactions between the two, not all variables are normally
available, and are represented by empty strings in the debug output. You can request any CGI variable in your application
code, including variables that are not in the list variables displayed by dump and debug output.
</p>
</blockquote>