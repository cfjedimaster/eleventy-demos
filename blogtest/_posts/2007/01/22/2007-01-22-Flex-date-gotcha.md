---
layout: post
title: "Flex date gotcha"
date: "2007-01-22T12:01:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2007/01/22/Flex-date-gotcha
guid: 1787
---

This surprised me. I was working with formatting a date value returned from ColdFusion. The dates looked like so:

<blockquote>
Thu Sep 28 17:34:21 GMT-0500 2006
</blockquote>

I used a dateFormatter with a format string of M/D/YYYY. Something odd happened to the year value though. My years were all 500. I'm pretty sure there were no users for my application around back then. 

Turns out the problem was in how I was passing the date to the dateFormatter. This was my first draft:

<code>
private function dateLabelFunction(item:Object, column:DataGridColumn):String {
	var theValue:String = item[column.dataField];
	return myDateFormatter.format(theValue);
}
</code>

It seems like the dateFormatter object doesn't quite grok the GMT portion of the date. Which seems odd - I mean - it's not like that isn't a known format. What makes it even more odd is that when I switched to creating a date object first, and then formatting it, it worked just fine:

<code>
private function dateLabelFunction(item:Object, column:DataGridColumn):String {
	var theValue:String = item[column.dataField];
	var theDate:Date = new Date(theValue);
	return myDateFormatter.format(theDate);
}
</code>

So the Date constructor had no issue with the string, but the formatter did not. I would imagine they would have used the same core code?