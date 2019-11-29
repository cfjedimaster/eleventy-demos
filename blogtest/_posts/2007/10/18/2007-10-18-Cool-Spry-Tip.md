---
layout: post
title: "Cool Spry Tip"
date: "2007-10-18T13:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/10/18/Cool-Spry-Tip
guid: 2422
---

I missed this from two versions ago or so, but Spry has a new attribute to make master/detail work a bit easier. In the past, you would typically use code like this to display a set of data and allow a user to click to load a detail region:

<code>
&lt;tr spry:repeat="mydata" onclick="mydata.setCurrentRow('{% raw %}{ds_RowID}{% endraw %}');"&gt;
</code>

Notice the onclick? This tells Spry to update the current selected row. This is now done like so:

<code>
&lt;tr spry:repeat="mydata" spry:setrow="mydata"&gt;
</code>

Love it. One more line of JavaScript removed.