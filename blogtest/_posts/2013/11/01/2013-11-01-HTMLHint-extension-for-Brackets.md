---
layout: post
title: "HTMLHint extension for Brackets"
date: "2013-11-01T13:11:00+06:00"
categories: [development,html5]
tags: []
banner_image: 
permalink: /2013/11/01/HTMLHint-extension-for-Brackets
guid: 5075
---

<p>
Earlier today I discovered <a href="http://htmlhint.com/">HTMLHint</a>, a linter for HTML documented. Based on how easy it is to <a href="http://blog.brackets.io/2013/10/07/new-linting-api/">write linting extensions for Brackets</a>, I downloaded the library and wrote a wrapper in approximately 10 minutes. Here's a screen shot of in action.
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/brackets.jpg" />
</p>

<p>
The linter itself is still a work in progress and doesn't seem to validate tag names themselves (I was able to use a poo tag), but seems pretty handy in general.
</p>

<p>
You can install this now via the extension manager or grab the bits from GitHub: <a href="https://github.com/cfjedimaster/brackets-htmlhint">https://github.com/cfjedimaster/brackets-htmlhint</a>
</p>

<p>
As a quick aside - I'm ashamed to admit that I have not always used linters. I had a JavaScript linter for Brackets (JSHint) but I didn't use it all the time. Now that the linting API can run linters automatically and pop open a set of issues I'm finding myself relying on them more and more. As an example, it is great for finding bugs that I'd have missed until I actually ran my code. 
</p>