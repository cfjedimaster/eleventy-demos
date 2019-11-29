---
layout: post
title: "Building a simple ColdFusion Token/Template System"
date: "2010-11-02T13:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/02/Building-a-simple-ColdFusion-TokenTemplate-System
guid: 3995
---

As ColdFusion developers, we build a lot of different types of applications. For the most part though these apps come down to simple content management systems. We build out forms and let our clients enter blocks of text that then get put together nicely on the front end. While the actual view of the application is dynamic, typically the text itself is rather static. So for example, this blog post comprises a title and a body, and is certainly dynamic when viewed by the public, but the actual words themselves are just straight text. Sometimes we need to provide a way to add an additional level of dynamicness (yes, I know that isn't a word, but I'm going for it anyway). A great example of this is an email template. Your web site may send out emails to users on a weekly schedule. The text of the email may need to include customization. It may want to say something like, "Hello #name#", where name is the person receiving the email. You can do this quite easily in ColdFusion, but what if the client wants more control over the text? What if they want to change "Hello" to "Hiya" or perhaps add a ! after the name? This is where a simple token/template system can come in handy. Here is a quick UDF I built with a few sample uses of it. (And by the way, I'm pretty sure I've blogged about this before in the past few years, but it was on my mind this week so I thought I'd whip out another example.)
<!--more-->
<p>

To begin - let's look at a simple template. You can imagine our client editing this to create a customize email for a product site. Users are allowed to sign up for specific newsletters based on different types of products. Here is the plain text:

<p>

<code>
Hello {% raw %}{name}{% endraw %},

Thank you for signing up for our {% raw %}{newslettertype}{% endraw %} news list.
Every day we will send you new and exciting emails about {% raw %}{producttype}{% endraw %}.

Thank you, 
{% raw %}{source}{% endraw %}
</code>

<p>

I've decided on the use of {% raw %}{ and }{% endraw %} to wrap the dynamic aspects of the template. Any character could be used really but you want something that stands out from the rest of the text. Now that we've got a block of text, we need to create a ColdFusion UDF that will:

<p>

<ul>
<li>Look for and find all the {% raw %}{...}{% endraw %} strings in the text
<li>Accept data in that contains the "real" values for those tokens
<li>Replace the tokens with real data and return the string
</ul>

<p>

Here is the UDF I came up with. It is a bit complex so I'll go into the design decisions after the paste.

<p>

<code>

&lt;cffunction name="tokenReplace" output="false" returnType="array"&gt;
	&lt;cfargument name="string" type="string" required="true" hint="String with tokens inside, specified by wrapping with {}"&gt;
	&lt;cfargument name="data" type="any" required="true" hint="Data used to replace tokens. Can be an array of structs, a struct, or a query object."&gt;
	
	&lt;cfset var result = []&gt;
	
	&lt;!--- first, find tokens in the string so we know what we can recognize ---&gt;
	&lt;!--- note that we will use a list, which means we wouldn't support a token with a comma in it, which is fair I think ---&gt;
	&lt;cfset var knownTokens = ""&gt;
	&lt;cfset var matches = reMatch("{% raw %}{.+?}{% endraw %}", arguments.string)&gt;
	&lt;cfset var match = ""&gt;
	
	&lt;cfloop index="match" array="#matches#"&gt;
		&lt;cfset knownTokens = listAppend(knownTokens, replaceList(match, "{% raw %}{,}{% endraw %}",""))&gt;
	&lt;/cfloop&gt;

	&lt;!--- based on our data, do different things ---&gt;
	&lt;cfif isStruct(arguments.data)&gt;
		&lt;cfset var thisResult = arguments.string&gt;
		&lt;cfloop index="token" list="#knownTokens#"&gt;
			&lt;cfset thisResult = rereplace(thisResult, "{% raw %}{" & token & "}{% endraw %}", arguments.data[token], "all")&gt;
		&lt;/cfloop&gt;
		&lt;cfset arrayAppend(result, thisResult)&gt;
	&lt;cfelseif isArray(arguments.data)&gt;
		&lt;cfloop index="item" array="#arguments.data#"&gt;
			&lt;cfset var thisResult = arguments.string&gt;
			&lt;cfloop index="token" list="#knownTokens#"&gt;
				&lt;cfset thisResult = rereplace(thisResult, "{% raw %}{" & token & "}{% endraw %}", item[token], "all")&gt;
			&lt;/cfloop&gt;
			&lt;cfset arrayAppend(result, thisResult)&gt;
		&lt;/cfloop&gt;
	
	&lt;cfelseif isQuery(arguments.data)&gt;
		&lt;cfloop query="arguments.data"&gt;
			&lt;cfset var thisResult = arguments.string&gt;
			&lt;cfloop index="token" list="#knownTokens#"&gt;
				&lt;cfset thisResult = rereplace(thisResult, "{% raw %}{" & token & "}{% endraw %}", arguments.data[token][currentRow], "all")&gt;
			&lt;/cfloop&gt;
			&lt;cfset arrayAppend(result, thisResult)&gt;
		&lt;/cfloop&gt;
	&lt;cfelse&gt;
		&lt;cfthrow message="tokenReplace: data argument must be either a struct, array of structs, or query"&gt;
	&lt;/cfif&gt;	
	
	&lt;cfreturn result&gt;
&lt;/cffunction&gt;
</code>

<p>

So the first argument to my UDF, tokenReplace, is the actual string. That should be easy enough to understand. The second argument is a bit more complex. I wanted a system that would allow me to pass different types of data. I imagined a query would be most often used, but I also imagined you may need a "one off" so I also wanted to support structs. I also figured you may have an array of data as well so I added support for arrays of structs. Since I figured you would probably be working with multiple sets of data more often than not, I made the UDF consistently return an array of strings. 

<p>

I begin by getting all my tokens. This is done with (edited a bit):

<p>

<code>
&lt;cfset matches = reMatch("{% raw %}{.+?}{% endraw %}", arguments.string)&gt;
	
&lt;cfloop index="match" array="#matches#"&gt;
	&lt;cfset knownTokens = listAppend(knownTokens, replaceList(match, "{% raw %}{,}{% endraw %}",""))&gt;
&lt;/cfloop&gt;
</code>

<p>

The reMatch finds all the {% raw %}{...}{% endraw %} tokens and the loop removes the {} from them. Once I have that, I then split into a branch that handles my three types of data. In all cases though we assume that if you have a token for foo, you have data for foo. I don't care if you send me more data than I need, but I do care if you don't have data for one of my tokens. Right now if you make that mistake, you get an ugly error, but the UDF could be updated to make it more explicit.

<p>

So, let's look at a complete example:

<p>

<code>

&lt;!--- Our template ---&gt;
&lt;cfsavecontent variable="template"&gt;
Hello {% raw %}{name}{% endraw %},

Thank you for signing up for our {% raw %}{newslettertype}{% endraw %} news list.
Every day we will send you new and exciting emails about {% raw %}{producttype}{% endraw %}.

Thank you, 
{% raw %}{source}{% endraw %}
&lt;/cfsavecontent&gt;

&lt;!--- Our sample data ---&gt;
&lt;cfset data = queryNew("id,name,newslettertype,producttype,source","cf_sql_integer,cf_sql_varchar,cf_sql_varchar,cf_sql_varchar,cf_sql_varchar")&gt;
&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "id", 1)&gt;
&lt;cfset querySetCell(data, "name", "Bob")&gt;
&lt;cfset querySetCell(data, "newslettertype", "Weapons of Mass Confusion")&gt;
&lt;cfset querySetCell(data, "producttype", "weapons")&gt;
&lt;cfset querySetCell(data, "source", "MADD")&gt;

&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "id", 2)&gt;
&lt;cfset querySetCell(data, "name", "Mary")&gt;
&lt;cfset querySetCell(data, "newslettertype", "Death Rays and MegaSharks")&gt;
&lt;cfset querySetCell(data, "producttype", "lasers")&gt;
&lt;cfset querySetCell(data, "source", "Dr. No")&gt;

&lt;cfset queryAddRow(data)&gt;
&lt;cfset querySetCell(data, "id", 3)&gt;
&lt;cfset querySetCell(data, "name", "Joe")&gt;
&lt;cfset querySetCell(data, "newslettertype", "Good Meat to Eat")&gt;
&lt;cfset querySetCell(data, "producttype", "food")&gt;
&lt;cfset querySetCell(data, "source", "PETA")&gt;

&lt;cfset results = tokenReplace(template,data)&gt;

&lt;cfdump var="#results#" label="Query Test"&gt;
&lt;p/&gt;

&lt;cfset s = {% raw %}{name="Luke", newslettertype="Lightsabers", producttype="swords", source="The Empire"}{% endraw %}&gt;
&lt;cfset results = tokenReplace(template, s)&gt;
&lt;cfdump var="#results#" label="Struct Test"&gt;
&lt;p/&gt;

&lt;cfset s2 = {% raw %}{name="Scott", newslettertype="Beers", producttype="beer", source="The Beer Industry"}{% endraw %}&gt;
&lt;cfset array = [s,s2]&gt;
&lt;cfset results = tokenReplace(template, array)&gt;
&lt;cfdump var="#results#" label="Array Test"&gt;
</code>

<p>

As you can see, I've got my template on top, and then three sets of examples. One query, one struct, and one array of structs. The results show that in all cases, we get nicely customized messages back.

<p>

<img src="https://static.raymondcamden.com/images/screen30.png" />