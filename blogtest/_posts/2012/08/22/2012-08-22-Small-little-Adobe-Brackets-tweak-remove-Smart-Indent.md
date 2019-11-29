---
layout: post
title: "Small little Adobe Brackets tweak - remove Smart Indent"
date: "2012-08-22T11:08:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2012/08/22/Small-little-Adobe-Brackets-tweak-remove-Smart-Indent
guid: 4710
---

This may come as a shocker, but I'm <i>really</i> particular about my editor settings. I'm sure no one else is, but I get pretty darn picky about my editor and how it behaves. One issue I've had with <a href="https://github.com/adobe/brackets">Brackets</a> is a feature called "Smart Indent."
<!--more-->
Smart Indent will automatically indent your cursor after you hit enter on a block expression. Not sure if "block expression" is the best term, but basically, if you enter a conditional, like if(x), or if you enter a HTML tag that wraps other tags, like &lt;table&gt;, Brackets will indent your cursor one "block" over after you hit enter. 

This bugs the heck out of me. While I do use indentation, I don't always use it. So for example, I don't like to indent my HEAD or BODY blocks. It feels silly to me to have one pair of HTML tags at the left gutter and nothing else. I'll not indent TR blocks inside of TABLE tags either, but I do indent the TDs.

Basically - my rule is - and I try to be consistent here - that if the wrapping block has nothing else in it but one main child, I don't see much point in indenting over the text.

When I type in Brackets, I constantly find myself having to hit backspace to return the cursor to where I want it. After a while I begin to see red and start wondering if therapy is in order.

Turns out though it is pretty easy to correct. If you go into the source code and find editor/Editor.js, you can see the following block where the CodeMirror object is instantiated:

<script src="https://gist.github.com/3426101.js?file=gistfile1.js"></script>

I checked the CodeMirror docs and found that I could pass a setting, smartIndent:false, to disable this.

<script src="https://gist.github.com/3426106.js?file=gistfile1.js"></script>

And that's it. To be clear, when I hit enter, the cursor still indents to where the last line began. It isn't flush against the left gutter. 

There is no "Preferences" UI yet for Brackets. I could make this an extension, but since I assume I'm probably in the minority when it comes to this preference and the modification is so small, I wouldn't bother creating one.