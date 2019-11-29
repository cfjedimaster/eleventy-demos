---
layout: post
title: "Limiting individual file sizes in the Ajax based uploader in ColdFusion 9"
date: "2010-08-13T18:08:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/08/13/Limiting-individual-file-sizes-in-the-Ajax-based-uploader-in-ColdFusion-9
guid: 3911
---

ColdFusion 9 added a snazzy little Ajax-based (well, Flash based to be truthful) multi-file uploader. Just in case you haven't actually seen it, here is a quick snap shot of what it looks like:
<p>
<img src="https://static.raymondcamden.com/images/Capture7.PNG" />
<p>
I've done a few blog posts on this topic already. Today a reader sent in an interesting question. While the control provides a way to limit the <i>total</i> file size of uploads (using the maxuploadsize attribute), there is no direct way to limit the size of <i>individual</i> file uploads. This blog entry will show one way that can be accomplished. I'll be using jQuery for my solution but please note that this is not a requirement.
<p>
<!--more-->
<p>
Ok, so the first problem we run into is that there is no support for noticing when a file is added to the queue. If there was, we could listen for that and simply throw an error then. The next problem is that there is no support for a "pre"-upload event. You get support for an upload complete event - but not one for right before the uploads begin. Luckily we have a way to work around this. We're going to disable the upload button and use our own logic to fire off the uploads. I'll show the entire template below and then walk you through what it does.
<p>
<code>

&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("#uploadBtn").click(function() {
		//get all the files
		var files = ColdFusion.FileUpload.getSelectedFiles('myfiles');
		if(files.length == 0) {
			alert("You didn't pick anything to upload!");
			return;
		}
		var oneTooBig = false;
		for(var i=0; i&lt;files.length; i++) {
			if(files[i].SIZE &gt; 40000) {
				oneTooBig = true;
				alert("The file, "+files[i].FILENAME +" is too big. It must be removed.");
			}
		}

		if(!oneTooBig) ColdFusion.FileUpload.startUpload('myfiles');
	});
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cffileupload name="myfiles" maxuploadsize="10" hideuploadbutton="true"&gt;
&lt;br&gt;&lt;br&gt;
&lt;input type="button" id="uploadBtn" value="Upload Mah Filez!"&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

First - notice how in the cffileupload control I've used the hideuploadbutton attribute. As you can guess, this removes the button you would normally use to upload all the files. I've added my own button, uploadBtn, that will be used instead. 

<p>

Now let's look at the JavaScript. When the upload button is clicked, I begin by using the ColdFusion Ajax API call, getSelectedFiles, to get an array of files in the control. Once I have that, it's rather trivial. I loop over each and if the file size is too big (I used 40K as an arbitrary limit), then I flag it and alert it to the user. If no file was too big I can then fire off the upload request, again using the document Ajax API call startUpload(). 

<p>

That's it. You can see here in this screen shot how the button was removed. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Capture22.PNG" />