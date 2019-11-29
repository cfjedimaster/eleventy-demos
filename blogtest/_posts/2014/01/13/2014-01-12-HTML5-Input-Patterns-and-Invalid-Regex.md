---
layout: post
title: "HTML5 Input Patterns and Invalid Regex"
date: "2014-01-13T07:01:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2014/01/13/HTML5-Input-Patterns-and-Invalid-Regex
guid: 5122
---

<p>
This is just a quick note to discuss something interesting a reader and I encountered last week. As you know (hopefully!), the input tag supports a pattern argument. The value of the pattern argument is a regular expression that is compared against the value of the input field. This allows for custom types of validation for data not covered by the host of new field types added in HTML5.
</p>
<!--more-->
<p>
But here's an interesting question. What exactly happens when you supply a <i>bad</i> regular expression? As you might expect - absolutely nothing. A reader on my blog noticed that a pattern value he had used was letting everything pass and not validating as he expected. When this happens, nothing will show up in the console and you really don't have a good idea as to what is going on.
</p>

<p>
Luckily there is a way to check for this. First - note that the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input">Mozilla Dev Network docs on Input</a> say this about pattern:"The regular expression language is the same as JavaScript's." This is probably obvious, but when it comes to browsers, I try not to assume anything. But armed with this knowledge you have a simple way to double check your patterns before using them in an input field.
</p>

<p>
I opened up my console, took his regex, and simply put it in a new <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp">RegExp</a> object. The second I pasted in his bad regex, I got an error. Here is an example:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_1_13_14__7_07_AM.png" />
</p>

<p>
Something to keep in mind, folks!
</p>