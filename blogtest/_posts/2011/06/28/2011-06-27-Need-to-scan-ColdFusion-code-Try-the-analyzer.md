---
layout: post
title: "Need to scan ColdFusion code? Try the analyzer"
date: "2011-06-28T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/28/Need-to-scan-ColdFusion-code-Try-the-analyzer
guid: 4286
---

This recently came up on cf-talk and I thought I'd share the idea here as well. A poster to cf-talk had an issue where he was given an <i>extremely</i> large code base with lots of errors in it. In his case, the errors were compile time base - things that would immediately throw an error when loaded by ColdFusion. (For an example of compile time versus run time errors, see the very end of this post.) His particular error was consistent - bad use of pound signs, so perhaps something like this.
<!--more-->
<p/>

<code>
&lt;cfoutput&gt;My name is #user.name&lt;/cfoutput&gt;
</code>

<p/>

Or less obvious, but still an error...

<p/>

<code>
&lt;cfoutput&gt;
lots of stuff...
&lt;span style="color:#ff000"&gt;Red!&lt;/span&gt;
&lt;/cfoutput&gt;
</code>

<p/>

So - the discussion on cf-talk mainly centered around how to use regular expressions to dig into the code base and find these out. I recommended another approach though - the ColdFusion Administrator's <b>Code Analyzer</b>.

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip130.png" />

<p/>

This is a tool not many people make use of - and frankly - it's a bit rusty. But it <i>does</i> work and can actually find syntax errors like described above. On the flip side it does seem to find many false positives. So if you use isNull for example, it warns you that in ColdFusion 9 isNull was added as a built in function. It assumes you wrote your own UDF and there will be a conflict. Unfortunately there is no way to turn that off unless you simply don't check for isNull. Let's look at how you would do that, and even better, how to make the Code Analyzer simply focus on errors. Click the Advanced Options button first.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip131.png" />

<p/>

Notice the Filter by Severity drop down. This allows you to focus on errors. You can look at the other options if you want, but you probably just want to leave these be. In  my earlier tests, the one where isNull kept popping up and I knew it wasn't an error, I just deselected isNull in the function drop down. Here's a screen shot from a parse of my system.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip132.png" />

<p/>

Another option, mentioned by Peter Boughton on the cf-talk list, is to use cfcompile. This is a command line tool so you won't get the pretty list of results, but it's another option. 

<p/>

I mentioned earlier the idea of compile time versus run time error. A compile time error is something that prevents ColdFusion from parsing your code. This is typically a syntax error. A run time error is something that will occur when your files are run. A simple example of that is outputting url.x and not accounting for url.x not being defined.