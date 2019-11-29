---
layout: post
title: "\"Pretty Dates\" with jQuery (ColdFusion example)"
date: "2009-11-16T17:11:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/11/16/Pretty-Dates-with-jQuery-ColdFusion-example
guid: 3606
---

Just a quick note here to share a jQuery plugin that <a href="http://www.cfsilence.com/">Todd Sharp</a> shared with me: <a href="http://bassistance.de/jquery-plugins/jquery-plugin-prettydate/">Prettydate</a>. Prettydate takes dates (which you would hide within your DOM) and formats them in a more generic "time since.." form. So for example, a date within a few seconds will post as "just now", whereas an entry a few minutes old will display as "5 minutes old." The plugin supports dates up to one month old and will automatically update while your users look at a page. This creates a cool effect. They may initially see:
<p>
<img src="https://static.raymondcamden.com/images/pd1.png" />
<p>
But within a few minutes this will be:
<p>
<img src="https://static.raymondcamden.com/images/cfjedi/pd2.png" />
<p>
I created a quick ColdFusion script that demonstrates this. The one thing you have to remember is that you must convert the dates to ISO8601 format. In the following example I've used hard coded dates but obviously you could get this data from a database:
<p>
<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/jquery/jquery.prettydate.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$("div#content &gt; p.article &gt; span").prettyDate()
})
&lt;/script&gt;
&lt;style&gt;
.date {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 10px;	
	display:block;
}
&lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;cfset articles = [
	{% raw %}{title="Article AAA", date=dateAdd("s", -50, now())}{% endraw %},
	{% raw %}{title="Article One", date=dateAdd("n", -5, now())}{% endraw %},
	{% raw %}{title="Article Two", date=dateAdd("n", -58, now())}{% endraw %}
	]&gt;
	
	
&lt;div id="content"&gt;
	&lt;cfloop index="article" array="#articles#"&gt;
		&lt;cfoutput&gt;
		&lt;p class="article"&gt;
			&lt;span class="title"&gt;&lt;b&gt;#article.title#&lt;/b&gt;&lt;/span&gt;&lt;br/&gt;
			&lt;span class="date" title="#dateFormat(article.date,'yyyy-mm-dd')#T#timeFormat(article.date,'HH:mm:ss')#"&gt;&lt;/span&gt;
			Some kind of teaser here...&lt;br/&gt;
		&lt;/p&gt;
		&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>
<p>
The screen shots I pasted above show the result of this example. For more docs and examples, see the <a href="http://bassistance.de/jquery-plugins/jquery-plugin-prettydate/">plugin's home page</a>. Note - this is an update to a plugin John Resig originally created so if you Google, make sure you get the new one.