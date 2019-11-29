---
layout: post
title: "A \"Gotcha\" with Auto Suggestions in ColdFusion 8"
date: "2007-07-23T17:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/23/A-Gotcha-with-Auto-Suggestions-in-ColdFusion-8
guid: 2213
---

A reader just sent me a bug report where he noticed that his autosuggestions didn't seem to work right in ColdFusion 8. The same dataset was returned from two things he typed into the box. One worked - and one did not.

Turns out he had typed, for example, "cat", and expected to see suggestions with the word cat <i>anywhere</i> in the result. He had written his back end SQL that way. He saw words with "cat" in the middle being returned, but they refused to show up as suggestions.

Turns out CF's autosuggest will ignore any result that doesn't start the letters you typed in the box. This is a reasonable choice as it is what most folks want. Spry works the same way, but does have an option to do internal matching as well. I've filed an ER with Adobe, but wanted to blog the issue in case others run into it as well.