---
layout: post
title: "Ask a Jedi: Controlling where ColdFusion looks to run a custom tag"
date: "2007-04-23T08:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/23/Ask-a-Jedi-Controlling-where-ColdFusion-looks-to-run-a-custom-tag
guid: 1973
---

Eric asks this question regarding custom tags and a move from ColdFusion 5 to MX:

<blockquote>
Our Application is still running with CF5 but since we have much more traffic on the site we also many problems that coldfusion crashes cause of memory leaks. To solve these problems we decided to upgrade to CFMX7. During tests i found out that <cfmodule> doesn't work in the same way as in CF5. We have the following structure in the CustomTags directory:

CustomTags<br>
at = country subdir austria<br>
de = language subdir german<br>
ch = country subdir switzerland<br>
de = language subdir german<br>
en = language subdir english<br>

normally every customtag is in the root directory but if there are special needs there can be also a version (same name) in one of the upper shown directory structure.
when i called a custom tag in CF5 <cfmodule name="blahblah"> the one from the root directory was called but in CFMX7 the one in a subdirectory will be used (if there's a copy of BlahBlah). Is there a way to fix these behavoir that CFMX7
uses customstags from subdir first?
</blockquote>

The name attribute of <a href="http://www.cfquickdocs.com/?getDoc=cfmodule">cfmodule</a> is a syntax that I do not normally use. In a way, it is a bit closer to cf_ syntax in that you don't specify a full name, but just the name of the tag. The syntax does let you specify subdirectories though. You <i>should</i> have been able to do something like this in your code:

<code>
&lt;cfmodule name="en.login"&gt;
</code>

Or - if the language was determined at runtime:

<code>
&lt;cfmodule name="#session.language#.login"&gt;
</code>

But it sounds like you had a login (and I"m just using that name as an example) in your root custom tag folder as well. I just ran a test on my machine with a "hello.cfm" in the root of custom tags and one in a subfolder. Using cfmodule name="hello" resulted in the <b>root</b> tag being run, which seems right to me.

So what do I propose? The main reason I propose cfmodule to developers is that it lets you specify an exact path to a custom tag. No guessing is needed. I'd switch from using name to template. Then there would be zero confusion about which custom tag will run. It may take a little while to update your code base, but it should be worth the effort. 

Does anyone else use cfmodule with the name attribute?