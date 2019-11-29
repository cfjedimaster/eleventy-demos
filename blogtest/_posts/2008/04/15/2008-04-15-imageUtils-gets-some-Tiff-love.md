---
layout: post
title: "imageUtils gets some Tiff love"
date: "2008-04-15T12:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/15/imageUtils-gets-some-Tiff-love
guid: 2769
---

Everyone's favorite image utility CFC (<a href="http://imageutils.riaforge.org">imageUtils</a>) got some really nice Tiff support thanks to Daniel Budde II. New functions include:

<ul>
<li>isMultiTiff - Returns true if the Tiff image has multiple pages
<li>isTiff - Returns true if the image is a Tiff. I found it a bit odd that none of the CF8 image functions seem to tell you <i>kind</i> of image you have (unless I'm missing the obvious)
<li>tiffPageCount - Returns the number of pages in the Tiff
<li>tiffSplit - lets you get pages from a multipage Tiff
<li>tiffToPDF - this is a cool one - as you can guess, it turns a Tiff file into a PDF. Works awesome with multi-page Tiffs.
</ul>

Thanks again to Daniel Budde II!