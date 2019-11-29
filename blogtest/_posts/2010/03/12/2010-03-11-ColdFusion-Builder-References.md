---
layout: post
title: "ColdFusion Builder - References"
date: "2010-03-12T11:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/12/ColdFusion-Builder-References
guid: 3745
---

In my <a href="http://www.raymondcamden.com/index.cfm/2010/3/10/ColdFusion-Builder--Refactoring">last blog entry</a>, I talked about how you can use ColdFusion Builder to perform code refactoring - essentially - supporting the updating of your APIs through the rest of your code base. You change some method from doX to performX, and ColdFusion Builder can help you update any scripts that make use of that code. Today I'm going to talk about the obvious related feature to this - references. 
<p/>
In order to perform any refactoring, ColdFusionBuilder first has to actually <i>find</i> the stuff that needs updating. There are a few ways you can make use of this feature. First - you can right click on a file in your Navigator view. Unfortunately you can only do this for CFM and CFCs, and not JavaScript or CSS files. In my first test, I simply ran a references report on my layout custom tag for BlogCFC:
<p/>
<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-03-12 at 10.27.26 AM.png" title="References for layout.cfm" />
<p/>
Nice, and pretty much what I expected. I then tried it on blog.cfc, but the only result then was blog.cfc itself, specifically the returnType="blog" line. CFBuilder wasn't able to recognize that I made an instance of blog.cfc within my Application.cfm file. Since I typically always create my CFCs within Application.cfc/cfm or ColdSpring, this isn't a huge big deal to me.
<p/>
The next place you can use references is on an individual UDF or CFC method. I tried this on my blog's isEmail UDF from a udf library file. It worked exactly as I expected and found every use of isEmail(). I then tried to trick it. I first use the following template:
<p/>
<code>
Is this isemail test?
</code>
<p/>
CFBuilder wasn't fooled by this. Nice! Now the next thing impressed me even more. I changed my template to this:
<p/>
<code>
Is this isemail test?

no test case #ISEMAIL()# dude
</code>
<p/>
Once again, CFBuilder didn't find the call. Can you guess why? No cfoutput! As soon as I wrapped the line in cfoutput tags, CFBuilder found it. On the flip side, when I tried this template:
<p/>
<code>
Is this isemail test?

no test case #ISEMAIL()# dude

&lt;cfset foo = isEmaiL()&gt;
</code>
<p/>
CFBuilder still found it. All in all, pretty impressive. While <a href="http://www.coldfusionjedi.com/index.cfm/2010/3/10/ColdFusion-Builder--Refactoring">refactoring</a> makes me nervous (warranted or not), I can see using the references feature quite a bit!