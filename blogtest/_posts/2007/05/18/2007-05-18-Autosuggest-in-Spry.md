---
layout: post
title: "Autosuggest in Spry"
date: "2007-05-18T23:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/05/18/Autosuggest-in-Spry
guid: 2049
---

Autosuggest isn't new to Spry 1.5, but I never had a chance to take a look at it till this morning. Surprisingly it wasn't too difficult. Tonight's example will be rather simple, but I'll follow it up with a ColdFusion-based one tomorrow.

At the simplest level, to enable autosuggest you create a simple text field. This is obviously the field that will have the autosuggest tied to it. So I'll start off with that:

<code>
&lt;input type="text" name="search" /&gt;
</code>

Next I wrap the form field in a div:

<code>
&lt;div id="mySuggest"&gt;
	&lt;input type="text" name="search" /&gt;
&lt;/div&gt;
</code>

This is simply going to wrap our autosuggest area. So next lets talk data. Where will the autosuggest information come from? Luckily it comes from the datasets we know and love in Spry. So for this demo I'll use the following:

<code>
&lt;script&gt;
var dsCharacters = new Spry.Data.XMLDataSet("data.xml","people/person");
&lt;/script&gt;
</code>

Now that I've got a DataSet, I can use it just like I've used Spry datasets before. So for example:

<code>
&lt;div id="resultsDIV" spry:region="dsCharacters"&gt;
	&lt;span spry:repeat="dsCharacters" spry:suggest="{% raw %}{name}{% endraw %}"&gt;{% raw %}{name}{% endraw %}&lt;br /&gt;&lt;/span&gt;	
&lt;/div&gt;
</code>

This shouldn't look different from previous Spry examples. In this case the repeating of the dataset is used for the autosuggest. I can put whatever HTML I want in there. The value that will be used comes from the spry:suggest.

Basically - thats it! We do need some libraries and a bit of JavaScript. Currently three JavaScript libraries and one CSS  file is required:

<code>
&lt;link href="/spryjs/SpryAutoSuggest.css" rel="stylesheet" type="text/css" /&gt;
&lt;script language="JavaScript" type="text/javascript" src="/spryjs/xpath.js"&gt;&lt;/script&gt;
&lt;script language="JavaScript" type="text/javascript" src="/spryjs/SpryData.js"&gt;&lt;/script&gt;
&lt;script language="JavaScript" type="text/javascript" src="/spryjs/SpryAutoSuggest.js"&gt;&lt;/script&gt;
</code>

Lastly, after the div we add one line of JavaScript:

<code>
&lt;script type="text/javascript"&gt;
var theSuggest = new Spry.Widget.AutoSuggest("mySuggest","resultsDIV", "dsCharacters","name", {% raw %}{hoverSuggestClass:'highlight'}{% endraw %});
&lt;/script&gt;
</code>

The first argument points to the great div that wraps the entire autosuggest area. The second argument points to the div that will draw out the suggestions. The third argument is the dataset. Next we tell Spry what field to search. After that we can pass a set of arguments. One of the most important ones is the hoverSuggestClass. Without it the autosuggest is a bit hard to read.

You can see a demo here: <a href="http://www.raymondcamden.com/sprysuggest/index.html">http://www.coldfusionjedi.com/sprysuggest/index.html</a>. To see the autosuggest in action, try a few Star Wars names.