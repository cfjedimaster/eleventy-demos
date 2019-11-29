---
layout: post
title: "ColdFusion 8: Dumping gets even better"
date: "2007-06-01T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/01/ColdFusion-8-Dumping-gets-even-better
guid: 2081
---

If you ask most developers, I'd be willing to bet that they would say their favorite ColdFusion tag is cfdump. Without a doubt, cfdump is a developers dream. It can take <i>any</i> variable and display the values. ColdFusion 8 added some new features to this tag to make it even more powerful. Read on for details...
<!--more-->
First off - have you ever dumped a query that had a lot of columns? This can make it a bit harder to find the data you are looking for. In ColdFusion 8, you can now use a show or hide attribute to tell ColdFusion what to show - or hide. (I bet you could have guessed that.) This works for both queries and structures. Here is a simple example:

<code>
&lt;cfdump var="#myquery#" show="id,name"&gt;
</code>

If my query had 4 columns: id, name, age, gender, then this dump would only show the ID and name values. I could get the same result like so:

<code>
&lt;cfdump var="#myquery#" hide="age,gender"&gt;
</code>

My old fdump custom tag did this, so I'm going to take some credit for these guys. ;) ColdFusion will even tell you that it has filtered the results, which is handy in case your memory is a bit like mine. 

Related to this is the new keys attribute. This one lets you filter a dump by the <i>number</i> of keys. Since you have no control over what keys are picked, I'm not quite sure why someone would use this, but if you want, it is there. Consider:

<code>
&lt;cfset s = {% raw %}{a=1,b=2,c=3,d=4,e=5,f=6}{% endraw %}&gt;
&lt;cfdump var="#s#" keys="3"&gt;
</code>

The first line creates a structure with 6 keys using the new shorthand method. Then I dump the first 3 keys. Again - I'm not quite sure I'd use this often, but it is nice to have it there.

Another change is the showUDFs attribute. I'm not going to demo this one as it is so simple. If you are dumping an object that contains UDFs, you can set showUDFs to false to hide them. I can see this being kind of useful. Normally you want to see data and variables, not methods, except I dump CFCs all the time just for that reason. 

Now for my favorite new feature. Have you ever needed to dump something and save the dump? You can wrap it in a mail and send the value, or wrap it in cfsavecontent and save it to a file, but ColdFusion 8 gives you new options.

There is now an output attribute for cfdump. The options for this attribute are:

<ul>
<li>browser - This is the default
<li>console - Sends the dump to your console
<li>filename - If the value is anything but browser or console, ColdFusion will assume it is a file name.
</ul>

Let's talk more about the filename value. First - it has to be a full path. (I wish ColdFusion would allow for relative paths for all file based operations.) Using a filename will create a much slimmer, text based dump of the data. Consider:

<code>
&lt;cfset foo = queryNew("id,name,age,gender")&gt;
&lt;cfset queryAddRow(foo)&gt;
&lt;cfset querySetCell(foo,"id",1)&gt;
&lt;cfset querySetCell(foo,"name","Ray")&gt;
&lt;cfset querySetCell(foo,"age",33)&gt;
&lt;cfset querySetCell(foo,"gender","male")&gt;
&lt;cfset queryAddRow(foo)&gt;
&lt;cfset querySetCell(foo,"id",2,2)&gt;
&lt;cfset querySetCell(foo,"name","Jacob",2)&gt;
&lt;cfset querySetCell(foo,"age",7,2)&gt;
&lt;cfset querySetCell(foo,"gender","male",2)&gt;

&lt;cfdump var="#foo#" output="#expandPath('./dump.txt')#"&gt;
</code>

This creates the following:

<code>
query

 
[Record # 1] 
AGE: 33 
GENDER: male 
ID: 1 
NAME: Ray
 
[Record # 2] 
AGE: 7 
GENDER: male 
ID: 2 
NAME: Jacob
 
************************************************************************************ 

</code>

Pretty handy!