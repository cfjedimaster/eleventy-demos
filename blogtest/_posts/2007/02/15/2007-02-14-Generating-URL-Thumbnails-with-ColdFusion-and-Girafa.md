---
layout: post
title: "Generating URL Thumbnails with ColdFusion and Girafa"
date: "2007-02-15T10:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/15/Generating-URL-Thumbnails-with-ColdFusion-and-Girafa
guid: 1839
---

So this is yet another blog entry related to something I saw on <a href="http://www.dzone.com">Dzone</a>. Olaf, a developer from the Netherlands, created a simple <a href="http://www.web-development-blog.com/archives/dynamic-thumbnails-from-websites/">PHP script</a> that would integrate with <a href="http://www.girafa.com">Girafa.com</a> to create URL thumbnails. Girafa has a free account for people who will generate less than 2000 thumbnails per day.
<!--more-->
So first - sign up with Girafa. If they are as quick with you as they were with me, you will be confirmed in less than an hour. Once you are confirmed you will have a client ID and a signature ID. At that point you can use this simple UDF, modeled after Olaf's version, to generate a URL for the thumbnail:

<code>
&lt;cfscript&gt;
function getThumbnailURL(theURL) {
	var client_id = "CHANGE THIS";
	var signature = "CHANGE THIS TOO BUDDY";
	var concat = signature & theURL;
	var mdhash = lcase(hash(concat));
	var result = "http://scst.srv.girafa.com/srv/i?i=";
	signature = mid(mdhash, 17, 16);
	theURL = urlEncodedFormat(theURL);
	
	result = result & client_id & "&r=" & theURL & "&s=" & signature;
	return result;
}
&lt;/cfscript&gt;
</code>

Then to create the thumbnail, simply pass the URL to the UDF:

<code>
&lt;cfoutput&gt;
&lt;img src="#getThumbnailURL('http://www.cnn.com')#"&gt;
&lt;p&gt;
&lt;img src="#getThumbnailURL('http://ray.camdenfamily.com')#"&gt;
&lt;/cfoutput&gt;
</code>

Pretty simple. As Olaf mentions, if you need more than 2000 thumbnails, or if you want to simply cache the result, you can store the image locally. (Although that may be against Girafa's TOS.) As an example of how the thumbsnails look, here is the thumbnail from my blog:

<img src="http://scst.srv.girafa.com/srv/i?i=sc010594&r=http{% raw %}%3A%{% endraw %}2F{% raw %}%2Fray%{% endraw %}2Ecamdenfamily%2Ecom&s=0af1b70f77887885">