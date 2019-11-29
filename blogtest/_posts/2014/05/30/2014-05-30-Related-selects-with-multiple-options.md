---
layout: post
title: "Related selects with multiple options"
date: "2014-05-30T18:05:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2014/05/30/Related-selects-with-multiple-options
guid: 5234
---

<p>
A reader asked me a simple Ajax-y type question this morning and I thought I'd turn it into a simple blog post. We've all done, or at least seen, related selects before. That widget where you select something in one drop down and it drives the data in the second drop down. What he was asking is how you would support being able to select <strong>multiple</strong> items in the first drop down. Here is an example of that. Before I go on, let me say that while the back end of this is built in ColdFusion, it absolutely does <strong>not</strong> matter what back end you use. Oh, and please do not ask me to build you a PHP version! ;)
</p>
<!--more-->
<p>
Let's begin by building a simple version of related selects. Here's the HTML:
</p>

<pre><code class="language-markup">&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My Page&lt;/title&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;
    	&lt;script type=&quot;text/javascript&quot; src=&quot;http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js&quot;&gt;&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

	&lt;form&gt;
		&lt;select id=&quot;state&quot;&gt;
			&lt;option value=&quot;0&quot;&gt;-- Select a State --&lt;/option&gt;
			&lt;option value=&quot;1&quot;&gt;California&lt;/option&gt;
			&lt;option value=&quot;2&quot;&gt;Louisiana&lt;/option&gt;
			&lt;option value=&quot;3&quot;&gt;Texas&lt;/option&gt;
		&lt;/select&gt;
		
		&lt;select id=&quot;city&quot;&gt;
			&lt;option&gt;-- Select a City --&lt;/option&gt;
		&lt;/select&gt;
	&lt;/form&gt;

&lt;script src=&quot;app.js&quot;&gt;&lt;/script&gt;	
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>
Nothing too terribly interesting here, but make note of the two drop downs. The first is for states and the second is for cities. This one will be driven by JavaScript. I was lazy and only typed in three states. Now let's look at the JavaScript.
</p>

<pre><code class="language-javascript">$(document).ready(function() {
	
	$stateDropdown = $(&quot;#state&quot;);
	$cityDropdown = $(&quot;#city&quot;);
	
	$stateDropdown.on(&quot;change&quot;, function(e) {
		var state = $(this).val();
		//always clear
		$cityDropdown.empty();
		//reinject the default
		$cityDropdown.append(&quot;&lt;option&gt;-- Select a City --&lt;/option&gt;&quot;);
		//if blank, do nothing
		if(state === 0) return;
		$.getJSON(&quot;service.cfc?method=getCities&quot;, {% raw %}{state:state}{% endraw %}).done(function(res) {
			for(var i=0, len=res.length; i&lt;len; i++) {
				$cityDropdown.append(&quot;&lt;option&gt;&quot;+res[i].CITY+&quot;&lt;/option&gt;&quot;);
			}
		});
	});
	
});</code></pre>

<p>
Again, nothing too complex here if you've built one of these things before. Notice a change - get the value - and update the related select. Finally, let's look at the server side component. Again, this is ColdFusion, but you could, I hope, see how this would be done in your language of choice. Like Node. Or Node. But, yeah, whatever you prefer:
</p>

<pre><code class="language-javascript">
component {

	//nice defaults
	url.returnformat=&quot;json&quot;;
	url.queryformat=&quot;struct&quot;;

	//include a file to create a fake query we can select against
	include &quot;fake.cfm&quot;;

	remote query function getCities(required numeric state) {
		return queryExecute(&quot;select city from cities where state = :state&quot;, {% raw %}{state={value:arguments.state, cfsqltype:'cf_sql_integer'}{% endraw %}}, {% raw %}{dbtype:'query'}{% endraw %});
	}

}</code></pre>

<p>
All this component does is define one method, getCities, that runs a query against a query (a ColdFusion feature that lets you treat an existing query like a database table). The data is simply hard-coded in an external file.
</p>

<pre><code class="language-markup">&lt;cfscript&gt;
variables.cities = queryNew(&quot;state,city&quot;, &quot;integer,varchar&quot;, [
	{% raw %}{state:1, city:&quot;San Francisco&quot;}{% endraw %},
	{% raw %}{state:1, city:&quot;San Mateo&quot;}{% endraw %},
	{% raw %}{state:1, city:&quot;Mountain View&quot;}{% endraw %},
	{% raw %}{state:2, city:&quot;Lafayette&quot;}{% endraw %},
	{% raw %}{state:2, city:&quot;Lake Charles&quot;}{% endraw %},
	{% raw %}{state:2, city:&quot;Catahoula&quot;}{% endraw %},
	{% raw %}{state:3, city:&quot;Houston&quot;}{% endraw %},
	{% raw %}{state:3, city:&quot;Dallas&quot;}{% endraw %},
	{% raw %}{state:3, city:&quot;Fort Worth&quot;}{% endraw %}]);
&lt;/cfscript&gt;
</code></pre>

<p>
Ok, so that's it. You could make this a bit more intelligent perhaps with some caching on the client-side, but that's really it. So how do we update this for multiple items?
</p>

<p>
Well, first, obviously, we add "multiple" to the first drop down. I won't reshare the entire HTML file as it is almost the exact same. The JavaScript is a little bit different though.
</p>

<pre><code class="language-javascript">$(document).ready(function() {
	
	$stateDropdown = $(&quot;#state&quot;);
	$cityDropdown = $(&quot;#city&quot;);
	
	$stateDropdown.on(&quot;change&quot;, function(e) {
		var state = $(this).val();
		//state is an array, convert it to a list
		state = state.join(&quot;,&quot;);

		//always clear
		$cityDropdown.empty();
		//reinject the default
		$cityDropdown.append(&quot;&lt;option&gt;-- Select a City --&lt;/option&gt;&quot;);
		//if blank, do nothing
		if(state === 0) return;
		$.getJSON(&quot;service.cfc?method=getCities&quot;, {% raw %}{state:state}{% endraw %}).done(function(res) {
			for(var i=0, len=res.length; i&lt;len; i++) {
				$cityDropdown.append(&quot;&lt;option&gt;&quot;+res[i].CITY+&quot;&lt;/option&gt;&quot;);
			}
		});
	});
	
});</code></pre>

<p>
So - the only real difference here is handling the fact that jQuery will return the multiple items as an array. We can easily convert that to a list of values using join. This turns the array into a simple string we can pass to our service. Finally, let's look at the change in the server-side code.
</p>

<pre><code class="language-javascript">component {

	//nice defaults
	url.returnformat=&quot;json&quot;;
	url.queryformat=&quot;struct&quot;;

	//include a file to create a fake query we can select against
	include &quot;fake.cfm&quot;;

	remote query function getCities(required string state) {
		return queryExecute(&quot;select city from cities where state in (:state)&quot;, {% raw %}{state={value:arguments.state, cfsqltype:'cf_sql_integer', list:true}}{% endraw %}, {% raw %}{dbtype:'query'}{% endraw %});
	}

}</code></pre>

<p>
So - a few small changes. First, our method signature went from requiring a number to a string. This lets us accept a value like 1, or 5,6. Next, the query was updated to do a "state in ()" type search. Again, this will work with one value or multiple. And... that's it. I've included a zip of both versions. The ColdFusion code requires the latest version if you want to run it as is.
</p><p><a href='https://static.raymondcamden.com/enclosures/relatedselects.zip'>Download attached file.</a></p>