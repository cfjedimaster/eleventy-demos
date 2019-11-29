---
layout: post
title: "Ask a Jedi: Sizing a window with ColdFusion"
date: "2007-05-07T23:05:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2007/05/07/Ask-a-Jedi-Sizing-a-window-with-ColdFusion
guid: 2016
---

Jay asks:

<blockquote>
OK, I should know how to do this and I feel stupid for asking but I am going to anyway.

Is there a simple way in Coldfusion to grab the current
size of the window you have opened?
</blockquote>

This isn't stupid - but is one of the many questions that reveal that you may have forgotten that ColdFusion is completely server side. ColdFusion's only interaction with the browser is with the HTML returned via the web server. 

So with that being said, you can use JavaScript to check the size of the window. I found a few methods, but these properties seem to work fine in Firefox. (And I'm too lazy to start Parallels just for IE, so I'm fine with people correcting me.)

<code>
window.outerWidth
window.outerHeight
</code>

You can check these values and if they are too small, resize the window. Consider this complete example:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Min Size Test&lt;/title&gt;
&lt;script&gt;
function checkMinSize() {
	if(window.outerWidth &lt; 500) window.resizeTo(500, window.outerHeight);
	if(window.outerHeight &lt; 500) window.resizeTo(window.outerWidth,500);
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body onLoad="checkMinSize()"&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

All this does is check the width and height. If either are less then 500 pixels, the window is resized to the correct size. I do this in two steps because it is possible only one dimension is too small.