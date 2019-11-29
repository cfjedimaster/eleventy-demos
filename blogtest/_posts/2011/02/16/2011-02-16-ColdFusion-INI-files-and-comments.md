---
layout: post
title: "ColdFusion, INI files, and comments"
date: "2011-02-16T18:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/16/ColdFusion-INI-files-and-comments
guid: 4125
---

Today I got a comment on a blog entry from close to 6 years ago: <a href="http://www.raymondcamden.com/index.cfm/2005/8/26/ColdFusion-101-Config-Files-AGoGo">ColdFusion 101: Config Files A-Go-Go</a> (what was I thinking with when I picked that title??). The blog entry discusses ColdFusion native INI file processing. I use an INI file to config <a href="http://blogcfc.riaforge.org">BlogCFC</a> and have used it elsewhere in the past as a simple form of configuration. I'm not one of the anti-XML folks but you can't deny that an INI file is pretty simple to use. I've moved away from this type of configuration though due to the issues that ColdFusion's INI functions have with internationalization inside ini files. That being said, I was a bit surprised today Cori pointed out a bug with ColdFusion's getProfileString function.

<p>
<!--more-->
Apparently INI files support a way to add comments. Wikipedia's <a href="http://en.wikipedia.org/wiki/INI_file">entry</a> says this:

<p>

<blockquote>
Semicolons (;) indicate the start of a comment. Comments continue to the end of the line. Everything between the semicolon and the End of Line is ignored.
</blockquote>

<p>

And a bit later goes on to say...

<p>

<blockquote>
In some implementations, a comment may begin anywhere on a line, including on the same line after properties or section declarations. In others, any comments must occur on lines by themselves.
</blockquote>

<p>

This last point is important. Depending on your implementation, you may allow for semicolon comments "inline" or only on a line by itself. ColdFusion definitely ignores inline comments. Let's look at an example. First, here is my INI file.

<p>

<code>
[main]
name=Raymond
age=37
coolness=high ; lies!
; What does this do?
[sub]
age=42
email=foo@foo.com
</code>

<p>

And here is a very generic "reader" for an INI file.

<p>

<code>
&lt;cfset inifile = expandPath("./test.ini")&gt;
&lt;cfset sections = getProfileSections(inifile)&gt;

&lt;cfloop item="section" collection="#sections#"&gt;
	&lt;cfoutput&gt;&lt;h2&gt;#section#&lt;/h2&gt;&lt;/cfoutput&gt;	
	&lt;cfset items = sections[section]&gt;
	&lt;cfloop index="item" list="#items#"&gt;
		&lt;cfset value = getProfileString(inifile, section, item)&gt;
		&lt;cfoutput&gt;#item#=#value#&lt;br/&gt;&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
	&lt;p&gt;
&lt;/cfloop&gt;
</code>

<p>

When run, this is the output I get:

<p>

<code>
main

name=Raymond
age=37
coolness=high ; lies!

sub

age=42
email=foo@foo.com
</code>

<p>

As you can see, the inline comment is returned. The comment on the line by itself was <b>not</b> returned. With that said - I'd say ColdFusion's implementation isn't bugged - it's just strict about where comments are allowed. So that being said - is there an easy way to account for this? Sure. Consider this version:

<p>

<code>
&lt;cfset inifile = expandPath("./test.ini")&gt;
&lt;cfset sections = getProfileSections(inifile)&gt;

&lt;cfloop item="section" collection="#sections#"&gt;
	&lt;cfoutput&gt;&lt;h2&gt;#section#&lt;/h2&gt;&lt;/cfoutput&gt;	
	&lt;cfset items = sections[section]&gt;
	&lt;cfloop index="item" list="#items#"&gt;
		&lt;cfset value = getProfileString(inifile, section, item)&gt;
		&lt;cfif find(";", value)&gt;
			&lt;cfset value = trim(listDeleteAt(value, listLen(value, ";"), ";"))&gt;
		&lt;/cfif&gt;
		&lt;cfoutput&gt;#item#=#value#&lt;br/&gt;&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
	&lt;p&gt;
&lt;/cfloop&gt;
</code>

<p>

I've simply added a find call in there and if a semicolon exists, we treat it as a list and chop off the end. Not rocket science, but useful if you have to parse INI files you don't have control over.