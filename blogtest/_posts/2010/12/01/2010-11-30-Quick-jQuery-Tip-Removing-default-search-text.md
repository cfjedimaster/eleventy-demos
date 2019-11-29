---
layout: post
title: "Quick jQuery Tip - Removing default search text"
date: "2010-12-01T11:12:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2010/12/01/Quick-jQuery-Tip-Removing-default-search-text
guid: 4034
---

One of the common UI patterns is to add some default text to a search box, so for example, it may say "Enter Search" in the input field. As soon as the user clicks on the field that default text goes away. While there are probably a thousand ways of doing it, here is one quick and dirty way of doing it with jQuery.
<!--more-->
<p/>

First, ensure your search field has an ID and the default text you want.

<p/>

<code>
&lt;input type="text" name="search" id="search" value="Search for Beer!"&gt;
</code>

<p/>

Next, within your document.ready block, just tell jQuery to monitor the field for clicks:

<p/>

<code>
$('#searchtext').click(function() {
});
</code>

<p/>

As for the actual code - it is somewhat complex. You may want to move this into a separate file due to the size:

<p/>

<code>
$('#searchtext').focus(function() {
	$(this).val("").unbind("focus");
});
</code>

<p/>

Ok, sorry, I was being a bit of an ass. Basically the code says: Set the value to blank and stop listening for focus event. Nice, short, and sweet. Hope this helps.

<p/>

P.S. Of course, you could just use placeholder as well: &lt;input type="text" name="search" placeholder="Search for Beer!"&gt;. This will be ignored by browsers that don't understand it and will act like the code above for browsers that do. This works in HTML/Adobe AIR applications as well.

P.S.S. I originally used the click even - but Dan mentioned how this wouldn't work with keyboard navigation. I changed to focus based on his recommendation.