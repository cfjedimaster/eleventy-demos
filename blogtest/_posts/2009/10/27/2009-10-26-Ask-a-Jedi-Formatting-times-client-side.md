---
layout: post
title: "Ask a Jedi: Formatting times client side"
date: "2009-10-27T10:10:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2009/10/27/Ask-a-Jedi-Formatting-times-client-side
guid: 3578
---

Patricks asks:

<blockquote>
Having an interesting dilemma that I cannot seem to come up with a
working solution to. I have a text box that we need people to enter a time
into. I dont want it to be a mask but rather onBlur the string "completes"
with the proper format. For example, the user enters 3:29.2 for their time,
onBlur the result needs to be 00:03:29.20. Or the user enters 4.6, onblur 
should result in 00:00:04.60. Just curious if you could point me in the 
right direction or come up with a demo, I think this would be very useful to
many folks as a blog entry.
</blockquote>

So let me state right off - I really don't like formatting in JavaScript. If I'm doing any kind of Ajax development and need the data to look nice, I will almost always do the formatting in ColdFusion first. ColdFusion has spoiled me, what can I say? So please keep that in mind when reviewing my solution. There are probably a hundred different ways to do this (better) but hopefully this will be helpful anyway.
<!--more-->
For my solution, I decided to do something a bit different. Instead of building a form and using the onblur as Patrick wanted, I thought I'd build something like a test script. The idea would be that I could provide an array of inputs and when the page loaded, it would run through them all and output the results. Here is what I came up with initially.

<code>
&lt;h2&gt;Tests&lt;/h2&gt;
&lt;div id="testDiv"&gt;&lt;/div&gt;

&lt;script&gt;
var myarea = document.getElementById("testDiv")
var tests = ["2.2","3:29.2"]

for(var i=0;i&lt;tests.length;i++) {
	myarea.innerHTML += "&lt;br/&gt;" + tests[i] + " = " + formatTime(tests[i])	
}

function formatTime(t) {
	return t
}
&lt;/script&gt;
</code>

I create a simple div on top. The JavaScript section begins by creating a pointer to it. The tests array represent all my inputs. Next I loop over the inputs and add to the div the initial value and the result of the format. As you can see, the format does nothing now. I ran this and got the following output:

<img src="https://static.raymondcamden.com/images/Picture 190.png" />

Nice and simple. But the point is - I can easily then add more inputs and test the output to ensure my function works correctly. So now for the actual formatting - and again - consider this code rough - I know it could be improved:

<code>
function formatTime(t) {
	//Desired result is hh:mm:ss.MM
	//Check for ., if not dot, assume it is just the seconds or more portion
	var ms = "00"
	if(t.indexOf(".") != -1) ms = t.split(".")[1]

	var time = t.split(".")[0]
	//so ms should be ok as is, but time may not be
	var items = time.split(":")
	
	//loop over length of size - 3
	var toAdd = 3-items.length
	for(var i=1; i &lt;= toAdd; i++) {
		items.unshift("00")
	}

	//now fix each item - if size of the item is 1, prepend with 0
	for(var i=0; i &lt; items.length; i++) {
		if(items[i].length == 1) items[i] = "0" + items[i]
	}

	var timeStr = items.join(":")
	return timeStr + "." + ms
}
</code>

I begin by grabbing the millisecond portion of the input - if it exists. The split function is a nice way to treat a JavaScript string like a ColdFusion list. The right side portion of the input is the hours, minutes, and seconds. Since a user may enter only seconds, or maybe only minutes and seconds, I may need to "pad" my data. So I split that portion on the colon character and if the size is less than three, I enter some blank values into the array. By the way, don't make the mistake I did:

<code>
for(var i=1; i &lt;= (3-items.length); i++) {
	items.unshift("00")
}
</code>

Can you guess why that failed?

Anyway, the next step was to convert any single character value, like "3", into a fuller "03" string. Finally I can convert the array back into a string using join. Here is the complete test script with some additional inputs. As you can imagine, this version was not the first version I sent him. As he sent back bugs, I simply entered his inputs and updated the function:

<code>
&lt;h2&gt;Tests&lt;/h2&gt;
&lt;div id="testDiv"&gt;&lt;/div&gt;

&lt;script&gt;
var myarea = document.getElementById("testDiv")
var tests = ["2.2","3:29.2","4.6","3","03:22:10.4"]

for(var i=0;i&lt;tests.length;i++) {
	myarea.innerHTML += "&lt;br/&gt;" + tests[i] + " = " + formatTime(tests[i])	
}

function formatTime(t) {
	//Desired result is hh:mm:ss.MM
	//Check for ., if not dot, assume it is just the seconds or more portion
	var ms = "00"
	if(t.indexOf(".") != -1) ms = t.split(".")[1]

	var time = t.split(".")[0]
	//so ms should be ok as is, but time may not be
	var items = time.split(":")
	
	//loop over length of size - 3
	var toAdd = 3-items.length
	for(var i=1; i &lt;= toAdd; i++) {
		items.unshift("00")
	}

	//now fix each item - if size of the item is 1, prepend with 0
	for(var i=0; i &lt; items.length; i++) {
		if(items[i].length == 1) items[i] = "0" + items[i]
	}

	var timeStr = items.join(":")
	return timeStr + "." + ms
}
&lt;/script&gt;
</code>

And the output:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 260.png" />