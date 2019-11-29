---
layout: post
title: "Bug to watch out for with CFFEED"
date: "2007-08-13T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/13/Bug-to-watch-out-for-with-CFFEED
guid: 2276
---

So I've blogged before about how xmlFormat() is a bit buggy. While it will remove most characters, including "high ascii" characters in the range of 128-255, it will gleefully ignore other high ascii characters, for example, character 8220 which is the funky Microsoft Word quote. Unfortunately it looks like the same code used for xmlFormat is used to escape text when you create feeds with CFFEED. Consider the following example:

<code>
&lt;cfset getEntries = queryNew("publisheddate,content,title")&gt;

&lt;cfset queryAddRow(getEntries)&gt;
&lt;cfset querySetCell(getEntries,"title", "LAST ENTRY")&gt;
&lt;cfset querySetCell(getEntries,"content", "&lt;b&gt;Test&lt;/b&gt;")&gt;
&lt;cfset querySetCell(getEntries,"publisheddate", now())&gt;

&lt;cfset queryAddRow(getEntries)&gt;
&lt;cfset querySetCell(getEntries,"title", "LAST ENTRY2")&gt;
&lt;cfset querySetCell(getEntries,"content", "#chr(8220)#Test#chr(8220)#")&gt;
&lt;cfset querySetCell(getEntries,"publisheddate", now())&gt;

&lt;cfset props = {% raw %}{version="rss_2.0",title="Test Feed",link="http://127.0.0.1",description="Test"}{% endraw %}&gt;



&lt;cffeed action="create" properties="#props#" query="#getEntries#" xmlVar="result"&gt;

&lt;cfcontent type="text/xml" reset="true"&gt;&lt;cfoutput&gt;#result#&lt;/cfoutput&gt;
</code>

The first entry will correctly show up in Firefox, but the second will not, and if you view source, you see the B tags are properly escaped, but the funky MS Word character is not. Now obviously I can make sure to "clean" my data before it gets used in the feed, but I wasn't aware this was an even an issue until a friend reported that the feed at <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a> suddenly turned up empty. For now I've switched to the solution below - which is <b>not</b> a good solution, but I needed a quick fix.

<code>
&lt;!--- clean up bad stuff ---&gt;
&lt;cfloop query="items"&gt;
	&lt;cfset fixedcontent = replaceList(content, "#chr(25)#,#chr(212)#,#chr(248)#,#chr(937)#,#chr(8211)#", "")&gt;
	&lt;cfset fixedcontent = replaceList(fixedcontent,chr(8216) & "," & chr(8217) & "," & chr(8220) & "," & chr(8221) & "," & chr(8212) & "," & chr(8213) & "," & chr(8230),"',',"","",--,--,...")&gt;	
	&lt;cfset querySetCell(items, "content", fixedcontent, currentRow)&gt;
&lt;/cfloop&gt;

&lt;cffeed action="create" properties="#props#" columnMap="#cmap#" query="#items#" xmlVar="result"&gt;
</code>