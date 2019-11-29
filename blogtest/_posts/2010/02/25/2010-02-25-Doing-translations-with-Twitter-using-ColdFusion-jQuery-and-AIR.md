---
layout: post
title: "Doing translations with Twitter (using ColdFusion, jQuery, and AIR)"
date: "2010-02-25T21:02:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2010/02/25/Doing-translations-with-Twitter-using-ColdFusion-jQuery-and-AIR
guid: 3734
---

Earlier today I saw Adobe blogger <a href="http://blogs.adobe.com/jd/">John Dowdell</a> retweet a request from a user looking for a way to do translations of tweets. Now - I know that some of my readers are <b>strongly</b> against machine translation. I get why. But - when I saw this the first thing I thought of was Google's excellent API for doing translations. I've <a href="http://www.raymondcamden.com/index.cfm/2009/10/26/Quick-ColdFusionjQuery-Google-Ajax-Language-Example">blogged</a> about this before. It is fairly simple to take some text, tell Google to translate it, and then work with the result. 
<p/>
<!--more-->
I began my exploration by simply setting up a quick search using the Twitter API. I searched for "vous OR camden", thinking "vous" would find French results and robot would find English results. Here is my initial CFML:
<p/>
<code>
&lt;cfset search = "vous OR robot"&gt;
&lt;cfset results = []&gt;

&lt;cfhttp url="http://search.twitter.com/search.json?&rpp=20&q=#search#" result="result"&gt;

&lt;cfif result.responseheader.status_code is "200"&gt;
	&lt;cfset content = result.fileContent.toString()&gt;
	&lt;cfset data = deserializeJSON(content)&gt;

	&lt;cfloop index="item" array="#data.results#"&gt;
		&lt;cfset arrayAppend(results, item)&gt;
	&lt;/cfloop&gt;
&lt;cfelse&gt;
	&lt;cfdump var="#result#"&gt;
&lt;/cfif&gt;
	
&lt;cfloop index="r" array="#results#"&gt;
    &lt;cfdump var="#r#"&gt;
&lt;/cfloop&gt;
</code>
<p/>
I won't go into details about the Twitter API here (you can find more at the <a href="http://apiwiki.twitter.com/">docs</a>) but you can see that I'm hitting the API with my query and working with a JSON response. I noticed something right away in each Tweet - something I had not noticed before. There is a key called iso_language_code which describes the language of the Tweet itself. I'm guessing Twitter isn't actually parsing the text but is rather simply trusting the client itself. Either way - if it is right most of the time, it's good enough for me. 
<p/>
I began my modifications by adding code to do some basic output and detect non-English results:
<p/>
<code>
&lt;cfloop index="r" array="#results#"&gt;
	&lt;cfoutput&gt;
	&lt;p class="twitter_result"&gt;
	From: #r.from_user#&lt;br/&gt;
	Created: #r.created_at#&lt;br/&gt;
	&lt;span class="text"&gt;#r.text#&lt;/span&gt;
	&lt;cfif r.iso_language_code neq "en"&gt;
		&lt;br/&gt;
		&lt;span class="texttranslation lang_#r.iso_language_code#"&gt;&lt;/span&gt;
	&lt;/cfif&gt;
	&lt;/p&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>
<p/>
Notice that I'm adding a span after the output when the result isn't English. I use 2 classes within that span. One is used to "mark" it for later (texttranslation) and another is used to record the language. Now I set up some jQuery:
<p/>
<code>
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt; 
&lt;script src="http://www.google.com/jsapi" type="text/javascript" &gt;&lt;/script&gt; 

&lt;script&gt;
google.load("language", "1");
google.setOnLoadCallback(initialize);
 
function initialize() {
 	
	$(".texttranslation").each(function() {
		var translationarea = $(this)

		var classes = translationarea.attr("class")
		//classes is a list of classes applied, we just want the last one
		var langportion = classes.split(" ")[1]
		//now get the final code
		var langcode = langportion.split("_")[1]

		//now get my sibling text
		var textSpan = $(this).siblings(".text")
		var theText = $(textSpan).text()
		google.language.translate(theText, langcode, "en", function(result) {
			if (!result.error) {
				translationarea.hide().html("Translation via Google: " + result.translation).fadeIn("slow");
			}
		})
	})
 
}
&lt;/script&gt;
</code>
<p/>
I begin with my imports necessary for translation.  I then ask jQuery to find all my texttranslation spans. For each one I examine the class attribute and use it as a simple text string. I can grab the language code from the second class which is always in the form of: lang_XX. Once I have the language, it is a simple matter then to fire off the translation request. I take the result, nicely attribute it to Google, and then place it under the Tweet. I added a fade in so I could look all sexy and web 2.0ish.
<p/>
You can see a demo of this here: <a href="http://www.coldfusionjedi.com/demos/feb2520102/test.cfm">http://www.coldfusionjedi.com/demos/feb2520102/test.cfm</a> Since I made the search string hard coded, you may or may not see a result with translations. I just confirmed it shows some now, but your results may vary. Here is the entire template - take a look at that before we move on to the <i>real</i> cool stuff:
<p/>
<code>
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt; 
&lt;script src="http://www.google.com/jsapi" type="text/javascript" &gt;&lt;/script&gt; 

&lt;script&gt;
google.load("language", "1");
google.setOnLoadCallback(initialize);
 
function initialize() {
 	
	$(".texttranslation").each(function() {
		var translationarea = $(this)

		var classes = translationarea.attr("class")
		//classes is a list of classes applied, we just want the last one
		var langportion = classes.split(" ")[1]
		//now get the final code
		var langcode = langportion.split("_")[1]

		//now get my sibling text
		var textSpan = $(this).siblings(".text")
		var theText = $(textSpan).text()
		google.language.translate(theText, langcode, "en", function(result) {
			if (!result.error) {
				translationarea.hide().html("Translation via Google: " + result.translation).fadeIn("slow");
			}
		})
	})
 
}
&lt;/script&gt;
&lt;style&gt;
.texttranslation { 
	font-style: italic;
}
&lt;/style&gt;

&lt;cfset search = "vous OR robot"&gt;
&lt;cfset results = []&gt;

&lt;cfhttp url="http://search.twitter.com/search.json?&rpp=20&q=#search#" result="result"&gt;

&lt;cfif result.responseheader.status_code is "200"&gt;
	&lt;cfset content = result.fileContent.toString()&gt;
	&lt;cfset data = deserializeJSON(content)&gt;

	&lt;cfloop index="item" array="#data.results#"&gt;
		&lt;cfset arrayAppend(results, item)&gt;
	&lt;/cfloop&gt;
&lt;cfelse&gt;
	&lt;cfdump var="#result#"&gt;
&lt;/cfif&gt;
	
&lt;cfloop index="r" array="#results#"&gt;
	&lt;cfoutput&gt;
	&lt;p class="twitter_result"&gt;
	From: #r.from_user#&lt;br/&gt;
	Created: #r.created_at#&lt;br/&gt;
	&lt;span class="text"&gt;#r.text#&lt;/span&gt;
	&lt;cfif r.iso_language_code neq "en"&gt;
		&lt;br/&gt;
		&lt;span class="texttranslation lang_#r.iso_language_code#"&gt;&lt;/span&gt;
	&lt;/cfif&gt;
	&lt;/p&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>
<p/>
Ok, so that worked well, but I thought, I bet I could do this even cooler. I remembered that I had done a jQuery-based AIR application that performed simple searches. You can read about this here: <a href="http://www.insideria.com/2009/09/using-aptana-studio-to-build-j-2.html">Using Aptana Studio to build jQuery/AIR Applications (3)</a> The blog entry describes how to use Aptana to build HTML based AIR applications. My final example was a simple search form that hits the Twitter search API. How hard would it be to modify it to do translations?
<p/>
<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" height="608" width="800"><param name="movie" value="http://www.coldfusionjedi.com/demos/feb2520102/jquerytrans2.swf" /><param name="quality" value="high" /><param name="bgcolor" value="#FFFFFF" /><param name="flashVars" value="width=800&height=608" /><param name="allowFullScreen" value="true" /><param name="scale" value="showall" /><param name="allowScriptAccess" value="always" /><embed allowFullScreen="true" allowScriptAccess="always" bgcolor="#FFFFFF" flashVars="width=800&height=608" height="608" quality="high" scale="showall" src="http://www.coldfusionjedi.com/demos/feb2520102/jquerytrans2.swf" type="application/x-shockwave-flash" width="800" /></object>
Not hard at all. The only real issue I ran into was the HTML/AIR security stuff. <b>That always bugs me.</b> Sim Bateman helped me a bit - but then I discovered something cool. Apparently Google supports <a href="http://code.google.com/apis/ajaxlanguage/documentation/#fonje">REST</a> based calls for translations. (One day I need to read <i>all</i> the Google API docs.) This worked perfectly within my little AIR application. You can download the AIR file below.
<p/>
As a final FYI, did you know that ColdFusion Builder includes parts of Aptana? Did you know it includes all the bits you need to build your own HTML based AIR applications? Check it out today!<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FjqTwitterAir%{% endraw %}2Ezip'>Download attached file.</a></p>