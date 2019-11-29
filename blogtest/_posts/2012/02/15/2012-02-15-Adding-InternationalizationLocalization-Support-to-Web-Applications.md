---
layout: post
title: "Adding Internationalization/Localization Support to Web Applications"
date: "2012-02-15T12:02:00+06:00"
categories: [development,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/02/15/Adding-InternationalizationLocalization-Support-to-Web-Applications
guid: 4525
---

I thought I'd spend some time this week looking at how to add localization support to web applications, specifically client-side heavy web applications. The original intent for this article was to look at the subject matter in terms of PhoneGap applications, but there's no reason why this can't be applied to desktop sites as well.
<p>
The purpose of this blog entry is to <u>introduce</u> and discuss some of the basic concepts, as well as provide a few examples of the concepts in practice. It is not my intent to cover every detail. I hope, though, that this blog entry will give you an idea of what's involved and get you started along the process with your own work.
<p>
Before going any further, I wish to thank <b>Paul Hastings</b> for his advice and help. He is an expert on the subject and has offered his support in this article and many times in the past. Any mistakes I make here our my fault entirely (and knowing Paul, he will rip me a new one with corrections ;). 
<p>
<!--more-->
<h2>Some Terms</h2>
<p/>

Before we begin, it helps to define a few basic terms so we can ensure we're on the same track. When it comes to localization, there's really two main things going on:

<p>

1) Internationalization (often abbreviated as i18n) is the process by which you "prepare" your code to be localized. So for example, it isn't the actual display of something in French, but rather preparing your code so that it <i>could</i> be displayed in French, or Japanese, or any language. Internationalization will be the main focus for this blog entry. At least to me, this is the fun part.

<p>

2) Localization (often abbreviated as l10n) is the actual process by which you make your code available in a language. So if step one made it possible for my application to be usable by the French and the Japanese, this step actually gets it done. This is the not so fun aspect. It involves the creating of language files and other fun translation type services. Do not assume you can just go to Google Translate and be done. This is the part that will take far longer than you expect. 

<p>

3) And finally, just to add one more rhyming word, the combination of internationalization and localization leads to an end result of Globalization (often abbreviated as g11n). 

<p>

<h2>Identifying Internationalization Targets</h2>

<p>

So what can internationalize? For web apps, I think this falls into three main categories:

<p>

1) Static UI components: This includes things like Submit buttons and form fields. Even though I say "Static", some of these items may be displayed dynamically. For example, consider a web application that lists your friends. Next to each friend is a button that lets you delete that friend. While the button is displayed dyamically, the text is static, "Delete". This is something that could be localized into French or Japanese.

<p>

2) Numbers and Dates. Quick, what day is 2/3/2012? If you said February 3rd, 2012, congrats. You are an American and should be proud. If you said March 2nd, I pity you for not living in the greatest nation on Earth. All kidding aside, numeric dates are very prone to this type of confusion, and while it's mostly non-Americans who get screwed by this, I know it's bitten me on a few web sites as well. Numbers are not necessarily that big of a deal. Some places switch out the comma and period so that 1,209.21 would be 1.209,21. However, I think most folks would recognize either form. That being said, it's a concern. Currency also falls into this as well.

<p>

3) Dynamic content: Technically this is not part of the web app, instead, it represents the database content your web app is a front end for, or the remote API your web app may be making use of. This is not something that will be covered for this blog entry. However, as I'll be talking about how to detect the user's language, note that you can pass that value with your calls to the server.

<p>

<h2>Our Demo</h2>

<p>

So given the targets above, let's talk about a simple web application we can use to help demonstrate these concepts. Our web application is a simple product status checker. It provides a form with a few basic options, a search button, and will hit the server to return matched products as well as their date of availability, the quantity in stock, and a price. You can view the demo here:

<p>

<strike>
http://www.raymondcamden.com/demos/2012/feb/15/v1/</strike> - <em>Old ColdFusion demo removed - sorry!</em>

<p>

To begin, simply type "e" and notice how the products are displayed. Feel free to try other search terms of course. The web application is pretty simple and most of the content is dynamic. That makes it an ideal candidate for our purposes. Let's get started!

<p>

<h2>Localizing Static Strings</h2>

<p>

The first thing we want to look at is how we could localize some of the static content. Consider the basic layout of the site:

<p>

<img src="https://static.raymondcamden.com/images/shot11.png" class="imgborder" />

<p>

In this screen capture, the "Product Search" is a title and would - most likely - not be something we'd care to translate. But the search and introductory text are good candidates for localization. To begin, I'm going to add a simple drop down to my top header to support selecting a language. For the purposes of this demo I'll support English, French, and Japanese.

<p>

<img src="https://static.raymondcamden.com/images/shot2.png" class="imgborder"/>

<p>

So how do I handle the actual changing of the strings into localized versions? For that I'm going to use a jQuery plugin: <a href="http://code.google.com/p/jquery-i18n-properties/">jquery-i18-properties</a>. This plugin allows the use of "Resource Bundles", a Java-standard way of created localization resources. These bundles are simply text files based on a key and a translation. So for example, I may define a key as "Search", I can then create an English version like so:
<p>

search = Search

<p>

and a French version like so

<p>

search = Rechercher

<p>

A good engine then can handle reading and parsing these files for you. Your code can then simply say, "Hey, for my current language, give me the 'search' key." That's exactly what this plugin does. Even better, you can perform translation at a later stage. If you don't have time to completely translate values for French speakers, the code will automatically fall back to English. As a coder, it means I can globalize the code and translators later can handle the localization. 

<p>

Here is an example: 

<p>

<pre><code class="language-javascript">
$.i18n.properties({
	name:'terms',
	path:'bundles/',
	mode:'map',
	callback:function() {
		$("#intromsg").text($.i18n.prop("intromsg"));
		$("#searchText").attr("placeholder", $.i18n.prop("search"));
	}
});
</code></pre>

<p>

This code calls the plugin and uses the browser's settings to determine the current language. When done, a callback is fired and I can then update my values. My demo is going to let user's select a language and will default to English. I began by abstracting out my localization call into a function:

<p>

<pre><code class="language-javascript">
function loadAndDisplayLanguages(lang) {

	$.i18n.properties({
		name:'terms',
		path:'bundles/',
		mode:'map',
		language:lang,
		callback:function() {
			$("#intromsg").text($.i18n.prop("intromsg"));
			$("#searchText").attr("placeholder", $.i18n.prop("search"));
		}
	});

}
</code></pre>

<p>

And within my jQuery document.ready block, I fired off the request defaulting to "en":

<p>

<pre><code class="language-javascript">
loadAndDisplayLanguages('en');
</code></pre>

<p>

Finally, I added a simple click handler for my drop down menu:

<p>

<pre><code class="language-javascript">
$(".langpick").on("click",function(e) {
	loadAndDisplayLanguages($(this).data("lang"));
});
</code></pre>

<p>

What's the data call there? I used a data attribute to store the language code for my 3 supported languages:

<p>

<pre><code class="language-javascript">
&lt;li&gt;&lt;a href="#" class="langpick" data-lang="en"&gt;English&lt;/a&gt;&lt;/li&gt;
&lt;li&gt;&lt;a href="#" class="langpick" data-lang="fr"&gt;French&lt;/a&gt;&lt;/li&gt;
&lt;li&gt;&lt;a href="#" class="langpick" data-lang="ja"&gt;Japanese&lt;/a&gt;&lt;/li&gt;
</code></pre>

<p>

Ok, with me so far? We aren't quite done yet. These modification work to update the search button placeholder text and intro text. But what about our product searches? Every product result has 4 values: the name, the available date, and the quantity:

<p>

<img src="https://static.raymondcamden.com/images/shot31.png" />

<p>

In order to update these values, we need to ensure we have them in our properties, and we need to ensure jQuery can find them so we can replace them. My English properties file now looks like this:

<p>

<pre><code class="language-javascript">
intromsg = To display products, use the search form above.
search = Search
price = Price
available = Available
quantity = Quantity
</code></pre>

<p>

I then edited my result handler to wrap the values in spans:

<p>

<pre><code class="language-javascript">
$.post("service.cfc?method=searchproducts", {% raw %}{search:s}{% endraw %}, function(res,code) {
                var dsp = "";
                for(var i=0; i&lt;res.length; i++) {
                    dsp += "&lt;div class='productResult'&gt;&lt;h3&gt;"+res[i].name+"&lt;/h3&gt;";
                    dsp += "&lt;p&gt;&lt;span class='pricelabel'&gt;"+PRICE_STR+"&lt;/span&gt;: "+res[i].price+"&lt;br/&gt;";
					dsp += "&lt;span class='availlabel'&gt;"+AVAILABLE_STR+"&lt;/span&gt;: "+res[i].available+"&lt;br/&gt;";
					dsp += "&lt;span class='quantlabel'&gt;"+QUANTITY_STR+"&lt;/span&gt;: "+res[i].quantity+"&lt;br/&gt;";
                    dsp += "&lt;/p&gt;&lt;/div&gt;";
                }
                $("#results").html(dsp);
            },"json");
</code></pre>

<p>

Note the use of 3 variables, PRICE_STR, AVAILABLE_STR, QUANTITY_STR. My JavaScript code now creates 3 global variables for this, and my loadAndDisplayLanguages function can update them:

<p>

<pre><code class="language-javascript">
//store strings for price, available, and quantity
var PRICE_STR = "";
var AVAILABLE_STR = "";
var QUANTITY_STR = "";

function loadAndDisplayLanguages(lang) {

	$.i18n.properties({
		name:'terms',
		path:'bundles/',
		mode:'map',
		language:lang,
		callback:function() {
			$("#intromsg").text($.i18n.prop("intromsg"));
			$("#searchText").attr("placeholder", $.i18n.prop("search"));
			PRICE_STR = $.i18n.prop("price");
			AVAILABLE_STR = $.i18n.prop("available");
			QUANTITY_STR = $.i18n.prop("quantity");
			$(".pricelabel").text(PRICE_STR);
			$(".availlabel").text(AVAILABLE_STR);
			$(".quantlabel").text(QUANTITY_STR);
		}
	});

}
</code></pre>

<p>

Woot! To test this version out, hit this url: 

<p>

<strike>http://www.raymondcamden.com/demos/2012/feb/15/v2</strike> <em>Another old demo removed</em>

<p>

Try switching your language to French or Japanese. Note that there is nothing there for Japanese. That's ok. Eventually (well, if this were real) we could create that properties file and everything would just work. 

<p>

So most our our 'labels' and simple text is updated, but we've got more work we can do. Note that the numeric and date values are not localized. That's our next target.

<p>

<h2>Globalizing Numbers and Dates</h2>

<p>

To work with the numbers and dates, I'm going to use another jQuery Plugin - globalize (https://github.com/jquery/globalize). As you can guess by the name, it handles globalizing/localizing numbers and dates. (It also has similar support to the i18n plugin.) In general, this plugin worked great, but I did run into one issue. In order to support various locales, you have to add additional script tags. So for example, I have to include a script tag for French and Japanese. Unlike the i18n plugin which simply tries to include things dynamically, the globalize plugin requires you to explicitly add support. (And yes, I know I could load those script files dynamically too.) One big thing to watch out for here - when I initially added French support, I did it like so:

<p>

<pre><code class="language-javascript">
&lt;script type="text/javascript" src="js/cultures/globalize.culture.fr.js"&gt;&lt;/script&gt;
</code></pre>

<p>

But my results were garbage. Turns out, I forgot about the chartset attribute. Adding this cleared this up immediately:

<p>

<pre><code class="language-javascript">
&lt;script type="text/javascript" src="js/cultures/globalize.culture.fr.js" charset="utf-8"&gt;&lt;/script&gt;
</code></pre>

<p>

One more small note - the globalize plugin is - in some ways - much more advanced then the i81n plugin. It recognizes a concept of "culture" which is more specific then a simple language code. You can still use language codes, but advanced users will want to read the docs carefully and see if they want to make use of this feature.

<p>

So, how about an example? Given our quantity values are numbers, we can use the plugin like so:

<p>

<pre><code class="language-javascript">
Globalize.format(res[i].quantity,"n0")
</code></pre>

<p>

Dates are a bit more trickier. You want to parse your original value first, then format it:

<p>

<pre><code class="language-javascript">
var dateStr = Globalize.parseDate(res[i].available,"MMMM, dd yyyy hh:mm:ss","en");
... Globalize.format(dateStr,"d") ...
</code></pre>

<p>

Notice I explicitly set the language to English. Since my data is coming in with an English format, this is ok. The format function will use the currently selected language. I haven't covered that yet, but you can set a language (or culture) like so:

<p>

<pre><code class="language-javascript">
Globalize.culture("en");
</code></pre>

<p>
Ok... so in general, easy enough to use, right? However, we have two things to consider here. First, we need to use these formatting functions when displaying our search results. Second, we need to ensure we can update them dynamically. But - we are taking original values and converting them into a language specific value. I assumed (and note, I could be wrong!) that once localized, the plugin may have an issue converting it back into something else. So I decided to once again make use of data values. This time I'm going to store my original values so I can fetch em later:

<p>

<pre><code class="language-javascript">
$.post("service.cfc?method=searchproducts", {% raw %}{search:s}{% endraw %}, function(res,code) {
	var dsp = "";
	for(var i=0; i&lt;res.length; i++) {
		dsp += "&lt;div class='productResult'&gt;&lt;h3&gt;"+res[i].name+"&lt;/h3&gt;";
		dsp += "&lt;p&gt;&lt;span class='pricelabel'&gt;"+PRICE_STR+"&lt;/span&gt;: &lt;span class='priceval' data-price='"+res[i].price+"'&gt;"+Globalize.format(res[i].price,"c")+"&lt;/span&gt;&lt;br/&gt;";
		var dateStr = Globalize.parseDate(res[i].available,"MMMM, dd yyyy hh:mm:ss","en");
		dsp += "&lt;span class='availlabel'&gt;"+AVAILABLE_STR+"&lt;/span&gt;: &lt;span class='dateval' data-date='"+res[i].available+"'&gt;"+Globalize.format(dateStr,"d")+"&lt;/span&gt;&lt;br/&gt;";
		dsp += "&lt;span class='quantlabel'&gt;"+QUANTITY_STR+"&lt;/span&gt;: &lt;span class='quantval' data-quant='"+res[i].quantity+"'&gt;"+Globalize.format(res[i].quantity,"n0")+"&lt;/span&gt;&lt;br/&gt;";
		dsp += "&lt;/p&gt;&lt;/div&gt;";
	}
</code></pre>

<p>

That handles the display, now let's go back to loadAndDisplayLanguages. I've updated it to handle the new globalization calls. Note that - oddly - I had to be explicit with my language when formatting.

<p>

<pre><code class="language-javascript">
function loadAndDisplayLanguages(lang) {

	$.i18n.properties({
		name:'terms',
		path:'bundles/',
		mode:'map',
		language:lang,
		callback:function() {
			$("#intromsg").text($.i18n.prop("intromsg"));
			$("#searchText").attr("placeholder", $.i18n.prop("search"));
			PRICE_STR = $.i18n.prop("price");
			AVAILABLE_STR = $.i18n.prop("available");
			QUANTITY_STR = $.i18n.prop("quantity");
			$(".pricelabel").text(PRICE_STR);
			$(".availlabel").text(AVAILABLE_STR);
			$(".quantlabel").text(QUANTITY_STR);

			$(".priceval").each(function(i,el) {
				var thisPrice = $(this).data("price");
				var newPrice = Globalize.format(thisPrice, "c",lang);
				$(this).text(newPrice);
			});

			$(".dateval").each(function(i,el) {
				var thisDate = $(this).data("date");
				var dateP = Globalize.parseDate(thisDate,"MMMM, dd yyyy hh:mm:ss","en");
				var newDate = Globalize.format(dateP, "d",lang);
				$(this).text(newDate);
			});

			$(".quantval").each(function(i,el) {
				var thisQuant = $(this).data("quant");
				var newQuant = Globalize.format(thisQuant, "n0",lang);
				$(this).text(newQuant);
			});

		}
	});

}
</code></pre>

<p>

<strike>
You can demo this here...
</strike> <em>Another old demo removed...</em>

<p>

And that's that. Obviously there is a lot more to consider here. I cannot stress enough how much more additional work will be necessary for proper localization. I'd love to hear people chime in with corrections, real life examples, or other comments.

<p>

p.s. I didn't bother attaching the server side code as it's a simple ColdFusion service using fake data. If anyone wants it just ask.