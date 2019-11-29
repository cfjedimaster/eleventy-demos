---
layout: post
title: "ColdFusion as a Service Examples - HTML/jQuery"
date: "2009-12-15T13:12:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/12/15/ColdFusion-as-a-Service-Examples-HTMLjQuery
guid: 3650
---

Last week I <a href="http://www.raymondcamden.com/index.cfm/2009/12/5/ColdFusion-as-a-Service-Examples--Images">blogged</a> my first set of examples from RIAUnleashed. Today I thought I'd share a few more. Specifically - these examples are both HTML/jQuery based and do not make use of Flex at all. 

The first thing I thought I'd point out is that you don't need to use the CFaaS CFCs as webservices. The documentation seems to imply this. However, when I tested CFaaS with simple HTTP requests, everything worked fine. I guess I shouldn't be surprised but again, the docs had led me to believe otherwise. I worked up a few simple demos, but here is one that demonstrates one way you could use CFaaS in a non-Flex context.

<code>
&lt;cfset u = "cfremoteuser1"&gt;
&lt;cfset p = "password"&gt;

&lt;cfhttp method="post" url="http://127.0.0.1/CFIDE/services/upload.cfc?returnformat=json" result="result"&gt;
	&lt;cfhttpparam type="file" name="upload" file="/Users/ray/Documents/ColdFusion/ColdSpring_Reference.pdf"&gt;
	&lt;cfhttpparam type="formField" name="serviceusername" value="#u#"&gt;
	&lt;cfhttpparam type="formField" name="servicepassword" value="#p#"&gt;
	&lt;cfhttpparam type="formField" name="method" value="uploadForm"&gt;
&lt;/cfhttp&gt;
&lt;cfset res = deserializeJSON(result.filecontent)&gt;
&lt;cfdump var="#res#"&gt;	

&lt;cfhttp method="post" url="http://127.0.0.1/CFIDE/services/pdf.cfc?returnformat=json" result="result"&gt;
	&lt;cfhttpparam type="formField" name="serviceusername" value="#u#"&gt;
	&lt;cfhttpparam type="formField" name="servicepassword" value="#p#"&gt;
	&lt;cfhttpparam type="formField" name="method" value="extractImage"&gt;
	&lt;cfhttpparam type="formField" name="source" value="#res[1].value#"&gt;
&lt;/cfhttp&gt;
&lt;cfdump var="#deserializeJSON(result.filecontent)#"&gt;
</code>

This example begins by first uploading a PDF to the Upload CFC. This CFC provides support for uploading files to the CFaaS system. It stores it and returns a URL containing a dynamic link to your file. Here is the output of the first dump:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 266.png" />

Now that we have a pointer to the file we can use it with the PDF service. In this case I run the extractImage method. The result is a list of image URLs for each and every image from the PDF:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 344.png" />

Pretty simple, right? While I can't imagine why you would use ColdFusion to post to another ColdFusion server to use CFaaS, you could if you wanted to. Mainly I imagine this example being useful if translated to another language, like PHP. (Just take the number of lines of code above and multiple by 4.)

For my second example, I did something a bit fancier. I used Aptana Studio to create a new HTML-based AIR application. This example makes use of the Image service and converts an image (specified by a URL) to grayscale:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 418.png" />

Ok, not exactly rocket science, but not something you can easily do in HTML (as far as I know - I do know that CSS does some cool filtering so it may actually support this!). The code behind this is relatively simple:

<code>
&lt;html&gt;
	
&lt;head&gt;
&lt;script src="lib/jquery/jquery-1.3.2.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$("#doit").click(function() {

		$("#result").html("Working...")
		var source = $("#imageurl").val()
		source = $.trim(source)
				
		$.getJSON("http://127.0.0.1/CFIDE/services/image.cfc?returnformat=json", 
			{method:"grayscale",serviceusername:"cfremoteuser1", 
			 servicepassword:"password", source:source},function(data,status) { 
				$("#result").html("&lt;img src='"+data+"'&gt;")
			})	
		
	})
})	
&lt;/script&gt;
&lt;style&gt;
body {
	padding: 5px;
	background-color: #33ff33;
	font-family:"MS Sans Serif", Geneva, sans-serif;
}
&lt;/style&gt;
&lt;/head&gt;	
&lt;body&gt;
	
&lt;h1&gt;jQuery CFaaS Demo&lt;/h1&gt;	

&lt;p&gt;
Enter an Image URL: &lt;input type="text" id="imageurl"&gt; &lt;input type="button" id="doit" value="Make It Gray" &gt;
&lt;/p&gt;

&lt;div id="result"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

As you can see, I simply bind to the doit button. When run, I execute a getJSON against a ColdFusion server, passing in all the information the method needs to work. 

All in all - pretty fun to write. I'm still not sure where I'd use CFaaS yet in production, but the more I dig into it, the more impressed I get.