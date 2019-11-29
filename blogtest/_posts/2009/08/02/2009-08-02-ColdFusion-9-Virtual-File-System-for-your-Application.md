---
layout: post
title: "ColdFusion 9 Virtual File System for your Application"
date: "2009-08-02T11:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/02/ColdFusion-9-Virtual-File-System-for-your-Application
guid: 3470
---

One of the cooler new features of ColdFusion 9 is the Virtual File System (VFS). I've blogged on it before and also authored a <a href="http://labs.adobe.com/technologies/coldfusion9/videos/rcamden_03/">quick video</a> on it as well. One thing that I kind of <i>don't</i> like though is the fact that the VFS is system wide, not application specific. I guess that kind of makes sense - the file system is system wide as well, but with the VFS being RAM based, it seems like it would have been cooler if it was tied to an application, not the entire server. 

For example, let's say I want to use the VFS in BlogCFC 7 (coming soon, I promise!). Since BlogCFC can be installed any number of times on one machine, I wouldn't be able to use a static VFS root like ram:///blogcfc. If I did, one BlogCFC install would overwrite the data of another BlogCFC install. I thought I'd whip up some simple code demonstrating one way to get around this.
<!--more-->
Let me begin with the Application.cfc file for our sample application. First up - the constructor area:

<code>
&lt;cfset this.name = "myvfs"&gt;

&lt;cfset variables.myroot = hash(getDirectoryFromPath(getCurrentTemplatePath()))&gt;
&lt;cfset variables.rootpath = "ram:///" & myroot & "/"&gt;
&lt;cfset this.mappings["/myvfs"] = variables..rootpath&gt;
</code>

The application name (myvfs) isn't really important here - it can be set to anything. The myroot value though is critical. I needed a unique value for my VFS storage area. I get this by creating a hash from the current template path. I use code like this in BlogCFC when naming the application. The end result is a hashed string based on the file path. This hash will be unique across the server. From that hash, I create a variable, rootpath, that points to the VFS. Lastly I create a mapping as well. (The reason why will become apparent a bit later.)

Now let's take a look at the onApplicationStart method:

<code>
&lt;cffunction name="onApplicationStart" access="public" returnType="boolean" output="false"&gt;
	&lt;!--- copy it so our code can use it ---&gt;
	&lt;cfset application.rootpath = variables.rootpath&gt;
	&lt;cfif not directoryExists(application.rootpath)&gt;
		&lt;cfdirectory action="create" directory="#application.rootpath#"&gt;
	&lt;/cfif&gt;
		
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

First note that I create an application scoped copy of the rootpath value. This will let my application files easily use the same root directory. If the directory does not exist (it shouldn't!) then I create it. By the way - wondering why I didn't make a script based CFC? A reader commented on one of my other posts that the script based CFCs were a bit confusing. I'm trying to simplify my ColdFusion 9 posts so you will see more tag based CFCs. I won't always use them - I really do prefer script based CFCs, but I'd like to ensure folks can focus on learning one thing at a time. It's how I learn best as well. Also, one of the areas where cfscript fails is in directory operations. You can check for the existence of a directory, but you can't add, edit, or delete directories. I've logged a ER for this and I'm sure it will be fixed for final.

Ok, now for the first test. Here is the index.cfm file I created:

<code>

&lt;!--- testing simple file storage ... ---&gt;
&lt;cfset logfile = application.rootpath & "log.txt"&gt;
&lt;cffile action="append" file="#logfile#" output="Ran at #now()#"&gt;

&lt;cfset contents = fileRead(logfile)&gt;
&lt;p/&gt;
&lt;form&gt;
&lt;textarea cols="50" rows="10"&gt;&lt;cfoutput&gt;#contents#&lt;/cfoutput&gt;&lt;/textarea&gt;
&lt;/form&gt;
</code>

I create a pathname based on the application.rootpath values. I then simply append to it. I load it up in a textarea so I can also see the results. After a few runs, I see this:

<img src="https://static.raymondcamden.com/images/Picture 177.png" />

So that demonstrates simple file reading and writing, but what about an example using cfinclude? As you know, cfinclude can't use a real path. It has to use a relative path or mapping. Remember when we created the mapping? Now we can make use of it:

<code>
&lt;!--- testing for cfinclude ... ---&gt;
&lt;cfset testfile = application.rootpath & "test.cfm"&gt;
&lt;cfset code = "&lt;cfset x = randRange(1,100)&gt;&lt;cfoutput&gt;##x##&lt;/cfoutput&gt;"&gt;

&lt;cffile action="write" file="#testfile#" output="#code#"&gt;

&lt;h2&gt;Testing the include...&lt;/h2&gt;
&lt;cfinclude template="/myvfs/test.cfm"&gt;

&lt;cfset contents = fileRead(testfile)&gt;
&lt;p/&gt;
&lt;form&gt;
&lt;textarea cols="50" rows="10"&gt;&lt;cfoutput&gt;#contents#&lt;/cfoutput&gt;&lt;/textarea&gt;
&lt;/form&gt;
</code>

In this example, my virtual file is named test.cfm. It contains CFML code to generate and output a random number from 1 to a 100. The cfinclude tag includes it and executes the CFML I generated. I kept the textarea in so you can see the code saved to the VFS:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 251.png" />

Woot! Works like a charm, right? I built a super simple VFS dumper and put it in the root of my CF9 install. The code just uses cfdirectory and a dump:

<code>
&lt;cfdirectory directory="ram://" name="files" recurse="true"&gt;

&lt;cfdump var="#files#" hide="attributes,mode"&gt;
</code>

I verified that my demo site was storing it's files within it's own folder:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 334.png" />

Ok, so now for the final step. Since the VFS is not application based, what's going to happen when my application times out? Nothing! It would be nice if the application cleaned up after itself, right? Check out this simple solution:

<code>
&lt;cffunction name="onApplicationEnd" access="public" returnType="void" output="false"&gt;
	&lt;cfargument name="appScope" type="any" required="true"&gt;
	&lt;cfdirectory action="delete" directory="#arguments.appScope.rootpath#" recurse="true"&gt;
&lt;/cffunction&gt;
</code>

Since the cfdirectory tag allows for recursive deletes, I just need one tag to clean up the entire folder. So my code could make use of multiple files and folders under the rootpath values and they will all be cleaned up with the application times out. 

I've included a zip of the demo folder. Let me know how it works out. By the way - if I get time, I'm going to whip up a quick CF Admin Extension that includes a simple VFS 'explorer' to let you browse, view, manage the VFS from your Administrator.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fmyvfs%{% endraw %}2D2%2Ezip'>Download attached file.</a></p>