---
layout: post
title: "Using ColdFusion to add simple content formatting to user input"
date: "2011-05-10T08:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/05/10/Using-ColdFusion-to-add-simple-content-formatting-to-user-input
guid: 4227
---

For the most part, those of us who use sites with user generated content, like this blog right here, will do everything possible to strip out and "sanitize" the content sent in by the public. This is mainly done as a security measure. <b>While not enough by itself</b>, htmlEditFormat can be used to strip out and block attempts to spam/misdirect users. Even when not worried about that, innocent users, if given the ability to inject HTML into your site, could easily make a simple HTML mistake that renders your site completely broken. (Visibly anyway.) While a few sites allow for basic HTML, in general you are stuck with simple plain text. Because of this many people will use a few common typographical symbols to convey meaning. For example, I may use *foo*to symbolize boldness or strong feeling. I may also use _underscores_ as a way to represent italics. Let's look at a simple example of how ColdFusion can render some of these into <i>real</i> HTML tags.
<!--more-->
<p>

First, I'll create a simple form that renders a textarea. 

<p>

<pre><code class="language-markup">
&lt;cfparam name="form.comments" default=""&gt;

&lt;form method="post"&gt;
&lt;cfoutput&gt;&lt;textarea name="comments" style="width:300px;height:200px"&gt;#form.comments#&lt;/textarea&gt;&lt;/cfoutput&gt;&lt;br/&gt;
&lt;input type="submit" value="Test"&gt;
&lt;/form&gt;

&lt;cfif len(trim(form.comments))&gt;
	&lt;cfoutput&gt;#markupRender(form.comments)#&lt;/cfoutput&gt;
	&lt;p&gt;
	&lt;cfoutput&gt;#htmlEditFormat(markupRender(form.comments))#&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code></pre>

<p>

The UDF, markupRender, doesn't exist yet, but notice how for this test I render both the result and the htmlEditFormat of the result. I wouldn't use the second output in production, but for testing, this lets me see the actual HTML rendered. Now let's look at the UDF:

<p>

<pre><code class="language-markup">
&lt;cfscript&gt;
function markupRender(required string text) {
	text = htmlEditFormat(text);
	text = reReplace(text, "\*(.*?)\*", "&lt;b&gt;\1&lt;/b&gt;","all");
	text = reReplace(text, "_(.*?)_", "&lt;i&gt;\1&lt;/i&gt;","all");
	return text;
}
&lt;/cfscript&gt;
</code></pre>

<p>

Not much at all to it, is there? I first perform a quick htmlEditFormat on the text, and then follow up with two simple regular expressions. Notice that I have to escape * since it is a special character in regexes. Also note the use of .*? - specifically the ?. The .* means match anything 0 or more times, but the use of ? makes it non greedy. Why is that important? Consider this string: I *love* ColdFusion and I *love* Star Wars. Without the non-greedy mark, the match on *(anything)* would go from the beginning of the first love all the way to the end of the last one. 

<p>

<strike>
Want to test it? Give it a run here: http://www.coldfusionjedi.com/demos/may102011/test0.cfm</strike> <i>Sorry - online demo no longer available.</i>

<p>

How about we take it one step further? Imagine if the user enters something like this:

<p>

<pre>
This *is* a *test*. I feel _strongly_ about this, I really do.

And I live at:

900 Elm Street
Lafayette, LA
</pre>

<p>

As you can see, I've got 3 paragraphs with the third paragraph being an address. The built-in function paragraphFormat would handle the paragraphs in general, but would not handle the address being on two lines. Luckily there is a UDF at CFLib just for that - <a href="http://www.cflib.org/udf/paragraphformat2">paragraphformat2</a>. 

<p>

Now in general, I think it's a good idea to keep your methods as simple and direct as possible. They should do one thing only. However, I think in this case putting all of my format logic together in one UDF makes sense as well. I could spend all day worrying about what is the best architecture for a simple UDF or I can just build it and be done with it. So I did. I took the guts of paragraphFormat2 and simply added it in:

<p>

<pre><code class="language-javascript">
&lt;cfscript&gt;
function markupRender(required string text) {
	text = htmlEditFormat(text);
	text = reReplace(text, "\*(.*?)\*", "&lt;b&gt;\1&lt;/b&gt;","all");
	text = reReplace(text, "_(.*?)_", "&lt;i&gt;\1&lt;/i&gt;","all");

	//Credit: Ben Forta and paragraphformat2: www.cflib.org/udf/paragraphformat2
	text = replace(text,chr(13)&chr(10),chr(10),"ALL");
	//now make Macintosh style into Unix style
	text = replace(text,chr(13),chr(10),"ALL");
	//now fix tabs
	text = replace(text,chr(9),"&nbsp;&nbsp;&nbsp;","ALL");
	//now return the text formatted in HTML
	return replace(text,chr(10),"&lt;br /&gt;","ALL");
}
&lt;/cfscript&gt;
</code></pre>

<p>

That's barely over 10 lines and it now correctly handles paragraphs, line breaks, and tabs too. 

Here is a complete copy of the template.


<pre><code class="language-markup">
&lt;cfparam name="form.comments" default=""&gt;

&lt;form method="post"&gt;
&lt;cfoutput&gt;&lt;textarea name="comments" style="width:300px;height:200px"&gt;#form.comments#&lt;/textarea&gt;&lt;/cfoutput&gt;&lt;br/&gt;
&lt;input type="submit" value="Test"&gt;
&lt;/form&gt;

&lt;cfif len(trim(form.comments))&gt;
	&lt;cfoutput&gt;#markupRender(form.comments)#&lt;/cfoutput&gt;
	&lt;p&gt;
	&lt;cfoutput&gt;#htmlEditFormat(markupRender(form.comments))#&lt;/cfoutput&gt;
&lt;/cfif&gt;

&lt;cfscript&gt;
function markupRender(required string text) {
	text = htmlEditFormat(text);
	text = reReplace(text, "\*(.*?)\*", "&lt;b&gt;\1&lt;/b&gt;","all");
	text = reReplace(text, "_(.*?)_", "&lt;i&gt;\1&lt;/i&gt;","all");

	//Credit: Ben Forta and paragraphformat2: www.cflib.org/udf/paragraphformat2
	text = replace(text,chr(13)&chr(10),chr(10),"ALL");
	//now make Macintosh style into Unix style
	text = replace(text,chr(13),chr(10),"ALL");
	//now fix tabs
	text = replace(text,chr(9),"&nbsp;&nbsp;&nbsp;","ALL");
	//now return the text formatted in HTML
	return replace(text,chr(10),"&lt;br /&gt;","ALL");
}
&lt;/cfscript&gt;
</code></pre>