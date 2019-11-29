---
layout: post
title: "Ouch - this cookie bug has teeth"
date: "2010-04-20T15:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/04/20/Ouch-this-cookie-bug-has-teeth
guid: 3786
---

Thanks to my buddy Nick Hill for finding this and <a href="http://www.12robots.com/">Jason Dean</a> for making an even simpler demo. Looks like there is a pretty serious bug with the Cookie scope in CF9. If you attempt to use structClear to remove cookies, ala:
<p>

<code>

&lt;cfset cookie.test = 3 /&gt;
&lt;cfset cookie.hammer = 5 /&gt;

&lt;cfset structClear(cookie) /&gt;
</code>

<p>

You will get an array index out of bounds error. If you switch to using structDelete and the individual cookies you end up with the cookies still there but with no value, which may be fine. You get the same with cfcookie/expires=now. 

<p>

You want to watch out for this if you use structClear(cookie) as your logout function (as Nick did). If you want to vote for this bug (although seriously- does this need to be 'voted'??) then you can go here: <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=82723">http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=82723</a>