---
layout: post
title: "How do I actually use a UDF?"
date: "2006-10-17T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/10/17/How-do-I-actually-use-a-UDF
guid: 1590
---

Over the past few days I've had multiple people ask me the same question - and that means one thing to me... blog post! 

The question these people were asking was the same - I know how to write a UDF, but not sure how to actually use it on a page? By that they didn't mean the "function" syntax (x = foo()), but how to include the UDF so that it could be used on a page.

The answer is simple once you realize that a UDF is nothing more than another kind of ColdFusion variable. Consider this code:

<code>
&lt;cfoutput&gt;
#x#
&lt;/cfoutput&gt;
</code>

What do you have to do to make this not throw an error? There are multiple ways to handle this. First, define it on the page:

<code>
&lt;cfset x = "DJ Jazzy Jeff and the Fresh Prince"&gt;
&lt;cfoutput&gt;#x#&lt;/cfoutput&gt;
</code>

Another way:

<code>
&lt;cfinclude template="thisiswherexismade.cfm"&gt;
&lt;cfoutput&gt;#x#&lt;/cfoutput&gt;
</code>

There are other ways of course, but you get the idea. So to use a UDF you follow the same rules. Here are two more examples using the same format as above:

<code>
&lt;cfscript&gt;
function cic() {% raw %}{ return "monkey"; }{% endraw %}
&lt;/cfscript&gt;
&lt;cfoutput&gt;#cic()#&lt;/cfoutput&gt;
</code>

And then the cfinclude version:

<code>
&lt;cfinclude template="filewithcfcUDFinit.cfm"&gt;
&lt;cfoutput&gt;#cic()#&lt;/cfoutput&gt;
</code>

Just like other variables, UDFs can be placed in the shared scopes. You can't do it directly though but rather must reassign:

<code>
&lt;cfscript&gt;
function dharma() {% raw %}{ return "swan"; }{% endraw %}
request.dharma  = dharma;
&lt;/cfscript&gt;

&lt;cfoutput&gt;#request.dharma()#&lt;/cfoutput&gt;
</code>