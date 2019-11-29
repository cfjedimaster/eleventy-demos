---
layout: post
title: "ColdFusion 8 Tip - Reading the top (or another slice) of a file"
date: "2007-09-07T12:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/07/ColdFusion-8-Tip-Reading-the-top-or-another-slice-of-a-file
guid: 2327
---

In the ColdFusion IRC channel today, someone asked about reading just the top portion of a file. While she was looking for a command line solution and not ColdFusion, I thought it would be interesting to share how easy it is in ColdFusion 8 using the new file attribute to CFLOOP. This code will loop over the first ten lines of a file and display them:

<code>
&lt;cfset myfile = server.coldfusion.rootdir & "/logs/server.log"&gt;

&lt;cfset c = 0&gt;
&lt;cfloop file="#myfile#" index="line"&gt;
	&lt;cfoutput&gt;#line#&lt;br /&gt;&lt;/cfoutput&gt;
	&lt;cfset c++&gt;
	&lt;cfif c gte 10&gt;
		&lt;cfbreak&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
</code>

I first create a variable to point to my server.log file. I then create a counter variable "c". Then I simply use the file attribute for cfloop to loop over the file. When I hit 10 lines, I break. No matter how big the file is, this code will run extremely fast as it won't need to parse in the entire file. My server.log file could be 10 gigs and this would still run quickly.

But wait - it gets betteer. <a href="http://www.phusor.com/">TJ Downes</a> pointed out that you can provide a FROM and TO and the tag will actually display a slice, or portion, of the file. This is <b>not</b> documented as far as I know. The following code is shorter and equivalent to the earlier listing:

<code>
&lt;cfset myfile = server.coldfusion.rootdir & "/logs/server.log"&gt;

&lt;cfloop file="#myfile#" index="line" from="1" to="10"&gt;
	&lt;cfoutput&gt;#line#&lt;br /&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

One thing to watch out - if you try to read beyond the size of the file, you will get an error. In that case, the first listing would be safer as it would support a file of any size.