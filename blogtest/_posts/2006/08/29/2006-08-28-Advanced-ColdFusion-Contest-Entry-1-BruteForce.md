---
layout: post
title: "Advanced ColdFusion Contest Entry 2: BruteForce"
date: "2006-08-29T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/29/Advanced-ColdFusion-Contest-Entry-1-BruteForce
guid: 1502
---

Welcome to the second entry review for my <a href="http://ray.camdenfamily.com/index.cfm/2006/6/11/Advanced-ColdFusion-Contest-Announced">Advanced ColdFusion</a> contest. This entry is from Bastian Konetzny.

<h2>Presenting BruteForce Code Analyzer</h2>

<a href="http://ray.camdenfamily.com/images/contestshots/bruteforce/bruteforce1.jpg"><img src="http://ray.camdenfamily.com/images/contestshots/bruteforce/bruteforce1_small.jpg" border="0" align="left" hspace="5"></a>

"BruteForce". I like that. First we have <a href="http://ray.camdenfamily.com/index.cfm/2006/8/11/Advanced-ColdFusion-Contest-Entry-1-CodeCop">CodeCop</a>, and now BruteForce. I'm waiting for the entry named "HunterKiller." 

First off, I had some issues installing this application. It didn't like my version of the MySQL (the primary DB it was tested on) database driver. Bastian sent me: 3.0.17-ga and that made things work a bit nicer. I'd recommend using that version, or trying to get it to run under SQL Server. (Bastian thinks it will work fine with other database types.)  Once you get it installed under your administrator, don't forget to edit the extensionscustom.cfm file in the root of your ColdFusion Administrator. This was missed in his documentation. 

Once this is done, you can run the application by going to your ColdFusion Administrator and opening up the Custom Extensions node and then clicking BruteForce. The application is smart enough to detect a new installation. It detected my datasources and asked which one to use. It also offered to make the mapping for me. This is all done via the new ColdFusion Administrator API. (Are you using this yet? Check the documentation in your ColdFusion MX7 server for more information. But obviously you can see the power of it here.)
<!--more-->
After you get past the initial setup screen, you can configure your report. The options are as you would expect, a title, a directory, whether or not to recurse. Interestingly the default title includes a ColdFusion variable:

<code>
Report Title (#timestamp#)
</code>

I assume this means we can use some default variables in our titles, but this is not documented anywhere yet. You can specify filters for both including and excluding certain files. I like the options there. You can also apply filters to directories. Last you specify the rules and rule collections you want to use for your report. (More on that later.) Note to Bastian - add a "Select All" type checkbox. 

<br clear="left">
<a href="http://ray.camdenfamily.com/images/contestshots/bruteforce/bruteforce2.jpg"><img src="http://ray.camdenfamily.com/images/contestshots/bruteforce/bruteforce2_small.jpg" border="0" align="left" hspace="5"></a>

At this point you can then run the report or save it as a profile. The output is very nicely formatted and is pretty clear I think. One cool thing is that he includes the ability to do debug messages. This is handy for ensuring you are parsing the files you think you should be. I have to admit I love how he got the print format working. He used an iframe to embed the PDF. Not only that, but his PDF is very nicely done as well. While I love cfdocument, I can never get it to look very nice, and he somehow got it done. (Bastian, I may be "innovating" some of this for my own reports.) To see an example of the PDF output, click <a href="http://ray.camdenfamily.com/images/contestshots/bruteforce/12.pdf">here</a>.

Now let's talk about his rules. He has two types of rules - a simple rule and a rule collection. Unfortunately, he <i>really</i> needs to add some documentation to this project to ensure it's success. Some of what I say here may be wrong, so hopefully Bastian will correct me. Simple rules extend a core rule he created.  Here is a simple rule for finding and noticing parameterExists.

<br clear="left">

<code>
&lt;cfcomponent name="base rule component" extends="bruteforce.rules.__base.base"&gt;

	&lt;cffunction name="setInfo" returntype="void" output="false" access="private" hint="I set the rule info"&gt;
		&lt;cfscript&gt;
			variables.stInfo.name = 'ParameterExists (CFC)';
			variables.stInfo.description = 'Check for usage of ParameterExists()';
			variables.stInfo.category = 'Function Check';
			variables.stInfo.version = '0.1 beta';
			variables.stInfo.author = 'bkonetzny@gmail.com';
		&lt;/cfscript&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="performRule" returntype="void" output="false" access="private" hint="I perform the rule"&gt;

		&lt;cfset var bDone = 0&gt;
		&lt;cfset var iStart = 0&gt;
		&lt;cfset var stSearchResult = ''&gt;

		&lt;cfloop condition="bDone NEQ 1"&gt;
			&lt;cfif refindnocase("ParameterExists\(",variables.stRuntime.content,iStart)&gt;
				&lt;cfset stSearchResult = refindnocase("ParameterExists\(",variables.stRuntime.content,iStart,true)&gt;
				&lt;cfset stSearchResult.message = "The ParameterExists function is deprecated. You should replace ParameterExists function calls with IsDefined function calls."&gt;
				&lt;cfset iStart = stSearchResult.pos[1] + stSearchResult.len[1]&gt;
				&lt;cfset addResult('warning',stSearchResult.message,stSearchResult.pos[1])&gt;
				&lt;cfset addResult('debug','testvalue')&gt;
			&lt;cfelse&gt;
				&lt;cfset bDone = 1&gt;
			&lt;/cfif&gt;
		&lt;/cfloop&gt;

		&lt;cfset ruleDone()&gt;
	&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

The setInfo method appears to be what is used for metadata for the rule. I like how he included versioning and author information in the rule. That could be handy for working with rules from multiple sources. This metadata is also used in the rules display in BruteForce.

The performRule method seems to be the main logic for the rule. I'm a bit unsure as to how he uses them though. The method uses a variables.stRuntime.content variable. I'm not sure where this comes from. Again - he needs to document this to help make it clear. 

As far as I can see - a rule collection is simply a collection of rules in one CFC. Again, there seems to be an API for how to set this up, but without really knowing the API I'm kind of guessing. I probably wouldn't use this feature very much. I prefer the atomic rules myself. Now if a rule collection could point to the rule CFCs, that could be useful. 

By modifying the code above, I was able to quickly add an Evalute() checker, and lo and behold, I found 2 instances in Bastian's BruteForce. Tsk Tsk!

Something else I'd like to see in this product. His rules can display debug, information, and warning messages. I can see managers wanting to have debug or maybe even information messages filtered out. I'd suggest Bastian add a filter to his report editor. 

One of the cooler rules in this product is the TODO checker. It looks for TODO comments. I actually found some I had completely forgotten about in BlogCFC. 

Lastly, the application can make use of <a href="http://code.google.com/p/cfconcurrency/">Concurrency</a> from Sean Corfield. On a personal level - I love seeing open source projects using other open source projects. Along with Concurrency he uses the Fusebox 5 framework. I've never been a fan of Fusebox, but it seems to work fine here. Note - if you plan on enabling Concurrency, be sure to read the README file for setup instructions. 

In summary, I think this is a pretty good entry, but it really needs to explain the API so it is more clear how rules are written. The output is very darn good and I like the use of other open source projects within it. To see the project yourself, please download it via the link below.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fbruteforce%{% endraw %}2Ezip'>Download attached file.</a></p>