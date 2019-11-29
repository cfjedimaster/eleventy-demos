---
layout: post
title: "ColdFusion 9 Multifile Uploader - Complete Example"
date: "2010-03-05T13:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/05/ColdFusion-9-Multifile-Uploader-Complete-Example
guid: 3740
---

I've done a few blog entries on ColdFusion 9's new multi file uploader. But for a while now I've wanted to build, and share, a complete example. As I've said before, putting a multi file uploader on your page is simple. Incredibly simple. Unfortunately, <i>using</i> the uploader is non-trivial. You've got multiple things going on at once that you have to manage. It is doable (I wrote up this demo in approximately 30 minutes), but you certainly need to do your planning ahead of time. So what will my little application do?
<!--more-->
<p/>

My application is a portfolio submission form. You can imagine a budding young artist bucking for a job at a top creative agency in the thrilling burg of Lafayette, LA. (It's thrilling - honest.) In order to apply for a job, s/he has to submit both biographical information as well as examples of their work. The application will take the user's information and their files and email it to the creative director. Right off the bat there you can see that we're going to need a form that mixes both traditional fields and the fancy new awesomeness of the multi file uploader. 

<p/>

I began by creating a simple form asking for 3 bits of biographical information:

<p/>

<code>
&lt;form action="portfoliosubmission.cfm" method="post"&gt;
Your Name: &lt;input type="text" name="name" value="#form.name#"&gt;&lt;br/&gt;
Your Email: &lt;input type="text" name="email" value="#form.email#"&gt;&lt;br/&gt;
Your Bio:&lt;br/&gt;
&lt;textarea name="bio"&gt;#form.bio#&lt;/textarea&gt;&lt;br/&gt;
</code>

<p/>

Notice that I'm using predefined form values for the three fields. They were set with a cfparam on the top of my template. (The entire code base is available via the download link below.) Next I added my multi file uploader:

<p/>

<code>
&lt;cffileupload extensionfilter="jpg,jpeg,gif,png,bmp,tiff" name="portfoliofiles" maxfileselect="5" title="Portfolio Images" url="fileupload.cfm?#urlEncodedFormat(session.urltoken)#"&gt;
</code>

<p/>

I want you to notice a few things here. First, both the extensionfilter and maxfileselect are totally arbitrary. I used image file extensions because this is meant for a design job submission. I picked 5 because I have 5 fingers on one hand. The URL points to a separate CFM. That CFM will handle processing the uploads. <b>Notice:</b> Due to a bug in how the control is created, you must add the current Session URL token to the URL. If you do not, the upload request will be done with a new session. 

<p/>

Ok, so we've got a basic form. What's going to happen when the user actually picks some files to upload?  Well since we are going to be emailing these files, we don't need to keep them around forever. I think using the new Virtual File System would be an excellent place to store those files. I added the following code to my onApplicationStart method of my Application.cfc:

<p/>

<code>
&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
	&lt;cfset application.portfolioUploadRoot = "ram:///portfoliouploads"&gt;
	&lt;cfif not directoryExists(application.portfolioUploadRoot)&gt;
		&lt;cfdirectory action="create" directory="#application.portfolioUploadRoot#"&gt;
	&lt;/cfif&gt;
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

As you can see, I've got an application variable that points to a path on the VFS. I then see if that directory exists and if not, I create it. Most likely it will <i>never</i> exist when the application starts, but I tend to rerun onApplicationStart manually during testing, and frankly, it doesn't hurt to be anal.

<p/>

So now we have a root folder for our uploads, but obviously we may have more than one person using the form at once. I next created an onSessionStart that would make a unique subdirectory just for one person.

<p/>

<code>
&lt;cffunction name="onSessionStart" returnType="void" output="false"&gt;
	
	&lt;cfset session.myuploadroot = application.portfolioUploadRoot & "/" & replace(createUUID(), "-", "_", "all")&gt;
	&lt;cfif not directoryExists(session.myuploadroot)&gt;
		&lt;cfdirectory action="create" directory="#session.myuploadroot#"&gt;
	&lt;/cfif&gt;
		
&lt;/cffunction&gt;
</code>

<p/>

This method creates a new subdirectory using the Application's root folder and a new UUID. Like before, this folder will not exist, but I couldn't help going the extra step and wrapping it with a directoryExists().

<p/>

So at this point, we have a safe storage place for the files. One that is unique per user. If we look at fileupload.cfm, we can see that it is rather trivial:

<p/>

<code>
&lt;cfif structKeyExists(form, "filedata")&gt;
	&lt;cffile action="upload" filefield="filedata" destination="#session.myuploadroot#" nameconflict="overwrite" result="result"&gt;
	&lt;!--- optional post processing ---&gt;
&lt;/cfif&gt;

&lt;cfset str.STATUS = 200&gt;
&lt;cfset str.MESSAGE = "passed"&gt;
&lt;cfoutput&gt;#serializeJSON(str)#&lt;/cfoutput&gt; 
</code>

<p/>

Two things to note here. I'm not doing any post-processing of the files. You may want to. In my case, I'm just going to leave them be. You should <b>not</b> trust that the user sent image files even with the extension filter. That being said, I'm not storing the files or executing them. I'm just emailing them. Secondly, and this is <b>critical</b> and <b>not documented</b> - be sure to output JSON with a 200 status. Big thanks to Brian Rinaldi and his <a href="http://www.remotesynthesis.com/post.cfm/multi-file-uploads-with-coldfusion-9-in-5-lines">blog post</a> on the topic. If you don't have this, one file upload will work but the multi file uploader won't continue on to the next file.

<p/>

Alright, so we've got the file uploads working, now let's circle back and look at how my form validates. I'm doing everything client side for simplicity's sake:

<p/>

<code>
&lt;cfif structKeyExists(form, "submit")&gt;

	&lt;cfset form.name = trim(htmlEditFormat(form.name))&gt;
	&lt;cfset form.email = trim(htmlEditFormat(form.email))&gt;
	&lt;cfset form.bio = trim(htmlEditFormat(form.bio))&gt;
	
	&lt;cfset errors = []&gt;
	&lt;cfif not len(form.name)&gt;
		&lt;cfset arrayAppend(errors, "You must include your name.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.email) or not isValid("email", form.email)&gt;
		&lt;cfset arrayAppend(errors, "You must include a valid email address.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.bio)&gt;
		&lt;cfset arrayAppend(errors, "You must include your bio.")&gt;
	&lt;/cfif&gt;
	&lt;cfdirectory action="list" name="myuploads" directory="#session.myuploadroot#"&gt;
	&lt;cfif myuploads.recordCount is 0&gt;
		&lt;cfset arrayAppend(errors, "You must upload at least one file.")&gt;
	&lt;/cfif&gt;

	&lt;cfif arrayLen(errors) is 0&gt;
		&lt;cfmail to="someone@myorg.org" from="#form.email#" subject="Portfolio Submission"&gt;
From: #form.name# (#form.email#)
Bio:
#form.bio#

			&lt;cfloop query="myuploads"&gt;
				&lt;cfmailparam file="#session.myuploadroot#/#name#"&gt;
			&lt;/cfloop&gt;
		&lt;/cfmail&gt;
		&lt;cfset showForm = false&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;
</code>

<p/>

So I begin by doing real simple validation on the 3 text fields. None of that should be new. But then check out how I validate if the user uploaded anything. I simply do a directory list on their personal storage. If it is empty, it means they didn't upload any files. Finally, if there are no errors, I send the email out. Notice how I use that previous query to create my list of attachments. I use both the errors and the directory list back on the bottom of the form when it is redisplayed:

<p/>

<code>
&lt;cfif structKeyExists(variables, "myuploads") and myuploads.recordCount&gt;
&lt;p&gt;
You have uploaded the following files already: #valueList(myuploads.name)#.
&lt;/p&gt;
&lt;/cfif&gt;
	
&lt;cfif structKeyExists(variables, "errors")&gt;
&lt;p&gt;
&lt;b&gt;Please correct the following error(s):&lt;/b&gt;
&lt;ul&gt;
&lt;cfloop index="e" array="#errors#"&gt;
&lt;li&gt;#e#&lt;/li&gt;
&lt;/cfloop&gt;
&lt;/ul&gt;
&lt;/p&gt;
&lt;/cfif&gt;
</code>

<p/>

Now it's time for the final part of the puzzle - clean up. Remember that a user may upload files and never actually hit submit on the form itself. I use both onApplicationEnd and onSessionEnd to remove the  files from the VFS:

<p/>

<code>
&lt;cffunction name="onApplicationEnd" returnType="void" output="false"&gt;
	&lt;cfargument name="applicationScope" required="true"&gt;
	&lt;cfif directoryExists(arguments.applicationScope.portfolioUploadRoot)&gt;
		&lt;cfdirectory action="delete" recurse="true" directory="#arguments.applicationScope.portfolioUploadRoot#"&gt;
	&lt;/cfif&gt;		
&lt;/cffunction&gt;

&lt;cffunction name="onSessionEnd" returnType="void" output="false"&gt;
	&lt;cfargument name="sessionScope" type="struct" required="true"&gt;
	&lt;cfargument name="appScope" type="struct" required="false"&gt;
		
	&lt;cfif directoryExists(arguments.sessionScope.myuploadroot)&gt;
		&lt;cfdirectory action="delete" recurse="true" directory="#arguments.sessionScope.myuploadroot#"&gt;
	&lt;/cfif&gt;
		
&lt;/cffunction&gt;
</code>

<p/>

For the most part none of that code should be new to you, but do notice how you never directly access the Session or Application scope within these methods. They are always passed by reference instead. 

<p/>

So that's it. There are a few things that could be done to make it fancier of course, but hopefully this gives you a <b>complete</b> example of what it means to add a multi file uploader to your form. Questions and comments are definitely welcome.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fportfoliosubmission%{% endraw %}2Ezip'>Download attached file.</a></p>