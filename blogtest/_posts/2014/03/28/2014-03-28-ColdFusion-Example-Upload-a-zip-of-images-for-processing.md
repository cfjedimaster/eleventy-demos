---
layout: post
title: "ColdFusion Example: Upload a zip of images for processing"
date: "2014-03-28T11:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/03/28/ColdFusion-Example-Upload-a-zip-of-images-for-processing
guid: 5186
---

<p>
I keep a note of possible blog ideas and as I've been having a bit of writer's block lately, I thought I'd take a look and see what I could turn into a decent article. One of the older ideas I had was something that I thought would be a good example. Imagine you've built an image uploader for your site and have a bit of processing on the back end (scaling, gray scaling, etc). Now imagine you want to allow for bulk uploads of zip files to do the same thing. Here is a simple one page example of that in action.
</p>
<!--more-->
<p>
First, I'll share the entire template, and then I'll walk through the various parts. Note - in a typical MVC framework this would be split up. You get the idea.
</p>

<pre><code class="language-markup">&lt;cfif structKeyExists(form, &quot;upload&quot;) and
	  structKeyExists(form, &quot;zip&quot;)&gt;
	  
	&lt;!--- first, where to store? outside of web root of course ---&gt;
	&lt;cfset uploadDir = getTempDirectory()&gt;

	&lt;cftry&gt;

		&lt;cffile action=&quot;upload&quot; destination=&quot;#uploadDir#&quot; nameconflict=&quot;makeunique&quot; 
				result=&quot;result&quot; accept=&quot;application/zip&quot; filefield=&quot;zip&quot;&gt;
	
		&lt;cfif result.fileWasSaved&gt;
			&lt;cfset theFile = result.serverDirectory &amp; &quot;/&quot; &amp; result.serverFile&gt;
			
				&lt;!--- destination will be temp folder + uuid ---&gt;
				&lt;cfset tempFolder = getTempDirectory() &amp; &quot;/&quot; &amp; createUUID()&gt;
				&lt;cfdirectory action=&quot;create&quot; directory=&quot;#tempFolder#&quot;&gt;
	
				&lt;!--- unzip it ---&gt;
				&lt;cfzip action=&quot;unzip&quot; destination=&quot;#tempFolder#&quot; file=&quot;#theFile#&quot;&gt;
	
				&lt;!--- now go through, find images, resize and save in the right place ---&gt;
				
				&lt;!--- folder for our nice sized images, probably better as an Application var ---&gt;
				&lt;cfset imageDestination =  getDirectoryFromPath(getBaseTemplatePath()) &amp; &quot;/images&quot;&gt;
	
				&lt;!--- get all the images, well JPG and PNG. Docs are wrong about filter. Multiple work. ---&gt;			
				&lt;cfset files = directoryList(tempFolder, false, &quot;name&quot;, &quot;*.jpg|*.png&quot;)&gt;
				&lt;cfloop index=&quot;aFile&quot; array=&quot;#files#&quot;&gt;
					&lt;!--- Ok, for each one, read it, scale it, copy it ---&gt;
					&lt;cfset img = imageRead(tempFolder &amp; &quot;/&quot; &amp; aFile)&gt;
					&lt;cfset imageScaleToFit(img, 200, 200)&gt;
					&lt;cfset imageWrite(img, imageDestination &amp; &quot;/&quot; &amp; aFile, true)&gt;
				&lt;/cfloop&gt;
	
				&lt;cfset message = &quot;Success, you uploaded #arraylen(files)# images.&quot;&gt;

				&lt;!--- clean up ---&gt;
				&lt;cfset directoryDelete(tempFolder,true)&gt;

		&lt;/cfif&gt;
		
	&lt;cfcatch&gt;
		&lt;!---
		&lt;cfdump var=&quot;#cfcatch#&quot; label=&quot;cfcatch&quot;&gt;
		---&gt;
		&lt;!--- This could be done nicer. ---&gt;
		&lt;cfset message = cfcatch.detail&gt;
	&lt;/cfcatch&gt;
	&lt;/cftry&gt;
		  
&lt;/cfif&gt;

&lt;cfif structKeyExists(variables, &quot;message&quot;)&gt;
	&lt;p&gt;
		&lt;cfoutput&gt;#message#&lt;/cfoutput&gt;
	&lt;/p&gt;
&lt;/cfif&gt;

&lt;form method=&quot;post&quot; enctype=&quot;multipart/form-data&quot;&gt;
	Select a zip:
	&lt;input type=&quot;file&quot; name=&quot;zip&quot; accept=&quot;application/zip&quot; required&gt;&lt;br/&gt;
	&lt;input type=&quot;submit&quot; name=&quot;upload&quot; value=&quot;Upload&quot;&gt;
&lt;/form&gt;
</code></pre>

<p>
Whenever I build a simple self-posting form like this I start with the UI at the bottom and put the processing on top. Again - you would normally have the logic in a controller. Please remember that.
</p>

<p>
In our form, we've got a grand total of two items - the file upload and the submit button. Note that I make use of the accept attribute and required attribute for the input field. This provides simple validation for the form. It isn't enough, of course, but why bother writing JavaScript on top when at least some of my audience will get it for free (and more every day as they move to newer browsers)?
</p>

<p>
The processing logic is pretty direct. We begin by checking to see if you've uploaded a file - and then we process that upload with the cffile tag. Note the use of the temporary directory. Never - ever - upload to a web accessible folder.
</p>

<p>
Next we make a new temporary folder to store the extracted zip. We unzip it and then filter out on images (in my case, JPG and PNG, you could include GIF as well). We then loop over the images, load them as an image object, scale (the value there was arbitrary), and save.
</p>

<p>
That's it. Here's the result of a zip I tested.
</p>

<p>
<img src="https://static.raymondcamden.com/images/images.png" />
</p>

<p>
While this works, it does take a little bit of time. Image scaling can be an expensive operation on the server. If you want to get fancy, you can try simply threading the operations in the background:
</p>

<pre><code class="language-markup">&lt;cfset files = directoryList(tempFolder, false, &quot;name&quot;, &quot;*.jpg|*.png&quot;)&gt;
&lt;cfloop index=&quot;x&quot; from=&quot;1&quot; to=&quot;#arraylen(files)#&quot;&gt;
	&lt;cfset aFile = files[x]&gt;
	&lt;cfthread name=&quot;scaleImage#x#&quot; theFile=&quot;#aFile#&quot;&gt;
		&lt;!--- Ok, for each one, read it, scale it, copy it ---&gt;
		&lt;cfset img = imageRead(tempFolder &amp; &quot;/&quot; &amp; attributes.theFile)&gt;
		&lt;cfset imageScaleToFit(img, 200, 200)&gt;
		&lt;cfset imageWrite(img, imageDestination &amp; &quot;/&quot; &amp; attributes.theFile, true)&gt;
	&lt;/cfthread&gt;
&lt;/cfloop&gt;</code></pre>


<p>
This runs <i>significantly</i> faster, but could be made more reliable in terms of reporting. 
</p>

<p>
I've attached both CFMs as a zip to this blog entry. Happy Friday!
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive36%{% endraw %}2Ezip'>Download attached file.</a></p>