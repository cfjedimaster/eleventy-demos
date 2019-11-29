---
layout: post
title: "ColdFusion handling of Subversion events"
date: "2006-12-09T14:12:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2006/12/09/ColdFsion-handling-of-Subversion-events
guid: 1703
---

I consider myself a casual user of Subversion (SVN). So every now and then I get surprised by what you can do with it. One of the cooler features of SVN is <a href="http://svnbook.red-bean.com/nightly/en/svn.reposadmin.create.html#svn.reposadmin.create.hooks">hook scripts</a>. These are scripts that run based on SVN events, such as committing a file. As you can imagine this is a pretty powerful tool as it lets you have finer control and additional monitoring of your SVN repository.
<!--more-->
So naturally the first thing I thought this morning was - How can I get ColdFusion hooked up to this?

Hook scripts are text files stored in the repository. To start using them you simply create the file. SVN provides samples for each of the events. On a Windows machine (where I was), you need to use <i>actionname</i>.bat or .exe for your file name. I wanted to write something that would fire after a commit action, so I created a file named post-commit.bat. 

Now the question is - how do you run ColdFusion from a command prompt? Unfortunately there is no direct way of doing this. I took Ashwin's <a href="http://blogs.sanmathi.org/ashwin/2006/09/14/howto-call-cf-from-the-command-line/">suggestion</a> and downloaded Curl. Curl is a command line tool to download a URL. 

Each hook script has different parameters passed to it. The post-commit script is passed the repository URL and revision number. In a bat file you can use these attributes as {% raw %}%1 and %{% endraw %}2. Here is the bat file I used:

<code>
c:\progra~1\curl\curl.exe "http://127.0.0.1/testingzone/test.cfm?repos={% raw %}%1&rev=%{% endraw %}2"
</code>

So to recap - when I check a file into this repository, SVN will automatically fire off my bat file and pass in the repo URL and revision number. 

So what did my ColdFusion script do? I could have simply sent an email with the information I was passed (repository and revision), but that isn't very helpful. I used SVN's command line tool to grab more information about the revision. Using CFEXECUTE I ran this command:

<code>
svn log file:///#repository# -r #revision# -v --xml
</code>

The log command simply returns the information about the revision. The -r attribute sets the revision to examine. The -v attribute tells SVN to verbose. Finally, and this is the coolest part, the --xml tells SVN to return the result in XML. Once I had the XML I had everything I needed to send out an email with the information about the commit action.

Before I paste the full ColdFusion code I used - a few notes. First off - Rob Gonda has some very cool Subversion wrapper code in ColdFusion. I bug him about once a week to release it as a project on <a href="http://www.riaforge.org">RIAForge</a>. :) I point it out to make the point that the code I used could have been done simpler with his API. (I know this as I use it at RIAForge and it has been very simple to use.) Secondly - SVN can return even more information then just a list of files. I could have also shown the diff in the email as well. Don't think you are limited to what I showed. Enjoy. If you actually use this code, let me know!

<code>
&lt;cfparam name="url.repos" default=""&gt;
&lt;cfparam name="url.rev" default=""&gt;

&lt;cfif len(url.repos) and len(url.rev)&gt;

	&lt;cfset url.repos = trim(url.repos)&gt;
	
	&lt;cftry&gt;
	&lt;cfset svnexe = "c:\progra~1\subversion\bin\svn.exe"&gt;
	&lt;cfset svncommand="log file:///#url.repos# -r #url.rev# -v --xml"&gt;

	&lt;cfexecute name="#svnexe#" arguments="#svncommand#" variable="result" timeout="30" /&gt; 
	&lt;cfset resultXML = xmlparse(result)&gt;	

	&lt;cfset author = resultXML.log.logentry.author&gt;
	&lt;cfset msg = resultXML.log.logentry.msg&gt;

	&lt;cfset files = arrayNew(1)&gt;
	
	&lt;cfloop index="x" from="1" to="#arrayLen(resultXML.log.logentry.paths.path)#"&gt;
		&lt;cfset thefile = resultXML.log.logentry.paths.path[x].xmlText&gt;
		&lt;cfset arrayAppend(files, thefile)&gt;
	&lt;/cfloop&gt;
	
	&lt;cfmail to="ray@camdenfamil.com" from="svn@camdenfamily.com" subject="SVN Commit"&gt;
Repository:  #url.repos#
Revision:    #url.rev#
Message:
#msg#
		
Files:&lt;cfloop index="x" from="1" to="#arrayLen(files)#"&gt;
#files[x]#&lt;/cfloop&gt;
	&lt;/cfmail&gt;

	&lt;cfcatch&gt;
		&lt;cfmail to="ray@camdenfamil.com" from="svn@camdenfamily.com" subject="SVN HandlerError" type="html"&gt;
		&lt;cfif isDefined("result")&gt;
		result=#htmlcodeformat(result)#
		&lt;/cfif&gt;
		&lt;cfdump var="#cfcatch#"&gt;
		&lt;/cfmail&gt;		
	&lt;/cfcatch&gt;
	
	&lt;/cftry&gt;
	
&lt;/cfif&gt;
</code>