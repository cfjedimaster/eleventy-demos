---
layout: post
title: "Using ReplaceList and null replacements"
date: "2010-12-15T15:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/15/Using-ReplaceList-and-null-replacements
guid: 4054
---

I had an interesting conversation (well, set of emails) with a reader today who had an interesting problem. Given an input string, he needed to remove some special characters and change spaces to underscores. He knew he could do it with a few Replace calls but wasn't sure if he could do it in one quick function call. I recommend <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-6e17.html">replaceList</a>. Let's look at an example of this and then I'll demonstrate what I found with null replacements.
<!--more-->
<p>

First, let's take an initial string:

<p>

<code>
&lt;cfset string = "This is $stuff with % things I don't like it."&gt;
</code>

<p>

And then let's replace the special characters and spaces:

<p>

<code>
&lt;!--- replace $ with nothing, % with nothing, and spaces with _ ---&gt;
&lt;cfset clean = replace(string, "$", "", "all")&gt;
&lt;cfset clean = replace(clean, "%", "", "all")&gt;
&lt;cfset clean = replace(clean, " ", "_", "all")&gt;
</code>

<p>

This returns: This_is_stuff_with__things_I_don't_like_it. That's perfect - but can we make the code a bit tighter? A reReplace would let me combine the first two calls into one - but let's look at how replaceList can do all three at once. replaceList is simple. Given an input string, take any found instance of the Nth item of a list with the Nth item of a second list. So for example:  replaceList(string, "a,b,c", "1,2,3"). This implies that any "a" should be changed to a 1, any "b" with a 2, and any "c" with a 3.

<p>

So given that, let's try to combine our three replace calls with one list. The question is - how do you handle replacing $ and % with nothing? I tried using empty list elements like so:

<p>

<code>
&lt;cfset clean = replaceList(string, "$,%, ", ",,_")&gt;
</code>

<p>

But it produced: Thisis_stuffwiththingsIdon'tlikeit. Not exactly what I expected. It looks like it replaced all spaces and the {% raw %}% with nothing. The one $ character was replaced with an underscore. I'm guessing the logic was to ignore the empty list values in the second list and basically act as if I had done:  replaceList(string, "$,%{% endraw %}, ", "_"). Apparently replaceList automatically says, "if you ask me to replace items in list 1 and it's bigger than list 2, I'll treat the rest as being replaced with nothing."

<p>

So given that - if we change things up a bit, we should be ok:

<p>

<code>
&lt;cfset clean = replaceList(string, " ,$,%", "_")&gt;
</code>

<p>

Basically the idea is - start off with the things you want to have true replacements for - spaces and underscores. Then list the things you just want nuked after. This gives us: This_is_stuff_with__things_I_don't_like_it.

<p>

The last tip I had for the user - and I'd suggest this any time - was to turn the code above into a UDF. Yeah it's pretty darn short, but the logic is something you'll probably do in more than one place. Wrapping it into a quick UDF gives you an easy way to ensure you can change the logic later on.