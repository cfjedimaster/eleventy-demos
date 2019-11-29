---
layout: post
title: "Quick example of posting videos to Brightcove"
date: "2009-12-01T13:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/01/Quick-example-of-posting-videos-to-Brightcove
guid: 3628
---

A reader asked for help using <a href="http://www.brightcove.com">Brightcove</a>'s API to upload a video using ColdFusion. While I do not plan on writing a full wrapper, or going into great detail, I thought a quick blog post on what he tried, and why it failed, could help others who plan on using the service.
<!--more-->
Let's first look at his original code and a description of the problem he had. 

<code>
&lt;cfhttp url="http://api.brightcove.com/services/post" method="post"
timeout="600" result="resultVar" multipart="true"&gt;

  &lt;cfhttpparam type="file" name="file" file="c:\com\brightcove\AT_T_test.mp4" /&gt;

  &lt;cfset jsonRequest = '{"method": "create_video", "params":
{% raw %}{"video": {"name": "test", "shortDescription": "test"}{% endraw %},"token":
"blahblahblah.."}}'&gt;

  &lt;cfhttpparam type="url"  name="json" value="#jsonRequest#"&gt;

  &lt;cfhttpparam type="body"  name="json" value="#jsonRequest#"&gt;

&lt;/cfhttp&gt;
</code>

Even without knowing the API, you can see that it makes use of JSON to pass parameters about the upload. This code won't work at all because you can't mix a httpparam of type body with type file. The API docs though seemed to imply you needed to send the JSON values as the body. I first attempted to simply save the JSON to the file system and send it as a second file. This didn't work. I then dig a bit of digging and discovered this forum post by the Brightcove team: <a href="http://forum.brightcove.com/brgh/board/message?board.id=Developer_2&message.id=85">http://forum.brightcove.com/brgh/board/message?board.id=Developer_2&message.id=85</a>

It pointed out that the JSON data could be sent as a form field, and it showed that my reader was missing a bit of data as well.  Oddly - another issue was the <i>order</i> of the HTTP params. I can't image why this makes a difference, but if the JSON data isn't the first httpparam, then nothing else works. The final, working code, is below. Note - I removed his API key so you can't run this as is.

<code>
&lt;cfset json = '{"method": "create_video", "params": {"video": {"name":
"CFHTTP create","shortDescription": "test video"},"token":
"falkeapikey"},"filename":
"actual2.mp4","maxsize":640000}'&gt;

&lt;cfhttp url="http://api.brightcove.com/services/post" method="post"
timeout="600" result="resultVar" multipart="true"&gt;

&lt;cfhttpparam type="formfield" name="json" value="#json#"&gt;
&lt;cfhttpparam type="file" name="actual2.mp4"
file="/Users/ray/Documents/workspace/youtubecfc/unittests/actual2.mp4"
/&gt;
&lt;/cfhttp&gt;

&lt;cfdump var="#resultvar#"&gt;
</code>

Anyway - I don't have time to dig into the Brightcove API more, but I'm sure someone out there could whip up a quick component.