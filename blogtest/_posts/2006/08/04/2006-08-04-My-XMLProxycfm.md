---
layout: post
title: "My XMLProxy.cfm"
date: "2006-08-04T16:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/08/04/My-XMLProxycfm
guid: 1450
---

In my article, <a href="http://ray.camdenfamily.com/index.cfm/2006/7/28/Building-an-AJAX-Based-RSS-Pod">Building an AJAX Based RSS Pod</a>, I talked about using ColdFusion as a proxy to retrieve remote XML feeds in order to feed to Spry. Charlie suggested that it may be a good idea to actually show off this file. Let me show it - and then talk about how it could be done better.

<code>
&lt;cfsetting showdebugoutput=false enablecfoutputonly=true&gt;
&lt;cfparam name="url.xmlfeed" default=""&gt;

&lt;cfif not len(trim(url.xmlfeed))&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;cfhttp url="#url.xmlfeed#"&gt;

&lt;cfcontent type="text/xml"&gt;&lt;cfoutput&gt;#cfhttp.fileContent#&lt;/cfoutput&gt;
</code>

As you can see, it is an extremely short file. The first line turns off debugging and trims down the white space. This is important when serving up XML. Forgetting to turn off debug output is a mistake I tend to make often.

Next I simply param the URL variable, xmlfeed, and ensure it isn't blank. In CF7 I could have added: isValid("url", url.xmlfeed) as well. Next I download the feed and serve it up to the browser. Again - I could have done more here. I could have try/caught the cfhttp to ensure nothing went wrong there, and I could have validated that the result was XML. 

I didn't do <i>any</i> of that, but hey, it was just a demo. I'd also recommend <i>against</i> allowing any URL. You would probably want to limit it to a set of URLs, or even simply one hard coded URL.