---
layout: post
title: "Using spry:hover, spry:even, and spry:odd all together"
date: "2007-10-22T17:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/10/22/Using-spryhover-spryeven-and-spryodd-all-together
guid: 2430
---

One of the nicer features of Spry is the simple way you can apply even, odd, and hover classes to a dataset. Consider this example:

<code>
&lt;tr spry:repeat="mydata" spry:setrow="mydata" spry:hover="hover" spry:even="even" spry:odd="odd"&gt;
	&lt;td style="cursor: pointer;"&gt;{% raw %}{name}{% endraw %}&lt;/td&gt;
	&lt;td style="cursor: pointer;"&gt;{% raw %}{age}{% endraw %}&lt;/td&gt;
	&lt;td style="cursor: pointer;"&gt;{% raw %}{gender}{% endraw %}&lt;/td&gt;
&lt;/tr&gt;
</code>

This code will tell Spry to apply a CSS class named even for even rows, odd for odd rows, and to notice a mouse over event on a row and apply the hover class. For some reason though I couldn't ever get this to work with the following CSS:

<code>
&lt;style&gt;
.hover {
	background-color: yellow;
}
.even {
	background-color: red;
}

.odd {
	background-color: blue;
}
&lt;/style&gt;
</code>

Yes, I mixed blue, red and yellow. This is why I don't <i>design</i> web sites. Anyway, this never worked correctly for me. Luckily for me (not so much for them), I've got the Spry team on speed dial. Turns out this was a problem with my lack of knowledge of CSS. Kin Blas had this to share:

<blockquote>
The 3 rules above all have equal specificity so if you have an element
with more than one class on it like this:

&lt;div class="even hover"&gt;

The last one defined in the CSS wins ... so in the above example the div
would be red even when you hover over it. If you want hover to be more
specific, then you have to change the order:


.even {% raw %}{ background-color: red }{% endraw %}<br>
.odd {% raw %}{ background-color: yellow }{% endraw %}<br>
.hover {% raw %}{ background-color: blue }{% endraw %}<br>
</blockquote>

When I switched the order - it worked perfectly.