---
layout: post
title: "Three more features of Spry 1.4: removeClassName, addClassName, getNodeText"
date: "2006-12-17T22:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/12/17/Three-more-features-of-Spry-14-removeClassName-addClassName-getNodeText
guid: 1720
---

Let's take a quick look at three more features in <a href="http://labs.adobe.com/technologies/spry/">Spry 1.4</a>. First lets take a look at remove and addClassName. These two functions will either remove, or apply, a CSS style to an element. So consider this element:

<code>
&lt;div id="test"&gt;This is the test content that will be changing.&lt;/div&gt;
</code>

To apply a CSS style to this element, you can use this code:

<code>
Spry.Utils.addClassName('test','someCSS');
</code>

Obviously removeClassName will remove the item. 

The last new function I'll discuss is getNodeText(). As you can probably guess, it returns the text inside an element. Using the same div above, the following code:

<code>
var str = Spry.Utils.getNodeText($('test'));
</code>

will set str equal to: This is the test content that will be changing.

For an example of all three, check out this <a href="http://ray.camdenfamily.com/demos/spry/spry14demo1.html">demo</a> Be sure to view source.