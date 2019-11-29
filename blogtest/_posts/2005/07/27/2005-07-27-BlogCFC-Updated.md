---
layout: post
title: "BlogCFC Updated"
date: "2005-07-27T19:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2005/07/27/BlogCFC-Updated
guid: 649
---

A very, very minor BlogCFC update has been released. The core CFC will still say version 3.8, but I'm calling this 3.8.1. Anyway - the changes....

<ul>
<li>There was a wierd little bug in BlueDragon with listDeleteAt. Imagine this string: http://www.foo.com/index.cfm. If you consider the / as the delimiter, this should be a 3 item list, since the null entry (//), is ignored. My code wanted to get everything from that string except the end part (/index.cfm), so I did a listDeleteAt on the URL using listLen. This worked fine, but in BD, it "removed" the null entry. So I ended up with http:/www.foo.com. I logged a bug with New Atlanta. Since the code was kind of silly anyway, I just replaced it with a regex and it should work fine on both.
<li>This leads to another issue regarding the "BlogURL" setting in the ini file. You MUST use the full URL when writing this setting. I.e., <b>don't</b> use "http://www.foo.com". Instead, use "http://www.foo.com/index.cfm." I updated the Word doc to make this more clear. (Everyone reads the docs, right?)
</ul>