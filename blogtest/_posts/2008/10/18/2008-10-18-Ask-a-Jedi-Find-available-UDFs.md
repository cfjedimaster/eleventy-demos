---
layout: post
title: "Ask a Jedi: Find available UDFs"
date: "2008-10-18T12:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/18/Ask-a-Jedi-Find-available-UDFs
guid: 3059
---

Brandon asks:

<blockquote>
<p>
Is there a way to see what UDF's are available to the requesting template?
</p>
</blockquote>

While there is probably some internal method that can do this, there is a little known function you can use to find out if a variable is a UDF. Let's start by creating a bunch of variables and UDFs.
<!--more-->
<code>
&lt;cfscript&gt;
a = 1;
b = 2;
c = 3;
d = 'you betcha!';

function e() {% raw %}{ return 'beer!'; }{% endraw %}

f = [1,2,3];
g = {% raw %}{name='Ray',consuming=e}{% endraw %};

function h() {% raw %}{ return "more beer!"; }{% endraw %}
&lt;/cfscript&gt;

&lt;cffunction name="i"&gt;
	&lt;cfreturn "Stuff"&gt;
&lt;/cffunction&gt;
</code>

Yes, those are horrible variable names, but you get the idea. In the above list, e, h, and i are udfs. Everything else is not. So how can we find them? First lets treat the variables scope like a structure:

<code>
&lt;cfloop item="k" collection="#variables#"&gt;
</code>

Next use the <a href="http://www.cfquickdocs.com/cf8/?getDoc=IsCustomFunction">isCustomFunction</a> function:

<code>
&lt;cfoutput&gt;
The variable #k# is 
&lt;cfif not isCustomFunction(variables[k])&gt;NOT&lt;/cfif&gt; a UDF.&lt;br /&gt;
&lt;/cfoutput&gt;
</code>

That's it! If you run this you will see that it correctly recognizes which variables are UDFs. 

In case you're curious, there isn't a direct way to tell if "X" is a built in function. You can use <a href="http://www.cfquickdocs.com/cf8/?getDoc=GetFunctionList">getFunctionList</a>, which returns a struct, but you would then obviously need to do a structKeyList followed by a listFindNoCase.

I'll admit to have never using either of these functions in production. Has anyone used them?