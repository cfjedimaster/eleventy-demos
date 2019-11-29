---
layout: post
title: "Sunday Quickie - Bookmarklet to Fix Forms that Disable autocomplete"
date: "2014-03-23T10:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2014/03/23/Sunday-Quickie-Bookmarklet-to-Fix-forms-that-disable-autocomplete
guid: 5182
---

<p>
<b>Edit on February 14, 2017:</b> I modified the code to handle autocomplete being set in input fields as well.
</p>

<p>
I don't know about you, but when I see a form that has disabled autocomplete, I get pretty upset:
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/Screenshot_3_23_14__8_48_AM.png" />
</p>

<p>
I understand the logic behind doing so on certain secure forms, but when I ran into this a few minutes ago for a freaking <strong>survey</strong> I wanted to punch my screen. (Ok, maybe I need to take a deep breath and relax too. ;)
</p>

<p>
For the heck of it, I wrote a quick bookmarklet to fix this problem. A bookmarklet is simply a set of JavaScript code in a bookmark. I've added this bookmark to my main toolbar so it is one click away. Just add the following:
</p>


<pre><code class="language-javascript">javascript:forms = document.querySelectorAll("form, input");for(var i=0;i&lt;forms.length;i++) {% raw %}{ forms[i].removeAttribute("autocomplete"); }{% endraw %}</code></pre>

<p>
I'm sure this could be written better (maybe instead of always removing the attribute it could always <i>enable</i> it), but on my limited testing (the form that ticked me off) it worked perfectly.
</p>