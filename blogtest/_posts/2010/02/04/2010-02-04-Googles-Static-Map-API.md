---
layout: post
title: "Google's Static Map API"
date: "2010-02-04T22:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/04/Googles-Static-Map-API
guid: 3708
---

I discovered something cool today - Google has a <a href="http://code.google.com/apis/maps/documentation/staticmaps/">"Static" Maps API</a>. What is that exactly? While Google Maps is <i>very</i> powerful, it requires the use of JavaScript. For simple maps, or for embedding maps into PDFs, you can't use regular Google Maps. This gets around it. The API is a simple URL based service that returns the image in binary form. So for example, to create a map for my area, I'd use this URL:
<!--more-->
<p>

http://maps.google.com/maps/api/staticmap?center=Lafayette{% raw %}%2C%{% endraw %}20LA&zoom=13&key=ABQIAAAAnKqaqda06cMGIKQ6i1ekrRT2yXp{% raw %}%5FZAY8%{% endraw %}5FufC3CFXhHIE1NvwkxT2gB6zcbOMt6hlm0jA8TKTSu9K3g&sensor=false&size=400x400

<p>

Which produces:

<p>

<img src="http://maps.google.com/maps/api/staticmap?center=Lafayette{% raw %}%2C%{% endraw %}20LA&zoom=13&key=ABQIAAAAnKqaqda06cMGIKQ6i1ekrRT2yXp{% raw %}%5FZAY8%{% endraw %}5FufC3CFXhHIE1NvwkxT2gB6zcbOMt6hlm0jA8TKTSu9K3g&sensor=false&size=400x400">

<p>

The URL contains multiple arguments. You can see the address, the zoom, a size, and, yes, my Google Maps key. But since I only use it for localhost I'm not too worried about it. The <a href="http://code.google.com/apis/maps/documentation/staticmaps/">docs</a> contain the full API and demonstrate how you can even use markers and overlays on the maps. 

<p>

I tried a PDF version and noticed something odd. Whenever I embedded the URL directly in the PDF, it failed. If I fetched the image and save it first, it worked fine, like in the example below:

<p>

<pre><code class="language-markup">
&lt;cfset key = "ABQIAAAAnKqaqda06cMGIKQ6i1ekrRT2yXp_ZAY8_ufC3CFXhHIE1NvwkxT2gB6zcbOMt6hlm0jA8TKTSu9K3g"&gt;
&lt;cfset size = "400x400"&gt;
&lt;cfset loc = "Lafayette, LA"&gt;
&lt;cfset zoom = 13&gt;
&lt;cfset img = "http://maps.google.com/maps/api/staticmap?center=#urlEncodedFormat(loc)#&zoom=#zoom#&key=#urlEncodedFormat(key)#&sensor=false&size=#size#"&gt;

&lt;cfset o = imageNew(img)&gt;
&lt;cfset imageWrite(o, expandPath("./mygooglemap.png"))&gt;

&lt;cfdocument format="pdf" name="mypdf"&gt;
&lt;h1&gt;Our Store!&lt;/h1&gt;

&lt;img src="/mygooglemap.png" align="right"&gt;
&lt;p&gt;
fjdsk lfjklsdjf jfkdk lfklsjkfl dskfd ksl fklfkl fklk lfkldsfklfk lsdfkljsdfkls
fjdsk lfjklsdjf jfkdkl fklsjkfl dskfd kslfklfklfklk lfkldsfklfk lsdfklj sdfkls
fjdsk lfjklsdjf jfkdklfklsjkfl dskfd ksl fklfklfklk lfkldsfklfk lsdfkljsdfkls
fjdsk lfjklsdjf jfkdklf klsjkfl dskfd kslfklfklfklk lfkldsfklfk lsd fkljsdfkls
fjdsk lfjklsdjf jfkdklfklsjkf l dskfd kslfklf klfklk lfkldsfklfk lsdfkljsdfkls
&lt;/p&gt;

&lt;/cfdocument&gt;

&lt;cfset fileWrite(expandPath("./googlemap.pdf"), mypdf)&gt;
</code></pre>

<p>

I even whipped up a quick UDF to make it simpler to use:

<p>

<pre><code class="language-javascript">
function getStaticMap(string key, string address, string size, numeric zoom) {
	return "http://maps.google.com/maps/api/staticmap?center=#urlEncodedFormat(arguments.address)#&zoom=#arguments.zoom#&key=#urlEncodedFormat(arguments.key)#&sensor=false&size=#arguments.size#";
}
</code></pre>

<p>

Anyway, there is a lot more to the API, but for those looking for maps you can store offline, or embed in PDFs, then this looks a great resource. (Oh, and let me bitch a bit a little bit here. I really wish the main Google Maps API would let you pass in an address instead of making you have to perform a geolocation request first. It seems silly that I'd need to make 2 HTTP requests for a map when Google should let me just pass the address in the initial map setup request.)