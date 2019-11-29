---
layout: post
title: "Announcing ColdFire"
date: "2007-03-09T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/09/Announcing-ColdFire
guid: 1882
---

If you have attended any of my Spry presentations, you have heard me sing the praises of <a href="http://www.getfirebug.com/">Firebug</a>, the best Firefox extension ever created. About once a week I discover something new about it that just amazes me.

About a week or so ago I discovered that Firebug, a Firefox extension, can <i>also</i> be extended. Turns out someone made <a href="http://www.firephp.org/">FirePHP</a>, an add on to Firebug that lets you do basic debugging of PHP code in Firebug.

Now I don't know about you guys - but I think anything the PHP folks can do we can do better. (And easier. And quicker...) So I started looking into how this could be added to Firebug. Turns out working with Firefox is a bit complex. Luckily I found out that Adam Podolnick (Podman on the CF IRC channel) was experienced with it. I've had plenty of experience working with ColdFusion's debug templates. So we teamed up to create ColdFire. 

<more />

ColdFire is a plugin that will let you view debugging information in Firebug instead of a giant dump at the bottom of the page. This is especially useful in cases where ColdFusion's debug output doesn't play well with CSS based sites. Right now it is not quite ready for release, but Adam and I hope to have a 1.0 release sometime soon. Here are a few screen shots. Click the image for a larger picture.

<a href="http://ray.camdenfamily.com/images/cf1.jpg"><img src="http://ray.camdenfamily.com/images/cf1_small.jpg" border="0" align="left"></a> The first screen shots shows the General Information tab. This is basic information about the request including server level, template, and other pieces of information. Unlike the built-in debug template, I also added support to show the current active application, if one exists.
<br clear="left">

<a href="http://ray.camdenfamily.com/images/cf2.jpg"><img src="http://ray.camdenfamily.com/images/cf2_small.jpg" border="0" align="left"></a> This second screen shot shows the template display. Note how you can tell regular templates from includes, custom tags, and CFCs. Also note the red background on slow templates. We may add filtering so you can restrict the display to just one template or method. This would be useful when you are working on cutting down the execution time of just one part of the request.
<br clear="left">

<a href="http://ray.camdenfamily.com/images/cf3.jpg"><img src="http://ray.camdenfamily.com/images/cf3_small.jpg" border="0" align="left"></a> Last is the query display. As you can see, it shows each query along with the SQL. This will probably need a bit more work for larger queries. Since I was able to use the code from <a href="http://ray.camdenfamily.com/projects/starfish/">Starfish</a>, the queries will automatically replace cfqueryparam values with their real data, so you won't see ? in the SQL.
<br clear="left">

So - what do you guys think? Useful?