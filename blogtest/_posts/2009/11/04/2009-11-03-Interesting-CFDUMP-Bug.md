---
layout: post
title: "Interesting CFDUMP Bug"
date: "2009-11-04T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/04/Interesting-CFDUMP-Bug
guid: 3589
---

I thought I was going crazy for a minute but I've discovered an interesting bug with CFDUMP under ColdFusion9. Create two components, like so:

<b>test.cfc</b>
<code>
&lt;cfcomponent output="false" &gt;

&lt;cffunction name="test" returnType="array"&gt;
	&lt;cfreturn [1,2,3]&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getTime" access="remote" returnType="any"&gt;
	&lt;cfreturn now()&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

<b>test2.cfc</b>
<code>
&lt;cfcomponent&gt;
	
&lt;cffunction name="secondtest" returnType="array"&gt;
	&lt;cfreturn [1,2,3]&gt;
&lt;/cffunction&gt;

&lt;!---
&lt;cffunction name="test" returnType="string"&gt;
	&lt;cfreturn "from test2"&gt;
&lt;/cffunction&gt;
---&gt;

&lt;/cfcomponent&gt;
</code>

Notice that both CFCs have different methods. (I'll explain why test is commented out in a second.) Now put both CFCs in an structure (arrays also demonstrate this bug):

<code>
&lt;cfset bucket = {}&gt;
&lt;cfset bucket.test = createObject("component", "test")&gt;
&lt;cfset bucket.test2 = createObject("component", "test2")&gt;

&lt;cfdump var="#bucket#"&gt;
</code>

The result is interesting - look at what is in test2 dump:

<img src="https://static.raymondcamden.com/images/Screen shot 2009-11-04 at 9.27.28 AM.png" />

Yep - the methods from test.cfc "leaked" into the second one. If you use an array you see the same results. If you dump each component by itself, however, you do not see a problem. Also - if you uncomment the test method in the second component, the display for that particular method is correct. In other words, it shows the string return type of string, not array.

I've filed a <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=80579">bug report</a> for this so hopefully it will get corrected in the next update.