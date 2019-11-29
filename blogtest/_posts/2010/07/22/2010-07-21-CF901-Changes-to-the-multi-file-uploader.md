---
layout: post
title: "CF901: Changes to the multi file uploader"
date: "2010-07-22T09:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/22/CF901-Changes-to-the-multi-file-uploader
guid: 3887
---

ColdFusion 9 introduced a new Ajax UI control to allow for multiple file uploads. This little control worked well, although it did add some level of complexity to your form process. (See <a href="http://www.raymondcamden.com/index.cfm/2009/11/11/Important-notes-about-ColdFusion-9s-new-multi-file-uploader">this blog entry</a> where I discuss that topic.) ColdFusion 9.0.1 updates the control a bit in a couple of nice ways. Here is what I've found so far.

<p>
<!--more-->
First, a couple of bug fixes are mentioned in the release notes. I'd say that more important one though involves the session scope and the use of URL variables. I mentioned in my <a href="http://www.coldfusionjedi.com/index.cfm/2009/11/11/Important-notes-about-ColdFusion-9s-new-multi-file-uploader">previous blog entry</a> that you needed to include your Session URL token in the url manually, like so:

<p>
<code>
&lt;cffileupload url="uploadall.cfm?#urlEncodedFormat(session.urltoken)#" name="files" /&gt;
</code>

<p>

This is no longer the case. You can leave that off and your session is preserved automatically when the files are POSTed to your server. Also - if you want to add any <i>additional</i> values, you don't have to url encode the values unnecessarily. What I mean by that is - previously, if you had tried to add: ?name=ray&age=31, the & would need to be encoded. This is not an issue at all anymore. The following example works perfectly:

<p>

<code>
&lt;cffileupload url="uploadall.cfm?name=Ray+Camden&age=37" name="files" &gt;
</code>

<p>

I manually encoded the name value, but I could have wrapped just that portion in a urlEncodedFormat call too. There are few other bug fixes mentioned in the <a href="http://kb2.adobe.com/cps/847/cpsid_84726.html">release notes</a>, but that's the one I appreciate the most. 

<p>

Now let's look at  new feature. 9.0.1 adds a new JavaScript function, ColdFusion.FileUpload.getSelectedFiles. This is documented in the new features guide, but unfortunately the guide is a bit wrong. First, it uses the wrong case, getselectedfiles. In JavaScript, that's kinda of important. Secondly, you aren't told how to actually use the function. Luckily I guessed that it works like other built in controls - you simply pass in the name of the control. Thirdly, the docs are wrong about <i>what</i> is returned. It says that you get a status for each file in the control. But it mentions that a "no" status implies there is an error. That isn't true at all. The "no" status simply means it hasn't been uploaded yet. Also note that the docs mention an "uploadStatus" key. This is actually a STATUS key. 

<p>

This is a great update since it now means that when we submit the form, we can check the control and see if you forgot to upload any files. Here is a simple example:

<p>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	
	$("#myForm").submit(function(e) {
		files = ColdFusion.FileUpload.getSelectedFiles('files');
		if(files.length) {
			for(var i=0; i&lt;files.length; i++) {
				if(files[i].STATUS == "No") {
					alert('Your file upload is not yet complete. Please upload all files or clear any ones you do not want to upload.');
					e.preventDefault();
					break;
				}
			}
		}
	})
})
&lt;/script&gt;

&lt;/head&gt;
&lt;body&gt;

&lt;form action="index.cfm" id="myForm" method="post"&gt;
Name: &lt;input type="text" name="name"&gt;&lt;br/&gt;
Email: &lt;input type="text" name="email"&gt;&lt;br/&gt;
Attachments: &lt;cffileupload url="uploadall.cfm?name=Ray+Camden&age=37" name="files" &gt;&lt;br/&gt;
&lt;input type="submit"&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

I've used jQuery here to listen for the form submission. I loop over the files in the control and if any of them have a status of No (<b>note the case!</b>) I prevent the form from submitting. This is an excellent update as I guarantee most users won't get that they need to upload the files with a separate click.