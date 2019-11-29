---
layout: post
title: "Spry Validation: Textarea"
date: "2007-12-17T11:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/12/17/Spry-Validation-Textarea
guid: 2544
---

It's been a while since I reviewed a Spry Validation example, so I thought I'd take a few minutes this morning to demonstrate another example - the Textarea validation. As with the other validation types (I've linked to my examples below), you begin by including a CSS and JavaScript library:
<!--more-->
<code>
&lt;html&gt;
&lt;head&gt; 
&lt;script src="/spryjs/SpryValidationTextarea.js" type="text/javascript"&gt;&lt;/script&gt; 
&lt;link href="/sprycss/SpryValidationTextarea.css" rel="stylesheet" type="text/css" /&gt; 
&lt;/head&gt;
</code>

You next take your textarea, and wrap it in a span:

<code>
&lt;span id="sprytextarea1"&gt;
	&lt;textarea name="textarea1" id="textarea1" cols="45" rows="5"&gt;&lt;/textarea&gt;
&lt;/span&gt;
</code>

As with the other validation types, the span wrap acts like a 'marker' to Spry to help it work with your form field and validation. 

Next we "enable" validation:

<code>
&lt;script type="text/javascript"&gt;
var sprytextarea1 = new Spry.Widget.ValidationTextarea("sprytextarea1");
&lt;/script&gt;
</code>

The ID passed to ValidationTextarea is the ID used for the span that wraps the textarea. As before, we can add a simple validation message to require the textarea:

<code>
&lt;span class="textareaRequiredMsg"&gt;A value is required.&lt;/span&gt;
</code>

Spry automatically hides/shows this span based on the value in the textarea. You can see a super exciting demo of this here:

<a href="http://www.raymondcamden.com/demos/spryform/textarea.html">http://www.coldfusionjedi.com/demos/spryform/textarea.html</a>

Where things get interesting are all the little options you have with validation. I bet the one folks will use most is the maxChars option. As you can guess, this lets you set a maximum number of characters. You can enable this like so:

<code>
var sprytextarea1 = new Spry.Widget.ValidationTextarea("sprytextarea1", {% raw %}{maxChars:100}{% endraw %});
</code> 

What's interesting is that there doesn't seem to be a corresponding span error class for this. I tried:

<code>
&lt;span class="textareaMaxCharsMsg"&gt;You typed more than 100 characters!&lt;/span&gt;
</code>

But it never showed up. Instead - Spry blocked the characters. When I tried to type more than 100, I was stopped. If I pasted a big block, it got cropped. I guess the team figured there was no need to support a message for something you couldn't do. 

There is a minChars option as well, and the message does instead work for that:

<code>
&lt;span class="textareaMinCharsMsg"&gt;You need to type 5 chars!&lt;/span&gt;
</code>

Spry also supports a counter, which is nice. You can either show people how many characters they have left, or show them how many they have typed, or both! Here is a simple example of showing the number of characters. First, we add a new span:

<code>
Chars Remaining: &lt;span id="my_counter_span"&gt;&lt;/span&gt;
</code>

Note the ID. Now when I create my validation object, I enable the character counter with two options:

counterType:"chars_remaining"

This tells Spry to show the number of characters left. I'd use "chars_count" to show the total number of characters typed.

counterId:"my_counter_span"

This simply tells Spry what span id to update. Simple, right?

Another cool little feature is "hint" - the hint attribute lets you put a hint inside the textarea telling the user what to type:

hint:"Enter Wisdom"

On initially loading the form, the user would see "Enter Wisdom" in the textarea. As soon as they click, the text goes away.

You can see a demo of all of the above here: 

<a href="http://www.coldfusionjedi.com/demos/spryform/textarea2.html">http://www.coldfusionjedi.com/demos/spryform/textarea2.html</a>

Lastly, to see the complete docs for the Textarea validator, see the online version:
<a href="http://labs.adobe.com/technologies/spry/articles/textarea_overview/index.html">http://labs.adobe.com/technologies/spry/articles/textarea_overview/index.html</a>