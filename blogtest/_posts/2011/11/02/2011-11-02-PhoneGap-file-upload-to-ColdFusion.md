---
layout: post
title: "PhoneGap file upload to ColdFusion"
date: "2011-11-02T18:11:00+06:00"
categories: [coldfusion,javascript,mobile]
tags: []
banner_image: 
permalink: /2011/11/02/PhoneGap-file-upload-to-ColdFusion
guid: 4418
---

This came up on the <a href="https://groups.google.com/forum/#!forum/phonegap">PhoneGap Forums</a> today so I thought I'd take a quick look at how PhoneGap handles file uploads. Turns out there is <i>really</i> nice support for it built-in, but you can quickly run into an issue with ColdFusion if you don't know one little tip.
<!--more-->
<p>

My demo application will make use of PhoneGap's <a href="http://docs.phonegap.com/en/1.0.0/phonegap_file_file.md.html#FileTransfer">FileTransfer</a> object. What's nice is that the PhoneGap team includes a full demo that makes use of your device's photo library. I decided I'd use this demo to post a file to ColdFusion and perform a few quick image manipulations to it. Let's begin with the PhoneGap portion of the code. My HTML is rather simple. I've got a button and some elements that will end up storing results later on.

<p>

<code>

&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;
	&lt;meta name="viewport" content="width=320; user-scalable=no" /&gt;
	&lt;meta http-equiv="Content-type" content="text/html; charset=utf-8"&gt;
	&lt;title&gt;Image Upload Example&lt;/title&gt;
	&lt;link rel="stylesheet" href="master.css" type="text/css" media="screen" title="no title" charset="utf-8"&gt;
	&lt;script type="text/javascript" charset="utf-8" src="phonegap-1.1.0.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript" charset="utf-8" src="xui-2.3.0.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript" charset="utf-8" src="main.js"&gt;&lt;/script&gt;
&lt;/head&gt;

&lt;body onload="init();"&gt;
	
	&lt;button id="picSelect"&gt;Select Picture&lt;/button&gt;
	
	&lt;div id="status"&gt;&lt;/div&gt;

	&lt;img id="resultpic"&gt;
			
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

As you can guess, the main logic is in main.js. Let's take a look over there.

<p>

<code>


function init() {
    document.addEventListener("deviceready", deviceReady, true);
}

function errorHandler(e) {
    /*
     FileTransferError.FILE_NOT_FOUND_ERR = 1;
    FileTransferError.INVALID_URL_ERR = 2;
    FileTransferError.CONNECTION_ERR = 3;
    */
    alert("Error: "+JSON.stringify(e));
}

function picDone(loc) {
    x$("#status").html("after","About to upload your picture...");

    
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=loc.substr(loc.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    //Thank you Steve Rittler! http://www.countermarch.com/blog/index.cfm/2011/10/27/PhoneGap-FileTransfer-and-ColdFusion
    options.chunkedMode=false;

    var ft = new FileTransfer();
    ft.upload(loc, "http://192.168.1.105/test3a.cfm", fileUploaded, errorHandler, options);
}

function fileUploaded(r) {
    x$("#status").html("And we're done!");
    x$("#resultpic").attr("src", r.response);
}

function deviceReady() {
    
    x$("#picSelect").touchstart(function(e) {
        navigator.camera.getPicture(picDone,errorHandler,{% raw %}{sourceType:Camera.PictureSourceType.PHOTOLIBRARY, destinationType:Camera.DestinationType.FILE_URI,quality:50}{% endraw %}); 
    });

}
</code>

<p>

Let's walk through this, starting with the deviceReady function. That's run because I added a listener to it in my init function and is a way to ensure I can do "cool device stuff" with the PhoneGap APIs. In case you're curious about the x$ stuff - that's just me playing with <a href="http://xuijs.com/">xui.js</a>, a replacement for jQuery. I'm not sure how I feel about it yet - ask me next week. 

<p>

Any way, you can see where we bind to the button element's touch event. When run, we ask the device to get a picture. PhoneGap allows you to go the camera or to the storage for the picture. In this case I went to my storage. Once the picture is taken, we then begin the file upload process. This is in the function picDone. The code here is pretty much ripped right from the PhoneGap docs, with <b>one crucial difference</b>. Notice the call out to a <a href="http://www.countermarch.com/blog/index.cfm/2011/10/27/PhoneGap-FileTransfer-and-ColdFusion">blog post</a> by Steve Rittler. Apparently the upload is using chunked form data. ColdFusion can't handle this. For the life of me though I thought it was an Apache issue. I got a 411 error in Apache, but nothing in ColdFusion. I'm still not convinced it <i>is</i> a ColdFusion, but at the end of the day, Steve's change worked fine. By the way, "fileKey" is simply the <i>name</i> of the form field. You will need to remember this when we get over to the server side. 

<p>

Finally, our file upload handler fileUploaded() assumes we are getting a URL back. It then simply takes that URL and assigns it to the image. Here's a few screen shots. First, the application as it begins:

<p>

<img src="https://static.raymondcamden.com/images/device-2011-11-02-161436.png" />

<p>

Next - the image picker....

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/shot22.png" />

<p>

and finally, the result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/shot31.png" />

<p>

The server side code is rather trivial:

<p>

<code>
&lt;cfsetting enablecfoutputonly="true"&gt;

&lt;cfif structKeyExists(form, "file")&gt;
	&lt;cfset destination = getTempDirectory()&gt;
	
	&lt;cffile action="upload" filefield="file" destination="#destination#" nameconflict="makeunique" result="result"&gt;
	
	&lt;cfif result.fileWasSaved&gt;
		&lt;cfset theFile = result.serverDirectory & "/" & result.serverFile&gt;
		&lt;cfif isImageFile(theFile)&gt;
			&lt;!--- copy to web root with new name ---&gt;
			&lt;cfset newName = expandPath("./") & createUUID() & ".jpg"&gt;
			&lt;cfset fileMove(theFile, newName)&gt;
			&lt;!--- resize to a thumbnail and grayscale for the hell of it ---&gt;
			&lt;cfset img = imageRead(newName)&gt;
			&lt;cfset imageScaleToFit(img, 200,200)&gt;
			&lt;cfset imageGrayScale(img)&gt;
			&lt;cfset imageWrite(img)&gt;
			&lt;cfoutput&gt;http://192.168.1.105/#getFileFromPath(newName)#&lt;/cfoutput&gt;
		&lt;cfelse&gt;
			&lt;cfset fileDelete(theFile)&gt;
		&lt;/cfif&gt;

		
	&lt;/cfif&gt;
	
&lt;/cfif&gt;
</code>

<p>

You can see I handle the file upload, do some basic checking, and if it is an image, I scale the size and gray scale the color. I then simply output the URL. I could have written this as a CFC of course and normally would.  Outside of the darn chunked error, this is a rather simple process. I'm not sure why this chunked option isn't documented (I posted as such to the forums), but now that I'm past it, I'm pretty pleased with how easy PhoneGap makes this.