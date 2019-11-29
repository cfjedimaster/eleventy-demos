---
layout: post
title: "Ask the Jedi: Counting characters and lines with Spry"
date: "2008-12-17T09:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/12/17/Ask-the-Jedi-Counting-characters-and-lines-with-Spry
guid: 3152
---

Barbara asks:

<blockquote>
<p>
Ray, we are almost finished with a card site and we recently added the spry widget for text area to count the characters however, we need one more piece because we also need to account for carriage returns which is a database element. I looked through the JavaScript widget and it is obviously issing
however was wondering if you knew of any way to account for it.
</p>
</blockquote>

Ah, interesting question there. For folks who may not remember, Spry has a textarea widget that allows for some fun validation rules. I discussed this in an earlier <a href="http://www.raymondcamden.com/index.cfm/2007/12/17/Spry-Validation-Textarea">blog entry</a> (<b>holy smokes</b> - that blog entry was <b>extactly</b> one year ago today!) which you may want to read over, but the basic problem is that while Spry makes it easy to count the characters, there is no built in support for line numbering. I played with this a bit and came up with the following.
<!--more-->
Let's first start with a simple character count demo. 

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script src="/spryjs/SpryData.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/spryjs/SpryValidationTextarea.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;link href="/sprycss/SpryValidationTextarea.css" rel="stylesheet" type="text/css" /&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;span id="sprytextarea1"&gt;
	&lt;textarea name="textarea1" id="textarea1" cols="45" rows="5"&gt;&lt;/textarea&gt;
&lt;/span&gt;
&lt;p/&gt;
Chars Remaining: &lt;span id="my_counter_span"&gt;&lt;/span&gt;&lt;br /&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;script type="text/javascript"&gt;
var sprytextarea1 = new Spry.Widget.ValidationTextarea("sprytextarea1", {% raw %}{maxChars:100,counterType:"chars_remaining",counterId:"my_counter_span"}{% endraw %});
&lt;/script&gt;
</code>

I'm not going to explain the code here as the <a href="http://www.coldfusionjedi.com/index.cfm/2007/12/17/Spry-Validation-Textarea">earlier entry</a> explains this well I think, but basically you can see that I tell Spry to monitor a textarea with the ID of sprytextarea1. I've also created a simple span that Spry will use for a character counter (technically a characters remaining counter).

I began my modifications by adding an event listener to the textarea. I used Spry's built in support for this by adding addEventListener:

<code>
Spry.Utils.addEventListener("textarea1","keyup",lineCounter,false);
</code>

This says: Add a onKeyUp event to textarea1 and call the lineCounter function. Now let's take a look at it:

<code>
&lt;script&gt;
var maxLines = 5;
function lineCounter(e) {
	var text = Spry.$("textarea1").value;
	var lines = text.split(/\n/);
	var remaining = maxLines - lines.length;
	if(remaining &lt; 0) { 
		//make new str of lines 0-4
		lines.pop();
		var newStr = lines.join('\n');	
		Spry.$("textarea1").value = newStr;
		remaining = 0;
	}
	Spry.$("lines_remaining").innerHTML="You have "+remaining+ " line(s) remaining.";
}
&lt;/script&gt;
</code>

I begin by getting the current text in the textarea. I split it on line numbers and figure out how many lines are remaining. The tricky part is what to do if there are too many. Spry will actually block (well, quickly delete) your text if you type too much, so I duplicated that behavior. I pop off that extra line of text, join them back together, and then update the textarea.

Lastly, I update a span with a message detailing how many lines remain. I added a new span just for this. The complete code is below. 

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script src="/spryjs/SpryData.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/spryjs/SpryValidationTextarea.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;link href="/sprycss/SpryValidationTextarea.css" rel="stylesheet" type="text/css" /&gt;
&lt;script&gt;
var maxLines = 5;
function lineCounter(e) {
	var text = Spry.$("textarea1").value;
	var lines = text.split(/\n/);
	var remaining = maxLines - lines.length;
	if(remaining &lt; 0) { 
		//make new str of lines 0-4
		lines.pop();
		var newStr = lines.join('\n');	
		Spry.$("textarea1").value = newStr;
		remaining = 0;
	}
	Spry.$("lines_remaining").innerHTML="You have "+remaining+ " line(s) remaining.";
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;span id="sprytextarea1"&gt;
	&lt;textarea name="textarea1" id="textarea1" cols="45" rows="5"&gt;&lt;/textarea&gt;
&lt;/span&gt;
&lt;p/&gt;
Chars Remaining: &lt;span id="my_counter_span"&gt;&lt;/span&gt;&lt;br /&gt;
Lines Remaining: &lt;span id="lines_remaining"&gt;You have 5 lines remaining.&lt;/span&gt;

&lt;/body&gt;
&lt;/html&gt;

&lt;script type="text/javascript"&gt;
var sprytextarea1 = new Spry.Widget.ValidationTextarea("sprytextarea1", {% raw %}{maxChars:100,counterType:"chars_remaining",counterId:"my_counter_span"}{% endraw %});
Spry.Utils.addEventListener("textarea1","keyup",lineCounter,false);
&lt;/script&gt;
</code>

Enjoy!