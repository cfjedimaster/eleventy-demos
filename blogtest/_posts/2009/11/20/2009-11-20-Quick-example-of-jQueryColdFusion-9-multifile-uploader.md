---
layout: post
title: "Quick example of jQuery/ColdFusion 9 multifile uploader"
date: "2009-11-20T18:11:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/11/20/Quick-example-of-jQueryColdFusion-9-multifile-uploader
guid: 3616
---

I was talking to a reader earlier today about ColdFusion 9's new multi-file uploader. I mentioned my <a href="http://www.raymondcamden.com/index.cfm/2009/11/11/Important-notes-about-ColdFusion-9s-new-multi-file-uploader">earlier</a> blog post which goes into details about the "multiple post" nature of this control, specifically if you have other form fields involved. He came back with an interesting scenario. How would you handle allowing for metadata about each file upload. By that I mean imagine the following: You've got a form with a few basic fields in (name, email, etc), and then you have the multi-file uploader. For each file you upload you want to ask the user to enter data about the file, like perhaps a nicer name. How could you handle that? Here is one simple example that makes use of jQuery. I wrote this <i>very</i> quickly so please forgive the ugliness.
<!--more-->
Ok - the code:

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
var counter=0

function handleComplete(res) {
	console.dir(res)
	if(res.STATUS==200) {
		counter++
		var newRow = '&lt;tr&gt;&lt;td&gt;&lt;input type="hidden" name="file_'+counter+'" value="'+res.FILENAME+'"&gt;'
		newRow += 'Label the file: '+res.FILENAME+' &lt;input type="text" name="filename_'+counter+'"&gt;&lt;/td&gt;&lt;/tr&gt;'
		$("table#detail").append(newRow)
	}
}
&lt;/script&gt;

  &lt;form action="test.cfm" method="post"&gt;
  Name: &lt;input type="text" name="name"&gt;&lt;br/&gt;
  Email: &lt;input type="text" name="email"&gt;&lt;br/&gt;
  Attachments: &lt;cffileupload url="uploadall.cfm" name="files" oncomplete="handleComplete"&gt;&lt;br/&gt;
  &lt;table id="detail"&gt;
  &lt;/table&gt;
  &lt;input type="submit"&gt;
  &lt;/form&gt;
  
  &lt;cfdump var="#form#"&gt;
</code>

Starting at the bottom, we have our basic form with the multi-file control. Notice I've added a oncomplete attribute. This will be run after every file is uploaded. This runs a function called handleComplete. I get passed an object that contains a status code, a message, and the file name. So the next part is simple. If the status is 200, simply add a row of data where we can ask for more information. Notice I use a hidden form field. This let's me connect, numerically, a file name along with the meta data. You will see the connection in the sample below. The screen shot below shows the result of uploading 3 files and me entering information about them.

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-11-20 at 5.15.45 PM.png" />

And after submitting, note the form data:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-11-20 at 5.16.16 PM.png" />

I hope this is helpful. Let me know if you have any questions, or improvements, on the technique.

<b>Edit:</b> For the 'nice name' label I used filename_X. That's a poor choice there since file_X is the filename. Just pretend I used something nice like, oh, filelabel_X.