---
layout: post
title: "If Spry Do This..."
date: "2006-08-01T18:08:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/08/01/If-Spry-Do-This
guid: 1444
---

Sorry for the obtuse title, but I wanted to demonstrate how <a href="http://labs.adobe.com/technologies/spry/">Spry</a> handles conditionals. What do I mean by that? So far all of my examples have mainly shown how to dump data into a table. While this is useful, sometimes you want to filter the data being shown. I've shown examples with filtering for pagination and keyword filtering, but there are other ways to do conditional type operations with Spry.
<!--more-->
Let's first take a look at a quick way to filter out data. In my last <a href="http://ray.camdenfamily.com/index.cfm/2006/7/28/Building-an-AJAX-Based-RSS-Pod">Spry article</a>, I showed you how you could quickly add a RSS based Spry pod to your site. The pod dumped all the entries from the MXNA XML feed. What if you wanted to filter it by certain categories? Here is the code for that:

<code>
&lt;span spry:repeat="mydata"&gt;
	&lt;span spry:if="'{% raw %}{dc:subject}{% endraw %}'.indexOf('ColdFusion') != -1;"&gt;
	&lt;a href="{% raw %}{link}{% endraw %}"&gt;&lt;span  spry:content="{% raw %}{title}{% endraw %}"&gt;&lt;/span&gt;&lt;/a&gt;&lt;br&gt;
	&lt;/span&gt;
&lt;/span&gt;
</code>

What you want to focus in on is the spry:if condition. Basically, the data inside the block will not be displayed  unless the condition matches. You use a JavaScript expression for your condition. In my example, I used: 

<blockquote>
'{% raw %}{dc:subject}{% endraw %}'.indexOf('ColdFusion') != -1;
</blockquote>

Spry will replace the {% raw %}{dc:subject}{% endraw %} at runtime, and then do an indexOf to see if "ColdFusion" is in the category list. (Notice I didn't do a direct comparison as the category may have been "Flash, ColdFusion".

You can see this example running <a href="http://ray.camdenfamily.com/demos/spryconditionals/test.html">here</a>. Now for the next example. What if you wanted to do a simple If/Then type check with Spry? Spry supports a spry:choose command which acts much like an If/Else or Case type block. 

Consider this example:

<code>
&lt;tr spry:repeat="mydata"&gt;
&lt;td&gt;{% raw %}{name}{% endraw %}&lt;/td&gt;
&lt;td&gt;
	&lt;div spry:choose="spry:choose"&gt;
		&lt;div spry:when="'{% raw %}{debt}{% endraw %}' &gt; 100000" class="bad"&gt;{% raw %}{debt}{% endraw %}&lt;/div&gt;
		&lt;div spry:when="'{% raw %}{debt}{% endraw %}' &gt; 50000" class="warning"&gt;{% raw %}{debt}{% endraw %}&lt;/div&gt;
		&lt;div spry:default="spry:default"&gt;{% raw %}{debt}{% endraw %}&lt;/div&gt;
	&lt;/div&gt;
&lt;/td&gt;
&lt;/tr&gt;
</code>

Each spry:when inside the choose block will be checked. If a condition is matched, the content inside is run. You can also use a spry:default block to handle a final condition. Check it out at this <a href="http://ray.camdenfamily.com/demos/spryconditionals/test2.html">example</a>. I use it to flag debts that are either very high, or close to getting high.