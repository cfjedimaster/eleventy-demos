---
layout: post
title: "Spry 1.4: Spry.utils.updateContent"
date: "2006-12-17T13:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/12/17/Spry-14-SpryutilsupdateContent
guid: 1719
---

Another cool new feature of Spry 1.4, and I don't even have to write a blog entry on it. Bruce Phillips has a <a href="http://www.brucephillips.name/blog/index.cfm/2006/12/17/How-To-Use-Sprys-SpryutilsupdateContent-Function-To-Update-Content-Without-Reloading-The-Web-Page">blog entry</a> and <a href="http://www.brucephillips.name/spry/updatecontentexample/">demo</a> showing off this new feature. At a basic level it gives you a super simple function to change the content of a element with another URL. So an example, if foo was an element, this would replace it with another URL:

<code>
Spry.Utils.updateContent('foo', 'mynewdata.cfm');
</code>

You can even fire off a function automatically when the data is downloading.