---
layout: post
title: "ColdFusion Startup Issue with Hostname"
date: "2014-11-21T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/11/21/ColdFusion-Startup-Issue-with-Hostname
guid: 5355
---

<p>
So - this is kind of crazy. Yesterday I fired up ColdFusion 11 to test something and discovered that every request for a CFM returned an error. The error was a Null Pointer Exception so not terribly helpful. (Or so I thought.) I checked the logs and saw this:
</p>
<!--more-->
<code>&lt;pre&gt;
Could not determine local hostname.
java.lang.NullPointerException
    at coldfusion.runtime.RuntimeServiceImpl.getQueueLimit(RuntimeServiceImpl.java:2145)
    at coldfusion.runtime.RuntimeServiceImpl.load(RuntimeServiceImpl.java:487)
&lt;/pre&gt;</code>

<p>
So I googled some more and came across this post on the forums: <a href="https://forums.adobe.com/thread/1006320">ColdFusion 10 install on RHEL 6.1</a>. I looked closely at the exception reported by the user there and noticed it matched what I was seeing on my server, specifically this part: org.apache.catalina.authenticator.AuthenticatorBase.invoke.
</p>

<p>
If you read that post, you will see that Rupesh (part of the ColdFusion team) says this:
</p>

<blockquote>The license service makes use of InetAddress.getLocalHost() API and therefore your /etc/hosts file should have an entry for both localhost as well as for your host name.</blockquote>

<p>
Well, my hosts file definitely had an entry for localhost, but on a whim, I added my hostname. In terminal I typed <code>hostname</code> (total guess, I had no idea that was a valid function) and it reported <code>Raymonds-MBP-8</code>. I added that to my hosts file, restarted ColdFusion, and everything was gravy.
</p>

<p>
I have absolutely no idea why this happened yesterday, but hopefully it will help others if they run into the same problem. I <i>am</i> having issues with my router where DNS lookups and other things will fail from time to time. So <i>maybe</i> something on my machine got hosed network-wise enough to confuse ColdFusion. Of course, I don't even have a license for my local ColdFusion 11 server so why in the heck did it need to check a license server?
</p>