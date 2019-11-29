---
layout: post
title: "When using ANT to write to the file system, specify a file"
date: "2011-02-17T12:02:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2011/02/17/When-using-ANT-to-write-to-the-file-system-specify-a-file
guid: 4128
---

This is my weekly contribution to the "Stupid Developer of the Week" award. I spent the last hour or so trying to diagnose why my ANT script couldn't write to my file system. Apparently there is some Windows 7 bug where folders are marked Read Only and you can't clear it. So despite my ANT script's ability to make a folder I kept getting "Access is denied" errors when it tried to write into the folder. Here is the code I used.

<p>

<code>
&lt;?xml version="1.0"?&gt;
&lt;project name="test" default="getstuff" basedir="."&gt;
	
	&lt;property name="url" value="http://www.raymondcamden.com" /&gt;
	&lt;property name="temp.dir" value="c:/temphttpdump/" /&gt;
		
	&lt;target name="getstuff"&gt;
		&lt;echo message="About to get ${% raw %}{url}{% endraw %} and copy to ${% raw %}{temp.dir}{% endraw %}" /&gt;
		&lt;mkdir dir="${% raw %}{temp.dir}{% endraw %}" /&gt;
		&lt;attrib file="${% raw %}{temp.dir}{% endraw %}" readonly="false" system="false" verbose="on" /&gt;
		&lt;get src="${% raw %}{url}{% endraw %}" dest="${% raw %}{temp.dir}{% endraw %}" httpusecaches="false" verbose="on" /&gt;
	&lt;/target&gt;

&lt;/project&gt;
</code>

<p>

Spot the issue yet? My get task is being told to save the result of my http get operation to a folder. <i>But I didn't tell it the file to use!</i> And because of this, the task assumed I wanted a file named temphttpdump since people often name files without extensions. To fix it I simply added a file name:

<p>

<code>
&lt;get src="${% raw %}{url}{% endraw %}" dest="${% raw %}{temp.dir}{% endraw %}/result.html" httpusecaches="false" verbose="on" /&gt;
</code>

<p>

In my own defense, "Access is denied" as a message has a much different meaning to most folks. Why couldn't it have said "File exists and I can't overwrite" instead? I would have recognized it was trying to save it as a file and saved an hour of my life.

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/picard-facepalm.jpg" />