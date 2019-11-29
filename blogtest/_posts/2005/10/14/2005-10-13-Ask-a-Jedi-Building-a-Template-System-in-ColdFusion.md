---
layout: post
title: "Ask a Jedi: Building a Template System in ColdFusion"
date: "2005-10-14T09:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/14/Ask-a-Jedi-Building-a-Template-System-in-ColdFusion
guid: 849
---

This question came in this morning, and while I have about two hundred questions in front of it, it was so interesting I had to cover it immidiately. Dave asks:

<blockquote>
I have seen CMS applications in PHP that have  templates that use variable for placing content, menu, footer, etc.  Is there a way that such variables can be created using ColdFusion?
</blockquote>

Absolutely! Let's look at a very simple example of this. Do note that there are multiple ways of solving this problem, and this is just one way. First, let's build some sample data:

<code>
&lt;cfset data = queryNew("id,name,age")&gt;

&lt;cfloop index="x" from="1" to="10"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data,"id",x)&gt;
	&lt;cfset querySetCell(data,"name","User #x#")&gt;
	&lt;cfset querySetCell(data,"age",randRange(20,90))&gt;
&lt;/cfloop&gt;
</code>

This code just creates a ten row query with some random data in it. Now let's create the template. For my template system, I'm going to pick an arbitrary token for replacement. In this case, tokens will be marked with the % character:

<code>
&lt;cfsavecontent variable="template"&gt;
Hi, my name is {% raw %}%name%{% endraw %} and I am {% raw %}%age%{% endraw %} year(s) old.
&lt;/cfsavecontent&gt;
</code>

As you can see, I've set up two tokens in this template, name and age. These tokens will correspond with the values in my query. Now let's show how we use the tokens:

<code>
&lt;!--- tokens to look for are my columns ---&gt;
&lt;cfset tokenList = data.columnList&gt;

&lt;cfloop query="data"&gt;
	&lt;!--- copy template ---&gt;
	&lt;cfset thisTemplate = template&gt;
	&lt;cfloop index="token" list="#tokenList#"&gt;

		&lt;cfset thisTemplate = replaceNoCase(thisTemplate, "{% raw %}%" & token & "%{% endraw %}", data[token][currentRow], "all")&gt;

	&lt;/cfloop&gt;
	
	&lt;cfoutput&gt;
	#thisTemplate#
	&lt;hr&gt;
	&lt;/cfoutput&gt;
	
&lt;/cfloop&gt;
</code>

We begin by creating a token list. This is a list of tokens that we will look for in our template. We get our list based on the query. Now, we could have done this the reverse way. I could have looked at the template and found all the instances of {% raw %}%something%{% endraw %}. In my case I took the easy way out and just used the columnlist variable. Which one is better? Well if I had scanned for {% raw %}%something%{% endraw %} strings, I would have a list of every token used in the template. If for some reason a token was used that did <i>not</i> exist in the query, I could throw an error. My method will simply ignore those variables though.

Next we loop over our query. I create a copy of the template inside the loop. Then I look for each token in my token list. The token will just be the word, like "name" or "age", so in my replaceNoCase call, I add % to the beginning and end of the token. I then replace it with the value from the query. 

Pretty simple. We use something a bit like this in our mail tool at <a href="http://www.mindseye.com">Mindseye</a>. We allow for certain tokens that can be placed in the email body. These tokens are replaced with the values from our mailing list data. This allows for more personalized emails. Again - there are <i>many</i> different ways you could handle this.