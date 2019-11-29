---
layout: post
title: "ColdFusion 8 Ajax Browser Support"
date: "2008-06-21T11:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/21/ColdFusion-8-Ajax-Browser-Support
guid: 2894
---

I was asked this a few times, but what is the official supported browser list for ColdFusion 8 Ajax support. I kept telling people to check the Developer's Guide, but it isn't there. You have to look in the CF8 Release Notes. From that:

<blockquote>
<p>
To use ColdFusion AJAX features, you must have one of the
following browsers:
*Firefox 1.5 and later<br />
*Internet Explorer 6 and later<br />
*Safari 2.0 and later<br />
</p>
</blockquote>

I had thought IE5 would work as well, but I was wrong. Note that 8.0.1's release notes mentions this:

<blockquote>
<p>
The FCKEditor component used in the cftextarea tag's rich text editor has been updated to
version 2.5. As a result, the rich text editor now supports Safari 3 and Opera 9.50 browsers.
</p>
</blockquote>

This seems to imply Opera can be used as well, but without it being on the "official" 8.0 release notes, I'd probably guess that support isn't complete. 

If you are on a browser that isn't officially listed, let's say Opera, it doesn't mean you are totally out of luck. Not all the Ajax stuff is front end related. Don't forget about support for returnFormat and JSON on the server side.