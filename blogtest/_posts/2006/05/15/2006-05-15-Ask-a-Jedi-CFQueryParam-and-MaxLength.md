---
layout: post
title: "Ask a Jedi: CFQueryParam and MaxLength"
date: "2006-05-15T22:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/15/Ask-a-Jedi-CFQueryParam-and-MaxLength
guid: 1268
---

Brian had an interesting question about the cfqueryparam tag:

<blockquote>
Question about the cfqueryparam maxlength attribute. I understand that it is (psuedo-)required for string types, but is it used for numerics, integers, or dates?  Or does ColdFusion ignore it for non-string datatypes?
</blockquote>

For those who aren't familiar with <a href="http://www.techfeed.net/cfQuickDocs/?cfqueryparam">cfqueryparam</a>, stop everything and go straight to the docs for it. The maxlength attribute is typically used for a string. So for example, if you were inserting a name and the size of the column in the database was 50, your tag could look like so:

<code>
&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#form.name#" maxlength="50"&gt;
</code>

So while this makes sense, what does maxlength do for non-string based column types? Believe it or not, it still gets checked. For example, if you try to pass a number, 999, and the maxlength is 2, ColdFusion will throw an error since the string length (3) is greater than 2.