---
layout: post
title: "Mimicking fixNewLine in ColdFusion Script"
date: "2014-02-10T11:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/02/10/Mimicking-fixNewLine-in-ColdFusion-Script
guid: 5149
---

<p>
A few days ago a reader asked me if there was a way to mimic the "fixNewLine" attribute in ColdFusion script. I thought he meant addNewLine, the feature that handles adding a new line character for you when you write text to a file. Turns out this is a feature I've never even heard of. From the <a href="https://wikidocs.adobe.com/wiki/pages/viewpage.action?pageId=87505539">docs</a>:
</p>
<!--more-->
<blockquote>
fixNewLine: yes: changes embedded line-ending characters in string variables to operating-system specific line endings.<br/><br/>
no: does not change embedded line-ending characters in string variables.
</blockquote>

<p>
I checked and there is not a way to do this via fileWrite or FileWriteLine. I whipped up the following little function that should have the same behavior.
</p>


<pre><code class="language-javascript">function fixNewLine(s) {
	var isWindows = server.os.name contains "windows";
	// http://stackoverflow.com/a/6374360/52160
	if(isWindows) {
		return rereplace(s, "\r\n{% raw %}|\n|{% endraw %}\r","#chr(13)##chr(10)#", "all");
	} else {
		return rereplace(s, "\r\n{% raw %}|\n|{% endraw %}\r","#chr(10)#", "all");
	}
}
</code></pre>

<p>
The code is based on a StackOverflow answer (I credited the link in the code) and just does a simple regex on the string based on the operating system. You could also modify this to force a style instead of sniffing the OS.
</p>

<p>
Any thoughts on this? I did some basic testing and it seems to work OK. If folks like this I'll put it up on <a href="http://www.cflib.org">CFLib</a>.
</p>