---
layout: post
title: "Use cgi.server_name? Be careful"
date: "2008-06-05T15:06:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2008/06/05/Use-cgiservername-Be-careful
guid: 2864
---

So I just had a random, stray thought. One thing I've done in the past is sniff the current server to determine behavior aspects of my site. So for example, my error handler may do something like this:
<!--more-->
<code>
&lt;cfif findNoCase("dev.", cgi.server_name)&gt;
  &lt;cfdump var="#exception#"&gt;
&lt;cfelse&gt;
  &lt;p&gt;
  Something went wrong. Quick - reboot the Tandy.
  &lt;/p&gt;
&lt;/cfif&gt;
</code>

While this works nice, I just ran across a problem with it. If you hit this file on my site:

<a href="http://www.raymondcamden.com/test4.cfm">http://www.coldfusionjedi.com/test4.cfm</a>

You will see I print out cgi.server_name. Now if you go into your HOSTS file and do:

<code>
67.59.153.214	baloneypants.com
</code>

And then hit the file with:

<a href="http://balaoneypants.com/test4.cfm">http://baloneypants.com/test4.cfm</a>

You will notice that the CGI variable now says baloneypants. No big surprise there I guess. But obviously if I knew your code did this, and if I added dev.x.com for x.com, I could use it as a way to "sniff" out differences based on that CGI variable.

Unfortunately I can't think of a nice solution. Sniffing the servername is a handy way to dynamically load settings based on environment. If you can't trust cgi.server_name than you need to do something else - like perhaps sniff something on the machine itself.

Any suggestions?