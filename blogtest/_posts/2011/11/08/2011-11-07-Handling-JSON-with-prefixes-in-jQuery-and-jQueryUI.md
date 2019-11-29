---
layout: post
title: "Handling JSON with prefixes in jQuery and jQueryUI"
date: "2011-11-08T09:11:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/11/08/Handling-JSON-with-prefixes-in-jQuery-and-jQueryUI
guid: 4424
---

William asked:

<p>

<blockquote>
How do you tell jquery in an autocomplete to remove the leading // from the json response?  Do you need to use an event function to manually do it, or is there a simple way?  This prefixing of JSON responses is mandatory for one of my projects.
</blockquote>

<p>
<!--more-->
Yes, you do need an event function to manually do it, but luckily jQuery makes this rather simple. To test this, I began with a very simple autocomplete implementation. This example uses ColdFusion on the back end but obviously it would work with any application server. First, here is the front end:

<p>

<code>
&lt;html&gt;
	
	&lt;head&gt;
	&lt;script type="text/javascript" src="http://code.jquery.com/jquery-1.7.min.js"&gt;&lt;/script&gt;
	&lt;script src="jquery-ui-1.8.16.custom/js/jquery-ui-1.8.16.custom.min.js"&gt;&lt;/script&gt;
	&lt;link rel="stylesheet" href="jquery-ui-1.8.16.custom/css/vader/jquery-ui-1.8.16.custom.css" type="text/css"&gt;
	&lt;script&gt;
	$(function() {

		$("#name").autocomplete({
			source: "source.cfc?method=searchart&returnformat=json"
		});
	
	});
	&lt;/script&gt;
	&lt;/head&gt;
	
	&lt;body&gt;
		
	&lt;form action="" method="post"&gt;	
	name: &lt;input name="name" id="name" /&gt;
	&lt;/form&gt;
	
	&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

And here is the back end. Again - this could be any language at all.

<p>

<code>
component {

	remote function searchArt(string term) {
		var q = new com.adobe.coldfusion.query();
		q.setSQL("select artname from art where lcase(artname) like :term");
		q.addParam(name="term",value="{% raw %}%#lcase(arguments.term)#%{% endraw %}",cfsqltype="cf_sql_varchar");
		var query = q.execute().getResult();
		var result = [];
		for(var i=1; i&lt;=query.recordCount; i++) {
			result[arrayLen(result)+1] = query.artname[i];
		}
		return result;	
		
	}

}
</code>

<p>

This example makes use of jQuery UI's <a href="http://jqueryui.com/demos/autocomplete/">Autocomplete</a> controls, one of my favorite parts of jQuery UI. As you can see it is rather simple to use. I simply tell it which input field I want to turn into an autocomplete and tell it how to fetch the data. (There are many more options but for now, this is all we need.) This runs fine until we begin to use the feature William spoke  of - prefixing the JSON result with two / characters in front. This is used in some situations to help make the Ajax application a bit more secure. By prefixing the JSON string we require preprocessing on the string before blindly evaluating it. While how this is done will depend on your application server, in ColdFusion you can turn this on at the server level or on a per application basis. Here's how I did it for this demo:

<p>

<code>
component {

	this.name="autocompleteprefixissue";
	this.datasource="cfartgallery";
	this.secureJSON="true";
	this.secureJSONPrefix="//";

}
</code>

<p>

Once this feature is enabled, your autocomplete stops working. You get no error. You're really stuck. If you know enough to check the network monitor, you can see the issue:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip217.png" />

<p>

So how do you fix it? One of the more cooler features of jQuery is the ability to register <a href="http://api.jquery.com/category/ajax/global-ajax-event-handlers/">global Ajax handlers</a>. But we're going to tackle this a bit differently and instead use <a href="http://api.jquery.com/jQuery.ajaxSetup/">ajaxSetup</a>. This is similar but works at a slightly lower level.  One of the features is called dataFilter. As you can guess, it allows you to filter the data returned by Ajax requests. What's cool is that this happens behind the scenes. Our autocomplete code will never know it even occurred. Let's look at how it works.

<p>

<code>
&lt;html&gt;
	
	&lt;head&gt;
	&lt;script type="text/javascript" src="http://code.jquery.com/jquery-1.7.min.js"&gt;&lt;/script&gt;
	&lt;script src="jquery-ui-1.8.16.custom/js/jquery-ui-1.8.16.custom.min.js"&gt;&lt;/script&gt;
	&lt;link rel="stylesheet" href="jquery-ui-1.8.16.custom/css/vader/jquery-ui-1.8.16.custom.css" type="text/css"&gt;
	&lt;script&gt;
	$(function() {

		$.ajaxSetup({
			dataFilter: function(data, type){
				return data.substring(2, data.length);
			}
		});
	
		$("#name").autocomplete({
			source: "source.cfc?method=searchart&returnformat=json"
		});
	
	});
	&lt;/script&gt;
	&lt;/head&gt;
	
	&lt;body&gt;
		
	&lt;form action="test4.cfm" method="post"&gt;	
	name: &lt;input name="name" id="name" /&gt;
	&lt;/form&gt;
	
	&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

My dataFilter function takes in the data stream and simply removes the first two characters. As I said, nothing in autocomplete was changed. As soon as this is added, things begin working perfectly again. Try this yourself below (and look - I didn't put any pesky console.log messages so all your poor folks in older IE builds or Firefox w/o Firebug can enjoy it!).

<p>

<a href="http://www.coldfusionjedi.com/demos/2011/nov/8/index.html"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>