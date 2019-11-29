---
layout: post
title: "Second beta of Railo 3 out"
date: "2008-06-27T09:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/27/Second-beta-of-Railo-3-out
guid: 2902
---

Just read this on the Railo 3 listserv. The second beta is out. A few new features were added, including the shorthand array/struct support CF8 has and cfdocument/cfpdf support. One really interesting update is the ability to specify where unscoped variables go in a UDF. Consider this example:

<code>
&lt;cfscript&gt;
function doit(y) {
	x = 2;
	return x*y;
}
&lt;/cfscript&gt;

&lt;cfoutput&gt;#doit(5)#&lt;/cfoutput&gt;
&lt;cfdump var="#variables#"&gt;
</code>

As you can see, I have an unscoped X variable. When I dump the Variables scope, I see doit and X. However, I can now jump into the Railo Admin...

<img src="https://static.raymondcamden.com/images//Picture 113.png">

when I change the setting to "Always" as you see in the screen shot, now the x variable is automatically placed in the var scope instead.

You can grab the latest build (for all OSes) <a href="http://www.railo-technologies.com/en/index.cfm?treeID=361">here</a>.