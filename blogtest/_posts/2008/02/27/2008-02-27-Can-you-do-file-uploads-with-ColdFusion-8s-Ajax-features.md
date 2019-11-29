---
layout: post
title: "Can you do file uploads with ColdFusion 8's Ajax features?"
date: "2008-02-27T12:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/27/Can-you-do-file-uploads-with-ColdFusion-8s-Ajax-features
guid: 2678
---

I've gotten this question about 200 times, as have other bloggers, so I thought I'd write up a quick blog post to discuss it.
<!--more-->
The short answer is no. Ajax, specifically the feature used to make HTTP requests, cannot do file uploads. Period. This is a security feature enforced at the browser level. 

However there are workarounds. The typical workaround uses JavaScript to create a hidden iframe. A new form is created here and then that form is posted to the server. You can then monitor the result of the form post and handle it.

If you Google, you will find about 2 million examples of this. I spent five minutes and picked an example that was simple and direct. This is - most probably - not the best example - but it worked. For this example I'll be using the code from:

<a href="http://www.phpletter.com/Demo/AjaxFileUpload-Demo/">AjaxFileUpload Demo</a>

Yes, that's a PHP site. Get over it. ;) The example makes use of <a href="http://jquery.com/">jQuery</a> and runs as a jQuery plugin. 

I downloaded the AjaxFileUpload zip. It provided everything. I copied the JS, CSS files, and images over, and then modified his main demo file to come up with the following base code:

<code>
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Ajax File Uploader Plugin For Jquery&lt;/title&gt;
&lt;script src="jquery.js"&gt;&lt;/script&gt;
&lt;script src="ajaxfileupload.js"&gt;&lt;/script&gt;
&lt;link href="ajaxfileupload.css" type="text/css" rel="stylesheet"&gt;
&lt;script type="text/javascript"&gt;
	function ajaxFileUpload()
	{
		$("#loading")
		.ajaxStart(function(){
			$(this).show();
		})
		.ajaxComplete(function(){
			$(this).hide();
		});

		$.ajaxFileUpload
		(
			{
				url:'/testingzone/ajaxupload/doajaxfileupload.cfm',
				secureuri:false,
				fileElementId:'fileToUpload',
				dataType: 'json',
				success: function (data, status)
				{ 
					if(typeof(data.error) != 'undefined')
					{
						if(data.error != '')
						{
							alert(data.error);
						}else
						{
							alert(data.msg);
						}
					}
				},
				error: function (data, status, e)
				{
					alert(e);
				}
			}
		)
		
		return false;

	}
&lt;/script&gt;	
&lt;/head&gt;

&lt;body&gt;
	
&lt;div id="wrapper"&gt;
    &lt;div id="content"&gt;
    	&lt;h1&gt;Ajax File Upload Demo&lt;/h1&gt;
    	&lt;p&gt;Jquery File Upload Plugin  - upload your files with only one input field&lt;/p&gt;
		&lt;img id="loading" src="loading.gif" style="display:none;"&gt;
		&lt;form name="form" action="" method="POST" enctype="multipart/form-data"&gt;
		&lt;table cellpadding="0" cellspacing="0" class="tableForm"&gt;

		&lt;thead&gt;
			&lt;tr&gt;
				&lt;th&gt;Please select a file and click Upload button&lt;/th&gt;
			&lt;/tr&gt;
		&lt;/thead&gt;
		&lt;tbody&gt;	
			&lt;tr&gt;
				&lt;td&gt;&lt;input id="fileToUpload" type="file" size="45" name="fileToUpload" class="input"&gt;&lt;/td&gt;	

					
			&lt;/tr&gt;

		&lt;/tbody&gt;
			&lt;tfoot&gt;
				&lt;tr&gt;
					&lt;td&gt;&lt;button class="button" id="buttonUpload" onclick="return ajaxFileUpload();"&gt;Upload&lt;/button&gt;&lt;/td&gt;
				&lt;/tr&gt;
			&lt;/tfoot&gt;
	
	&lt;/table&gt;
		&lt;/form&gt;    	
    &lt;/div&gt;
    

&lt;/body&gt;
&lt;/html&gt;
</code>

You want to pay particular attention to the ajaxFileUpload function. The <i>only</i> thing I modified was the URL value. To handle the file upload on the server, you handle it like any other file upload. However, his code wanted a JSON structure back. Luckily that is incredibly easy in ColdFusion.

<code>
&lt;cfset r = structNew()&gt;
&lt;cfset r["msg"] = ""&gt;
&lt;cfset r["error"] = ""&gt;

&lt;cfif structKeyExists(form, "fileToUpload") and len(form.filetoupload)&gt;
	&lt;cffile action="upload" filefield="fileToUpload" destination="#expandPath("./")#" nameconflict="makeunique"&gt;
	&lt;cfset r["msg"] = "Your file was #file.clientfile# and had a size of #file.filesize#."&gt;
&lt;cfelse&gt;
	&lt;cfset r["error"] = "No file was uploaded."&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;#serializeJSON(r)#&lt;/cfoutput&gt;
</code>

So obviously if you use some other method, your code will vary, but hopefully this simple example will be enough to get people started.

If readers would like to recommend their own scripts, please do so.