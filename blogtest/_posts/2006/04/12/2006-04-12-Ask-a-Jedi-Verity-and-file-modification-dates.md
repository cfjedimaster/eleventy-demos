---
layout: post
title: "Ask a Jedi: Verity and file modification dates"
date: "2006-04-12T16:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/12/Ask-a-Jedi-Verity-and-file-modification-dates
guid: 1205
---

I'm slowly going through old Ask a Jedi questions and found this one. (And just a reminder, <i>please</i> don't use me for serious, super-critical, urgent matters, I'm only human and can't respond to everything nor can I respond quickly. This question was from mid December.)
	
<blockquote>
I'm trying to get the modified date of each file in my Verity collection. I've read that you can do this by using CFFILE to get the modified date when you create the index. But how would you code that?
</blockquote>

There are a few different things you can do. First - don't forget that you can use cfdirectory and specify a full file name in the extension. This is covered in a <a href="http://www.coldfusioncookbook.com/entry/58/How-do-I-get-the-last-modified-date-on-a-file?">ColdFusion Cookbook entry</a>. Using this method, you would get the data as you display the results from the search. This puts the burden on the search page though and may make things a bit slow. If you go with this route, I'd highily suggest a simple RAM based caching so you don't have to look up the data on every search.

An alternative would be to not use the file/path indexing feature of the cfindex tag. Instead, use cfdirectory to get a list of files. This also returns the time the file was modified. Then you can use cfindex with type=file and pass in the modification date using one of the custom fields. The problem with this approach is that you will have a butt-load of cfindex calls and it will be very slow. However, indexing is normally done by an automated process, so it may not be that big of a deal.