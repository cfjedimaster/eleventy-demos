---
layout: post
title: "HTML5 Data Attribute Example"
date: "2011-11-03T10:11:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/11/03/HTML5-Data-Attribute-Example
guid: 4419
---

My readers are probably sick and tired of me gushing over data attributes, and for that, I apologize. I'm just a huge fan of <i>practical</i>, useful solutions, and no, I'm not going to use this as opportunity to complain about how silly Canvas is again. Rather, I thought I'd whip up another simple example of how you can make use of data attributes in your shiny Ajax-enabled web sites.
<!--more-->
<p>

If you don't remember what data attributes are, here's a quick reminder. Data attributes are a way to add ad hoc data to your DOM. By prefixing an attribute with data- in front of your name/value pair, your have HTML that is still valid no matter what name you use. So for example:

<p>

<code>
&lt;img src="something" data-nsfw="true"&gt;
</code>

<p>

There is no data-nsfw attribute for the image tag, but because I began the attribute with data-, it's valid. Another example:

<p>

<code>
&lt;img src="something" data-nsfw="true" data-hires="someurl"&gt;
</code>

<p>

In both examples, the browser blissfully ignores the custom attributes, but you can write your own code to do whatever you want with it. This comes in handy in numerous situations, but here's one simple example. Imagine I'm selecting data from a table that includes price information. To make it pretty, I'll wrap the output of the price in a function to render it as a currency. Here's an example in ColdFusion:

<p>

<code>
Price: #dollarFormat(price)#&lt;br/&gt;
</code>

<p>

For the hell of it, here's the PHP version of it:

<p>

<code>
echo money_format('%i', $price) . "\n";
</code>

<p>

This outputs something like : $12,3900.11. What if you wanted to work with this price in JavaScript but treat it as a number? You would need to strip out the currency, possibly even the commas first. Instead of worrying about that, what if we used data attributes to store the "naked" price as a simple number? This will be hidden from the end user (technically <b>not</b> hidden - it will be available in view source) but will be available for our code. Here's an example. The code below loops over a query of art work. (I'll show the entire template in a bit.)

<p>

<code>
&lt;cfoutput query="getArt"&gt;
	&lt;div class="artPiece" data-id="#artid#" data-price="#price#"&gt;
		
		&lt;h2&gt;#artname#&lt;/h2&gt;
		Price: #dollarFormat(price)#&lt;br/&gt;
		Media: #mediatype#&lt;br/&gt;
		Artist: #firstname# #lastname#&lt;br/&gt;
		#description#&lt;br/&gt;
		&lt;img src="/cfdocs/images/artgallery/#largeimage#"&gt;
	&lt;/div&gt;
&lt;/cfoutput&gt;
</code>

<p>

As you can see, I've included two data attributes in my div tag. One of the primary key of the record and one for the price. To be clear, I could have used other methods. I could have used a hidden form field for example. But this is <i>much</i> cleaner. Grabbing the values is a matter of simple JavaScript, but jQuery makes it even easier. Here's the complete template:

<p>

<code>


&lt;!--- get art work ---&gt;
&lt;cfquery name="getArt" datasource="cfartgallery"&gt;
select	art.artid, art.artname, art.description, art.price, art.largeimage, 
		artists.firstname, artists.lastname, 
		media.mediatype
		from art
		join artists on art.artistid = artists.artistid
		join media on art.mediaid = media.mediaid
&lt;/cfquery&gt;

&lt;html&gt;
	
	&lt;head&gt;
		&lt;title&gt;Data Example&lt;/title&gt;
		&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css" /&gt;
		&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;

		&lt;style&gt;
		.artPiece {
			margin: 12px;	
			border-style:solid;            
           	border-width:thin;
			width: 230px;   
			padding: 5px;
			float: left;
		}
		
		&lt;/style&gt;
		&lt;script type="text/javascript"&gt;
		$(function() {
			$(".artPiece").click(function() {
				var selectedId = $(this).data("id");
				var selectedPrice = $(this).data("price");
				console.log(selectedId+" "+selectedPrice);
			});			
		});	
		&lt;/script&gt;
	&lt;/head&gt;
	
	&lt;body&gt;
		
		&lt;div class="container"&gt;
			
		&lt;h1&gt;Art Work&lt;/h1&gt;
		
		&lt;cfoutput query="getArt"&gt;
			&lt;div class="artPiece" data-id="#artid#" data-price="#price#"&gt;
				
				&lt;h2&gt;#artname#&lt;/h2&gt;
				Price: #dollarFormat(price)#&lt;br/&gt;
				Media: #mediatype#&lt;br/&gt;
				Artist: #firstname# #lastname#&lt;br/&gt;
				#description#&lt;br/&gt;
				&lt;img src="/cfdocs/images/artgallery/#largeimage#"&gt;
			&lt;/div&gt;
		&lt;/cfoutput&gt;
		
		&lt;/div&gt;
		
	&lt;/body&gt;
	
&lt;/html&gt;
</code>

<p>

You can ignore the SQL and most of the formatting. Focus on the fact that I've got a click handler on my div. Grabbing my two values is as simple as using jQuery's data method. You can demo this below.

<p>

<a href="http://www.raymondcamden.com/demos/2011/nov/3/test3.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>