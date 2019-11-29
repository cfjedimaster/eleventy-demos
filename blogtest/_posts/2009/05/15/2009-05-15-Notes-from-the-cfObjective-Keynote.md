---
layout: post
title: "Notes from the cfObjective Keynote"
date: "2009-05-15T15:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/15/Notes-from-the-cfObjective-Keynote
guid: 3357
---

Yes, I know I'm not at cfObjective, but I've got some notes anyway. Don't ask how - I'd have to kill you - but here is a quick overview of what was revealed yesterday at the Adobe keynote. Some of this is old, some of this is new. I'm <i>not</i> going to comment heavily on stuff, not until
I'm out of NDA and can speak freely, so please do not ask for detailed follow ups until everything is 100% public.

First off, Adobe rattled off some nice news about the community as a whole. You probably saw this on Twitter yesterday. There are now an estimated
750K ColdFusion developers. I'll also point out the <a href="http://www.webbschofield.com/index.cfm/2009/5/14/Analysts-at-Gartner-Praise-CF">news</a>
that Kristen posted yesterday about the glowing review of ColdFusion by Gartner. Overall, pretty darn good for a language some people keep wanting
to kill off. (Good luck guys, keep trying.)

Now for the notes - taken from the slides, so a bit vague/bad grammar/etc, just deal. :)

*Exposed Service Layer: I believe Terrance is demoing this now at cfObjective. Direct access to ColdFusion services.<br/>
Query Service<br/>
Mail<br/>
Document Services<br/>
Imaging<br/>
Charting/Graphs<br/>
Exchange<br/>
More...<br/>
Available via SOAP and AMF. 

What I take from this is that it will be incredibly easy to make use of CF services from Flex and other remote clients.

*CFML Enhancements

Server.cfc will support onServerStart()<br/>
Nested cftransaction tags<br/>
&lt;cffinally&gt;/finally (This lets you add a block to a try/catch code block that will always be run at the end.)<br/>
&lt;cfcontinue&gt; (Lets you skip to the next iteration of a loop)<br/>
Pass implicit structures/arrays to tags and functions (CF8 added implicit strucs/arrays, but there were restrictions in how well you could use em)<br/>
Assignment chaining: a=b=c<br/>
When a function returns an array, you can now do: result = myFunction()[x] Obviously this is only useful in cases where you don't care about the rest of the data. If
you were doing this often, I'd probably ask why you don't just add a myPrefferedFunction() that would return just the data you need.

*CFSCRIPT Enhancements<br/>
<i>Full</i> language support for cfscript, including defining components. JavaDoc style comments for documentation and metadata.

<code>
component {
	variables.event_name ='';
	public function void init(new_name) {
		variables.event_name = new_name;
		return;
	}
}
</code>

All of the following work in cfscript:

abort ["message"]<br/>
exit ["methodName"]<br/>
include "template"<br/>
param [type] name [=defaultValue]<br/>
throw "message"<br/>
rethrow<br/>

Explicit local scope for private variables in a UDF/cfc method. <br/>
Implicit getters/setters based on cfproperty.<br/>
Import and New keywords.

<code>
import com.demo*;
user = new User();
user.setName('Adam');
</code>


*ORM
I don't believe anything new was said here, but again, to be NDA-safe, I'll keep quiet. They did mention access to Hibernate internals, which I think is new (and nice!).

*Bolt

Eclipse-based Editor<br/>
HTML, DOM & CSS Code Assist<br/>
CFML Code Assist<br/>
CFML Insight<br/>
CFML Debugging<br/>
CFML Refactoring<br/>
CFML ORM Insight<br/>
Code Snippets <br/>
Real-time Log Viewer<br/>
Extensible with CFML<br/>
Framework Scaffolding <br/>
Code Generation<br/>
Project Tasks<br/>
Whatever you want<br/>

*Advanced Caching<br/>

Very happy to hear about this. CF's caching support has needed an upgrade for a while. 

Object Cache<br/>
Save / Retrieve objects from a built-in cache<br/>
Programmatic access to cache metadata / properties<br/>
cacheGet()<br/>
cachePut()<br/>
cacheGetMetaData()<br/>
etc.<br/>

Template Cache<br/>
Cache page fragment or entire templates

Additional discussion was made of the CFML Advisory board and the upcoming UG Tour. Will blog more on that later.