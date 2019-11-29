---
layout: post
title: "ColdFusion Example: Using jQuery UI Accordion with a ColdFusion query"
date: "2014-11-12T09:11:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2014/11/12/ColdFusion-Example-Using-jQuery-UI-Accordion-with-a-ColdFusion-query
guid: 5348
---

<p>
A reader pinged me yesterday with a simple problem that I thought would be good to share on the blog. He had a query of events that he wanted to use with jQuery UI's <a href="http://jqueryui.com/accordion/">Accordion</a> control. The Accordion control simply takes content and splits into various "panes" with one visible at a time. For his data, he wanted to split his content into panes designated by a unique month and year. Here is a quick demo of that in action.
</p>
<!--more-->
<p>
I began by creating a query to store my data. I created a query with a date and title property and then add up to three "events" over the next twelve months. I specifically wanted to support 0 to ensure my demo handled noticing months without any data.
</p>


<pre><code class="language-markup">&lt;!---
Create some fake data with dates
---&gt;
&lt;cfscript&gt;
q = queryNew(&quot;date,title&quot;);
for(i=1; i&lt;12; i++) {
	//for each month, we add 0-3 events (some months may not have data)
	toAdd = randRange(0, 3);
	
	for(k=0; k&lt;toAdd; k++) {
		newDate = dateAdd(&quot;m&quot;, i, now());
		queryAddRow(q, {% raw %}{date:newDate, title:&quot;Item #i##k#&quot;}{% endraw %});	
	}
}
&lt;/cfscript&gt;
</code></pre>

<p>
To handle creating the accordion, I had to follow the rules jQuery UI set up for the control. Basically - wrap the entire set of data in a div, and separate each "pane" with an h3 and inner div. To handle this, I have to know when a new unique month/year "block" starts. I store this in a variable, lastDateStr, and just check it in every iteration over the query. I also need to ensure that on the last row I close the div.
</p>


<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
	&lt;meta charset=&quot;utf-8&quot;&gt;
	&lt;title&gt;jQuery UI Accordion - Default functionality&lt;/title&gt;
	&lt;link rel=&quot;stylesheet&quot; href=&quot;//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css&quot;&gt;
	&lt;script src=&quot;//code.jquery.com/jquery-1.10.2.js&quot;&gt;&lt;/script&gt;
	&lt;script src=&quot;//code.jquery.com/ui/1.11.2/jquery-ui.js&quot;&gt;&lt;/script&gt;
	&lt;script&gt;
	$(function() {
	$( &quot;#accordion&quot; ).accordion();
	});
	&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
	&lt;div id=&quot;accordion&quot;&gt;

		&lt;cfset lastDateStr = &quot;&quot;&gt;
		&lt;cfloop query=&quot;q&quot;&gt;
			&lt;cfset thisDateStr = month(date) &amp; &quot;/&quot; &amp; year(date)&gt;
			
			&lt;!--- Is this datestr different? ---&gt;
			&lt;cfif thisDateStr neq lastDateStr&gt;
				&lt;!--- We only 'close' a div if not on the first iteration ---&gt;
				&lt;cfif currentRow neq 1&gt;
					&lt;/div&gt;
				&lt;/cfif&gt;
				&lt;cfoutput&gt;
				&lt;h3&gt;#thisDateStr#&lt;/h3&gt;
				&lt;/cfoutput&gt;
				&lt;div&gt;
				&lt;cfset lastDateStr = thisDateStr&gt;
			&lt;/cfif&gt;
			
			&lt;cfoutput&gt;
			#title#&lt;br/&gt;
			&lt;/cfoutput&gt;
			
			&lt;cfif currentRow is recordCount&gt;
				&lt;/div&gt;
			&lt;/cfif&gt;
			
		&lt;/cfloop&gt;
	&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

<p>
And the end result:
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss7.png" class="bthumb" />
</p>

<p>
So, not rocket science, but hopefully helpful to someone. Here is the entire template if you want to try it yourself.
</p>


<pre><code class="language-markup">&lt;!---
Create some fake data with dates
---&gt;
&lt;cfscript&gt;
q = queryNew(&quot;date,title&quot;);
for(i=1; i&lt;12; i++) {
	//for each month, we add 0-3 events (some months may not have data)
	toAdd = randRange(0, 3);
	
	for(k=0; k&lt;toAdd; k++) {
		newDate = dateAdd(&quot;m&quot;, i, now());
		queryAddRow(q, {% raw %}{date:newDate, title:&quot;Item #i##k#&quot;}{% endraw %});	
	}
}
&lt;/cfscript&gt;

&lt;!doctype html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
	&lt;meta charset=&quot;utf-8&quot;&gt;
	&lt;title&gt;jQuery UI Accordion - Default functionality&lt;/title&gt;
	&lt;link rel=&quot;stylesheet&quot; href=&quot;//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css&quot;&gt;
	&lt;script src=&quot;//code.jquery.com/jquery-1.10.2.js&quot;&gt;&lt;/script&gt;
	&lt;script src=&quot;//code.jquery.com/ui/1.11.2/jquery-ui.js&quot;&gt;&lt;/script&gt;
	&lt;script&gt;
	$(function() {
	$( &quot;#accordion&quot; ).accordion();
	});
	&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
	&lt;div id=&quot;accordion&quot;&gt;

		&lt;cfset lastDateStr = &quot;&quot;&gt;
		&lt;cfloop query=&quot;q&quot;&gt;
			&lt;cfset thisDateStr = month(date) &amp; &quot;/&quot; &amp; year(date)&gt;
			
			&lt;!--- Is this datestr different? ---&gt;
			&lt;cfif thisDateStr neq lastDateStr&gt;
				&lt;!--- We only 'close' a div if not on the first iteration ---&gt;
				&lt;cfif currentRow neq 1&gt;
					&lt;/div&gt;
				&lt;/cfif&gt;
				&lt;cfoutput&gt;
				&lt;h3&gt;#thisDateStr#&lt;/h3&gt;
				&lt;/cfoutput&gt;
				&lt;div&gt;
				&lt;cfset lastDateStr = thisDateStr&gt;
			&lt;/cfif&gt;
			
			&lt;cfoutput&gt;
			#title#&lt;br/&gt;
			&lt;/cfoutput&gt;
			
			&lt;cfif currentRow is recordCount&gt;
				&lt;/div&gt;
			&lt;/cfif&gt;
			
		&lt;/cfloop&gt;
	&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;	</code></pre>