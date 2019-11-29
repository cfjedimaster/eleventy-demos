---
layout: post
title: "Ask a Jedi: Paging within cfsearch?"
date: "2008-06-11T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/11/Ask-a-Jedi-Paging-within-cfsearch
guid: 2875
---

Peter asks:

<blockquote>
<p>
Whats the BEST way to page results from cfsearch?
</p>
</blockquote>

I think my readers are being a bit pushy lately on "best" - I'm feeling the pressure. ;) Luckily this one is easy.
<!--more-->
The cfsearch tag allows for both a startrow and maxRows value. So to paginate, you would simply pass in startrow and set maxRows to startrow plus some arbitrary number for the number of results per page.

The only tricky bit is getting the total number of matches found. If you use the status attribute, like below:

<code>
&lt;cfsearch collection="cfdocs" criteria="cf" name="results" startrow="5" maxrows="5" status="s"&gt;
</code>

You get a structure back that contains three keys: found, searched, and time. Found represents the total number of matches. You would want to use that for your paging.

p.s. Let me abuse my blog entry here and mention I added similar functionality to <a href="http://seeker.riaforge.org">Seeker</a> last night.