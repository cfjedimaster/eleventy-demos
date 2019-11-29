---
layout: post
title: "Spry's HTML Panel"
date: "2007-11-04T17:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/11/04/Sprys-HTML-Panel
guid: 2452
---

Over the past few weeks, I've been taking a look at Spry's widgets, specifically those related to form items. I've been surprised by what I've found. I really wish I would have looked at them earlier. Today I looked at another widget, the HTML Panel. This one isn't form related, but is <i>darn</i> cool.
<!--more-->
The HTML Panel is <i>not</i> a "panel" like what you get in ColdFusion 8. You can think of the panel as simply an item on your web page that can be loaded with other content. For example, imagine this div:

<code>
&lt;div id="content"&gt;
Stuff will load here.
&lt;/div&gt;
</code>

Now imagine I want to load content into this div. By creating an HTML Panel widget out of the div, I can easily change the content. Let's look at a real example. 

First off - like the other widgets, you need to use a CSS and JavaScript file:

<code>
&lt;html&gt;

&lt;head&gt;
	&lt;script src="/spryjs/SpryHTMLPanel.js" language="javascript" type="text/javascript"&gt;&lt;/script&gt;
	&lt;link href="/sprycssSpryHTMLPanel.css" rel="stylesheet" type="text/css"&gt;
&lt;/head&gt;
</code>

Next I'm going to create a menu. This is what I'll use to load content:

<code>
&lt;h2&gt;Products&lt;/h2&gt;

&lt;p&gt;
&lt;b&gt;
	&lt;a onClick="panel.loadContent('apple.html'); return false"&gt;Apples&lt;/a&gt; / 
	&lt;a onClick="panel.loadContent('banana.html'); return false"&gt;Bananas&lt;/a&gt; /
	&lt;a onClick="panel.loadContent('cherry.html'); return false"&gt;Cherries&lt;/a&gt;
&lt;/b&gt;
&lt;/p&gt;
</code>

Don't worry about the JavaScript just yet. Now I'll create the area where content will load:

<code>
&lt;div id="product"&gt;
&lt;p&gt;
Please select a product.
&lt;/p&gt;
&lt;/div&gt;
</code>

The last thing I'll do is enable the HTML panel with a line of JavaScript. This is like every other widget I've covered so far:

<code>
&lt;script type="text/javascript"&gt;
var panel = new Spry.Widget.HTMLPanel("product");
&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

I simply create a new instance of the HTMLPanel, and point it to the ID of the item that will be replaceable. Ok, so now if you go back to the JavaScript you can see what I use to load content:

<code>
&lt;a onClick="panel.loadContent('apple.html'); return false"&gt;Apples&lt;/a&gt;
</code>

I just use the loadContent function of the panel object. I point it to the HTML to load, and that's it! You can see a live example of this <a href="http://www.raymondcamden.com/demos/spryform/test_html.html">here</a>. View source to see the complete example.

So far so good - and easy as well. But wait - it gets a <i>lot</i> sexier. One of the things Spry tries to help out with is a <i>progressive enhancement</i>. That is a fancy way of saying "support non-JavaScript" browsers. One of the options you can use when loading widgets is to supply an ID. Spry will load the remote content, but only display the stuff within the specified ID. Why is that sexy? Consider this new example (note, I trimmed a bit of the HTML):

<code>
&lt;h2&gt;Fragment Test&lt;/h2&gt;

&lt;p&gt;
&lt;b&gt;
	&lt;a href="f1.html" onClick="panel.loadContent(this.href,{% raw %}{id:'content'}{% endraw %}); return false"&gt;Test One&lt;/a&gt; / 
	&lt;a href="f2.html" onClick="panel.loadContent(this.href,{% raw %}{id:'content'}{% endraw %}); return false"&gt;Test Two&lt;/a&gt;
&lt;/b&gt;
&lt;/p&gt;

&lt;div id="panel"&gt;
&lt;p&gt;
Please select something!
&lt;/p&gt;
&lt;/div&gt;

&lt;script type="text/javascript"&gt;
var panel = new Spry.Widget.HTMLPanel("panel");
&lt;/script&gt;
</code>

As with the previous example, I've got a menu on top with a section in the middle that will be dynamic, but let's focus on one of the links:

<code>
&lt;a href="f1.html" onClick="panel.loadContent(this.href,{% raw %}{id:'content'}{% endraw %}); return false"&gt;Test One&lt;/a&gt;
</code>

Note that I have a normal href. Then notice my onclick. First off - the URL for the onclick refers to the same URL defined in the tag itself. A little fancy self-referring which is nice if you ever change the URL. The second argument passed to the loadContent function is an object with one key/value pair. The ID attribute simply means, "Load the remote URL, but just show the stuff inside the content id." Let's look at f1.html:

<code>
&lt;html&gt;

&lt;head&gt;
	&lt;title&gt;F1&lt;/title&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h2&gt;F1&lt;/h2&gt;

&lt;div id="content"&gt;
&lt;p&gt;
	This is the content for fragement page 1.
&lt;/p&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

As you can see - only one div has the ID of content. Now think about it. With one link you have 2 possible things going on:

<ol>
<li>If the user doesn't have JavaScript, it loads up f1.html, and they get the complete page.
<li>If the user does have JavaScript, the remote page is loaded, but only the content area is displayed.
</ol>

So in one simple link you have support for both JS enabled browser and browsers that have JS turned off (or search engines). As I said - darn sexy! You can see this in action <a href="http://www.coldfusionjedi.com/demos/spryform/test_html2.html">here</a>, and I recommend testing it with JS on and off to see it working. 

Now one thing you can may not like about this is that even with the JS-enabled clicks, you are loading all the HTML, but it should still be faster for the end user as the browser won't have to load layout UI and stuff like that - just the content it needs. You can get around this easily enough in ColdFusion of course. Have your non-JS link to foo.cfm, and your Spry link to foo.cfm?slim=1, where the existence of the URL parameter tells your layout code to suppress any output. 

Lastly - be sure to check out the complete docs for the HTML panel:

<a href="http://labs.adobe.com/technologies/spry/articles/html_panel/index.html">HTML Region Overview</a>