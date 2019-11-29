---
layout: post
title: "How To: ColdFusion Chart with No Numbers"
date: "2009-03-09T17:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/03/09/How-To-ColdFusion-Chart-with-No-Numbers
guid: 3270
---

This question came in via my <a href="http://www.raymondcamden.com/forums">forums</a>, but I thought it would make a nice blog post. wolfee asks:

<blockquote>
<p>
Is it possible to show a cfchart with bars but exclude the values (both on the verticle axis and on rollover? I'd like to give a visual indication of scores but not reveal the actual scores. Thankyou for any tips offered!
</p>
</blockquote>

The answer is - of course - yes - since everything is possible with ColdFusion. (Ok, maybe not everything, but darn close!)
<!--more-->
As always, the answer is in the chart editor. I opened it up and simply disabled the Y-Axis. I then disabled Popup. That's it. Done. Here is a simple example:

<code>
&lt;cfsavecontent variable="style"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart is3D="false"&gt;
&lt;frame xDepth="12" yDepth="11"/&gt;
&lt;yAxis isVisible="false" scaleMin="0" /&gt; 
&lt;popup showOn="Disabled"/&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;

&lt;cfchart format="flash" xaxistitle="Fleet" yaxistitle="numbers" style="#style#"&gt;

   &lt;cfchartseries type="bar" serieslabel="result"&gt;
      &lt;cfchartdata item="Cylons" value="75"&gt;
      &lt;cfchartdata item="Colonials" value="80"&gt;
   &lt;/cfchartseries&gt;

&lt;/cfchart&gt;
</code>

Note - I stripped the XML down to the bare minimum to get it working, but you get the idea. The visual result is:


<img src="https://static.raymondcamden.com/images/cfjedi//Picture 143.png">

Just pretend you can mouse over that and nothing shows up. Trust me - it works. ;) I'm not convinced this is 100% safe though. I bet you could get the SWF, decompile it, and see the numbers. Anyone want to try?