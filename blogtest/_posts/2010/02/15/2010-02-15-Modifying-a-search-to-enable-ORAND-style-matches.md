---
layout: post
title: "Modifying a search to enable OR/AND style matches"
date: "2010-02-15T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/15/Modifying-a-search-to-enable-ORAND-style-matches
guid: 3722
---

Here is a simple question. Given the "typical" search scenario (user searches for X, your SQL searches for "like {% raw %}%x%{% endraw %}"), how do you broaden the user's input when multiple words are used? Let me begin with an example of what I mean and then I'll demonstrate a few solutions. Also, note that in this blog entry I'm focusing only on <b>SQL</b> searching, not free text searching ala Lucene (or full text searching like you get in some databases).
<!--more-->
I began with an incredibly simple search form tied to the cfartgallery sample database.

<code>
&lt;cfparam name="form.search" default=""&gt;

&lt;form method="post"&gt;
	&lt;cfoutput&gt;
	&lt;input type="text" name="search" value="#form.search#"&gt;
	&lt;input type="submit" value="Search"&gt;
	&lt;/cfoutput&gt;
&lt;/form&gt;

&lt;cfif len(trim(form.search))&gt;

	&lt;cfset term = "{% raw %}%" & trim(form.search) & "%{% endraw %}"&gt;
	&lt;cfset term = ucase(term)&gt;
	
	&lt;cfquery name="results" datasource="cfartgallery"&gt;
	select	artname, description
	from	art
	where	ucase(artname) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#term#"&gt;
	or		ucase(description) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#term#"&gt;
	&lt;/cfquery&gt;

	&lt;cfdump var="#results#"&gt;
	
&lt;/cfif&gt;
</code>

I assume nothing here is too crazy or unique. I basically take the form input, trim it, and wrap it with % characters. (Note the use of ucase here as the Derby databases were case sensitive.) I then check this input against the artname and description columns. While this works, it fails in a few cases. A good example of this involves two pieces of art: "Man in Jeans" and "Man on Stool." If I knew a piece of art existed that was named "man something something jeans", a search for "man jeans" would fail to work. My search code here is treating the input as a phrase, so it must match the literal 'man jeans' set of characters anywhere in the two columns. 

One possible way to fix this would be to treat the input like a list of options and allow for a match against <b>any</b> of them. Let's look at that modification first.

<code>
&lt;cfparam name="form.search" default=""&gt;

&lt;form method="post"&gt;
	&lt;cfoutput&gt;
	&lt;input type="text" name="search" value="#form.search#"&gt;
	&lt;input type="submit" value="Search"&gt;
	&lt;/cfoutput&gt;
&lt;/form&gt;

&lt;cfif len(trim(form.search))&gt;

	
	&lt;cfquery name="results" datasource="cfartgallery"&gt;
	select	artname, description
	from	art
	where	1=0 
		&lt;cfloop index="word" list="#trim(form.search)#" delimiters=" "&gt;		
			&lt;cfset word = "{% raw %}%" & ucase(word) & "%{% endraw %}"&gt;
			or
			ucase(artname) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#word#"&gt;
			or
			ucase(description) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#word#"&gt;
		&lt;/cfloop&gt;
	&lt;/cfquery&gt;

	&lt;cfdump var="#results#"&gt;
	
&lt;/cfif&gt;
</code>

Notice I've modified the where clause. I begin with a 1=0 to act as a simple placeholder that will match nothing. Then for each "word" in the input I output OR clauses for each thing. Given the input "man jeans", the SQL you will end up with is:

where 1=1<br/>
or ucase(artname) like '{% raw %}%MAN%{% endraw %}'<br/>
or ucase(description) like '{% raw %}%MAN%{% endraw %}'<br/>
or ucase(artname) like '{% raw %}%JEANS%{% endraw %}'<br/>
or ucase(description) like '{% raw %}%JEANS%{% endraw %}'<br/>

This works well, but could a bit too loose. My search for "man jeans" ends up matching both "Man in Jeans" and "Man on Stool." That isn't horrible - and is better than matching nothing. But if we wanted to be a bit more strict, we can use an AND search. In this example, we will require all the words to exist, but still allow them to match in any column.

<code>
&lt;cfparam name="form.search" default=""&gt;

&lt;form method="post"&gt;
	&lt;cfoutput&gt;
	&lt;input type="text" name="search" value="#form.search#"&gt;
	&lt;input type="submit" value="Search"&gt;
	&lt;/cfoutput&gt;
&lt;/form&gt;

&lt;cfif len(trim(form.search))&gt;

	
	&lt;cfquery name="results" datasource="cfartgallery"&gt;
	select	artname, description
	from	art
	where	
		&lt;cfloop index="x" from="1" to="#listLen(form.search, " ")#"&gt;
			&lt;cfset word = listGetAt(form.search, x, " ")&gt;
			&lt;cfset word = "{% raw %}%" & ucase(word) & "%{% endraw %}"&gt;
			&lt;cfif x neq 1&gt;
			and
			&lt;/cfif&gt;	
			(	
			ucase(artname) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#word#"&gt;
			or
			ucase(description) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#word#"&gt;
			)
		&lt;/cfloop&gt;
	&lt;/cfquery&gt;

	&lt;cfdump var="#results#"&gt;
	
&lt;/cfif&gt;
</code>

The where clause here is different. This time I loop over each word but include the AND prefix for each set of searches. The AND prefix is used only after the first word. So given the "man jeans" example we used earlier, we end up with this clause:

where<br/>
(ucase(artname) like '{% raw %}%MEN%{% endraw %}'<br/>
or
ucase(description) like '{% raw %}%MEN%{% endraw %}')<br/>
and
(ucase(artname) like '{% raw %}%JEANS%{% endraw %}'<br/>
or
ucase(description) like '{% raw %}%JEANS%{% endraw %}')<br/>

This provides a tighter result set than the previous example. So which is best? It depends. :) What I recommend is - log your searches and spend some time trying them yourselves. See how successful they are. Take that data and then decide what kind of modifications you should make to your search form.