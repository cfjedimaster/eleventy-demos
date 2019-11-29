---
layout: post
title: "Ask a Jedi: Multiple questions, few answers..."
date: "2006-02-14T10:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/14/Ask-a-Jedi-Multiple-questions-few-answers
guid: 1097
---

I got a few Ask a Jedi questions this week that shared one common characteristic - none of them had a "good" answer. Therefore I thought it would be perfect to combine them into one post. If anything, it just goes to show you that ColdFusion provides <i>multiple</i> solutions to a problem, and like many things in life, there isn't one correct answer. Let's start with the first question:
<!--more-->
<blockquote>
When is it best to have/not have an ending tag with a CFMODULE?
</blockquote>

Never. Always. Seriously - it depends. You use a end tag when you want to have "wrapping" logic. HTML is a great example of this. The tag, &lt;B&gt;, tells the browser to <i>begin</i> bolding text. The tag, &lt;/B&gt;, tells the browser to <i>stop</i> bolding text. What are some cases where you might need this in custom tags? Layout is one example. I typically wrap my site content with code like so:

<code>
&lt;cfmodule template="/siteroot/customtags/layout.cfm" title="Main"&gt;
stuff
&lt;/cfmodule&gt;
</code>

This starts a layout (basically includes a header), runs the code inside, and then ends a layout (includes a footer). That's one example, but there are others as well.

Basically the question you want to ask yourself is - does this custom tag have the concept of doing something when starting up and when ending. If not, you do not need a closing tag. 

However - there is something to remember. A person may decide to call your custom tag like so:

<code>
&lt;cf_foo /&gt;
</code>

Notice the fancy self-closing XHTML usage. Cool, eh? Well, what happens then is that your custom tag will actually run twice. This is probably something you don't want to happen, but it is easy to fix. You can either check for the execution mode (this is a variable ColdFusion sets to let you know if the tag is running in "start" or "end" mode, or use cfexit. Here is method one:

<code>
&lt;cfif thisTag.executionMode is "start"&gt;
do stuff
&lt;/cfif&gt;
</code>

And here is method two:

<code>
&lt;cfexit method="exitTag"&gt;
</code>

I definitely prefer method two as it prevents you from needing to wrap your entire custom tag in a CFIF. Just make that line that last line of your custom tag. (By the way, whether you use cf_foo, or cfmodule, the same rules apply.)

Brian asks:

<blockquote>
Is there an advantage of using either of these built in functions over the other? Fix(), Int(), Round().
</blockquote>

Nope. Use the one that makes sense. Seriously - I'm not being flippant. You should use the function that does what you want to do with your numbers.

Tuyen (and what a cool name is that):

<blockquote>
In your opinion, what would be the best CF frameworks?

Fusebox/ColdSpring/ModelGlue/Mach II/onTap/Tartan/theHUB...?
</blockquote>

I think I've answered this before. <i>My</i> favorite framework is <a href="http://www.model-glue.com">Model-Glue</a>, but if you ask 10 people you will get 10 different answers. (And readers, please don't post comments 'voting' on frameworks. ;) My suggestion is that you check out <b>all</b> the frameworks and see which one works best for you. You may need to actually <i>build</i> a site to figure this out. I was rebuilding <a href="http://www.cflib.org">CFLib.org</a> in Mach II and discovered that I really didn't care for it. No offense to Mach II folks, it just didn't work for me. Model-Glue did. But it was a strictly personal feeling, nothing more.