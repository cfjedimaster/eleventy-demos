---
layout: post
title: "Ask a Jedi: Best way to trim text"
date: "2008-05-28T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/28/Ask-a-Jedi-Best-way-to-trim-text
guid: 2844
---

Sal asks:

<blockquote>
<p>
just curious what's the best way (or how you handle) to truncate a paragraph to only show say perhaps 500 chars.? I have a newsletter that I'm emailing out, and I only wanna show 500 chars. of each article in the email.
</p>
</blockquote>

Ah, I love it when folks ask me the "best" way to do things since no matter what I say, I'm not wrong (grin). Seriously though - here are multiple ways to trim text.
<!--more-->
Let's first start off with a block of text that we will use for our tests:

<pre><code class="language-markup">
&lt;cfsavecontent variable="quote"&gt;
The Constitution is not an instrument for the government to restrain the people, it is an instrument for the people to restrain the government -- lest it come to dominate our lives and interests. Patrick Henry.
&lt;/cfsavecontent&gt;
</code></pre>

So the <i>quickest</i> way to trim text is with left:

<pre><code class="language-markup">
&lt;cfoutput&gt;#left(quote,100)#&lt;/cfoutput&gt;
</code></pre>

However if you use this on the text, you get:

<blockquote>
<p>
The Constitution is not an instrument for the government to restrain the people, it is an instrumen 
</p>
</blockquote>

As you can see, the last word in the trimmed text, instrument, was cut off before the final t. This isn't a horrible thing of course, but it could be done better. ColdFusion does ship with a Wrap function, but that won't crop the text, it will simply break the text into lines of a certain length. It will break the text nicely though, so why not use list functions?

<pre><code class="language-markup">
&lt;cfoutput&gt;#listFirst(wrap(quote,100),chr(10))#&lt;/cfoutput&gt;
</code></pre>

This returns a nicer trim:

<blockquote>
<p>
The Constitution is not an instrument for the government to restrain the people, it is an 
</p>
</blockquote>

This works nicely, but I kinda feel 'dirty' doing it like this, so why not see if a UDF exists for this? Turns out one does: <a href="http://www.cflib.org/udf.cfm/fullleft">FullLeft</a>. This UDF lets me do this instead:

<pre><code class="language-markup">
&lt;cfoutput&gt;#fullleft(quote,100)#&lt;/cfoutput&gt;
</code></pre>

In theory it's doing a lot less work than wrap so it should be quicker. 

Ok, so we're done, right? Well, what if we modify the quote a bit:

<pre><code class="language-markup">
&lt;cfsavecontent variable="quote"&gt;
The &lt;a href="http://www.raymondcamden.com"&gt;Constitution&lt;/a&gt; is &lt;b&gt;not&lt;/b&gt; an instrument for the government to restrain the people, it is an instrument for the people to restrain the government -- lest it come to dominate our lives and interests. Patrick Henry.
&lt;/cfsavecontent&gt;
</code></pre>

As you can see I've added some HTML to the text. This HTML messes up my count. If I wanted to show 100 characters, I don't think I'd want HTML to count at all. In fact, I probably don't want to show HTML at all. I can fix that easily enough:

<pre><code class="language-markup">
&lt;cfset quote = rereplace(quote, "&lt;.*?&gt;", "", "all")&gt;
</code></pre>

Another issue is space. Now this is a contrived example, but it could happen in a live system:

<pre><code class="language-markup">
&lt;cfsavecontent variable="quote"&gt;
The &lt;a href="http://www.coldfusionjedi.com"&gt;Constitution&lt;/a&gt; is &lt;b&gt;not&lt;/b&gt; 










an 
instrument for the government to restrain the people, it is an instrument for 
the people to restrain the government -- lest it come to dominate our lives and interests. 

Patrick Henry.
&lt;/cfsavecontent&gt;
</code></pre>

You can use another regex to handle this:

<pre><code class="language-markup">
&lt;cfset quote = rereplace(quote, "[[:space:]]+", " ", "all")&gt;
</code></pre>

Or conversely, if you use the wrap() function, it takes a 3rd argument to strip out existing line breaks and carriage returns.

Lastly - it sometimes helps to visually flag text that has been trimmed. Normally this is done with a "...". You can mimic this affect like so:

<pre><code class="language-markup">
&lt;cfif len(quote) gt 100&gt;
	&lt;cfset trimmedQuote = fullLeft(quote, 100)&gt;
	&lt;cfset trimmedQuote &= "..."&gt;
&lt;cfelse&gt;
	&lt;cfset trimmedQuote = quote&gt;
&lt;/cfif&gt;
&lt;cfoutput&gt;#trimmedQuote#&lt;/cfoutput&gt;
</code></pre>

I just check the length of the original quote and conditionally perform a trim and add the "...".