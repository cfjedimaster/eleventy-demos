---
layout: post
title: "Warning about the ColdFusion Admin API and CFLOGON"
date: "2007-06-15T13:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/15/Warning-about-the-ColdFusion-Admin-API-and-CFLOGON
guid: 2126
---

I ran into an interesting little issue last night when I was writing my blog entry on the <a href="http://www.raymondcamden.com/index.cfm/2007/6/14/ColdFusion-8-Server-Monitor-API">Server Monitoring API</a>. For some reason my ability to add blog posts stopped working. I thought something crazy was going on until I noticed something. My username had switched from the username I used to logon to BlogCFC to the username "admin". Why? 

Remember this code from my demo:

<code>
&lt;cfinvoke component="cfide.adminapi.administrator" method="login" adminPassword="mypasswordcanbeatupyourpassword"&gt;
</code>

From what I can tell, this code actually uses CFLOGON. Since my ColdFusion Administrator doesn't have a username, just a password, it used "admin" for the username. So when I was reloading both my blog and my demo, my getAuthUser() was switching back and forth.

If I read this right (<b>and I could be wrong</b>), it means that you cannot use the Admin API from within the context of an Application that is using CFLOGON. Frankly this might be the last nail in the coffin for me and CFLOGON. I'm going to file a bug report on this but I wanted to give folks a warning as it certainly worried me.