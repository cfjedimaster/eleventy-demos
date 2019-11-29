---
layout: post
title: "Quick ColdFusion/jQuery Google Ajax Language Example"
date: "2009-10-26T08:10:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/10/26/Quick-ColdFusionjQuery-Google-Ajax-Language-Example
guid: 3577
---

A few weeks ago <a href="http://jamesedmunds.com/poorclio/">James Edmunds</a> (fellow manager of our local user group and local ColdFusion developer) demonstrated a very slick example of the <a href="http://code.google.com/apis/ajaxlanguage/">Google Ajax Language</a> API. This is a set of APIs that allow for translation services. I thought I'd take some time to play with it myself and share a simple example or two.
<!--more-->
First off, I recommend reading the <a href="http://code.google.com/apis/ajaxlanguage/documentation/">documentation</a>. It isn't 100% clear all the time (big surprise here) but it will give you a basic idea of what to do. Definitely check the <a href="http://code.google.com/apis/ajaxlanguage/documentation/#HelloWorld">Hello World</a> example at minimum. 

To use Google's language API, you begin by first loading their JavaScript loader library.

<code>
&lt;script src="http://www.google.com/jsapi" type="text/javascript"&gt;&lt;/script&gt;
</code>

This provides a hook to load multiple Google services, including their Language API. To load it, you would simply do:

<code>
google.load("language", "1");
</code>

This fires off a request to load the relevant library (that second argument simply tells Google to load the latest version one build). Due to the asynchronous nature of this request, we need to ask Google to run another method when done:

<code>
google.setOnLoadCallback(initialize);
</code>

If you are building a jQuery application you will want to ensure these lines are <b>not</b> within the typical $(document).ready block. In fact, I removed that completely from my demo. Instead, I simply used the initialize function (and that name isn't required of course) as my main block for setting up listeners and other jQuery related tasks. 

With that - let's talk about my first demo. The idea for this comes from what James had showed me - a basic product catalog that allowed you to translate product descriptions. I began by writing code to fetch records from the cfcodeexplorer sample database.

<code>
&lt;cfquery name="getArt" datasource="cfcodeexplorer"&gt;
select	*
from	books
where	bookdescription != ''
&lt;/cfquery&gt;

&lt;style&gt;
.bookentry {
	background-color: #f0f0f0;	
	width: 500;
	padding: 10px;
	margin-bottom: 10px;
}
&lt;/style&gt;

&lt;cfoutput query="getArt"&gt;
&lt;div class="bookentry"&gt;
&lt;h2&gt;#title#&lt;/h2&gt;
&lt;p&gt;
&lt;span class="description"&gt;#bookdescription#&lt;/span&gt;
&lt;/p&gt;
&lt;/div&gt;
&lt;/cfoutput&gt;
</code>

Nothing terribly fancy there. I get the records and loop over them. All the fun stuff happens in the JavaScript. That means if a user comes here with no JavaScript support, they won't see a thing extra, which is good. Now for the JavaScript:

<code>
google.load("language", "1");
google.setOnLoadCallback(initialize);

function initialize() {

	$(".bookentry").each(function() {
		var s = "&lt;div class=\"translationarea\"&gt;"
		s += "&lt;p&gt;&lt;a href=\"\" class=\"tospanish\"&gt;Spanish&lt;/a&gt; | &lt;a href=\"\" class=\"tofrench\"&gt;French&lt;/a&gt;&lt;/p&gt;"
		s += "&lt;div class=\"translation\"&gt;&lt;/div&gt;"
		s += "&lt;/div&gt;"
		$(this).append(s)
	})
</code>

The first two lines are what I described above - they load up the Language library and run a function when done. I begin by finding each of my book entry divs that were output from the query. For each of them I create a string that includes links for Spanish and French translations. In this string I also create an empty div that will be used for my mouseover. (On reflection, I should create that variable one time, outside the each function, and then use it. I'd get much better performance, but to be honest, I don't see the necd to rewrite the demo just yet.) 

The net result of this function is to add links to each of the records from the database. I want to support translations when you mouseover the links. So next I'll simply add the event listeners. 

<code>
$(".tospanish").mouseover(function() {
	var translationarea = $(this).parent().parent().find(".translation")
	var text = $(this).parent().parent().parent().find(".description").text()
	google.language.translate(text, "en", "es", function(result) {
	  if (!result.error) {
		translationarea.html(result.translation)
	  }
	})
	
})

$(".tofrench").mouseover(function() {
	var translationarea = $(this).parent().parent().find(".translation")
	var text = $(this).parent().parent().parent().find(".description").text()
	google.language.translate(text, "en", "fr", function(result) {
	  if (!result.error) {
		translationarea.html(result.translation)
	  }
	})
	
})
</code>

I've got one listener each for both the Spanish and French links. Both functions do the exact same thing, except that one will translate to Spanish and the other to French. (My next demo will make this a bit more simpler and remove the duplication.) In each function, we do a bit of traversal to find the translationarea (where our translated text will be dumped) and the product text itself. This is probably the most complex aspect to be honest. The translation then is brutally simply: google.language.translate(text, "en", "fr", callback). The callback simply checks the result and sets it to the blank div we had created before. Here is the entire template:

<code>
&lt;cfquery name="getArt" datasource="cfcodeexplorer"&gt;
select	*
from	books
where	bookdescription != ''
&lt;/cfquery&gt;


&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script src="http://www.google.com/jsapi" type="text/javascript" &gt;&lt;/script&gt;

&lt;script&gt;
google.load("language", "1");
google.setOnLoadCallback(initialize);

function initialize() {

	$(".bookentry").each(function() {
		var s = "&lt;div class=\"translationarea\"&gt;"
		s += "&lt;p&gt;&lt;a href=\"\" class=\"tospanish\"&gt;Spanish&lt;/a&gt; | &lt;a href=\"\" class=\"tofrench\"&gt;French&lt;/a&gt;&lt;/p&gt;"
		s += "&lt;div class=\"translation\"&gt;&lt;/div&gt;"
		s += "&lt;/div&gt;"
		$(this).append(s)
	})
	
	$(".tospanish").mouseover(function() {
		var translationarea = $(this).parent().parent().find(".translation")
		var text = $(this).parent().parent().parent().find(".description").text()
		google.language.translate(text, "en", "es", function(result) {
		  if (!result.error) {
			translationarea.html(result.translation)
		  }
		})
	
	})

	$(".tofrench").mouseover(function() {
		var translationarea = $(this).parent().parent().find(".translation")
		var text = $(this).parent().parent().parent().find(".description").text()
		google.language.translate(text, "en", "fr", function(result) {
		  if (!result.error) {
			translationarea.html(result.translation)
		  }
		})
	
	})

}
&lt;/script&gt;

&lt;style&gt;
.bookentry {
	background-color: #f0f0f0;	
	width: 500;
	padding: 10px;
	margin-bottom: 10px;
}
&lt;/style&gt;

&lt;cfoutput query="getArt"&gt;
&lt;div class="bookentry"&gt;
&lt;h2&gt;#title#&lt;/h2&gt;
&lt;p&gt;
&lt;span class="description"&gt;#bookdescription#&lt;/span&gt;
&lt;/p&gt;
&lt;/div&gt;
&lt;/cfoutput&gt;
</code>

You can run this demo <a href="http://www.raymondcamden.com/demos/translation/index2.cfm">here</a>. What's surprising is how darn fast this runs. Sure I'm translating a very small amount of text, but still, it works really nice! 

Now let's kick it up a notch. The first problem I want to solve is the duplication of code to handle French and Spanish translations. There are probably multiple ways to do this, but for my solution, I simply provided multiple classes to my links:

<code>
$(".bookentry").each(function() {
	var s = "&lt;div class=\"translationarea\"&gt;"
	s += "&lt;p&gt;&lt;a href=\"\" class=\"translationlink es\"&gt;Spanish&lt;/a&gt; | &lt;a href=\"\" class=\"translationlink fr\"&gt;French&lt;/a&gt;&lt;/p&gt;"
	s += "&lt;div class=\"translation\"&gt;&lt;/div&gt;"
	s += "&lt;/div&gt;"
	$(this).append(s)
})
</code>

As you can see, I've used one core style "translationlink" as well as a style name based on the language code. This means that I will need to fetch the type when working with the mouseover. Here is the modified version:

<code>
$(".translationlink").mouseover(function() {
	var toLang = $(this).attr("class").split(" ")[1]
	var translationarea = $(this).parent().parent().find(".translation")
	translationarea.html("Loading translation...")
	var text = $(this).parent().parent().parent().find(".description").text()
	google.language.translate(text, "en", toLang, function(result) {
	  if (!result.error) {
		translationarea.html(result.translation)
	  } else {
		translationarea.html("Translation failed.")
	  }
	})

})
</code>

The very first modification is to bind to just translationlink. This will then work for all my translations links. I grab the language by simply getting the class attribute and splitting it into an array. This version also adds a basic loading text value. Again, the API works so fast I'm not really sure this is necessary, but it doesn't hurt. The API call now uses the dynamic variable and really, that's it. I added support to let folks know if the translation fails as well. The CFML code is the exact same, so to see the JavaScript in it's entirety, simply view source on the demo here: <a href="http://www.coldfusionjedi.com/demos/translation/index3.cfm">http://www.coldfusionjedi.com/demos/translation/index3.cfm</a>

Notice something different about the demo? It's got Chinese support as well. That took me all of two seconds. I just added:

<code>
| &lt;a href=\"\" class=\"translationlink zh-CN\"&gt;Chinese&lt;/a&gt; 
</code>

to my script. You can find a complete list of supported languages <a href="http://code.google.com/apis/ajaxlanguage/documentation/reference.html#LangNameArray">here</a>. Unfortunately, Klingon is not supported. 

Oh - I also added one small change - I put a new div on top:

<code>
&lt;div id="branding" style="float:right"&gt;Translation service: &lt;/div&gt;
</code>

and added this to my initialize function:

<code>
google.language.getBranding('branding');
</code>

As you can guess, this handles adding branding to the page to give credit to Google. I don't mind when APIs ask for this, but I've got to say - building a function to make it brain-dead simply is a nice touch.

That's basically it. The API supports more than what I demonstrated here. For example, it can read text and make guesses to the language. This allows you to say, "I've got some text here, no idea of the language, but please try to translate it to English." The API can also tell you if the client supports the proper Unicode fonts for extended characters (like Chinese for example). Again, check the docs and the <a href="http://code.google.com/apis/ajaxlanguage/documentation/reference.html">reference</a> in particular for more information.