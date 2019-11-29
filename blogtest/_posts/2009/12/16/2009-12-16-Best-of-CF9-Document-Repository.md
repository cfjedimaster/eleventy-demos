---
layout: post
title: "Best of CF9: Document Repository"
date: "2009-12-16T13:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/16/Best-of-CF9-Document-Repository
guid: 3652
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" align="left" style="margin-right:5px;margin-bottom:5px"/> Today's Best of ColdFusion 9 is Document Repository by Nathan Strutz. As you can guess by the title, the application handles document uploads. It has a simple security system with user registration. Once logged in, you can upload a document to the repository. Nathan's code will create a thumbnail, store a record in the database, and add the document to your list. Functionality wise it's only partially there right now, but there are some pretty darn interesting things in the code and it's a great start. Let's take a look.
<!--more-->
First and foremost, I want to give Nathan <b>huge</b> brownie points for creating an installer. 

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 64.png" />

And actually - not only did he create an installer, he created an <i>uninstaller</i> as well. His application handles setting up the DSN as well as creating a collection. I know that within all my open source applications, the lack of an installer is a real glaring omission. More applications should do this. Oh, and his installer is pretty smart too. On a whim I tested running the installer again, and it correctly saw that things were setup already. If you look at one thing from this application, make sure it's the installer code. Surprisingly he put this within a CFC in his model. Normally I'd have this as a separate script. (By "normally" I mean if I ever got off my lazy butt and did an installer.) This seemed odd to me at first glance but I can see some logic behind this. It <i>is</i> application specific even if run only once. 

After setting the application up, you are presented with the main UI. The design of this application is very well done. Maybe it's that I'm getting older, but I love designs that make use of large text. It just makes things easier to read, more immediate, and overall just more bold. Again though - I'm slowly becoming an old fuddy duddy so it may just be my eyes. Registration (and login) is done with the cfwindow tag. After you register you can immediately begin uploading files:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 76.png" />

Nathan recommends testing with images and said Word documents work as well. I was able to get PDF working, but a SWF file threw an error. I uploaded a few documents and noticed a bug with the thumbnail. It seemed to only use the thumbnail graphic for the first file uploaded. 

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 82.png" />

But outside of that bug, it worked as expected. There is no way currently to edit documents, but you can download them and see a bit of meta information about the document. These features could be added quickly enough. 

The admin is - unfortunately - all simply mocked out - but again - I love the "fat" UI here. It is incredibly simple and direct.

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 92.png" />

So let's talk a bit about the code. I'm happy to see this is another example of <a href="http://fw1.riaforge.org">Framework One</a>, the new framework by Sean Corfield I blogged about earlier. I actually plan on blogging on it more once I get past the contest. 

In terms of components, his code is 100% script based. For folks curious what a 'full on' script based model CF9 application looks like, this is a good example. I can say that after using scripts for my CFCs in my Picard project, it definitely speeds up development. A cool aspect to his code is that he wrote a nice script wrapper for tags not yet supported in cfscript. The only non-script based CFC is SimulatedCFTags.cfc. I've pasted the complete code below:

<code>
&lt;cfcomponent output="false"&gt;

	&lt;cffunction name="simulateCFCollection"&gt;&lt;cfcollection attributecollection="#arguments#" name="local.value"/&gt;&lt;cfif structKeyExists(local,"value")&gt;&lt;cfreturn local.value/&gt;&lt;/cfif&gt;&lt;/cffunction&gt;
	&lt;cffunction name="simulateCFIndex"&gt;&lt;cfindex attributecollection="#arguments#"/&gt;&lt;/cffunction&gt;
	&lt;cffunction name="simulateCFSearch"&gt;&lt;cfsearch attributecollection="#arguments#" name="local.value"/&gt;&lt;cfreturn local.value/&gt;&lt;/cffunction&gt;

	&lt;cffunction name="simulateCFFile"&gt;&lt;cffile attributecollection="#arguments#" result="local.value" /&gt;&lt;cfreturn local.value/&gt;&lt;/cffunction&gt;

	&lt;cffunction name="simulateCFDocument"&gt;&lt;cfdocument attributecollection="#arguments#"/&gt;&lt;cfif structKeyExists(local,"value")&gt;&lt;cfreturn local.value/&gt;&lt;/cfif&gt;&lt;/cffunction&gt;
	&lt;cffunction name="simulateCFPDF"&gt;&lt;cfpdf attributecollection="#arguments#"/&gt;&lt;cfif structKeyExists(local,"value")&gt;&lt;cfreturn local.value/&gt;&lt;/cfif&gt;&lt;/cffunction&gt;
	&lt;cffunction name="simulateCFSpreadsheet"&gt;&lt;cfspreadsheet attributecollection="#arguments#"/&gt;&lt;cfif structKeyExists(local,"value")&gt;&lt;cfreturn local.value/&gt;&lt;/cfif&gt;&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

As you can guess, this lets him use features that aren't supported yet in script. I was going to object to his use of "simualte*" for the names, but it's actually a really good idea. If ColdFusion 10 adds support for these functions he simulated, he won't have to worry about any kind of name collision. 

Here is one sample call just to give you an idea:

<code>			variables.beanFactory.getBean("CFTags").simulateCFCollection(action="delete", engine="solr", collection=variables.beanFactory.getBean("config").get("collectionName"));
</code>

Pretty nifty I think. 

Random note - just found this comment:

<code>
will throw a gray error if there's a problem
</code>

Not sure what a "gray error" is but I thought that was kind of funny.

The next thing I'd like to point out is his use of dynamic file processors. If you look at UploadedItem.cfc, you can see this bit of code:

<code>
return beanFactory.getBean("itemProcessor_" & getItemType());
</code>

This returns a dynamic CFC based on the file type of what you upload. If you look at the itemprocessors folder you can see what is supported and how to add support for additional file types. 

So a few small nits. I had issue with the cfclocation argument in his Application.cfc. His code uses:

<code>
cfclocation = getDirectoryFromPath( getCurrentTemplatePath() ) & "com/dopefly/documentrepository/"
</code>

Which didn't work for me. It appears as if it needs to be relative only. I modified my code to:

<code>
cfclocation = "com/dopefly/documentrepository/"
</code>

Secondly - and this is a real small thing. When downloading documents, the filename ended up being index.cfm.jpeg. Don't forget that you can set a filename for stuff you push to the user via cfcontent. Actually - I just double checked the code. He does supply a filename like so:

<code>
&lt;cfheader name="content-disposition" value='attachment; filename="#local.rc.file.getOriginalFileName()#' /&gt;
&lt;cfcontent file="#local.rc.repo & local.rc.file.getFileName()#" type="application/unknown"&gt;
</code>

So maybe it simply isn't working in Chrome. I can say that the code I've used in the past uses inline, not attachment:

<code>
&lt;cfheader name="Content-Disposition" value="inline; filename=cookbook.pdf"&gt;
&lt;cfcontent type="application/pdf" reset="true" variable="#result#"&gt;
</code>

Anyway, you get the idea. So - in summary. Very nice beginning to a document repository. It's got an excellent UI already and if it just gets feature complete, it could be a great open source application! Download, play, and comment!<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FCF9DocRepo%{% endraw %}5FBuild%2Ezip'>Download attached file.</a></p>