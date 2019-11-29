---
layout: post
title: "Solr presentation assets, and a note on DisMax searching"
date: "2013-10-24T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/10/24/Solr-presentation-assets-and-a-note-on-Dismax-searching
guid: 5067
---

<p>
Attached to this blog entry is the zip of my slides and demos from my Solr presentation at the CF Summit.
</p>
<!--more-->
<p>
During my preparation for this presentation, I did some research into DisMax type searching. This is a Solr search type that you can use by simply adding it to your cfsearch tag.
</p>

<pre><code class="language-markup">
&gt;cfsearch collection="myblog" criteria="#form.search#" name="results" 
	status="searchStatus" suggestions="always" 
	type="dismax" 
&lgt;
</code></pre>

<p>
Why would you use it versus the standard type? From the <a href="http://wiki.apache.org/solr/DisMax">Wiki</a>
</p>

<blockquote>
<p>
Simply put, it's your choice for all user generated queries.
</p>
<p>
Out of the box, Solr uses the standard Solr query parser which is pretty stupid, understanding only syntactically correct boolean queries like "title:foo OR body:foo", it can only search one field by default, and it may very well throw an exception in your face if you put in some characters it does not like.
</p>
<p>
Therefore a new, more robust query mode was needed and the DisMax and ExtendedDisMax Query Parsers were born. They are designed to process simple user entered phrases (without heavy syntax) and search for the individual words across several fields using different weighting (boosts) based on the significance of each field, and it should never throw an exception. 
</p>
</blockquote>

<p>
All in all, it sounds like there is no reason you shouldn't switch to using it. However, when I first tested it, it seemed broken. I even filed a bug report on it. But during my presentation, I discovered I had screwed up my code and the feature works perfectly fine.
</p>

<p>
As a simple example, consider a search for "phonegap coldfusion" on this blog. By default, the standard search treats this as "OR" and returns over 2000 results. With DismMax it treats it as AND and you get far fewer, but probably much more relevant, results.
</p>

<p>
I'm going to update my own blog engine when I get back next week and I'm sure there are reasons why you wouldn't <i>always</i> use DisMax, but to me, it seems pretty clear that you probably want to test it out.
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FSolrPreso%{% endraw %}2Ezip'>Download attached file.</a></p>