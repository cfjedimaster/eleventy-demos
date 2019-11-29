---
layout: post
title: "Yet Another Galleon ColdFusion Forums Update, and ColdFusion Tip"
date: "2005-08-30T19:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/30/Yet-Another-Galleon-Update-and-ColdFusion-Tip
guid: 743
---

I've updated <a href="http://ray.camdenfamily.com/downloads/forums.zip">Galleon ColdFusion Forums</a> again, this time to fix an issue with BlueDragon. Well, not an issue per se, but BlueDragon doesn't support CFCHART. I only used it in the admin, so BD users could simply ignore it, but I knew I'd get a lot of bug reports so I simply fixed it. 

Curious to know how I fixed it? I used a technique I used a long time ago when working on the Spectra product. I had a case where for one version of ColdFusion I needed to call some tag, let's say &lt;cfray&gt; and for some higher version of CF, use &lt;cf_rayreplacement&gt;, since the &lt;cfray&gt; was removed.

Well, you can't just do this:

<div class="code"><FONT COLOR=MAROON>&lt;cfif version gte 5&gt;</FONT><br>
  <FONT COLOR=MAROON>&lt;cf_rayreplacement&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
  <FONT COLOR=MAROON>&lt;cfray&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>

If you do this, ColdFusion (and BlueDragon) notice that you have an invalid tag in the source. Even if never gets called, it won't compile. So to get around this, I simply moved the code to an include:

<div class="code"><FONT COLOR=MAROON>&lt;cfif version gte 5&gt;</FONT><br>
  <FONT COLOR=MAROON>&lt;cf_rayreplacement&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
  <FONT COLOR=MAROON>&lt;cfinclude the bad tag&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>