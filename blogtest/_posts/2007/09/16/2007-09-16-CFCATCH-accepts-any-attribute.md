---
layout: post
title: "CFCATCH accepts any attribute?"
date: "2007-09-16T17:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/16/CFCATCH-accepts-any-attribute
guid: 2349
---

As I prepare my final bits of code for my MAX presentation (on CFFEED), I incorporated Rupesh Kumar's blog entry on <a href="http://coldfused.blogspot.com/2007/08/using-cffeed-with-url-sending.html">cffeed and gzip compression problems</a>. I noticed something odd though in his code example:

<code>
&lt;cfcatch any&gt;
</code>

Normally that line is written as:

<code>
&lt;cfcatch type="any"&gt;
</code>

I then played around with this. At first I thought that maybe cfcatch was treating what it saw as a shortcut for type=. I tried this:

<code>
&lt;cfcatch application&gt;
</code>

And it worked fine. The code Rupesh had written through an Application type error. But then I tried something completely different:

<code>
&lt;cfcatch parishilton="ismyhero"&gt;
</code>

And lo and behold - it worked as well. So I guess cfcatch simply ignores unknown attributes, unlike most of the rest of the language. Rupesh's code worked because the type attribute defaults to any. It was like he wrote:

<code>
&lt;cfcatch&gt;
</code>