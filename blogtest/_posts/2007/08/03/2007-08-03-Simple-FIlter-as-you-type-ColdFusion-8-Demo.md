---
layout: post
title: "Simple \"FIlter as you type\" ColdFusion 8 Demo"
date: "2007-08-03T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/03/Simple-FIlter-as-you-type-ColdFusion-8-Demo
guid: 2249
---

I was writing some samples for the new CFWACK and built something short and cute that I thought was worth sharing now. If you look at the search form on <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a> you will see that it does a dynamic replacement on the main content area when you perform a search (if you are on the home page). This is handy but I was curious about other ways of doing it. Consider this simple example:

<code>
&lt;form&gt;Search: &lt;input type="text" name="search"&gt;&lt;input type="button" value="Search"&gt;&lt;/form&gt;

&lt;cfdiv bind="url:results.cfm?search={% raw %}{search}{% endraw %}" /&gt;
</code>

The first line is an extremely simple form. The second line is the cool one. I've bound a CFDIV to a results page. By using {% raw %}{search}{% endraw %} in the bind, I've set it so that every time the value changes, the contents will change. You can see this in action here:

<a href="http://www.raymondcamden.com/demos/ajaxsearch/index2.cfm">http://www.coldfusionjedi.com/demos/ajaxsearch/index2.cfm</a>

You can enter a term and either click outside the box or hit the button. (Don't hit Return/Enter.) While that works, an even slicker version is this:

<code>
&lt;form&gt;Search: &lt;input type="text" name="search"&gt;&lt;/form&gt;

&lt;cfdiv bind="url:results.cfm?search={% raw %}{search@keypress}{% endraw %}" /&gt;
</code>

I've removed the button and notice now my bind is based on search@keypress. The @ symbol means I'm defining an event to listen to. Instead of onChange, I've used keypress (when using this format, drop the "on"). Now you get "filter as you type" search, all in 2 lines of code without a line of JavaScript. You can see this demo here:

<a href="http://www.coldfusionjedi.com/demos/ajaxsearch/">http://www.coldfusionjedi.com/demos/ajaxsearch</a>

While not the prettiest demo, and not the most elegant (you don't want to type very fast), it's darn tooting sweet how simple the code is. Just in case folks are curious, here is the code for results.cfm. It isn't anything special or "CF8-ish":

<code>
&lt;cfparam name="url.search" default=""&gt;
&lt;cfset url.search = htmlEditFormat(url.search)&gt;
&lt;cfset url.search = left(url.search,255)&gt;

&lt;cfquery name="results" datasource="coldfusionjedi"&gt;
select	top 10 id, title, posted
from	tblblogentries
where	title like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#url.search#%{% endraw %}" maxlength="255"&gt;
order by posted desc
&lt;/cfquery&gt;
		  
&lt;table border="1"&gt;
	&lt;tr&gt;
		&lt;td&gt;Title&lt;/td&gt;&lt;td&gt;Posted&lt;/td&gt;
	&lt;/tr&gt;
	&lt;cfoutput query="results"&gt;
	&lt;tr&gt;
		&lt;td&gt;&lt;a href="http://www.coldfusionjedi.com/index.cfm?mode=entry&entry=#id#"&gt;#title#&lt;/a&gt;&lt;/td&gt;
		&lt;td&gt;#dateFormat(posted)# #timeFormat(posted)#&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/table&gt;
</code>

Who here thinks it would be nice to have a list of cool ColdFusion 8 AJAX sites? I don't mean my ugly little demos, but production sites making use of the technology? I'd happily start a list and link to it under Guides.