---
layout: post
title: "Ask a Jedi: ColdFusion 8 and Ext"
date: "2007-11-17T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/17/Ask-a-Jedi-ColdFusion-8-and-Ext
guid: 2480
---

Johansen asks what I think is a common question now with ColdFusion 8 and it's Ajax features:

<blockquote>
<p>
When I look in FireBug's list of included JS-files, and now in the article on Jason Delmore's Blog. It looks like the "EXT JS" library is included in CF8. Maybe it is me, but I have not yet found any documentation on how to use the "EXT JS" in my CF code.
</p>
</blockquote>

That's because you aren't supposed to - not really anyway. "Ext" is not an official part of ColdFusion 8, it is just how ColdFusion 8 does it's Ajax magic. Now what I just said isn't 100% true. If you look at your ColdFusion Reference (and I hope you have), you will see a whole section on CF/JavaScript stuff called: Ajax JavaScript Functions

This chapter talks about the various JavaScript functions you can use to help you with ColdFusion 8 Ajax development. Some of these functions relate specifically to Ext:

ColdFusion.Grid.getGridObject<br>
ColdFusion.Layout.getBorderLayout<br>
ColdFusion.Layout.getTabLayout<br>
ColdFusion.Window.getWindowObject<br>

Each of these functions will get you access to the underlying Ext objects used to drive the grids, borders, tabs, and windows. On a related note - ColdFusion.Tree.getTreeObject works the same way, but gets a  YUI object instead (from the Yahoo library). 

So if you do know Ext, you can use these functions to get the objects and call various methods on them. For an example, see my post on <a href="http://www.raymondcamden.com/index.cfm/2007/8/20/Custom-grid-renderers-with-CFGRID">custom grid renderers</a>. 

Technically you could call this "using Ext", but I don't think it is exactly fair to say you have Ext in CF 8. If I were building an Ajax site from scratch and wanted to use other features of Ext, I would <i>not</i> rely on the libraries that ColdFusion ships and would instead download them direct from Ext instead. It is possible that in future version of ColdFusion, Adobe may switch to a completely new underlying Ajax library. (I doubt it - but...)