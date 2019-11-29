---
layout: post
title: "Quick Tip - CFLOG and JSON"
date: "2009-11-19T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/19/Quick-Tip-CFLOG-and-JSON
guid: 3613
---

As my friends will tell me, I'm something of a cflog fiend. I use logging as my primary debugging tool. It's not perfect, but I find it to be especially effective in Model-Glue applications where one request bounces all over the place from controllers to model files to views. The only problem with cflog though is that it can only log text, not complex data. You can always switch to cfdump for that - don't forget that ColdFusion 8 added the ability to dump to a file. While this works, I prefer the "slimness" of a line of text. So when I need to log some complex data, I just use JSON. For example:

<code>
var userData = maf.login(arguments.username, arguments.password);
writeLog(file='picard',text='login good for #arguments.username#');
writeLog(file='picard',text=serializeJSON(userData));
return userData;
</code>