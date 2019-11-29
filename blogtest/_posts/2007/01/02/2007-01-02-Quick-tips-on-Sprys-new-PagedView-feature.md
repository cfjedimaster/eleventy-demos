---
layout: post
title: "Quick tips on Spry's new PagedView feature"
date: "2007-01-02T17:01:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/01/02/Quick-tips-on-Sprys-new-PagedView-feature
guid: 1746
---

Here are a few quick tips if you want to use the new <a href="http://labs.adobe.com/technologies/spry/samples/data_region/SpryPagedViewSample.html">PagedView</a> support in Spry (remember, this code isn't yet in the "released" version). 

First - if you want to use sorting with PagedView datasets, you sort the <i>original</i> dateset, not the PagedView. So imagine this code:

<code>
var dsContent = new Spry.Data.XMLDataSet("/index.cfm?event=xml.getcontent&dd_class=#class.getID()#","content/content");
dsContent.setColumnType("DOWNLOADS","number");

var pvContent = new Spry.Data.PagedView(dsContent, {% raw %}{ pageSize: 5 }{% endraw %});
</code>

I was doing my sort like so:

<code>
&lt;th onclick="pvContent.sort('DOWNLOADS','toggle')"&gt;DOWNLOADS&lt;/th&gt;
</code>

But the proper way is to sort the original dataset:

<code>
&lt;th onclick="dsContent.sort('DOWNLOADS','toggle')"&gt;DOWNLOADS&lt;/th&gt;
</code>

Secondly, Kin Blas (One of the Spry Guys), posted a <a href="http://www.adobe.com/cfusion/webforums/forum/messageview.cfm?catid=602&threadid=1226651">quick fix</a> to the Spry forums. Add this line of code to the bottom of SpryPagedView.js:

<code>
Spry.Data.PagedView.prototype.onPostSort = Spry.Data.PagedView.prototype.onDataChanged;
</code>

So - next on my plate is a demo that shows how to use paging both client side and server side. In other words, Spry will grab a portion (like 100 rows) of the total (lets go crazy and say one million rows total) and then let you page over "pages of pages" I suppose we can say.