---
layout: post
title: "Ask a Jedi: Example of modal dialog editing with jQuery"
date: "2011-01-02T14:01:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/01/02/Ask-a-Jedi-Example-of-modal-dialog-editing-with-jQuery
guid: 4069
---

Steve asks:
<p/>
<blockquote>
I'm getting onto the jquery / CF integration a bit late.  When I get some time I really want to go through all of your tutorials. What I was trying to find was a simple "edit" type form that would be a modal pop up window from a page of items.
<br/<br/>
For example, say you have a product listing of widgets - and next to each widget is an "edit" link that would open a modal jquery window with some form fields on it - populated by a CFC from a db query and then updated via a CFC from the modal window which then closes on update.
<br><br/>
This seems like a pretty good "real world" tutorial but in just browsing through your stuff, and plenty of other sites, I'm not seeing one that really explains this concept.
</blockquote>
<p>
<!--more-->
So - there are obviously a thousand different ways we could implement something like this. Here is an example I came up with. I began by creating a simple, static ColdFusion script that did nothing (nothing Ajax-y anyway) at all.

<p>

<pre><code class="language-markup">
&lt;cfquery name="getart"&gt;
select	artid, artname, description, price
from	art
&lt;/cfquery&gt;

&lt;style&gt;
.artdiv {
	padding: 5px;
	margin: 5px;
	background-color: #80ff80;
}
&lt;/style&gt;

&lt;cfoutput query="getart"&gt;
	
	&lt;div class="artdiv"&gt;
		&lt;h2&gt;#artname#&lt;/h2&gt;
		&lt;p&gt;
		Price: #dollarFormat(price)#
		&lt;/p&gt;
		&lt;p&gt;
		#description#
		&lt;/p&gt;
	&lt;/div&gt;
	
&lt;/cfoutput&gt;
</code></pre>

<p>

I run a quick query against the cfartgallery database and display each piece of art. I display the name, price, and description for each one. Here is a quick screen shot so you can see what I mean.

<p>


<img src="https://static.raymondcamden.com/images/ScreenClip6.png" />

<p>

Admit it - you love my design, don't you? I call this the "Sickly Green" theme. Anyway, I always try to start simple and then progressively add to it. So let's look at the first iteration of my solution.

<p>

<pre><code class="language-markup">
&lt;cfquery name="getart" maxrows="10"&gt;
select	artid, artname, description, price
from	art
&lt;/cfquery&gt;

&lt;html&gt;
&lt;head&gt;
&lt;script src="jquery-ui-1.8.7.custom/js/jquery-1.4.4.min.js"&gt;&lt;/script&gt;
&lt;script src="jquery-ui-1.8.7.custom/js/jquery-ui-1.8.7.custom.min.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="jquery-ui-1.8.7.custom/css/overcast/jquery-ui-1.8.7.custom.css" /&gt;
&lt;script&gt;
$(document).ready(function() {

	$(".artdiv").click(function() {
		//based on which we click, get the current values
		//first, the name
		var name = $("h2", this).text();
		var price = $("p:first", this).data("price");
		var desc = $("p:last", this).text();
		desc = $.trim(desc);
		
		$("#namefield").val(name);
		$("#pricefield").val(price);
		$("#descriptionfield").val(desc);
		
		$("#editForm").dialog({
			buttons: {
				"Save": function(){
					console.log('save clicked');
				}
			}
		});
	});
	
});
&lt;/script&gt;
&lt;style&gt;
.artdiv {
	padding: 5px;
	margin: 5px;
	background-color: #80ff80;
}
#editForm {
	display:none;	
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfoutput query="getart"&gt;
	
	&lt;div class="artdiv"&gt;
		&lt;h2&gt;#artname#&lt;/h2&gt;
		&lt;p data-price="#price#"&gt;
		Price: #dollarFormat(price)#
		&lt;/p&gt;
		&lt;p class="description"&gt;
		#description#
		&lt;/p&gt;
	&lt;/div&gt;
	
&lt;/cfoutput&gt;

&lt;div id="editForm" title="Edit Art"&gt;
	&lt;p&gt;
	&lt;b&gt;Name:&lt;/b&gt;&lt;br/&gt;
	&lt;input type="text" id="namefield"&gt;
	&lt;/p&gt;
	&lt;p&gt;
	&lt;b&gt;Price:&lt;/b&gt;&lt;br/&gt;
	&lt;input type="text" id="pricefield"&gt;
	&lt;/p&gt;
	&lt;p&gt;
	&lt;b&gt;Description:&lt;/b&gt;&lt;br/&gt;
	&lt;textarea id="descriptionfield"&gt;&lt;/textarea&gt;
	&lt;/p&gt;
	
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

Ok, we've got a lot going on here new so let's tackle it from the top. You will notice that I've added both jQuery and jQuery UI. jQuery UI will be used for the dialog control. 

<p>

Now look at th JavaScript. We want "click to edit" and I decided on simply listening to the click handler for the entire div of the art piece. This is probably not the way I'd do it normally. I'd probably add a simple Edit link to the lower right corner, or perhaps upper right corner. Point is - you can do this anyway you like. At minimum I should add some CSS to make it obvious you <i>can</i> click to edit. 

<p>

So the next thing we need to do is create a dialog. This will hold the form that we will use to edit the art piece. Now stay with me here as we are going to to back and forth a bit. I need a way to get the data, right?  Well I can use jQuery selectors filtered by the current selector (the div you clicked on) to get the information. The name is in my h2 tag. That's easy enough to get. My price is a bit more tricky. Did you notice how I used dollarFormat? I don't want the "pretty" value but the original value. So I added a data-price attribute to my paragraph tab and fetch it out using jQuery's data function. Finally the description is fetched via the last paragraph. Three different examples and again - you could do this any number of other ways as well. 

<p>

So once we have the values, we can then launch the dialog. If you scroll to the bottom of the page you will see a hidden div there with the form. I set the form field values and than use the dialog() function to show it. I love how easy jQuery UI makes things for me. Note I also added a Save button. It isn't doing anything yet but I can confirm it is firing with a console message. Ok - hopefully you are with me so far. Here is another screen show.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip7.png" />

<p>

Alright - now let's kick it up to 11. So far we've gotten a dialog form working. It's dynamic so that the values you see in the dialog are dependent on the piece of art you click on. We've got a save button but it isn't doing anything. To complete the application we need to send the form data to the server and update the display. Here is my third and final iteration.

<p>

<pre><code class="language-markup">
&lt;cfset getArt = new artservice().getArt()&gt;

&lt;html&gt;
&lt;head&gt;
&lt;script src="jquery-ui-1.8.7.custom/js/jquery-1.4.4.min.js"&gt;&lt;/script&gt;
&lt;script src="jquery-ui-1.8.7.custom/js/jquery-ui-1.8.7.custom.min.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="jquery-ui-1.8.7.custom/css/overcast/jquery-ui-1.8.7.custom.css" /&gt;
&lt;script&gt;
//credit: http://www.mredkj.com/javascript/numberFormat.html
function dollarFormat(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length &gt; 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{% raw %}{3}{% endraw %})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return "$" + x1 + x2;	
}

$(document).ready(function() {

	$(".artdiv").click(function() {
		var initialDiv = this;

		//based on which we click, get the current values
		var artid = $(this).data("artid");
		var name = $("h2", this).text();
		var price = $("p:first", this).data("price");
		var desc = $("p:last", this).text();
		desc = $.trim(desc);

		$("#artid").val(artid);		
		$("#namefield").val(name);
		$("#pricefield").val(price);
		$("#descriptionfield").val(desc);
		
		$("#editForm").dialog({
			buttons: {
				"Save": function() {
					var thisDialog = $(this);
					$.post("artservice.cfc?method=saveart", 
					{
						id:$("#artid").val(),
						name:$("#namefield").val(),
						price:$("#pricefield").val(),
						description:$("#descriptionfield").val()
					}, 
					function() {
						//update the initial div
						$("h2", initialDiv).text($("#namefield").val());
						var price = $("#pricefield").val();
						$("p:first", initialDiv).data("price", price);
						price = parseInt(price).toFixed(2);
						$("p:first", initialDiv).text("Price: "+dollarFormat(price));
						$("p:last", initialDiv).text($("#descriptionfield").val());
						$(thisDialog).dialog("close");
					});
				}
			}
		});
	});
	
});
&lt;/script&gt;
&lt;style&gt;
.artdiv {
	padding: 5px;
	margin: 5px;
	background-color: #80ff80;
}
#editForm {
	display:none;	
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;cfoutput query="getart"&gt;
	
	&lt;div class="artdiv" data-artid="#artid#"&gt;
		&lt;h2&gt;#artname#&lt;/h2&gt;
		&lt;p data-price="#price#"&gt;
		Price: #dollarFormat(price)#
		&lt;/p&gt;
		&lt;p class="description"&gt;
		#description#
		&lt;/p&gt;
	&lt;/div&gt;
	
&lt;/cfoutput&gt;

&lt;div id="editForm" title="Edit Art"&gt;
	&lt;input type="hidden" id="artid"&gt;
	&lt;p&gt;
	&lt;b&gt;Name:&lt;/b&gt;&lt;br/&gt;
	&lt;input type="text" id="namefield"&gt;
	&lt;/p&gt;
	&lt;p&gt;
	&lt;b&gt;Price:&lt;/b&gt;&lt;br/&gt;
	&lt;input type="text" id="pricefield"&gt;
	&lt;/p&gt;
	&lt;p&gt;
	&lt;b&gt;Description:&lt;/b&gt;&lt;br/&gt;
	&lt;textarea id="descriptionfield"&gt;&lt;/textarea&gt;
	&lt;/p&gt;
	
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

There's a few changes here and there so let me try to address them one by one. First off - note that I've removed the initial query and replaced it with a CFC call. Going into the JavaScript, ignore that new function for now, and go on down to the artdiv click area. I added a new call to the get ID. (Once again using the data feature.) The save now runs a CFC method called saveart, sending the data from my form. The result for now is a bit simple. I assume everything worked ok and don't worry about validation. I write my values back into the initial div (note I made a variable out of it) and for the most part this is simple. Price isn't quite so easy though. I've got two places where price is used. First in a non-formatted way in the data portion and secondly in a nice formatted version. While there are many plugins out there for number formatting (and currency formatting too), I went with a simple function I found via Google. All in all though the end result is to simply copy the form values from the dialog back into the view.

<p>

And that's it. I'd put up a live example of this but I'd have to worry about spammers hitting the edit field. I did zip up all the files (including the CFC if you want to see it) and attached it to this blog entry. Enjoy!<p><a href='https://static.raymondcamden.com/enclosures/multiedit.zip'>Download attached file.</a></p>