---
layout: post
title: "Ask a Jedi: Doing a trim with Spry"
date: "2008-12-12T13:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/12/12/Ask-a-Jedi-Doing-a-trim-with-Spry
guid: 3145
---

OJ asks:

<blockquote>
<p>
I have a spry question. I am displaying data like so: {% raw %}{dsProjects::Solution}{% endraw %}

I want to limit the amount of characters displayed to 100. How do I go about doing that?
</p>
</blockquote>

This is fairly simple in Spry. While it has always been possible using event handlers for your data, it is far easier using a function to display the text. Let me demonstrate.
<!--more-->
Take the following XML document for our seed data:

<code>
&lt;kids&gt;
	&lt;kid&gt;
		&lt;name&gt;Jacob&lt;/name&gt;
		&lt;description&gt;Jacob is a cool kid. He likes Bionicles. He doesn't like Star Wars as much as he should.&lt;/description&gt;
		&lt;age&gt;8&lt;/age&gt;
	&lt;/kid&gt;
	&lt;kid&gt;
		&lt;name&gt;Lynn&lt;/name&gt;
		&lt;description&gt;Lynn is the most beautiful girl in the world. She is also the most intelligent. She is also a princess.&lt;/description&gt;
		&lt;age&gt;7&lt;/age&gt;
	&lt;/kid&gt;
	&lt;kid&gt;
		&lt;name&gt;Noah&lt;/name&gt;
		&lt;description&gt;Noah is going to be the next quarterback for the New Orleans Saints. He will take them to the Super Bowl.&lt;/description&gt;
		&lt;age&gt;6&lt;/age&gt;
	&lt;/kid&gt;
&lt;/kids&gt;
</code>

Note the description field is a bit long. On the front end, my simplest example of using this data would be:

<code>
&lt;div spry:region="dsRows"&gt;
	&lt;div spry:state="loading"&gt;Loading - Please stand by...&lt;/div&gt;
	&lt;div spry:state="error"&gt;Oh crap, something went wrong!&lt;/div&gt;
	&lt;div spry:state="ready"&gt;
	
    &lt;div spry:repeat="dsRows"&gt;
    &lt;p&gt;
    {% raw %}{name}{% endraw %} is {% raw %}{age}{% endraw %} years old&lt;br/&gt;
    {% raw %}{description}{% endraw %}
    &lt;/p&gt;
    &lt;/div&gt;

    &lt;/div&gt;
       
&lt;/div&gt;
</code>

To tell Spry we want to manipulate the description, we can switch the {% raw %}{description}{% endraw %} token to {% raw %}{function::formatDescription}{% endraw %}. We then have to create the JavaScript funciton.

<code>
function formatDescription(region,lookupFunc) {
	var value = lookupFunc("{% raw %}{description}{% endraw %}");
	if(value.length &lt;= 100) return value;
	else return value.substring(0,100) + "...";
}
</code>

The API for these 'format' functions require that we specify both the region and an alias for the lookupFunc. The lookupFunc is used to translate the original token into a real value.

At that point we do simple string manipulation. If the size is 100 characters or less, we return it. If it is more, we return a substring with ... added to the end. For me, this returned:

<blockquote>
<p>
Jacob is 8 years old<br/>
Jacob is a cool kid. He likes Bionicles. He doesn't like Star Wars as much as he should.<br/>
</p>

<p>
Lynn is 7 years old<br/>
Lynn is the most beautiful girl in the world. She is also the most intelligent. She is also a prince...
</p>

<p>
Noah is 6 years old<br/>
Noah is going to be the next quarterback for the New Orleans Saints. He will take them to the Super ...
</p>
</blockquote>

Nice and simple! Here is the complete code for the front end.

<code>
&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
&lt;head&gt;
&lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /&gt;
&lt;title&gt;Untitled Document&lt;/title&gt;
&lt;script src="/spryjs/xpath.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;script src="/spryjs/SpryData.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;script type="text/javascript"&gt;
&lt;!--
var dsRows = new Spry.Data.XMLDataSet("test.xml", "/kids/kid");

function formatDescription(region,lookupFunc) {
	var value = lookupFunc("{% raw %}{description}{% endraw %}");
	if(value.length &lt;= 100) return value;
	else return value.substring(0,100) + "...";
}
//--&gt;
&lt;/script&gt;

&lt;/head&gt;

&lt;body&gt;

&lt;div spry:region="dsRows"&gt;
	&lt;div spry:state="loading"&gt;Loading - Please stand by...&lt;/div&gt;
	&lt;div spry:state="error"&gt;Oh crap, something went wrong!&lt;/div&gt;
	&lt;div spry:state="ready"&gt;
	
    &lt;div spry:repeat="dsRows"&gt;
    &lt;p&gt;
    {% raw %}{name}{% endraw %} is {% raw %}{age}{% endraw %} years old&lt;br/&gt;
    {% raw %}{function::formatDescription}{% endraw %}
    &lt;/p&gt;
    &lt;/div&gt;

	&lt;/div&gt;
       
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>