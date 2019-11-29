---
layout: post
title: "Adding timezone detection for Adobe Groups"
date: "2010-08-14T17:08:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/08/14/Adding-timezone-detection-for-Adobe-Groups
guid: 3912
---

I mentioned this earlier on Twitter and thought I'd follow up with a quick blog post. This morning I added support for client-side timezone detection in JavaScript. This is specifically built for User Group Managers adding new events to <a href="http://groups.adobe.com">Adobe Groups</a>. The technique is certainly not mine. I read this excellent blog post by Josh Fraser and he deserves all the credit: <a href="http://www.onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/">Auto detect a time zone with JavaScript</a>. I've read his entry twice now and I understand it enough to say I'm darn glad I didn't have to figure it out myself. The rest of this entry will simply focus on how I modified his code to work within the Adobe Group's site.
<!--more-->
<p>
First off - if you look at Josh's <a href="http://onlineaspect.com/examples/timezone/detect_timezone.js">code</a> you will see it is built to look for a drop down in the DOM called timezone. I needed this to be a bit more free form. Adobe Groups is - at heart - a CMS. When editing content I have one generic handler for all types of content - blog posts, events, etc. Therefore there could be multiple, or no, timezone controls on any particular edit page. So the first thing I did was to modify my drop down to use a class I could then pick up within jQuery:
<p>

<code>
&lt;select name="#arguments.name#_timezone" class="timezonePicker"&gt;
</code>

<p>

The next modification I did was to store the offset and DST settings into the drop down. My option tag already had a value and a label. After getting some advice on Twitter (thanks <a href="http://www.bennadel.com">Ben Nadel</a>) I went with embedding the values using data-KEY form, like so:

<p>

<code>
&lt;option data-tz="#local.x.getOffset()#,#local.x.getDST()?1:0#" value="#local.x.getId()#" &lt;cfif local.x.getId() is timezone&gt;selected&lt;/cfif&gt;&gt;#local.x.getName()#&lt;/option&gt;
</code>

<p>

In case you are curious, local.x is simply a Timezone entity. That's all I changed within the HTML. Here is the JavaScript I ended up using.

<p>

<code>
&lt;script&gt;
// script by Josh Fraser (http://www.onlineaspect.com)
$(document).ready(function() {
	var rightNow = new Date();
	var jan1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0);  // jan 1st
	var june1 = new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0, 0); // june 1st
	var temp = jan1.toGMTString();
	var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
	temp = june1.toGMTString();
	var june2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
	var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);
	var daylight_time_offset = (june1 - june2) / (1000 * 60 * 60);
	var dst;
	if (std_time_offset == daylight_time_offset) {
		dst = "0"; // daylight savings time is NOT observed
	} else {
		// positive is southern, negative is northern hemisphere
		var hemisphere = std_time_offset - daylight_time_offset;
		if (hemisphere &gt;= 0)
			std_time_offset = daylight_time_offset;
		dst = "1"; // daylight savings time is observed
	}
	//find my tz
	var tzPickers = $(".timezonePicker");
	for(var i=0; i&lt;tzPickers.length; i++) {
		tzPicker = tzPickers[i];
		for(var x=0; x&lt;tzPicker.options.length; x++) {
			var thisData = tzPicker.options[x].getAttribute("data-tz").split(",");
			if(thisData[0] == std_time_offset && thisData[1] == dst) {
				tzPicker.selectedIndex = x;
				break;
			}
		}
	}

});
&lt;/script&gt;
</code>

<p>

So the first portion of this is all Josh. The only change is the second half where I look for all timezonePicker items in the DOM. For each one I loop over their options and see if their data matches the values returned by Josh's code. 

<p>

I tested this within Chrome, Firefox, and Safari (my primary desktop is Windows but my laptop is still a Mac) and it worked fine. Oddly though (and I didn't test this intensively) it seems like if I changed my timezone settings in the operating system, Chrome would stop picking up on the time zone. I had to restart Chrome in order for it to work again.

<p>

Anyway - I hope this helps others - and a big thank you to Josh for making this so simple.