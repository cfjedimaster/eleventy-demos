---
layout: post
title: "Ask a Jedi: Can you use string functions along with WDDX and JavaScript?"
date: "2005-07-28T17:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/28/Ask-a-Jedi-Can-you-use-string-functions-along-with-WDDX-and-JavaScript
guid: 650
---

Mike asks the following:

<blockquote>
As a new application service provider, we are currently using CFMX7 and its advanced features such as WDDX handling in our application. Through the CFWDDX tag, we are calling a database query and loading the result set with "cfml2js". Since this tag uses proprietary javascript to write to a single js variable, there is no way to actually handle/refer to the query variables (i.e. #query.id# or #query.account_name#), therefore it is impossible to use HTMLEditFormat(#query.variable#) to strip away html tags that may be in the data coming back. Is there anyway to using the WDDX feature and the HTMLEditFormat in conjunction? Please shine some jedi light on this topic.
</blockquote>

Ok, so a few notes here. WDDX isn't really new to CFMX7. It has been around for quite some time. That being said, it is rather handy. There is something like this that is new in CFMX7, the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/wwhelp/wwhimpl/common/html/wwhelp.htm?context=ColdFusion_Documentation&file=00000654.htm">ToScript</a> function. Either way, it isn't "proprietary JavaScript" per se, it is just that you do not have any control over the JS produced. 

That being said - you have two options. First, you can manipulate the data before you convert it to JavaScript. You can loop over the query and use the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/wwhelp/wwhimpl/common/html/wwhelp.htm?context=ColdFusion_Documentation&file=00000601.htm">querySetCell</a> function along with HTMLEditFormat. The other option is to do it in JavaScript. You said there is no way to refer to the query variables. Well, you can, but in JavaScript. JavaScript has regex style functions that would let you do something just like HTMLEditFormat. All things considered, though, you are better off doing it server-side instead.