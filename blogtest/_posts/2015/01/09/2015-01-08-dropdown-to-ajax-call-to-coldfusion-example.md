---
layout: post
title: "Dropdown to Ajax call to ColdFusion example"
date: "2015-01-09T10:22:44+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2015/01/09/dropdown-to-ajax-call-to-coldfusion-example
guid: 5538
---

A reader pinged me last night with a relatively simple request:


<blockquote>
I want a dropdown and when the user changes the value, I want to use Ajax to hit a CFC and do something with the result.
</blockquote>

<!--more-->

This is incredibly trivial, but I thought it might be kind of fun to share the code <i>as</i> I write it. Normally I make a demo and share the final bits, but perhaps it would useful to folks to see how I build things like this. 

As I said, this is super trivial, but even when I'm doing simple stuff, I'll build up the bits in steps and check in the browser to ensure I'm not making any stupid mistakes. With that in mind, let's get started.

First, I built an HTML template. 

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;title&gt;&lt;/title&gt;
        &lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
        &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
        	&lt;script type=&quot;text/javascript&quot; src=&quot;http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js&quot;&gt;&lt;/script&gt;
        	&lt;script&gt;            
            $(document).ready(function() {            
            
            })            
            &lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;

		&lt;form&gt;
			&lt;select id=&quot;options&quot;&gt;
				&lt;option&gt;--&lt;/option&gt;
				&lt;option value=&quot;1&quot;&gt;One&lt;/option&gt;
				&lt;option value=&quot;2&quot;&gt;Two&lt;/option&gt;
			&lt;/select&gt;
		&lt;/form&gt;
		
		&lt;div id=&quot;result&quot;&gt;&lt;/div&gt;
		
    &lt;/body&gt;
&lt;/html&gt;
</code></pre>

The important bits are:

<ul>
<li>I chose jQuery for my Ajax, DOM manipulation library and put in an empty ready block. As I said, I take things in steps, so there isn't any JavaScript code written yet.
<li>I added a dropdown. I know I'm going to be listening for changes to the dropdown so I gave it an ID. There are 3 values, but the first one simply reflects a null state.
<li>The reader wants to display the result so I've added a blank div. Again though, I'm sure to include an ID value so I can access it from jQuery.
</ul>

Next - I'm going to add code to listen for the dropdown change. This code block, and the rest, are within the document ready block and I won't be showing the entire file. At the very end I'll share the template.

<pre><code class="language-javascript">
$("#options").change(function(e) {
	var selected = $(this).val();
	console.log('change:', selected);
});
</code></pre>

Nothing scary here - just listen for the change, get the selected value, and log it to the console. This is all jQuery 101 stuff, but yes, I do stuff like this and run it in the browser just to be sure. I code fast, and I can alt-tab/alt-r quickly, so this doesn't take me long, but as I tend to screw things up quite a bit I like to build out in steps.

Ok, so the next part involves taking the value and sending it to ColdFusion to do something. The actual server-side logic isn't important here. For now the logic will be to take the value passed and return it preprended with, "I was sent: ".

Here is the component for that logic. I wrote this in script form but you could use tags. But don't. Seriously.

<pre<code class="language language-javascript">
component {

	url.returnformat="json";
	
	remote function doStuff(required string input) {
		return "I was sent: #arguments.input#";	
	}	

}
</code></pre>

I'm assuming this is self-explanatory, except for perhaps the url.returnformat line. That lets me skip passing JSON as a returnformat to the query string when using the API. What we really need (and I'll go file a bug report) is a way to specify a default returnformat at the application level. WDDX was cool ten years ago but there is no reason it should be the default now - backwards compat or not. You can do a default returnformat per method, but that gets messy. To confirm it worked, I opened it up in my browser directly: http://localhost:8501/testingzone/ddajax/api.cfc?method=dostuff&input=foo

Ok, so now back to the JavaScript. All we need to do is run an XHR against the CFC and put the response in the div:

<pre><code class="language-javascript">
$result = $("#result");
            		
$("#options").change(function(e) {
	var selected = $(this).val();
	console.log('change:', selected);
	if(selected === '--') return;
	$.get("api.cfc?method=dostuff", {% raw %}{input:selected}{% endraw %}, function(res) {
		$result.html(res);
	},"JSON");
});
</code></pre>

The first change is to cache the result div selector. Since I'll be updating it multiple times (well, if the user makes multiple changes) it makes sense to grab it once. The next change is to use $.get to fetch the data. We could have use $.getJSON too. Finally, we take the result and place it in the div. (Note - we are using JSON to wrap a string which is overkill. We could have used the 'plain' returnformat value as well. I expect that for most folks they will be returning 'data' not just strings so I kept the code as you see to better reflect a real use case.)

And that's it. Not exactly rocket science, but there you go. Here is the complete HTML file.

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;title&gt;&lt;/title&gt;
        &lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
        &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
        	&lt;script type=&quot;text/javascript&quot; src=&quot;http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js&quot;&gt;&lt;/script&gt;
        	&lt;script&gt;            
            $(document).ready(function() {            
            
            		$result = $(&quot;#result&quot;);
            		
            		$(&quot;#options&quot;).change(function(e) {
            			var selected = $(this).val();
            			console.log('change:', selected);
            			if(selected === '--') return;
            			$.get(&quot;api.cfc?method=dostuff&quot;, {% raw %}{input:selected}{% endraw %}, function(res) {
            				$result.html(res);
            			},&quot;JSON&quot;);
            		});
            })
            &lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;

		&lt;form&gt;
			&lt;select id=&quot;options&quot;&gt;
				&lt;option&gt;--&lt;/option&gt;
				&lt;option value=&quot;1&quot;&gt;One&lt;/option&gt;
				&lt;option value=&quot;2&quot;&gt;Two&lt;/option&gt;
			&lt;/select&gt;
		&lt;/form&gt;
		
		&lt;div id=&quot;result&quot;&gt;&lt;/div&gt;
		
    &lt;/body&gt;
&lt;/html&gt;
</code></pre>