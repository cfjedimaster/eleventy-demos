---
layout: post
title: "Ajax Image Uploads (with Previews)"
date: "2010-03-08T17:03:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/03/08/Ajax-Image-Uploads-with-Previews
guid: 3742
---

Earlier today I saw a pretty darn good tutorial over at ZURB (I have no idea why they are, but with a name like ZURB they are either Web 2.0 experts or an alien race hell bent on enslaving us. Either way - cool). The article, <a href="http://www.zurb.com/playground/ajax_upload">Image Uploads with 100% Less Suck. Guaranteed</a>, detailed how you can let a user select an image and create a preview from that selection. I'm not going to talk a lot about how the code works - the ZURB folks did a real good job in their blog entry. So be sure to read that before going any further. I assume you did that (programmers always follow written directions) and have asked - can we do this with ColdFusion handling the server-side image processing? Of course we can. Here is a quick mock up I came up with.
<!--more-->
<p>

I began with a slightly modified version of ZURB's front end code. I set up my div/form like so:

<p>

<code>
&lt;div id="preview"&gt;&lt;span id="status"&gt;&lt;/span&gt;&lt;img id="thumb"&gt;&lt;/div&gt;
&lt;form action="test.cfm" method="post"&gt;
&lt;b&gt;Upload a Picture&lt;/b&gt;&lt;br/&gt;
&lt;input type="field" id="imageUpload" name="imageUpload"&gt;&lt;br/&gt;
&lt;input type="submit" value="Save"&gt;
&lt;/form&gt;
</code>

<p>

Notice I've got a preview div with a status span and a blank image. The form itself just consists of the upload field. Now for the JavaScript, and again, credit for this goes to ZURB, and I should also point out it makes use of the <a href="http://valums.com/ajax-upload/">AJAX Upload</a> jquery plugin.

<p>

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script src="ajaxupload.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function(){

	var thumb = $('img#thumb');	

	new AjaxUpload('imageUpload', {
		action: 'thumbnailupload.cfm',
		name: 'image',
		onSubmit: function(file, extension) {
			$('span.status').text("Loading preview");
		},
		onComplete: function(file, response) {
			thumb.load(function(){
				$('span.status').text("");
				thumb.unbind();
			});
			response = $.trim(response)
			console.log('thumbnailpreview.cfm?f='+escape(response))
			thumb.attr('src', 'thumbnailpreview.cfm?f='+escape(response));
		}
	});
});

&lt;/script&gt;
</code>

<p>

For the most part this is no different from the ZURB blog entry, but I decided to use simple text for the status field during loading. (And yes, I left a console.log in there - IE folks please delete!) You will notice that I point the upload to thumbnailupload.cfm. The result is then loaded via another ColdFusion file, thumbnailpreview.cfm. Let's first look at the upload.

<p>

<code>
&lt;cfset destdir = "ram:////thumbnails"&gt;
&lt;cfif not directoryExists(destdir)&gt;
	&lt;cfdirectory action="create" directory="#destdir#"&gt;
&lt;/cfif&gt;

&lt;cffile action="upload" filefield="image" destination="#destdir#" nameconflict="makeunique" result="result"&gt;
&lt;cfset newFilePath = destdir & "/" & result.serverfile&gt;

&lt;cfif isImageFile(newFilePath)&gt;
	&lt;cfset jpgVersion = destdir & "/" & replace(createUUID(), "-", "_", "all") & ".jpg"&gt;
	&lt;cfimage action="resize" width="100" height="100" source="#newFilePath#" destination="#jpgVersion#" overwrite="true"&gt;
	&lt;cfoutput&gt;#getFileFromPath(jpgVersion)#&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

<p>

I begin by making use of the Virtual File System - a ColdFusion 9 feature. If my root folder doesn't exist, I create it. I then handle the upload. So far so good. The last part of the template simply checks to see if the upload was an image. If it is, I both resize and rename to a JPG. I'll explain the rename in a bit. The resize is hard coded to be 100x100. If I had left height to blank I could have gotten a resize that respected the aspect ratio. Normally you <b>do</b> want to respect that - but in my case I just thought a box worked better. The final action is to return the file name of the JPG file I created.

<p>

So if you look back into the JavaScript, you see I take that result, trim it, and pass it to a new url, the preview script. Let's now take a look at that:

<p>

<code>
&lt;cfparam name="url.f" default=""&gt;

&lt;cfif fileExists("ram:////thumbnails/#url.f#") and isImageFile("ram:////thumbnails/#url.f#")&gt;
	&lt;cfimage action="read" source="ram:////thumbnails/#url.f#" name="image"&gt;
	&lt;cfcontent type="image/jpg" variable="#imageGetBlob(image)#"&gt;
&lt;/cfif&gt;
</code>

<p>

Woot. Lots of a code there, eh? As you can see, I simply validate that the requested file exists in the VFS (and is a valid image - which means I'm duplicating my check here - a bit of overkill but it can't hurt). I read in the bits and serve it up via cfcontent. The result is spectacular:

<p>

<img src="https://static.raymondcamden.com/images/cooluploadtest.png" title="Best. Upload. Ever." />

<p>

Ok, so maybe that's not exactly spectacular, but it does work rather well. However, there's a few things we need to keep in mind before using this code:

<p>

<ul>
<li>When you make use of the AJAX Upload jquery plugin, it "takes over" the file upload field. What that means is if you submit the form you <i>don't</i> get the file. This means we are right back to the non trivial problem I <a href="http://www.coldfusionjedi.com/index.cfm/2010/3/5/ColdFusion-9-Multifile-Uploader--Complete-Example">blogged</a> about last week. If I had to solve it for this particular example, I'd probably store the uploaded image as is, after renaming to a UUID, and then create a thumbnail by adding a "_t" to the file name. I'd return the UUID key and my preview script would know how to find the thumbnail. I'd store that UUID in a hidden form field. When the form is submitted, I'd then know how to fetch the real image out of RAM. Who else thinks it would be cool to have a presentation on "Non-Trivial AJAX Problems"?
<li>I'm not sure why I used cfimage to read in the bits in the preview script. I should have just read the bits in via fileRead. It would - I assume - run a bit faster.
<li>This code <i>should</i> be pretty sure - it's checking to see if the upload is a valid image, but you probably tighten it up even further. Also note I forgot to delete the upload if it wasn't an image. That's a two second modification though. 
</ul>

<p>

Anyway, I hope this implementation example is useful!