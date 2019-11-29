---
layout: post
title: "ColdFusion 8: Handling missing CFM files"
date: "2007-05-31T08:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/31/ColdFusion-8-Handling-missing-CFM-files
guid: 2076
---

One of the more interesting new features in ColdFusion 8 is an update to the Application.cfc file. You can now add a method called: onMissingTemplate. As you can imagine, it fires off when a request comes in for a CFM file that doesn't exist.
<!--more-->
Take a look at the basic method signature:

<code>
&lt;cffunction name="onMissingTemplate" returnType="boolean" output="false"&gt;
	&lt;cfargument name="targetpage" type="string" required="true"&gt;
	
	
&lt;/cffunction&gt;
</code>

As you can see - it has a boolean return type and one argument - the name of the page that had attempted to load. Here is a simple example:

<code>
&lt;cffunction name="onMissingTemplate" returnType="boolean" output="false"&gt;
	&lt;cfargument name="targetpage" type="string" required="true"&gt;
	
	&lt;!--- log it ---&gt;
	&lt;cflog file="missingfiles" text="#arguments.targetpage#"&gt;
	&lt;cflocation url="/apptest/404.cfm?f=#urlEncodedFormat(arguments.targetpage)#" addToken="false"&gt;
	
&lt;/cffunction&gt;
</code>

In this case, I log the file to a log named missingfiles. I then send the user to a page and pass along the file she tried to load. On 404.cfm, all I do is tell the user their file didn't exist and I direct them to the home page. You could handle this anyway you like of course. For example - why not just log it and then send the user to the home page? That is acceptable as well. Although personally I like to at least be told I tried to load a file that didn't exist.

It is certainly nice to have this added to ColdFusion, but there are a few caveats you need to be aware of. 

First - it is only going to fire off for CFM requests. So if you try to go to:

www.dharma.com/foo.cfm

And foo doesn't exist, it will fire. If you try to go to:

www.dhamra.com/foo.html

then your web server will handle it. The same applies for missing directories. Consider this example:

www.dhamra.com/secretfolder

This will <b>not</b> fire onMissingTemplate.

But you can handle a "deep" directory if the end of the request is a CFM file. This will work fine:

www.dhamra.com/2007/12/2/myarticle.cfm

Another thing to watch out for is that onMissingTemplate will not run onError. Therefore - simply write your code perfectly. (Ok, that is a joke.) You can wrap your code in try/catch to be extra careful. 

You also need to watch out for cases where you want to browse a directory. Maybe... What I mean by this is - according to the docs, if you don't want onMissingTemplate to fire in a folder where you want directory browsing, you have to use the new application variable: welcomeFileList. However, in my tests, this was not the case. 

And now for the last note - and this is the weird one. Inside of onMissingTemplate, you do have access to all the scopes you normally would. <b>However</b> - onApplicationStart and onSessionStart are not fired. So you cannot rely on the scopes to exist. You have to test for them. If you use the code like I did above where I simply send the user away, then it isn't a big deal. Once the user is sent to 404.cfm, her session will be created. But it is something to keep in mind.