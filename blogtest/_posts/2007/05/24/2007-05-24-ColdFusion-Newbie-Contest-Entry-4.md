---
layout: post
title: "ColdFusion Newbie Contest - Entry 4"
date: "2007-05-24T23:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/24/ColdFusion-Newbie-Contest-Entry-4
guid: 2062
---

<img src="http://ray.camdenfamily.com/images/tamagochi.png" align="left">

Welcome to the fourth entry in the <a href="http://ray.camdenfamily.com/index.cfm/2007/4/16/ColdFusion-Newbie-Contest-Announced--Monster-Maker">ColdFusion Newbie Contest</a>. Today's entry is Tamagochi by Alexie Protasov. Once again I cannot host an online demo (I'll explain why a bit later), but you can download the code below.

This entry was pretty impressive and rather simple (which is cool - simple can be nice). Tamagochi makes use of AJAX calls to interact with the pet. I also liked how quickly the pet seemed to move from stage to stage. It made the game seem fast paced. One main issue though is that it only works well in IE. I had to fire up Parallels to test. Another issue is that there wasn't much feedback to your clicks. Sometimes it was hard to tell if your clicking actually did anything.

Now lets dig into the code. First and foremost - this is the first application to use Application.cfc! That makes me <b>very</b> happy and earns Alexie extra brownie points. His Application.cfc is rather short so I'll include the whole thing here:
<!--more-->
<code>
&lt;cfcomponent output="no"&gt;
	&lt;cffunction name="OnApplicationStart" output="no" returntype="boolean"&gt;
		&lt;cfset Application.Tamagochi = CreateObject("component", "Tamagochi").init("My Tamagochi")&gt;
		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="OnRequestStart" returntype="boolean"&gt;
		&lt;cfif IsDefined('URL.restart')&gt;
			&lt;cfset OnApplicationStart()&gt;
		&lt;/cfif&gt;
		
		&lt;cfset Application.Tamagochi.check()&gt;
		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

So while I'm happy he used the feature - I'll point out at least one mistake - no name. He never named his application.  Doing so puts his Application in the mysterious unnamed Application area. Try cfdumping the Application scope in an unnamed application and you will see what I mean. This could easily be addressed with this line:

<code>
&lt;cfset this.name = "SinceYouDidntNameItICallItRay"&gt;
</code>

His core CFC, Tamagochi, is pretty interesting. For those who works with beans, you may recognize bean like aspects of his CFC (lots of set/get pairs), but he also has the core functionality of the pet in here as well. Normally I'd split this up - but I believe this is the best use of a CFC yet in this competition so I'm rather proud. He also made good use of output control and var scoping. (Although he forgot to turn off output in his methods.)

As a suggestion to Alexie - I'd move your init method to the top of the function. It doesn't really do anything different up there, but if I may pretend I speak for other developers, it is pretty much the standard. 

His AJAX work is pretty simple. It is all done by hand without any framework. Each action for the pet calls a CFM. I was very happy to see some basic error checking in the AJAX called CFMs. Here is the code run when you feed the creature:

<code>
&lt;cfsilent&gt;
	&lt;cfheader name="expires" value="Expires: Mon, 26 Jul 1997 05:00:00 GMT"&gt;
    &lt;cfheader name="expires" value="#Now()#"&gt; 
    &lt;cfheader name="pragma" value="no-cache"&gt; 
    &lt;cfheader name="cache-control" value="no-cache, no-store, must-revalidate"&gt;
    &lt;cfif IsDefined('Application.Tamagochi')&gt;
    	&lt;cflock scope="application" type="exclusive" timeout="60"&gt;
        	&lt;cfset Application.Tamagochi.feed()&gt;
        &lt;/cflock&gt;
    &lt;/cfif&gt;
&lt;/cfsilent&gt;
</code>

Note the use of headers to prevent caching by the client. Note the basic isDefined check, and the locking. Very nicely done I think.

A few last notes before I wrap up. I didn't put this up as an online application because the creature is stored in the Application scope. This means everyone would share the same pet. He could fix this by simply switching to the session scope. If you download the zip, you will notice a login/register page. These didn't work for me so I assumed Alexie left them behind. 

All in all - very nicely done. Simple and well built. Now if he can just get Firefox working...<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FTamagochi%{% endraw %}2Erar'>Download attached file.</a></p>