---
layout: post
title: "ColdFusion Zeus POTW - Extra edition..."
date: "2011-12-20T22:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/12/20/ColdFusion-Zeus-POTW-Extra-edition
guid: 4467
---

Ok, I know I did a <a href="http://www.raymondcamden.com/index.cfm/2011/12/19/ColdFusion-Zeus-POTR-CallStack">Zeus POTW</a> earlier this week, but I had to share this little gem. This is another small thing - a simple function - and something that's been possible via a CFLib UDF for years. That being said - when I saw this show up in the latest Zeus build today, I had to share.
<!--more-->
<p/>

If you've ever needed to format a date <i>and</i> a time, you know that it requires two calls, ala:

<p/>

<code>
&lt;cfoutput&gt;
#dateFormat(now())# #timeFormat(now())#
&lt;/cfoutput&gt;
</code>

<p/>

Zeus adds dateTimeFormat to combine this into one call:

<p/>

<code>
&lt;cfoutput&gt;
#dateTimeFormat(now())#&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

<p/>

For formatting, the mask is slightly different than before. Masks are based on <a href="http://docs.oracle.com/javase/1.4.2/docs/api/java/text/SimpleDateFormat.html">SimpleDateFormat</a> from Java. So for example:

<p/>

<code>
&lt;cfoutput&gt;
#dateTimeFormat(now(), "MMMM d, yyyy h:mm a")#&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

<p/>

Yeah, ok, not Earth-shattering, but this was one of a few new functions released in the latest Zeus build that were things I've seen requested for years.