---
layout: post
title: "jQuery based example of simple shopping cart UI"
date: "2011-01-10T13:01:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2011/01/10/jquery-based-example-of-simple-shopping-cart-ui
guid: 4078
---

Last week a reader and I shared a few emails about an issue he was having with this site. His site, <a href="http://beebright.com/index.cfm">Bee Bright</a>, is a candle shop. If you go into a product category, like for example <a href="http://beebright.com/products.cfm?cat_id=7">pillar candles</a>, you can see that he makes use of Ajax for his shopping cart. Simply click add to cart on one of the items and you can see this in action. This works for him but he was a bit concerned about his implementation. We talked back and forth a bit about it and I think it brings up a topic I've mentioned here before (and at Scotch on the Rocks last year). Moving to Ajax is not always a silver bullet solution. Sometimes it takes two or three implementations before you get things right. The more I work with Ajax the more I think about topics like this so I thought it would be good to discuss his solution, and mine, and let folks comment in as well. So enough preamble, let's get into it.
<!--more-->
<p>

To begin, let's discuss how he implemented the Ajax and why he was concerned. The developer, Chris, made use of cfdiv within an output tied to a simple query. Here is his code. I've removed some extra HTML to make things a bit simpler.

<p>

<code>
&lt;cfoutput query="products"&gt;
&lt;a href="images/products/#product_img#" class="cloud-zoom" id="zoom#currentrow#" rel="position: 'inside', zoomWidth:'100', zoomHeight:'100'"&gt;&lt;img src="images/products/#product_img_th#" width="220" /&gt;&lt;/a&gt;
&lt;div style="margin-left:240px;"&gt;
  &lt;div class="product_name"&gt;#product_name#&lt;/div&gt;
  #description#
&lt;/div&gt;
&lt;div class="orderbox"&gt;
&lt;cfdiv bind="url:cybercart/product_order_form.cfm?cat_id=#url.cat_id#&prod_id=#prod_id#"&gt;
&lt;/div&gt;
&lt;/cfoutput&gt;
</code>

<p>

The cfdiv outputs a form that makes use of cfform. This allows the form to automatically use Ajax to post the results. This is what gives you the ability to replace the form with the cart status update after hitting the button. 

<p>

Pretty simple - and it works. But Chris was a bit worried about the number of requests. On a page with 20 products he ended up seeing 21 CFM requests. One for the product listing and then 20 for each product form. Now the amount of HTML being sent back wasn't really that much (Chrome reports it at around 3 and a half K), but the more network requests you have going on the slower your total experience is going to be.

<p>

This is to me a <b>great</b> example of where an Ajax solution could possibly actually be slower than a non-Ajax solution. I don't mean that as an attack at all on his code. I've made this exact same type of mistake myself. But as Ajax developers sometimes it's easy to miss how a solution can backfire. 

<p>

What I proposed to Chris was a solution that reduced the number of initial HTTP requests. Instead of a request for each div, I suggested that we just return the forms with the products and use our front end code to handle them with jQuery. I built up some samples at lunch time that demonstrate this. I began with a simple product listing based on the cfartgallery.

<p>

<code>
&lt;cfquery name="getArt" datasource="cfartgallery"&gt;
select	artid, artname, price, description, largeimage
from	art
&lt;/cfquery&gt;

&lt;h2&gt;Products&lt;/h2&gt;

&lt;cfoutput query="getArt"&gt;
&lt;img src="artgallery/#largeimage#" align="left"&gt;
&lt;h3&gt;#artname#&lt;/h3&gt;
&lt;p&gt;
#description# 
&lt;/p&gt;
&lt;p&gt;
&lt;form&gt;
&lt;input type="text" value="1"&gt; &lt;input type="button" value="Add to Cart"&gt;
&lt;/form&gt;
&lt;br clear="left"&gt;
&lt;hr/&gt;
&lt;/cfoutput&gt;
</code>

<p>

Nothing too fancy here. Just select all the products, display them, and create a form to add them to a cart. You can see this in action here: <strike>http://www.coldfusionjedi.com/demos/jan102011/</strike> (<i>Old demos no longer work.</i>). Ok, so let's now enhance this a bit.

<p>

<code>

&lt;cfquery name="getArt" datasource="cfartgallery"&gt;
select	artid, artname, price, description, largeimage
from	art
&lt;/cfquery&gt;

&lt;html&gt;
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$(".addToCart").click(function() {
		//get the previous field
		var field = $(this).prev();
		//get the value
		var numberToAdd = $(field).val()
		if(!isNaN(numberToAdd)) {
			var prodid = $(field).data("productid");
			console.log("going to add "+numberToAdd+" for product id "+prodid);
		}
	});
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h2&gt;Products&lt;/h2&gt;

&lt;cfoutput query="getArt"&gt;
&lt;img src="artgallery/#largeimage#" align="left"&gt;
&lt;h3&gt;#artname#&lt;/h3&gt;
&lt;p&gt;
#description# 
&lt;/p&gt;
&lt;p&gt;
&lt;form&gt;
&lt;input type="text" value="1" data-productid="#artid#"&gt; &lt;input type="button" value="Add to Cart" class="addToCart"&gt;
&lt;/form&gt;
&lt;br clear="left"&gt;
&lt;hr/&gt;
&lt;/cfoutput&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

I've got a few changes here. I added a class to the button and some data to my fields. If you scroll up to my jQuery code you can see I'm now listening for clicks to the button. Once clicked I get the previous item in the dom, my form field, and then grab the value. If numeric I fetch out the productid and I now know both the quantity and product id of what you want to add to the cart. You can demo this here: <strike>http://www.coldfusionjedi.com/demos/jan102011/index2.cfm</strike> (<i>Old demos no longer work.</i>) And before anyone complains - yes - I used console.log. Yes - I know it doesn't work in IE or Firefox w/o Firebug. If you don't have those guys then just don't run the demo. Ok, now let's add some more to it.

<p>

<code>
$(document).ready(function() {
	$(".addToCart").click(function() {
		//get the previous field
		var field = $(this).prev();
		//get the value
		var numberToAdd = $(field).val()
		if(!isNaN(numberToAdd)) {
			var prodid = $(field).data("productid");
			console.dir("going to add "+numberToAdd+" for product id "+prodid);
			$.post("service.cfc?returnformat=json&method=addproducttocart", {% raw %}{"quantity":numberToAdd,"productid":prodid}{% endraw %}, function(res,code) {
				//result is the cart. we will just say how many items
				var s = "Product added to cart. You now have ";
				var total = 0;
				for(var p in res) {
					total += parseInt(res[p]);
				}
				s += total + " item(s) in your cart.";
				console.log(s);
			},"json");
		}
	});
})
</code>

<p>

In this update I only changed the JavaScript. If you want the full CFM for this just download the attached code. Now I'm doing a post of the quantity/product to the server. I take the result (which is the complete cart, and I'll show that in a minute) and I create a result string from it. I don't bother with a total price for the cart but just report on the total number of items. Obviously you could add that too if you wanted. In order for this to work I added an Application.cfc:

<p>

<code>
component {
	this.name="jan102011demo";
	this.sessionManagement="true";
	
	public boolean function onApplicationStart() {
		return true;
	}
	
	public boolean function onRequestStart(string req) {
		//allow for easy testing of the cart
		if(structKeyExists(url,"init")) onSessionStart();
		return true;
	}
	
	public void function onSessionStart() {
		session.cart = {};
	}
	
}
</code>

<p>

The only thing useful here was the creation of the cart on session startup. Next, here is my simple service component:

<p>

<code>
component {

	remote function addProductToCart(numeric quantity, numeric productid) {
		if(!structKeyExists(session.cart, arguments.productid)) session.cart[arguments.productid] = 0;
		session.cart[arguments.productid]+=arguments.quantity;
		return session.cart;
	}
}
</code>

<p>

Not much here either. I basically add to a structure that contains keys as product IDs and values as quantities. I could add validation on the product ID as well as quantity (what happens if a negative or float is passed?) to make this a bit more solid. So - there we go. I'm basically done. But I would like to actually display the result like the Chris did. Instead of overwriting the form though I decided to give the <a href="http://pjdietz.com/jquery-plugins/freeow/">Freeow</a> plugin a try. This is a jQuery plugin I saw last week that does Growl-style notifications. Using this meant adding a CSS tag, a JS script include, and a grand total of one line of code:

<p>

<code>
$("#freeow").freeow("Cart Updated!", s, {% raw %}{classes:["smokey"]}{% endraw %});
</code>

<p>

You can see this yourself by hitting the big ole Demo button:

<i>Sorry - old demos no longer work.</i>

Thoughts? As always, I'm sure folks could code this a million other ways. My main point here - and one I want to talk more about this year - is that while Ajax is easy/sexy/cool/etc, it really makes sense to think about your solutions and what kind of impact they have once released. Make sense?<p><a href='/enclosures/jan102011.zip'>Download attached file.</a></p>