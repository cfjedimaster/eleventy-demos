---
layout: post
title: "Quick example of RSS URL checking with jQuery and ColdFusion"
date: "2010-06-16T14:06:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/06/16/Quick-example-of-RSS-URL-checking-with-jQuery-and-ColdFusion
guid: 3848
---

I'm working on a web site that allows people to enter RSS urls. These urls get parsed (via CFFEED) and displayed on a custom page. While I have support for handling bad RSS feeds, I wanted to create a quick demo where I'd use jQuery and ColdFusion to handle checking the RSS feeds while the user is working on the form. Here is what I came up with.
<!--more-->
<p/>

First - let's look at the form. The first two fields aren't really relevant. I added them to show that the RSS parsing was part of a greater form. The last three fields, the RSS labeled ones, are the fields we will care about.

<p/>

<code>
&lt;style&gt;
.rssfield {% raw %}{ width: 500px; }{% endraw %}
.rssstatus { 
	font-style: italic;
}
&lt;/style&gt;

&lt;form&gt;
name:  &lt;input type="text" name="name"&gt;&lt;br/&gt;
max num of entries:  &lt;input type="text" name="maxentries"&gt;&lt;br/&gt;
rss feed:  &lt;input type="text" name="rssfeed1" class="rssfield"&gt;&lt;br/&gt;
rss feed:  &lt;input type="text" name="rssfeed2" class="rssfield"&gt;&lt;br/&gt;
rss feed:  &lt;input type="text" name="rssfeed3" class="rssfield"&gt;&lt;br/&gt;
&lt;input type="submit"&gt;
&lt;/form&gt;
</code>

<p/>

Note that I've made use of a class, "rssfield", that is common to all the fields. This is going to come into play within our jQuery. And speaking of that - let's take a look at the JavaScript.

<p/>

<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	$(".rssfield").blur(function() {
		var value = $(this).val()
		var name = $(this).attr("name")
		console.log('current value is '+value+' for field '+name)
		value = $.trim(value)

		//If blank, just quit - but clear any previous status		
		if(value == '') {
			if($("#status"+name).length == 1)  $("#status"+name).text("")
			return
		}
		//create a response span - if we don't have one
		if($("#status"+name).length == 0) $(this).next().before('&lt;span class="rssstatus" id="status'+name+'"&gt;Checking RSS validity...&lt;/span&gt;')
		else $("#status"+name).text("Checking RSS validity...")

		//call the server to check the field

		$.get('checkrss.cfm', {% raw %}{ "rssurl":value}{% endraw %}, function(data,status,eq) {
			if(data.verified == 0) {
				console.log('bad')
				$("#status"+name).html("RSS value not valid: "+data.message)
			} else {
				console.log('good')
				$("#status"+name).html("RSS value valid!")
			}
			console.log(data)
		})
	})
	
})
&lt;/script&gt;
</code>

<p/>

So as you can see - the bulk of the code here revolves around a blur handler for any field with the rssfield class. (I should probably have filtered it INPUT tags as well.) I begin by getting the value and name. Once I have the value, I do a quick trim on it. Now the first thing I want to do is ensure the user actually typed something in. If they didn't, I might as well leave. For now ignore that first line in the clause. It will make more sense in a second.

<p/>

If the user did type something, I begin by creating a new span to handle a status message. Why did I do this? My thinking was - it would be kind of nice if I didn't add stuff to my form that was distracting. Not that a empty span would even register to a user, but I thought it would be nice if jQuery handled that as well. So essentially - I try to get a span for my particular field. If it doesn't exist, I create it. If it does exist, I set the text. I'm <b>way</b> open to being argued about this way of doing this.

<p/>

Finally we get to the AJAX call. I pass the value to a ColdFusion script and then wait around the result. I'm going to expect a structure back. That structure will have two fields: verified and message. The message field will only be used for errors. So that's it really for the client side code, now let's take a look at checkrss.cfm:

<p/>

<code>
&lt;cfparam name="url.rssurl" default=""&gt;
&lt;cfif url.rssurl is ""&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;!--- 
Return a structure:
 	verified: 0/1 (true/false)
	message: Only useful on bad results
---&gt;
&lt;cfset result = {}&gt;
&lt;cfif not isValid("url", url.rssurl)&gt;
	&lt;cfset result["verified"] = 0&gt;
	&lt;cfset result["message"] = "Value was not a valid URL."&gt;
&lt;cfelse&gt;
	&lt;cftry&gt;
		&lt;cffeed source="#url.rssurl#" query="foo"&gt;
		&lt;cfset result["verified"] = 1&gt;
		&lt;cfset result["message"] = ""&gt;
		&lt;cfcatch&gt;
			&lt;cfif cfcatch.message is "Unable to parse the feed: Either source specified is invalid or feed is malformed."&gt;
				&lt;cfset result["verified"] = 0&gt;
				&lt;cfset result["message"] = "URL was not a valid RSS feed."&gt;			
			&lt;cfelse&gt;
				&lt;cfset result["verified"] = 0&gt;
				&lt;cfset result["message"] = "Unable to verify RSS feed. Gremlins."&gt;			
			&lt;/cfif&gt;
		&lt;/cfcatch&gt;
	&lt;/cftry&gt;
&lt;/cfif&gt;

&lt;cfcontent type="application/json" reset="true"&gt;&lt;cfoutput&gt;#serializeJSON(result)#&lt;/cfoutput&gt;
</code>

<p/>

Stepping through - we being with a quick param for url.rssurl. If it is blank, we abort the request. Then we first check to see if the URL is valid. If not, we return a struct with a message saying that it was not. Now unfortunately, cffeed does not support a way to see if a URL is a valid RSS feed. So because of that, I perform the request and simply try/catch it. I've got one catch set up for a bad feed, and another set up for "everything else". Finally I serialize the response. 

<p/>

All in all - a pretty simple example. I do want to point out something. The <a href="http://docs.jquery.com/Plugins/Validation">jQuery form validation plugin</a> (when I say "the" I obviously mean, to me, the best one) actually supports operations like this. You can easily set up validation rules that include hitting server side stuff for complex logic. I chose not to use it in this example because I'm not quite sure I'll be using the plugin for the site in question. And I wanted to write it myself for fun. 

<p/>

I've got a demo set up (see big ole button below), but unfortunately, I had to hobble it a bit. Any valid URL will be converted to http://feeds.feedburner.com/RaymondCamdensColdfusionBlog, which means it will always come back as true. I will explain why later today. (Possible new bad bug in cffeed unfortunately.) 

<p/>

<a href="http://www.raymondcamden.com/demos/jun162010/test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>