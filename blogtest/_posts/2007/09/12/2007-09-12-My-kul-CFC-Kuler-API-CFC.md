---
layout: post
title: "My kul CFC (Kuler API CFC)"
date: "2007-09-12T16:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/12/My-kul-CFC-Kuler-API-CFC
guid: 2342
---

<img hspace="10" src="http://kuler.adobe.com/kuler/API/rss/png/generateThemePng.cfm?themeid=11" align="left"> Most of the folks I hang out with <strike>are pretty scary</strike>are code geeks so we rarely talk about design or design related issues. As someone interested in technology in general though I find it interesting. Some time ago Adobe released <a href="http://kuler.adobe.com">kuler</a>, a site that lets people create and share color swatches. I'm not sure what a swatch is - I think it has something to do with putting colors together nicely. For me 'putting colors together nicely' means getting dressed and checking out the face my wife makes. The kuler site is pretty fun to look at and play with - and it turns out it has a pretty nice <a href="http://labs.adobe.com/wiki/index.php/Kuler">API</a> as well.

As you know - the only word that makes me more excited than API is wishlist - so when I saw the docs I thought I'd see if I could whip up a quick little CFC. 

It turned out to be rather easy. My CFC supports everything the API does:

<ul>
<li>Get latest, most popular, and highest rated themes
<li>Search themes
<li>And it also provides a few utility functions to make linking a bit easier.
</ul>

Check out the sample code below:

<code>

&lt;cfset k = createObject("component", "kuler")&gt;

&lt;cfdump var="#k.getRecent()#" label="Recent" top="3" expand="false"&gt;

&lt;cfdump var="#k.getPopular()#" label="Popular" top="3" expand="false"&gt;

&lt;cfdump var="#k.getHighestRated()#" label="Highest Rated" top="3" expand="false"&gt;

&lt;cfoutput&gt;
&lt;a href="#k.getThemeURL(11)#"&gt;&lt;img src="#k.getThumbURL(11)#"&gt;&lt;/a&gt;
&lt;/cfoutput&gt;

&lt;cfdump var="#k.search('ocean')#" label="Search for ocean" top="3"&gt;

&lt;cfdump var="#k.search(title='Asian')#" label="Search for title=Asian" top="3"&gt;
</code><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive9%{% endraw %}2Ezip'>Download attached file.</a></p>