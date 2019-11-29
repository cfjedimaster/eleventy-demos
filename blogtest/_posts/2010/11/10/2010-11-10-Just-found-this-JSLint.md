---
layout: post
title: "Just found this - JSLint"
date: "2010-11-10T15:11:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2010/11/10/Just-found-this-JSLint
guid: 4010
---

Earlier this week I received a copy of <a href="http://oreilly.com/catalog/9780596806767">JavaScript Patterns</a>. I've only finished the first two chapters and already I'm finding it to be an incredible book. (I'll be doing a review when I finish.) One of the first things I learned while reading it concerned a tool called <a href="http://www.jslint.com/">JSLint</a>. To quote their FAQ, JSLint is a code quality tool. It can read in JavaScript and report on problems, best practices, anti-patterns, etc. It is very configurable so if you find it <i>too</i> strict you can knock it down a peg or two. I spent a few minutes last night (before my Black Ops session!) working on a ColdFusion Builder Extension. Why? It isn't really needed - there is an <a href="http://www.rockstarapps.com/joomla-1.5.8/products/jslint-eclipse-plugin.html">eclipse plugin</a> already for JSLint. But it gave me an excuse to write another extension and revel in how darn cool ColdFusion Builder is. Here is a quick example of it in action:

<p>

<img src="https://static.raymondcamden.com/images/screen42.png" />

<p>

Currently the extension can be used on JavaScript files within the project view and code snippets in open CFM files. (You can't run extensions on editor files that are not CFM or CFCs.) I also took the opportunity to finally begin work on a CFC to make extension writing easier. Here are a few examples of what the CFC can do:

<p>

<code>
&lt;cfparam name="ideeventinfo"&gt; 
&lt;cfset builderHelper = new builderHelper(ideeventinfo)&gt;
&lt;cfset runAs = builderHelper.getRunType()&gt;
</code>

<p>

You begin by passing in the XML packet CFBuilder sends on all requests to the CFC. The getRunType returns how the extension was run. Since my JSLint extension runs from both the project explorer and the editor I need to know which was used.

<p>

<code>
&lt;cfif runAs is "projectView"&gt;
	&lt;cfset selectedResource = builderHelper.getSelectedResource()&gt;
	&lt;cffile action="read" file="#selectedResource.path#" variable="contents"&gt;
	&lt;cfset resource = selectedResource.path&gt;
&lt;cfelseif runAs is "editor"&gt;
	&lt;cfset data = builderHelper.getSelectedText()&gt;
	&lt;cfset contents = data.text&gt;
	&lt;cfset resource = data.path&gt;
&lt;cfelse&gt;
	&lt;cfthrow message="JSLint extension run in a way it is not supposed to be run."&gt;
&lt;/cfif&gt;
</code>

<p>

If we called the extension via the project view, I ask for the selected resource. This returns a structure of the path of the selection as well as the type (folder versus file). If the editor was used, I simply run getSelectedText. This method will check to see if there was an actual selection. If not, it grabs the entire contents of the file. Finally, here is another method in action:

<p>

<code>
&lt;script src="#builderHelper.getrooturl()#jquery-1.4.3.min.js"&gt;&lt;/script&gt;
</code>

Anyway, I plan on adding to this as time goes on. Click the download link below to get the extension.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fjslint%{% endraw %}2Ezip'>Download attached file.</a></p>