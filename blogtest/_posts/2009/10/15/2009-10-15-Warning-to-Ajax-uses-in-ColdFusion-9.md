---
layout: post
title: "Warning to Ajax users in ColdFusion 9"
date: "2009-10-15T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/15/Warning-to-Ajax-uses-in-ColdFusion-9
guid: 3564
---

I've seen this come up a few times now so I thought I'd whip up a quick blog entry to help spread the word. One of the cooler aspects of ColdFusion 8's Ajax support was that it provided hooks to the underlying frameworks. So for example, when working with CFWINDOW, if you wanted to do something that ColdFusion didn't provide a JS API for, you would use getWindowObject to retrieve the actual Ext object. If you visited the Ext docs, you could then look for the API you wanted to use.

This worked fine - except that ColdFusion 8's Ext library was somewhat old. ColdFusion 9 corrected this and uses the latest (well, as far as I know, maybe Ext is a minor point or two ahead now) version. This means that - <b>potentially</b> - any code you have that made use of the API may no longer work. 

Here is an example that came in today - it uses the Grid API.

<code>
function initGrid(){
var grid = ColdFusion.Grid.getGridObject('maingrid');
var gridHead = grid.getView().getHeaderPanel(true);
var tbar = new Ext.Toolbar(gridHead);
...
</code>

This worked fine under ColdFusion 8, but fails in 9. I'm not terribly familiar with the latest Ext, but I'm sure the developer could find a new way of doing what he wanted to accomplish.

Not the end of the world for sure, but something to keep in mind. In <i>general</i>, if I feel the need to go "off the ranch" from Adobe's provided UI controls, I'd just end up using the library's code by itself.