---
layout: post
title: "YouTubeCFC update and the most insane API you will see today..."
date: "2008-11-12T13:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/12/YouTubeCFC-update-and-the-most-insane-API-you-will-see-today
guid: 3097
---

I updated my <a href="http://youtubecfc.riaforge.org">YouTubeCFC</a> component at lunch today. One change involves search. YouTube's API provides spelling suggestions for some search terms and I now return that in the call. Even cooler, you can tell the API to search again if no results were found and a suggestion was made.

The other change involves uploads. When you upload a video you provide keywords that describe the video. A user reported a bug with the upload feature that I couldn't replicate until I typed exactly what they had used. Turns out, YouTube's API has some rather... <i>strong</i> rules for keywords. Check out the docs:

<blockquote>
<p>
The <media:keywords> tag contains a comma-separated list of words associated with a video. You must provide at least one keyword for 
each video in your feed. This field has a maximum length of 120 characters, including commas, and may contain all valid 
UTF-8 characters except &lt; and &gt;. In addition, each keyword must be at least two characters long and may not be longer than 25 characters.
</p>
<p>
Please note that individual keywords may not contain spaces. However, you can use spaces after the commas that separate keywords. 
For example, crazy,surfing,stunts and crazy, surfing, stunts are both valid values for this tag. However, crazy, surfing stunts 
is not valid. (The invalid value does not contain a comma between "surfing" and "stunts".)
</p>
</blockquote>

If you can read that without your eyes bleeding, great. To me, this is horrible design. I couldn't imagine building a public facing wrapper to YouTube's service and telling the general public that. Shoot, most of the general public wouldn't get what a keyword is anyway.

So with that in mind, my CFC now has a method that will automatically 'massage' your keywords. If you dare to enter: "pizza ackbar trap lich king" as your keywords, the CFC will change it to the format YouTube prefers.