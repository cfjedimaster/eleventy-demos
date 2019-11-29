---
layout: post
title: "ColdFusion Newbie Contest - Entry 6"
date: "2007-05-30T00:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/29/ColdFusion-Newbie-Contest-Entry-6
guid: 2070
---

Welcome to the 6th entry in my <a href="http://ray.camdenfamily.com/index.cfm/2007/4/16/ColdFusion-Newbie-Contest-Announced--Monster-Maker">newbie ColdFusion contest</a>. Today's entry is by Joe Zhou. His entry didn't have a name, but referred to the Monster so that's what I'm calling it. His entry has a few graphics in it that are copyrighted, so as with the last few entries I'm not putting a demo online. I do encourage you to download it (use the Download link below), and check it out.
<!--more-->
<img src="http://ray.camdenfamily.com/demos/contest6/entry6.png" align="left">

This game was especially difficult for me. Maybe I'm just a bit slow (very possible), but I was unable to make this Monster happy no matter what I did. I was able to change various stats (his monster allows for feeding, playing,
and resting), but his overall status went from bad to worse. As a side thought - it would have been truly evil if a user had submitted an entry that was impossible to win. Especially if it was really subtle. You would work, and work, and work, and slowly but surely your creature would die, but still leaving you thinking that next time - maybe next time - you could save it. Evil. But I digress. Now that you've checked out the demo, let's talk about the code.

As with a few other entries - I'm going to complain about him not using index.cfm. His docs explain which file to hit first - but it really shouldn't be up to the docs. I'm wondering if he (and the other entries), were maybe a bit
confused about how to correctly "push" a user if not logged in/registered. This could be done easily enough in Application.cfc/cfc. So for example, a simple "is logged in" check could be done like so:

<code>
&lt;cfif not structKeyExists(session, "loggedin")&gt;
   &lt;cfinclude template="login.cfm"&gt;
   &lt;cfabort&gt;
&lt;/cfif&gt;
</code>

Moving on - I thought this was a bit odd:

<code>
&lt;cfapplication sessiontimeout= "#CreateTimeSpan(0, 5, 1, 0)#" sessionmanagement="yes"&gt;
</code>

Specifically the 5 hour session timeout. The default is 20 minutes, and while I've seen 30, or 40, 5 hours seemed... excessive. Although if you look at the ColdFusion Administrator, the max is set to 2 whole <i>days</i>. 
Does anyone else use high timeouts like this?

Moving on - a cardinal sin - and something I encountered at my current client. His file, login.cfm, uses JavaScript error validation. Nothing wrong with that. But turning off JavaScript support allows you to go on
through to the next page without any server side validation at all. I know I've said it before - but folks - you must not rely on JavaScript. It is very nice. It is very helpful. But for things like a login form, you have 
to follow it up with server side validation as well. On the flip side, if you look at register.cfm, he <i>did</i> indeed do both types of checking. Unfortunately he forgot to display the server side error. 

Another problem. Consider main.cfm. His code cfparams url.action. Which is good. Never assume a URL/Form/Cookie variable actually exists. Users (especially people like me) can muck with values and remove/change
them to see if they break your applications. As an example, if url.action is "", this code is run:

<code>
&lt;cfset user = oUser.loginuser(username=#form.username#, password=#form.password#)&gt;
</code>

With no cfparam for the form values, it is possible that an error could be thrown here.

Another issue: HIs application makes use of an XML file (with WDDX data - what in the heck - I thought no one used WDDX anymore!) to store the user data. While I liked this - it does bring up a security issue. 
I can easily view the XML file in my browser and see all the usernames and passwords in plain text. This can be fixed easily enough in much the same way I "protected" the XML data/ini data I use in some of
my open source applications. I simply switched from an XML/ini file extension to a cfm extension. I then wrapped the data in CFML comments. This means if someone requests the file directly, they see nothing.

Lastly, let me talk about his CFC, userinfo.cfc. His CFC handles the processing of the WDDX file I mentioned in the last paragraph. I liked this CFC, although he made the output/var scope issues that most others
did. Then again - I tend to be pretty anal retentive about my CFCs!<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fmonster%{% endraw %}2Ezip'>Download attached file.</a></p>