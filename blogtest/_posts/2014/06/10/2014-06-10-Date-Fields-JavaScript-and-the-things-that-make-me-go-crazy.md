---
layout: post
title: "Date Fields, JavaScript, and the things that make me go crazy..."
date: "2014-06-10T16:06:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2014/06/10/Date-Fields-JavaScript-and-the-things-that-make-me-go-crazy
guid: 5242
---

<p>
Just a quick note to detail some interesting issues I ran into last night. I was writing a <i>very</i> simple report tool for a client. He has a process that runs a large set of MLS queries and does a lot of - well - stuff. It is a slow process so I've set it up so that it runs one day at a time based on a simple URL parameter. While this works well enough he asked if I could build a simple front end to it so he could select two dates and have it process each day one by one. Simple, right?
</p>

<p>
<img src="https://static.raymondcamden.com/images/oc.jpg" />
</p>
<!--more-->
<p>
I decided to use two text fields using type="date". This gives me nice date controls in modern browsers and since I have an user base of one, I'm pretty confident I can be sure that it will be supported on his browser. Just in case you haven't seen this in action, this is how it renders in Chrome.
</p>

<p>
<img src="https://static.raymondcamden.com/images/12.png" />
</p>

<p>
Clicking the field gives an automatic calendar control.
</p>

<p>
<img src="https://static.raymondcamden.com/images/22.png" />
</p>

<p>
In case you're wondering, in Firefox, and any other browser that decided it was more important to support canvas for HTML gaming than form fields that most people use (sorry, I'm not bitter, honest), you get a plain text field. I can skip downloading a library just to add a control and it "breaks" perfectly - the user can still type in a date. A win-win.
</p>

<p>
<img src="https://static.raymondcamden.com/images/download1.jpg" />
</p>

<p>
So, the first issue I ran into was validation. Now, I know I said earlier that I have a small user base, so I could have just <i>told</i> him not to screw up, but I wanted to do <i>some</i> validation at least. Can't hurt, right? Turns out checking to see if a value is a proper date is a bit more difficult than you would imagine. So for example, if you make a new Date object and pass 99/99/99, you get a Date object back. It recognizes that the value is bad, but you still have a date object.
</p>

<p>
<img src="https://static.raymondcamden.com/images/date.png" />
</p>

<p>
A bit of Googling turned up <a href="http://stackoverflow.com/a/1353711/52160">this answer</a>, which I'm duplicating here:
</p>

<pre><code class="language-javascript">function isDate(d) {
	if ( Object.prototype.toString.call(d) === "[object Date]" ) {
	  // it is a date
	  if ( isNaN( d.getTime() ) ) {  // d.valueOf() could also work
		// date is not valid
		return false;
	  }
	  else {
		// date is valid
		return true;
	  }
	}
	else {
	  // not a date
		return false;
	}
}</code></pre>

<p>
Essentially, his solution checks to see if the value is a Date object and then sees if the time value is a valid number. If it isn't a date object, then it fails as well. Note - his solution on the Stack Overflow page didn't have return statements in it. Don't do what I did and just cut and paste as is and wrap in a function. That was kinda lame, Ray.
</p>

<p>
Ok, so far so good. But then came the thing that <strong>really</strong> threw me for a loop. Last night I was testing and picking today (June 9th) as the date. I got the value from the form field, made a new date out of it, and sent it to console.log, just to be sure. (I do that a lot - use the console just to ensure that the values I think I'm working with are the values I actually have.) So again - I picked the current date. It showed 6/9/2014. In the console I got: Sun Jun 08 2014 19:00:00 GMT-0500 (CDT).
</p>

<p>
Yeah, let that sink in a bit.
</p>

<p>
Ok, so what the heck? Luckily I was able to quickly find a solution here: <a href="http://www.hitthebits.com/2013/02/html5-date-pickers-and-javascript-date-objects.html">HTML5 Date Pickers and JavaScript Date Objects</a>. To quote Dave Leeds:
</p>

<blockquote>
According to the specifications, date picker controls will have a value in RFC 3339 format, which is a profile of ISO 8601. When you new up a JavaScript Date in that format, you'll get a date that accounts for your timezone.
</blockquote>

<p>
As he goes on to say, the values are GMT, not the user's time zone. Because... I don't freaking know. I mean, in what universe would a typical user pick a date on a calendar and think, "Oh my god I hope this is GMT because I do EVERYTHING IN GMT!" 
</p>

<p>
*sigh* These are the things that drive me crazy about web development. Luckily Dave has a simple fix. It feels like a hack, but it seems to work fine for me: var dateString = somedate.replace(/-/g, "/"). Basically changing 6-9-2014 to 6/9/2014. 
</p>

<p>
So um... yeah. Keep this in mind. 
</p>