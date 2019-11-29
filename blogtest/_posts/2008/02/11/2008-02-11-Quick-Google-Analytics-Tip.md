---
layout: post
title: "Quick Google Analytics Tip"
date: "2008-02-11T14:02:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2008/02/11/Quick-Google-Analytics-Tip
guid: 2646
---

This weekend David Eckman of <a href="http://www.vkistudios.com/">VKI Studios</a> sent me an email about <a href="http://www.riaforge.org">RIAForge</a>. His company makes frequent use of RIAForge, and as a provider of Google Analytic implementation services, he wanted to let me know about a problem with the way I had set up the code.

RIAForge makes use of multiple, dynamic root URLs. So you have the main URL (http://www.riaforge.org) and multiple, dynamic project URLs (http://blogcfc.riaforge.org for example). My Analytics codes was <b>not</b> set up properly to handle multiple domains. 

I had trouble finding the exact way to generate the right code via Google's interface, but luckily David sent me the mod directly. Here is the old code:

<code>
&lt;script
type="text/javascript"&gt;
var gaJsHost = (("https:" ==
document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost +
"google-analytics.com/ga.js' type='text/javascript'{% raw %}%3E%{% endraw %}3C/script%3E"));
&lt;/script&gt;
&lt;script type="text/javascript"&gt;
var pageTracker =
_gat._getTracker("UA-70863-8");
pageTracker._initData();
pageTracker._trackPageview();
&lt;/script&gt;
</code>

And the modified version, note the line that sets the domain, third from the bottom:

<code>
&lt;script
type="text/javascript"&gt;
var gaJsHost = (("https:" ==
document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost +
"google-analytics.com/ga.js' type='text/javascript'{% raw %}%3E%{% endraw %}3C/script%3E"));
&lt;/script&gt;
&lt;script type="text/javascript"&gt;
var pageTracker =
_gat._getTracker("UA-70863-8");
pageTracker._setDomainName("riaforge.org");
pageTracker._initData();
pageTracker._trackPageview();
&lt;/script&gt;
</code>

Since these guys make their money from this type of advice, I want to thank <a href="http://www.vkistudios.com/">VKI Studios</a> once again. They were also very cool with me blogging this.