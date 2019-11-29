---
layout: post
title: "When not to use cfcontent"
date: "2011-05-18T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/05/18/When-not-to-use-cfcontent
guid: 4237
---

Here's an interesting problem (that most of you will be able to guess the answer to because of the title) a reader ran into. He had a very simple form that took in your input and saved it to an XML file. The problem he had was in how to let the user know the file was generated. Sounds simple enough, but take a look at his code and see if you can figure out the problem.
<!--more-->
<p>

<code>
&lt;cfset showForm = true&gt;

&lt;cfif structKeyExists(form, "name") and len(trim(form.name))&gt;
	
	&lt;cfprocessingdirective suppresswhitespace ="Yes"&gt;
	&lt;cfcontent type="text/xml; charset=utf-16"&gt;
	&lt;cfxml variable="packet"&gt;&lt;cfoutput&gt;&lt;person&gt;&lt;name value="#xmlFormat(form.name)#" /&gt;&lt;/person&gt;&lt;/cfoutput&gt;&lt;/cfxml&gt;
	&lt;cfset fileWrite(expandPath("./test.xml"), toString(packet))&gt;
	&lt;/cfprocessingdirective&gt;
	&lt;cfset showForm = false&gt;

&lt;/cfif&gt;

&lt;cfif showForm&gt;
	
	&lt;form method="post"&gt;
	Name: &lt;input type="text" name="name"&gt; &lt;input type="submit" value="Save"&gt;
	&lt;/form&gt;
	
&lt;cfelse&gt;
	
	&lt;p&gt;
	Thanks for sharing your name. The Men in Black will be over soon.
	&lt;/p&gt;
	
&lt;/cfif&gt;
</code>

<p>

Reading top to bottom, you can see my form handling portion on top. If the user entered a name (and the validation here is pretty simple, it should look for an empty string to be complete), it takes that name value and creates an XML variable from it. It then records it to a file, test.xml, and sets a flag to let the user know the process is done. But notice the output (in Chrome at least):

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip94.png" />

<p>

Woah - hold the chickens there. What happened? Well the issue is the use of cfcontent. The reader had probably seen that many times before. What he didn't realize is that it was being used to <i>serve</i> XML to the user. cfcontent is like a special way to warn the browser. Instead of getting HTML back, cfcontent tells the browser something like this:

<p>

<blockquote>
"Hey buddy, I know you are expecting some HTML back, but I've got a truck load of something else. It kind of smells like XML, so let's just say it's XML."
</blockquote>

<p>

When given this "hint", the browser can then try to handle it better. It's pretty much always required for binary data, and should be used for non-HTML responses, like XML and JSON. Removing the cfcontent fixes everything.

<p>

<code>
&lt;cfset showForm = true&gt;

&lt;cfif structKeyExists(form, "name") and len(trim(form.name))&gt;
	
	&lt;cfprocessingdirective suppresswhitespace ="Yes"&gt;
	&lt;cfxml variable="packet"&gt;&lt;cfoutput&gt;&lt;person&gt;&lt;name value="#xmlFormat(form.name)#" /&gt;&lt;/person&gt;&lt;/cfoutput&gt;&lt;/cfxml&gt;
	&lt;cfset fileWrite(expandPath("./test.xml"), toString(packet))&gt;
	&lt;/cfprocessingdirective&gt;
	&lt;cfset showForm = false&gt;

&lt;/cfif&gt;

&lt;cfif showForm&gt;
	
	&lt;form method="post"&gt;
	Name: &lt;input type="text" name="name"&gt; &lt;input type="submit" value="Save"&gt;
	&lt;/form&gt;
	
&lt;cfelse&gt;
	
	&lt;p&gt;
	Thanks for sharing your name. The Men in Black will be over soon.
	&lt;/p&gt;
	
&lt;/cfif&gt;
</code>