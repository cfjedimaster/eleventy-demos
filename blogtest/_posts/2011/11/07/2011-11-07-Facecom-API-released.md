---
layout: post
title: "Face.com API released"
date: "2011-11-07T14:11:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2011/11/07/Facecom-API-released
guid: 4423
---

Wow, another cool API was just released today. <a href="http://face.com">Face.com</a> has released an API for facial recognition. Not only will it do facial recognition, it will also do training (so it can help learn people) and integration with Facebook and Twitter. I played around with the API today and it's easy to use. You can see the <a href="http://developers.face.com/docs/api/">docs</a> for yourself, and that's <i>without</i> having to register. (Sorry, I get ticked off at API providers that require you to give over your personal information before deigning to tell you what their API looks like.) I whipped up a super quick ColdFusion sample to show you how it works. (And again, this is just an example of their facial recognition, they do more.)
<!--more-->
<p>

<code>
&lt;cfset apikey = "yeah, you need to sign in for this"&gt;
&lt;cfset apisecret = "see above"&gt;

&lt;cfset apiUrl = "http://api.face.com/faces/detect.json"&gt;

&lt;cfset sourceimage = "c:\users\raymond\dropbox\photos\two starbucks.jpg"&gt;

&lt;cfhttp url="#apiurl#?api_key=#apikey#&api_secret=#apisecret#" method="post"&gt;
	&lt;cfhttpparam name="body" type="file" file="#sourceimage#"&gt;
&lt;/cfhttp&gt;

&lt;cfset resultStr = cfhttp.filecontent&gt;
&lt;cfif isJSON(resultStr)&gt;
	&lt;cfset result = deserializeJSON(resultStr)&gt;
	&lt;cfif result.status is "success" and arraylen(result.photos)&gt;
		&lt;!--- read in our image ---&gt;
		&lt;cfset img = imageRead(sourceimage)&gt;
		&lt;!--- API supports N photos at once, but we assume 1 photo ---&gt;
		&lt;cfset photo = result.photos[1]&gt;
		
		&lt;cfloop index="tag" array="#photo.tags#"&gt;
			&lt;!--- to draw our square, we will need to get upper left corner, we are given a center+w,h ---&gt;
			&lt;!--- tag.center.x/y == % of total size ---&gt;
			&lt;cfset centerReal = {% raw %}{ x=tag.center.x/100 * photo.width, y=tag.center.y/100*photo.height}{% endraw %}&gt;
			&lt;cfset widthReal = tag.width/100*photo.width&gt;
			&lt;cfset heightReal = tag.height/100*photo.height&gt;
			&lt;cfset upperLeft = {% raw %}{ x=centerReal.x-(widthReal/2), y=centerReal.y-(heightReal/2)}{% endraw %}&gt;
			&lt;cfset imageDrawRect(img, upperLeft.x, upperLeft.y, widthReal, heightReal)&gt;
			&lt;cfdump var="#tag.attributes#" label="Tag attributes"&gt;
		&lt;/cfloop&gt;
	&lt;/cfif&gt;
	&lt;cfimage action="writeToBrowser" source="#img#"&gt;
			
&lt;/cfif&gt;
</code>

<p>

In the template above, I create a URL request based on my API key and secret (which took all of two minutes to get when I signed up) and pass in a photo from my hard drive. They also support URLs as well as sending multiple images at once. Even better, if you are concerned about the speed of the response, you can provide a call back url and their service will ping you back with the results. Finally - and this I really dig - they will also tell you how many API calls you have left and how soon it will reset. I love how thorough they seem to be here. 

<p>

Ok, so after I make the call, I start to work with the result. You get an array of photo results back, one for each you sent. Since my code is working with one I just assume the array has one item. Within that struct you have an array of tags. The tags contain data about your matches. Oddly - even though they know the size of your image, they return everything in percentages. That was the only part of this API I really didn't care for. You can see where I do a bit of math to convert these into values that make sense for my photo. Once I have that though it is relatively easy to draw a rectangle. I also dump the tag attributes. This is a pretty cool feature where it tells you how confident it is and things like gender, glasses, and if the person is smiling! 

<p>

Finally, I use a quick writeToBrowser to test out the results. Here are a few samples.

<p>


<img src="https://static.raymondcamden.com/images/ScreenClip214.png" />

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip215.png" />


Now check out this final copy. It correctly gets that Scott and I have glasses. it correctly says Dave isn't smiling. It gets my 'smile' factor wrong, but do note how lose the confidence is. 


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip216.png" />