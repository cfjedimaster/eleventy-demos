---
layout: post
title: "Working with funky XML in ColdFusion"
date: "2007-09-13T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/13/Working-with-funky-XML-in-ColdFusion
guid: 2344
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2007/9/12/My-kul-CFC-Kuler-API-CFC">blogged</a> about writing an interface to the kuler API. A user wrote me and mentioned he had tried to do the same, but ran into a problem with the XML. Kuler's feeds include XML that may look a bit odd. Consider this snippet:

<code>
     &lt;item&gt;

        &lt;!-- theme title --&gt; 
        &lt;title&gt;Theme Title: my theme&lt;/title&gt; 
        &lt;!-- url link to theme within the kuler application --&gt; 
        &lt;link&gt;http://kuler.adobe.com/index.cfm#themeID/11&lt;/link&gt; 
        &lt;guid&gt;http://kuler.adobe.com/index.cfm#themeID/69579&lt;/guid&gt; 
        &lt;enclosure xmlns="http://www.solitude.dk/syndication/enclosures/"&gt; 
        &lt;title&gt;Perfect Fit&lt;/title&gt; 
        &lt;link length="1" type="image/png"&gt;
         &lt;url&gt;http://kuler.adobe.com/kuler/API/rss/png/generateThemePng.cfm?themeid=69579&lt;/url&gt; 

        &lt;/link&gt; 
    &lt;/enclosure&gt; 
    &lt;!-- description content which includes theme png, artist, posted date, tags, and swatch hex colors --&gt; 
    &lt;kuler:themeItem&gt;

        &lt;!-- themeID --&gt; 
        &lt;kuler:themeID&gt;11&lt;/kuler:themeID&gt; 
        &lt;!-- theme title --&gt; 
        &lt;kuler:themeTitle&gt;my theme&lt;/kuler:themeTitle&gt; 
        &lt;!-- url link to theme's png image --&gt; 
        &lt;kuler:themeImage&gt;
        http://kuler.adobe.com/kuler/API/rss/png/generateThemePng.cfm?themeid=11 

        &lt;/kuler:themeImage&gt;
</code>

While it starts off rather simple, you may notice the tags towards the end have colons in them. The user who wrote me had trouble working with them because he was trying to use struct/array notation like so:

<code>
&lt;cfset someval = somenode.item.kuler:themeitem.xmlText&gt;
</code>

Obviously this threw an error since colons aren't legal in ColdFusion variables. What he forgot though is that when you treat XML like a struct, you can use any struct notation you want - even bracket notation. The line above could be rewritten like so:

<code>
&lt;cfset someval = somenode.item["kuler:themeitem"].xmlText&gt;
</code>

Notice how the 'funky' XML tag (kuler:themeitem) is used as a string inside the brackets. 

This also applies to <i>any</i> structure of course.