---
layout: post
title: "Video encoding with Zencoder"
date: "2011-04-26T07:04:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2011/04/26/Video-encoding-with-Zencoder
guid: 4208
---

This is something I found a few months ago but I'm just now finally finding the time to write it up. If you've ever had to work with video encoding, you know it can be somewhat difficult, especially if you are looking for an automated solution. I've worked with ffmpeg before, and while it's pretty darn powerful, it can be a chore to set it up correctly and figure out the exact right API to get the results you need. If a client came to me asking for some form of video encoding solution I'd probably punt and say - just use Youtube. That's before I found <a href="http://zencoder.com/">Zencoder</a>.
<!--more-->
<p>

Zencoder is a commercial service that provides video encoding over the Internet. At first that seemed a bit crazy. Most videos are pretty large and I couldn't imagine how well such a service would work. Zencoder though can connect to your videos in multiple ways, including via Amazon S3. As long as Zencoder can suck down the file it can process it on it's own servers and spit out your videos with multiple results:

<p>

<ul>
<li>You can output to 6 different video formats and 4 for audio (see <a href="http://zencoder.com/features/output-formats/">output formats</a>)
<li>You can resize the video
<li>You can modify quality, bitrate, framerate, and other things that are way above me
<li>You can generate thumbnails from the video
<li>You can add a watermark
<li>You can create a clip (ie, just a portion from the original)
<li>and more...
</ul>

<p>

Best of all - of this works via a simple to use API. If you read my blog, you know I love APIs and I especially like services that go out of their way to make things simple. The full docs for their API may be found here: <a href="http://app.zencoder.com/docs">http://app.zencoder.com/docs</a> 

<p>

For the most part, your interaction with Zencoder comes down to sending a request to them telling Zencoder where your video may be accessed. Your video is then put into a queue. Their API supports multiple ways of working with your own queue. You can ask it to ping you HTTP, email, or just use another API call to check the status. When Zencoder is done it can then copy the results back to you via FTP, SFTP, FTPS, or even better - S3. 

<p>

This service is not free. You can see their price list <a href="http://zencoder.com/pricing/">here</a>. To me - this looks pretty reasonable. They have a web based dashboard so you can do adhoc conversions and I could see myself using this for my blog. I know there are tools I could run locally, but for a few bucks I'd much rather let Zencoder handle it. 

<p>

So by now you may be asking - is there a ColdFusion wrapper for this service? The answer is - of course - heck yes. Todd Schlomer has written a wrapper and it works really well. You can find it on Github here: <a href="https://github.com/sctm/zencoder-cf">https://github.com/sctm/zencoder-cf</a> (And yes - he also created a RIAForge project so you will find it if you search there.)

<p>

I whipped up a quick ColdFusion script that shows a basic set of calls with his API. It just starts a job and doesn't actually check the result. But I wanted to show how easy this was, <i>especially</i> with ColdFusion 901's simple S3 integration. Here is template - and again - please consider this ugly test code.

<p>

<code>
&lt;cfset apikey = "myapikey"&gt;
&lt;cfset zen = new zencoder.Zencoder(apikey)&gt;

&lt;cfset s3dir = "s3://s3.coldfusionjedi.com"&gt;

&lt;cfif not fileExists(s3dir & "/lynn.3gp")&gt;
	&lt;cfset fileCopy(expandPath("./lynn.3gp"), s3dir & "/lynn.3gp")&gt;
&lt;/cfif&gt;

&lt;cfset source = s3dir & "/lynn.3gp"&gt;

&lt;cfset outputs = new zencoder.ZencoderOutputArray()&gt;
&lt;cfset thumbs = new zencoder.ZencoderThumbnails()&gt;
&lt;cfset thumbs.addThumbnail({% raw %}{"number"=6,"size"="160x120","base_url"="s3://zen.coldfusionjedi.com",label="thumblabel"}{% endraw %})&gt;
 
&lt;cfset outputs.addOutput(
	new zencoder.ZencoderOutput(base_url="s3://zen.coldfusionjedi.com",
								filename="foo2.mp4",
								label="Label_1",
								thumbnails=thumbs,
								public=1)
)&gt;

&lt;cfset res = zen.createEncodingJob(source,outputs)&gt;

&lt;cfdump var="#res#"&gt;
&lt;cfoutput&gt;
&lt;cfif structkeyexists(res, "message")&gt;message=#res.message.tostring()#&lt;/cfif&gt;
&lt;p&gt;
Done.
&lt;/cfoutput&gt;
</code>

<p>

There isn't a lot going on here really. I begin by creating an instance of the Zencoder library with my API key. I then copy - if it isn't already there, a video I made locally to a S3 folder. Next I create a Zencoder output array. You can request multiple outputs when processing but for this template I'll just work with one. I also asked for 6 thumbnails. Finally I tell Zencoder where to store the file and then create my job.

<p>

And that's it! Obviously I'm leaving off the slightly more complex portion - handling the result. As I said, you can ping the API to check the status o jobs or have Zencoder run a HTTP call against your site. I'd imagine you could set up a simple Ajax based checker on your site in a few minutes. 

<p>

All in all - this is a darn impressive service, and I'm looking forward to working with it in the future. I'd love to hear from anyone who has had a chance to use this in production yet.