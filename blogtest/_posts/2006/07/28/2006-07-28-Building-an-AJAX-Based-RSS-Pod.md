---
layout: post
title: "Building an AJAX Based RSS Pod"
date: "2006-07-28T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/28/Building-an-AJAX-Based-RSS-Pod
guid: 1438
---

So by now everyone knows that I love <a href="http://labs.adobe.com/technologies/spry/">Spry</a>, but I thought I'd build another cool little example for folks to look at. First, take a look at the <a href="http://ray.camdenfamily.com/demos/spryrsspod/test2.html">example</a>. What you are seeing is a pod based on the RSS feed from <a href="http://weblogs.macromedia.com/mxna/">MXNA</a>. If you sit there for a few minutes, you may notice something. The pod automatically updates. How is this done? You can view source, but let me break it down for you:
<!--more-->
<code>
&lt;script type="text/javascript" src="xpath.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="SpryData.js"&gt;&lt;/script&gt;
</code>

The above lines load the Spry framework.

<code>
&lt;script type="text/javascript"&gt;
var theFeed = "http://weblogs.macromedia.com/mxna/xml/rss.cfm?query=byMostRecent&amp;languages=1";
var mydata = new Spry.Data.XMLDataSet("xmlproxy.cfm?xmlfeed="+theFeed,"//item", {% raw %}{ useCache:  false, loadInterval: 10000 }{% endraw %}); 
&lt;/script&gt;
</code>

Line one simply sets the feed. Line two passes the feed to a local ColdFusion file. It uses CFHTTP to fetch the RSS and return it to the browser. Why do I have to do this? Browser security restrictions insist that I only call resources from the same file. I made my CFM file open to any URL, but you probably want to limit it to a set of URLs, or not even allow Spry to set the feed. 

The tricky part is the automatic reloading. That's done with this difficult piece of code:

<code>
{% raw %}{ useCache:  false, loadInterval: 10000 }{% endraw %}
</code>

Pretty hard, eh? The useCache statement tells Spry not to cache the results. (Duh.) The loadInterval statement tells Spry to reload the data every 10000 ms. 

That's it. You could use this pod on your blog and make a "live" view of MXNA (or any other <a href="http://ray.camdenfamily.com">important blog</a>). 

I also do two other things I haven't talked about in my Spry posts yet. First, you may notice that many Spry examples have a "flash" when they load. The "flash" is a quick display of the Spry tokens that goes away when the data beings to load.  Luckily there are a few ways to handle this, and I show two in my example. Consider this block:

<code>
&lt;div spry:region="mydata" class="SpryHiddenRegion"&gt;
	
	&lt;div class="pod"&gt;

	&lt;span spry:repeat="mydata"&gt;
	&lt;a href="{% raw %}{link}{% endraw %}"&gt;&lt;span spry:content="{% raw %}{title}{% endraw %}" /&gt;&lt;/a&gt;&lt;br&gt;
	&lt;/span&gt;
	
	&lt;/div&gt;
	
&lt;/div&gt;
</code>

We have two things going on here. First, notice the class="SpryHiddenRegion". In my CSS I set this to:

<code>
.SpryHiddenRegion {
	visibility: hidden;
}
</code>

The name, "SpryHiddenRegion", is noticed by Spry and will automatically be removed when data is loaded. Now notice:

<code>
&lt;span spry:content="{% raw %}{title}{% endraw %}" /&gt;
</code>

This does two things. First, the {% raw %}{title}{% endraw %} token will not show up when the pages loads. Secondly, if I had used a "wrapping" format like so:

<code>
&lt;span spry:content="{% raw %}{title}{% endraw %}"&gt;Hello non-JS peeps&lt;/span&gt;
</code>

If the user has JavaScript disabled, they will see the content inside the span. (You can, of course, use the noscript tag for this type of message as well.)

For another version of my example, see this <a href="http://ray.camdenfamily.com/demos/spryrsspod/test.html">earlier version</a>. It uses a mouse over to let you read part of the entry and has the debugging turned on.