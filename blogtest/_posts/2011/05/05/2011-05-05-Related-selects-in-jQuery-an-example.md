---
layout: post
title: "Related selects in jQuery - an example"
date: "2011-05-05T19:05:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/05/05/Related-selects-in-jQuery-an-example
guid: 4221
---

Earlier today a follower on Twitter asked about doing related selects in jQuery. This is relatively trivial, but surprisingly most Google searches turned up plugins instead of tutorials. There's nothing wrong with that. In fact, if I needed to do this in a project I'd make use of the excellent <a href="http://www.texotela.co.uk/code/jquery/select/">Select box manipulation</a> plugin for a few years now. It occurred to me though that it may be interesting to do a related select example "from scratch" so to speak. This is how I solved it - feel free to rewrite it better/faster/leaner.
<!--more-->
<p>

First, I began with a form:

<p>

<pre><code class="language-markup">
&lt;form&gt;
	
	&lt;label for="states"&gt;States&lt;/label&gt;
	&lt;select name="states" id="states"&gt;
	&lt;option value=""&gt;Select a State&lt;/option&gt;
	&lt;option value="1"&gt;Louisiana&lt;/option&gt;
	&lt;option value="2"&gt;California&lt;/option&gt;
	&lt;option value="3"&gt;Virginia&lt;/option&gt;
	&lt;option value="4"&gt;Texas&lt;/option&gt;
	&lt;/select&gt;

	&lt;label for="cities"&gt;Cities&lt;/label&gt;
	&lt;select name="cities" id="cities"&gt;
	&lt;option value=""&gt;Select a City&lt;/option&gt;
	&lt;/select&gt;	
	
&lt;/form&gt;
</code></pre>

<p>

Here you can see my two selects. One labeled states and one for cities. Notice that cities is blank except for a top placeholder item. Now let's look at the JavaScript. The code isn't more than 20 lines so I've included the entire block here:

<p>

<pre><code class="language-javascript">
//first, detect when initial DD changes
$("#states").change(function() {
	//get what they selected
	var selected = $("option:selected",this).val();
	//no matter what, clear the other DD
	//Tip taken from: http://stackoverflow.com/questions/47824/using-core-jquery-how-do-you-remove-all-the-options-of-a-select-box-then-add-on
	$("#cities").children().remove().end().append("&lt;option value=\"\"&gt;Select a City&lt;/option&gt;");
	//now load in new options if I picked a state
	if(selected == "") return;
	$.getJSON("test.cfc?method=getcities&returnformat=json",{% raw %}{"stateid":selected}{% endraw %}, function(res,code) {
		var newoptions = "";
		for(var i=0; i&lt;res.length; i++) {
			//In our result, ID is what we will use for the value, and NAME for the label
			newoptions += "&lt;option value=\"" + res[i].ID + "\"&gt;" + res[i].NAME + "&lt;/option&gt;";
		}
		$("#cities").children().end().append(newoptions);
	});
});
</code></pre>

<p>

So we begin by simply listening to changes in the first drop down. We grab the selected value right away. Next we nuke all the options in the city drop down. For that action I used an excellent example from StackOverflow. You can see that I can move from the drop down to it's children, to removing them, to moving to the end and appending my placeholder. All in one line. I sometimes shy away from code like that as it feels like a bit too much going on at once, but in this case I think it's completely appropriate. 

<p>

Next we see if the user actually picked something. If they didn't, we leave. If they did, we do a quick call to our back end to load the data. Now for this example, the code isn't too important, but for completeness sake I'll post it at the bottom. Basically you can imagine a database call. It's going to return an array of results where each array index contains an ID and NAME value. From that I can create a string, and like the earlier statement used to add a placeholder, I can append it to the drop down.

<p>

And that's it. As I said, there's plugins out there to make this even easier, but it certainly isn't too difficult this way either. Here is the complete HTML page.

<p>

<pre><code class="language-markup">
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	//first, detect when initial DD changes
	$("#states").change(function() {
		//get what they selected
		var selected = $("option:selected",this).val();
		//no matter what, clear the other DD
		//Tip taken from: http://stackoverflow.com/questions/47824/using-core-jquery-how-do-you-remove-all-the-options-of-a-select-box-then-add-on
		$("#cities").children().remove().end().append("&lt;option value=\"\"&gt;Select a City&lt;/option&gt;");
		//now load in new options if I picked a state
		if(selected == "") return;
		$.getJSON("test.cfc?method=getcities&returnformat=json",{% raw %}{"stateid":selected}{% endraw %}, function(res,code) {
			var newoptions = "";
			for(var i=0; i&lt;res.length; i++) {
				//In our result, ID is what we will use for the value, and NAME for the label
				newoptions += "&lt;option value=\"" + res[i].ID + "\"&gt;" + res[i].NAME + "&lt;/option&gt;";
			}
			$("#cities").children().end().append(newoptions);
		});
	});

})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;


&lt;form&gt;
	
	&lt;label for="states"&gt;States&lt;/label&gt;
	&lt;select name="states" id="states"&gt;
	&lt;option value=""&gt;Select a State&lt;/option&gt;
	&lt;option value="1"&gt;Louisiana&lt;/option&gt;
	&lt;option value="2"&gt;California&lt;/option&gt;
	&lt;option value="3"&gt;Virginia&lt;/option&gt;
	&lt;option value="4"&gt;Texas&lt;/option&gt;
	&lt;/select&gt;

	&lt;label for="cities"&gt;Cities&lt;/label&gt;
	&lt;select name="cities" id="cities"&gt;
	&lt;option value=""&gt;Select a City&lt;/option&gt;
	&lt;/select&gt;	
	
&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

And the CFC:

<p>

<pre><code class="language-javascript">
component {

	remote function getCities(required numeric stateid) { 
		var result = [];
		
		//This would be a db call
		for(var i=1; i&lt;arguments.stateid*2; i++) {
			var city = {};
			city.name = "Some City #i# for State #arguments.stateid#";
			city.id = i;
			arrayAppend(result, city);	
		}
		
		return result;
	}

	
}
</code></pre>