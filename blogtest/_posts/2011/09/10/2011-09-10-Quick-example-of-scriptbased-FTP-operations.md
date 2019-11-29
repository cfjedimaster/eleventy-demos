---
layout: post
title: "Quick example of script-based FTP operations"
date: "2011-09-10T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/09/10/Quick-example-of-scriptbased-FTP-operations
guid: 4359
---

In the 10+ years I've used ColdFusion I think I've needed to use FTP once, but after reading an article today on <a href="http://ldeveloper.blogspot.com/2011/09/fast-php-example-ftp-file-upload.html">FTP in PHP</a> I thought I'd take a quick look at using the FTP component that shipped with ColdFusion 9. Here's what I found.
<!--more-->
<p/>

I began by creating a few simple variables and creating an instance of the FTP service. 

<p/>

<code>
ftpServer = "server";
ftpUser = "user";
ftpPassword = "password";

ftpService = new ftp();
r = ftpService.open(action="open", connection="ftpCon", 
			server="#ftpServer#", username="#ftpUser#", password="#ftpPassword#");
</code>

<p/>

Notice the use of ftpCon there. When you do FTP operations in ColdFusion, you can create a name for the connection. This name exists for the <b>current request only</b>. It isn't an object - it's just a name. But once you have it you reuse it for further operations. This means you don't have to pass in your server, username, and password operations for future requests.

<p/>

The result of this call is a Result object. All of the CFC "wrapper" objects return a semi-complex (my way of saying not simple but terribly complext either) object that has 2 main components, a <b>prefix</b> and a <b>result</b>. The prefix is a bit confusingly-named, but it's the result of the "meta data" from the tag call. As a practical example that may make more sense, think about cfquery calls. Whenever you do a cfquery call you get a record set as well as some metadata in the CFQUERY "scope". It isn't a real scope per se but it's a structure automatically created. So for the CFC wrappers, the Prefix contains that information. Given the call above, the prefix contains what the cfftp variable would have. Given that, I can check to ensure I succeeded and then do a directory call.

<p/>

<code>
if(r.getPrefix().succeeded) {
	files=ftpService.listDir(directory="/websites",name="res",connection="ftpCon",passive=true);	
	writedump(files);

	r = ftpService.putFile(localfile="c:\Users\Raymond\Desktop\test.txt",connection="ftpCon",remoteFile="/websites/test.txt");
	writedump(r);

}
</code>

<p>

I've got two calls there. The first list files in the remote directory websites. Here is an oddity. The name attribute normally names the query result returned from CFFTP. However, our result is in the files objects. But if we leave the name attribute off we get an error. I'm going to try to fix that for Zeus as it makes no sense. Basically - just give it a throwaway name and work with the result object files instead. Here's what that dump looks like. You can see it in the Result object wrapper. 

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip177.png" />

<p>

Sorry for the small size there - the dump was kinda big. Right after that I do a putFile to upload a local file. Notice the connection in use again. This time the result object shows...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip178.png" />

<p>

Kinda odd that the key is named ErrorCode. Anyway - to complete the puzzle you want to close the connection as well. Here's the entire template.

<p>

<code>
&lt;cfscript&gt;
ftpServer = "foo";
ftpUser = "moo";
ftpPassword = "zoo";

ftpService = new ftp();
r = ftpService.open(action="open", connection="ftpCon", 
			server="#ftpServer#", username="#ftpUser#", password="#ftpPassword#");

if(r.getPrefix().succeeded) {
	files=ftpService.listDir(directory="/websites",name="res",connection="ftpCon",passive=true);	
	writedump(files);

	r = ftpService.putFile(localfile="c:\Users\Raymond\Desktop\test.txt",connection="ftpCon",remoteFile="/websites/test.txt");
	writedump(r);

}


ftpService.close(connection="ftpCon");

&lt;/cfscript&gt;
</code>