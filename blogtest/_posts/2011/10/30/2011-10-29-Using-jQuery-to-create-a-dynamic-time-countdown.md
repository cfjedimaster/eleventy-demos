---
layout: post
title: "Using jQuery to create a dynamic time countdown"
date: "2011-10-30T08:10:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2011/10/30/Using-jQuery-to-create-a-dynamic-time-countdown
guid: 4413
---

A user wrote in with an interesting request. He wanted to take a form field, and as a user entered a date in it, display the "time till" the entered date. So for example, if I were to enter tomorrow, let's say an hour from now, we would get a message stating this was one day, one hour away. To make things even more interesting, he wanted to make it dynamic. So as you sat there and watched, the difference would actually count down. Here's how I solved it - and as always - I'm open to folks rewriting this in a better way! (If you do, please use pastebin, don't post your code in the comment.)
<!--more-->
<p>

I thought I'd begin by simply creating a form that would:

<p>

<ul>
<li>Validate a string as a date
<li>Figure the difference between now and then (assume the date is in the future)
<li>Display the difference as a string (but not worry about updating for now)
</ul>

<p>

Each of these pieces has some interesting twists to it. For my date validation, I turned to Google and it brought up this <a href="http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript">interesting article</a> over at Stack Overflow. The suggested the following:

<p>

<code>
function isValidDate(d) {
	if ( Object.prototype.toString.call(d) !== "[object Date]" ) return false;
	return !isNaN(d.getTime());
}
</code>

<p>

This function checks to see if the passed object is a Date object first. It then uses the result of getTime() to validate a that it contains a real date. So in theory, all I have to do is get my string, run new Date() on it, and check it. This worked great. <i>Kinda.</i> I noticed that JavaScript had no problem accepting February 29, 2011 as a date. It simply considered it March 1. It also accepted 2 as a date in the past. Yes, just 2. For my demo here, I was ok with that since my code would end up ignoring past dates anyway. The February 29 thing I decided to just spin as a feature. Yep, that's how I roll. 

<p>

The difference part then becomes simple math. You can subtract one date from another and get the difference in milliseconds. Once you have that, you do some division and you're good to go. Here's the entire version of my first draft below.

<p>

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	//http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
	function isValidDate(d) {
		if ( Object.prototype.toString.call(d) !== "[object Date]" ) return false;
		return !isNaN(d.getTime());
	}
	
	$("#date").keyup(function() {
		var v = $(this).val();
		v = new Date(v);
		if(isValidDate(v)) {
			console.log(v + " is a date");
			var now = new Date();
			//assume v is a future date
			var difference = v-now;
			//only care if positive
			if(difference &gt; 0) {
				var days, hours, minutes, seconds = 0;
				
				days = Math.floor(difference / (24*60*60*1000));

				if(days &gt; 0) {
					difference -= days * (24*60*60*1000);
				}

				if(difference &gt; 0) {
					hours = Math.floor(difference / (60*60*1000));
					if(hours &gt; 0) {
						difference -= hours * (60*60*1000);
					}
				}
				
				if(difference &gt; 0) {
					minutes = Math.floor(difference / (60*1000));
					if(minutes &gt; 0) {
						difference -= minutes * (60*1000);
					}
				}
				
				if(difference &gt; 0) {
					seconds = Math.floor(difference / 1000);
				}
				$("#timeleft").html(days + " days, "+ hours + " hours, "+ 
									minutes + " minutes, " + seconds + " seconds.");
									
				console.log(days + ", "+hours+", "+minutes + ", "+ seconds);
			}
		}
	});
})
&lt;/script&gt;

&lt;form id="mainForm"&gt;
	Date: &lt;input type="text" name="date" id="date"&gt;&lt;br/&gt;
&lt;/form&gt;

&lt;div id="timeleft"&gt;&lt;/div&gt;
</code>

<p>

You can demo this yourself <a href="http://www.raymondcamden.com/demos/2011/oct/30/test4.html">here</a>. <b>And yes - notice I'm using console.log to help debug the application. Please do not post a comment saying the code isn't working in your browser if you don't have console support.</b>

<p>

Ok - so now all I have to do is add in the timer aspect. I rearranged my code a bit and added an interval aspect to it. Here's the entire new template.

<p>

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	var selectedDate;
	var hb;
	
	//http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
	function isValidDate(d) {
		if ( Object.prototype.toString.call(d) !== "[object Date]" ) return false;
		return !isNaN(d.getTime());
	}
	
	function showDiff() {
		var now = new Date();
		//assume v is a future date
		var difference = selectedDate-now;
		//only care if positive
		if(difference &gt; 0) {
			var days, hours, minutes, seconds = 0;
			
			days = Math.floor(difference / (24*60*60*1000));

			if(days &gt; 0) {
				difference -= days * (24*60*60*1000);
			}

			if(difference &gt; 0) {
				hours = Math.floor(difference / (60*60*1000));
				if(hours &gt; 0) {
					difference -= hours * (60*60*1000);
				}
			}
			
			if(difference &gt; 0) {
				minutes = Math.floor(difference / (60*1000));
				if(minutes &gt; 0) {
					difference -= minutes * (60*1000);
				}
			}
			
			if(difference &gt; 0) {
				seconds = Math.floor(difference / 1000);
			}
			$("#timeleft").html(days + " days, "+ hours + " hours, "+ 
								minutes + " minutes, " + seconds + " seconds.");
								
			console.log(days + ", "+hours+", "+minutes + ", "+ seconds);
		}
	}
	
	$("#date").keyup(function() {
		var v = $(this).val();
		v = new Date(v);
		if(isValidDate(v)) {
			console.log(v + " is a date");
			selectedDate = v;
			//clear in case it was run
			clearInterval(hb);
			hb = setInterval(showDiff, 1000);
		} else {
			clearInterval(hb);
		}
	});
})
&lt;/script&gt;

&lt;form id="mainForm"&gt;
	Date: &lt;input type="text" name="date" id="date"&gt;&lt;br/&gt;
&lt;/form&gt;

&lt;div id="timeleft"&gt;&lt;/div&gt;
</code>

<p>

Basically I took my display code and made it it's own function while also moving some of my values out into a global scope. This will <b>not</b> correctly handle things if the interval hits 0, but, it's a good example I think though. You can demo this one below.

<p>

<a href="http://www.coldfusionjedi.com/demos/2011/oct/30/test3.html"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>