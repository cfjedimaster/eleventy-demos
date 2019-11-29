---
layout: post
title: "Ask a Jedi: Turning a site off"
date: "2006-08-07T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/07/Ask-a-Jedi-Turning-a-site-off
guid: 1451
---

Ryan asks:

<blockquote>
I've got a site built for one of my clients, but I'm having a little trouble
trying to implement a new function to the site.  I need a way to "turn off" or "shut down" the site when I am performing maintenance.  I
also want the client to be able to perform this function as well.  I need to
know which type of variables to use.  I've dealt mostly with session variables
and as I understand it, session variables timeout.  I need this variable to last
indefinitely, or at least until the site is turned back &quot;on&quot;.  Is this
done with server variables?  Do you just set the server variable and then
redirect to a maintenance page?  I need the end result to be:  If anyone visits
the site, and it is "down", it redirects to a user-friendly
maintenance page.  What is the simplest way to achieve this?  Thanks for all of
your help.
</blockquote>

There are a few ways to handle this. First off, you probably want to shut down the public portion of your site and not the entire site. You said you wanted the client to be able to do it. That means you obviously need a way to turn it back on via some admin interface. So the first thing you would to be sure of is that you allow the admin to still run. This could be done by checking the current request. Consider this onRequestStart code block from an Application.cfc file:

<code>
&lt;cfif not findNoCase("/admin", arguments.thePage)&gt;
&lt;!--- include the 'Sorry, we are down page' ---&gt;
&lt;cfabort&gt;
&lt;/cfif&gt;
</code>

Rememeber that onRequestStart is passed the name of the file to process. By checking that we can determine if the request is for the admin or a public page. So this code handles the actual shutdown, but not how it is done. 

Most likely you want to use an application variable to handle the "Shutdown" state. So your code could be modified like so:

<code>
&lt;cfif application.shutdown and not findNoCase("/admin", arguments.thePage)&gt;
&lt;!--- include the 'Sorry, we are down page' ---&gt;
&lt;cfabort&gt;
&lt;/cfif&gt;
</code>

Application variables only last as long as the application stays active, and with the site shutdown, that might not be more than the default 2 hours. Obviously you don't want to site to turn back on when it times out. I normally store my application defaults in either an INI or XML file. (See my <a href="http://ray.camdenfamily.com/index.cfm/2005/9/8/ColdFusion-101-Config-Files-AGoGo-Part-3-Wrap-Up">series</a> on ColdFusion and configuration.) The configuration file is read into Application variables at startup to enhance performance. If you want your "Shutdown" to persist, you will need to ensure your admin tool writes back to the configuration file.