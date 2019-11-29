---
layout: post
title: "ColdFusion Builder extensions - Assigning multiple handlers to one file"
date: "2011-03-07T16:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/03/07/ColdFusion-Builder-extensions-Assigning-multiple-handlers-to-one-file
guid: 4149
---

Did you know there was a Google group dedicated to writing extensions with ColdFusion Builder? You can find it <a href="http://groups.google.com/group/cfb-extensions-dev">here</a>. Earlier today Dave Ferguson asked an interesting question. He had an extension with a great number of actions. However, all these actions really just needed to run one particular ColdFusion file. Let's take a look at what he tried first and what a good possible fix could be.
<!--more-->
<p>

His first attempt/thought was something like this:

<p>

<code>
&lt;handler id="test1" type="CFM" filename="test.cfm?x=1" /&gt;
&lt;handler id="test2" type="CFM" filename="test.cfm?x=2" /&gt;
&lt;handler id="test3" type="CFM" filename="test.cfm?x=3" /&gt;
</code>

<p>

Basically - 3 different commands all running one CFM file but passing a URL variable to indicate which type of action should be run. Unfortunately this doesn't work at all. When I tried this the extension said no response was returned. 

<p>

So what would I recommend? Make use of onMissingTemplate. Consider this example - first - the XML I used in the ide_config.xml file:

<p>

<code>
&lt;handler id="test1" type="CFM" filename="test2.cfm" /&gt;
&lt;handler id="test2" type="CFM" filename="test3.cfm" /&gt;
&lt;handler id="test3" type="CFM" filename="test4.cfm" /&gt;
</code>

<p>

None of these files exist. In my Application.cfc I then used:

<p>

<code>
public boolean function onMissingTemplate(string targetpage) {
	request.requested = arguments.targetpage;
	include "test.cfm";
	return true;
}
</code>

<p>

All my code here does is take the requested template and store it into the Request scope. Using "requested" as a key in the Request scope may be a bit confusing, but, whatever. I then include the primary CFM that will handle all the requests. Your code could then do whatever it needs to based on the request variable.