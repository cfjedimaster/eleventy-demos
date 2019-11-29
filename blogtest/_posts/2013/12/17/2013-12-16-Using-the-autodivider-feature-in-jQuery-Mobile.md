---
layout: post
title: "Using the autodivider feature in jQuery Mobile"
date: "2013-12-17T10:12:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2013/12/17/Using-the-autodivider-feature-in-jQuery-Mobile
guid: 5104
---

<p>
A few days ago a reader asked me an interesting question. He wanted to create a list of dates in jQuery Mobile and group them by date. Turns out, this is fairly easy using the Autodividers feature of the <a href="http://api.jquerymobile.com/listview/">ListView</a> widget.
</p>
<!--more-->
<p>
jQuery Mobile has supported dividers in lists for a while now, but recent editions added support for creating them automatically. Out of the box, jQuery Mobile will create dividers based on the first letter of the list item. Consider this example.
</p>

<pre><code class="language-markup">&lt;ul data-role=&quot;listview&quot; data-inset=&quot;true&quot; data-autodividers=&quot;true&quot;&gt;
	&lt;li&gt;Benedict&lt;&#x2F;li&gt;
	&lt;li&gt;Bleys&lt;&#x2F;li&gt;
	&lt;li&gt;Brand&lt;&#x2F;li&gt;
	&lt;li&gt;Caine&lt;&#x2F;li&gt;
	&lt;li&gt;Corwin&lt;&#x2F;li&gt;
	&lt;li&gt;Eric&lt;&#x2F;li&gt;
	&lt;li&gt;Gerard&lt;&#x2F;li&gt;
	&lt;li&gt;Julian&lt;&#x2F;li&gt;
	&lt;li&gt;Random&lt;&#x2F;li&gt;
&lt;&#x2F;ul&gt;</code></pre>

<p>
By adding autodividers="true" to the list, you get dividers based on the first letter in each name above.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s14.png" />
</p>

<p>
So the obvious next question is - how do you create dividers based on some other form of grouping - like dates? Luckily jQuery Mobile's listview widget gives you an easy way to handle this. 
</p>

<p>
You simply take the listview widget and define a function that returns the "selector" for an item. In abstract, it would look like this:
</p>

<pre><code class="language-markup">$("some selector").listview({
	autodividers:true,
	autodividersSelector: function ( li ) {
		// "li" is the list item, you can get the text via li.text()
		// and then you return whatever you want - in text that is
		return li.text().substring(0,1).toUpperCase();
	}
}).listview("refresh");</code></pre>

<p>
The method above should work the same as the default behavior. Get the first letter and upper case it. (I typed this without actually running it so if there is a typo above blame my laziness.) 
</p>

<p>
In order to support our date grouping, we can use this method and JavaScript date methods. Let's look at a full example. First, the HTML. Note that I've made an empty list widget that will store my data.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt; 
&lt;html&gt;
    
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt; 
        &lt;title&gt;Divide Demo&lt;&#x2F;title&gt;
        &lt;link rel=&quot;stylesheet&quot; href=&quot;http:&#x2F;&#x2F;code.jquery.com&#x2F;mobile&#x2F;1.3.2&#x2F;jquery.mobile-1.3.2.min.css&quot; &#x2F;&gt;
        &lt;script src=&quot;http:&#x2F;&#x2F;code.jquery.com&#x2F;jquery-1.9.1.min.js&quot;&gt;&lt;&#x2F;script&gt;
        &lt;script src=&quot;http:&#x2F;&#x2F;code.jquery.com&#x2F;mobile&#x2F;1.3.2&#x2F;jquery.mobile-1.3.2.min.js&quot;&gt;&lt;&#x2F;script&gt;
    &lt;&#x2F;head&gt; 
    
    &lt;body&gt; 
        
        &lt;div data-role=&quot;page&quot; id=&quot;mainPage&quot; &gt;
            
            &lt;div data-role=&quot;header&quot;&gt;
                &lt;h1&gt;Our Events&lt;&#x2F;h1&gt;
            &lt;&#x2F;div&gt;
            
            &lt;div data-role=&quot;content&quot;&gt;
				&lt;ul data-role=&quot;listview&quot; data-inset=&quot;true&quot; id=&quot;dates&quot; data-autodividers=&quot;true&quot;&gt;
				&lt;&#x2F;ul&gt;
            &lt;&#x2F;div&gt;
            
            &lt;div data-role=&quot;footer&quot;&gt;
                &lt;h4&gt;Footer content&lt;&#x2F;h4&gt;
            &lt;&#x2F;div&gt;
            
        &lt;&#x2F;div&gt;

		&lt;script src=&quot;datestuff.js&quot;&gt;&lt;&#x2F;script&gt;

	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
Now let's look at the JavaScript.
</p>

<pre><code class="language-javascript">&#x2F;* global $,document,console,quizMaster *&#x2F;
$(document).ready(function() {

	var dates = [
		&quot;12&#x2F;16&#x2F;2013 12:00:00&quot;,
		&quot;12&#x2F;16&#x2F;2013 14:00:00&quot;,
		&quot;12&#x2F;17&#x2F;2013 12:00:00&quot;,
		&quot;12&#x2F;18&#x2F;2013 12:00:00&quot;,
		&quot;12&#x2F;19&#x2F;2013 12:00:00&quot;,
		&quot;12&#x2F;19&#x2F;2013 16:00:00&quot;
	];
	
	var dateList = $(&quot;#dates&quot;);
	for(var i=0, len=dates.length; i&lt;len; i++) {
		dateList.append(&quot;&lt;li&gt;&quot;+dates[i]+&quot;&lt;&#x2F;li&gt;&quot;);	
	}
		
	dateList.listview({
		autodividers:true,
		autodividersSelector: function ( li ) {
			var d = new Date(li.text());
			return (d.getMonth()+1)+ &quot;&#x2F;&quot; + d.getDate() + &quot;&#x2F;&quot; + d.getFullYear();
		}
	}).listview(&quot;refresh&quot;);

});</code></pre>

<p>
At the top I've got a set of hard coded dates. These would typically be loaded via Ajax.  I loop over them and insert them into the list. Once I've got that I can then initialize my listview and define a custom selector. As I mentioned above, I can use JavaScript date methods to return a string based on just the date portion of the date values I had above. (In other words, ignore the time.) I can also do some formatting on the date to make it look nice. Here is the final result.
</p>

<img src="https://static.raymondcamden.com/images/s26.png" />

<p>
You can run a full demo of this below.
</p>

<a href="https://static.raymondcamden.com/demos/2013/dec/17/dividedata.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>