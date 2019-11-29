---
layout: post
title: "CHF Warning - Impacts MXUnit"
date: "2010-02-20T11:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/20/CHF-Warning-Impacts-MXUnit
guid: 3729
---

Just a quick warning about the CHF I just <a href="http://www.raymondcamden.com/index.cfm/2010/2/20/Cumulative-Hot-Fix-for-ColdFusion-9-Released">blogged</a> about. It makes a small change to the LOCAL scope that can impact your code. It definitely breaks <a href="http://mxunit.org">MXUnit's</a> test runner. The change involves code that sets LOCAL variable. Imagine the following UDF:
<p/>
<code>
&lt;cfscript&gt;
function foo() {
	var local = "";
	local.x = 1;
	return x;
}
&lt;/cfscript&gt;

&lt;cfoutput&gt;#foo()#&lt;/cfoutput&gt;
</code>
<p/>
Notice how I set local to a string, and then treat is a structure later. While that may be a bit sloppy, it works fine <i>until</i> you apply the CHF. Once you do, you get:
<p/>
<b>LOCAL is explicit scope in ColdFusion 9.</b><br/>
You can only assign LOCAL to a struct. You cannot assign LOCAL to java.lang.String
<p/>
This is easy enough to fix, and easy to fix within MXUnit. Just find runner/HtmlRunner.cfc and delete line 13, which should be:
<p/>
<code>
&lt;cfset var local = ""&gt;
</code>