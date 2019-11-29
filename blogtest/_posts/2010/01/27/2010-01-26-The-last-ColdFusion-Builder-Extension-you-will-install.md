---
layout: post
title: "The last ColdFusion Builder Extension you will install"
date: "2010-01-27T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/27/The-last-ColdFusion-Builder-Extension-you-will-install
guid: 3697
---

I have to begin by apologizing. ColdFusion Builder is - already - a pretty darn cool tool. While it still has warts (and to be fair, it is still in beta), it has been my day to day programming tool for a few months now. One of the cooler features of CFB is how easy it is to extend it with custom extensions. You can find a bunch on <a href="http://www.riaforge.org/index.cfm?event=page.category&id=14">RIAForge</a> now. Unfortunately for them, though, I'm releasing an extension today that makes all of them pointless. (Warning, the size of this SWF is rather large - I recorded it on a large screen.)
<!--more-->
<p>
<a href="http://s3.coldfusionjedi.com/thisiscrap.swf"><img src="https://static.raymondcamden.com/images/Screen shot 2010-01-27 at 8.21.52 AM.png" title="Click me for ridiculous-sized video" border="0" /></a>
<p>
Ok, so if you watched the video and returned, sorry to waste your time. I do have one redeeming point to this blog entry. You may have noticed that the file I was editing in the video was refreshed automatically. Extensions can do this, but there is a typo in the documentation. In order to refresh the file that was right clicked on, you can use the following code (taken from the 'fix bugs' extension):
<p>
<code>
&lt;cfsetting enablecfoutputonly="true" showdebugoutput="false"&gt;
&lt;cfparam name="ideeventinfo"&gt;
&lt;cfset data = xmlParse(ideeventinfo)&gt;
&lt;cfset myFile = data.event.ide.projectview.resource.xmlAttributes.path&gt;
&lt;cfset projectName = data.event.ide.projectview.xmlAttributes.projectname&gt;

&lt;cffile action="read" file="#myfile#" variable="code"&gt;
&lt;cfset code = "&lt;cftry&gt;#code#&lt;cfcatch&gt;&lt;/cfcatch&gt;&lt;/cftry&gt;"&gt;
&lt;cffile action="write" file="#myfile#" output="#code#"&gt;

&lt;cfsavecontent variable="res"&gt;
&lt;cfoutput&gt;
&lt;response&gt;
&lt;ide&gt;
&lt;commands&gt; 
&lt;command type="refreshfile"&gt;
&lt;params&gt;
&lt;param key="filename" value="#myfile#" /&gt;
&lt;param key="projectname" value="#projectname#" /&gt;
&lt;/params&gt; 
&lt;/command&gt;
&lt;/commands&gt;
&lt;/ide&gt;
&lt;/response&gt;
&lt;/cfoutput&gt;
&lt;/cfsavecontent&gt;

&lt;cfheader name="Content-Type" value="text/xml"&gt;&lt;cfoutput&gt;#res#&lt;/cfoutput&gt;
</code>

<p>
Specifically, I believe the docs say to use <command <b>name</b>="refreshfile">, while what you really want is <b>type</b> instead. I've included the complete extension as an attachment to this entry.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FCode%{% endraw %}20Assistant%2Ezip'>Download attached file.</a></p>