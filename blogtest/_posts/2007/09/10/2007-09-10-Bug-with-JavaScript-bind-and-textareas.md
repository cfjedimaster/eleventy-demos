---
layout: post
title: "Bug with JavaScript bind and textareas"
date: "2007-09-10T15:09:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2007/09/10/Bug-with-JavaScript-bind-and-textareas
guid: 2334
---

I was playing around with a little something today when I ran across a bug. If you try to use cfajaxproxy and bind a textarea to a JavaScript function, you will get an error if the textarea contains a newline. Consider:

<code>
&lt;cfajaxproxy bind="javascript:setCount({% raw %}{body2@keyup}{% endraw %})"&gt;

&lt;script&gt;
function setCount(r) {	
	var cdiv = document.getElementById('counter');
	cdiv.innerHTML = cdiv.innerHTML + 'you did it' + r + '&lt;br&gt;';
}
&lt;/script&gt;

&lt;cfform name="ray"&gt;
&lt;cftextarea id="body2" name="body2"&gt;&lt;/cftextarea&gt;
&lt;/cfform&gt;
&lt;div id="counter"&gt;&lt;/div&gt;
</code>

Turns out the newline breaks the JavaScript call. If you switch to a CFC call it works fine, but for what I was doing, I didn't need to call the server. Todd pointed out that this is rather trivial code, I could have just done this:

<code>
&lt;cftextarea id="body2" name="body2" onkeyup="javascript:setCount(this.value);"&gt;&lt;/cftextarea&gt;
</code>

But I wanted to keep it inside cfajaxproxy. I'll report a bug on this in a few minutes.