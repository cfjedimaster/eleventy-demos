---
layout: post
title: "First draft of new YouTube API"
date: "2008-04-16T00:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/15/First-draft-of-new-YouTube-API
guid: 2771
---

So not long after I had released my <a href="http://youtubecfc.riaforge.org">YouTubeCFC</a> wrapper, Google dared to update the API to match the rest of their services. I didn't bother updating my code as I wanted to wait till upload support was done. YouTube now officially allows you to upload (and even update) videos. 

I've begun work on rewriting my CFC. It supports basic reading (get top videos for example), but no searching yet. But I did get upload working. Here is an example of how easy it is:

<code>
&lt;cfset yt = createObject("component", "youtube")&gt;
&lt;cfset yt.setDeveloperKey("xxx")&gt;

&lt;cfset yt.login("cfjedimaster", "likeidsay")&gt;
&lt;cfset r = yt.upload(expandPath('./movie2.mov'),'Test Upload','Playing with youtube','Music','testing,fun')&gt;
&lt;cfoutput&gt;id=#r#&lt;/cfoutput&gt;
</code>

I've included the CFC for folks to play with, and once I get a bit more of the API done I'll replace the CFC at RIAForge.

You will need a valid login and a <a href="http://code.google.com/apis/youtube/dashboard/">developer key</a>. Also there seems to be a quota limit. I ran into after uploading about 10 videos.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fyoutube%{% endraw %}2Ecfc%2Ezip'>Download attached file.</a></p>