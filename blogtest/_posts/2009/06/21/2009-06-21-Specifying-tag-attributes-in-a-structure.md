---
layout: post
title: "Specifying tag attributes in a structure"
date: "2009-06-21T23:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/21/Specifying-tag-attributes-in-a-structure
guid: 3405
---

Yesterday I was reading an article on Ben Forta's blog, <a href="http://forta.com/blog/index.cfm/2009/6/20/Look-No-Datasource">Look, No Datasource</a>, where he described how in ColdFusion 9, we can specify a default datasource at the application level that can then be used with all tags that use a datasource attribute. So instead of doing:

<code>
&lt;cfquery name="getShots" datasource="#application.dsn#"&gt;
</code>

we can instead just do:

<code>
&lt;cfquery name="getShots"&gt;
</code>

This is cool and all, but a reader commented that it would be nice if we could also supply default mail settings at the server level. I agree with him, it would be nice. Things like datasources, mail settings, etc, are typically high level things that individual tags should not need to worry about. 

It occurred to me that he may not be aware of a feature, added in ColdFusion 8, which <i>kind of</i> allows for this right now. For a long time custom tags have supported an attributeCollection argument. This is a structure that acts like passed in arguments. So if a custom tag takes two arguments, num1 and num2, I could actually pass them in like so:

<code>
&lt;cfset s = {% raw %}{num1="2",num2="67"}{% endraw %}&gt;
&lt;cf_foo attributeCollection="#s#"&gt;
</code>

That's not a great example as it didn't save me any keystrokes, but I think you get the idea. ColdFusion 8 simply expanded this to built in tags. So taking the reader's comment about mail, you could, if you wanted, do this in your Application.cfc file:

<code>
&lt;cfset application.mail = {% raw %}{server="127.0.0.1",username="mail",password="pass"}{% endraw %}&gt;
</code>

and then pass it to your cfmail tags:

<code>
&lt;cfmail to="some@where.com" from="admin@foo.com" subject="Your Email" attributeCollection="#application.mail#"&gt;
foo
&lt;/cfmail&gt;
</code>

Ok, so again, there isn't a huge savings in keystrokes, but it does allow you to change your mail tags from one central structure. Mail server doesn't require a password anymore? Just remove it from the struct. Want to supply a failto attribute? Add it to the struct and every cfmail tag uses the struct will be updated.

I've got to be honest and say that I've not yet used this in production (mainly because I keep forgetting about it!) but it's pretty powerful stuff. Anyone out there using it?