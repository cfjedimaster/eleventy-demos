---
layout: post
title: "Ask a Jedi: Check for file existence before upload"
date: "2008-03-04T09:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/04/Ask-a-Jedi-Check-for-file-existence-before-upload
guid: 2689
---

Jay asks:

<blockquote>
<p>
I have some code that allows a user to upload a file. 
Upon upload I build a file name and store it in a database.
The people it is uploaded to will take it massage it and return it to use via a folder that I monitor. Once a see a file I match it to the Database and download it.

my problem is that the users will want to re-upload the same file for various reasons. I have the "return" process checking
for matching files and moving the original to a separate folder, however I would like to check in the upload process to see if the file I am about to upload already exists and if so give the use the opportunity to abort the upload and
rename the file
</p>
</blockquote>
<!--more-->
So the answer to this is... kinda. You have a few things you can consider. First off - you can simply put all uploads in a temporary holding folder. If the file isn't a duplicate, move it out. If it is, simply present the user a form to make them give it a new name. The only thing you want to watch out for is users simply leaving your application. You would want to periodically clean the holding folder. 

Another way to handle this is with AJAX. JavaScript doesn't let you do much with a file upload field. You can't change it for example. But you can read it. Consider the following code:

<code>
&lt;cfajaxproxy cfc="filetest" jsclassname="filetest"&gt;

&lt;script&gt;
var myFileTest = new filetest();

function testFile(f) {
	var value = f.value;
	if(value != '') {
		if(myFileTest.exists(value)) alert('This file already exists.');		
	}
}
&lt;/script&gt;

&lt;form action="" method="post" enctype="multipart/form-data"&gt;
&lt;input type="file" name="upload" onChange="testFile(this)"&gt;
&lt;/form&gt;
</code>

I've bound an onChange event to my fileUpload field. I grab the value, and if there is something there, I do an Ajax call to a CFC named filetest. The value is only the filename, not the complete folder. In my CFC I do:

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="exists" access="remote" returnType="boolean" output="false"&gt;
	&lt;cfargument name="file" type="string" required="true"&gt;
	&lt;cfreturn fileExists(expandPath("./" & arguments.file))&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

Now this code could be rife for abuse. You would want to make sure that it only checks a folder you don't mind the entire world knowing about. But you get the idea. As soon as a user selects a file, the code will see if a file with the same name exists. You could then create a form field to ask the user for a new name.