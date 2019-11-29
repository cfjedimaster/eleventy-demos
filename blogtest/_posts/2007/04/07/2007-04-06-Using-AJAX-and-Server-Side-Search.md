---
layout: post
title: "Using AJAX and Server Side Search"
date: "2007-04-07T08:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/07/Using-AJAX-and-Server-Side-Search
guid: 1947
---

I've blogged before (or at least think I have) about how to do client side filtering/searching of data with Spry. An example of this is the <a href="http://www.riaforge.org/index.cfm?event=page.search">search</a> at RIAForge. The concept is simple. Load your dataset. Then simply filter against this dataset. RIAForge lets you filter both on the keyword you enter and the category. While this does require some JavaScript work, it is still pretty darn simply in Spry. (I encourage you to view source on the page.) However, there are a few drawbacks to this approach.

<more />

The first problem is that you have to load the entire dataset. This works ok for small sets of data, but once you get to a large dataset, it isn't practical to load everything into the client. RIAForge's search is actually getting a bit close to that now.

The second problem is that your limited to searching with JavaScript functions. While JavaScript lets you do basic comparison, substring, and regex checks, you can't do some of the more fancier searches you could do on the server side. A great example of this is Verity. Verity has some kick butt/super ninja style cool search styles. None of which are available to you in JavaScript, and all of which could be very useful to your users. 

So can we use AJAX and search side search together? Sure! Consider this demo:

<a href="http://ray.camdenfamily.com/demos/sprysearch/">http://ray.camdenfamily.com/demos/sprysearch/</a>

This demo uses AJAX to call the back end and pass in the search terms to ColdFusion. Now in this simple demo I am just going a simple SQL statement. It could very easily have been handled by JavaScript. But I'm searching against nearly 2000 records. I certainly would not have wanted to load that into the client. 

While you can view source and see everything, let me point out a few interestings aspects. First off - this is the code  fired when you hit the search button:

<code>
function search() {
	var searchvalue = $("searchterms").value;
	if(searchvalue == '') return;
	dsResults.url = "search.cfm?term="+escape(searchvalue);
	dsResults.loadData();
}
</code>

I grab the search value from the form field, and if it isn't blank, I update the URL of the dataset and tell Spry to load it. Pretty simple, right?

The only other fancy thing I do isn't even really related to this blog entry, but I'll point it out anyway. I wanted to always show something when you searched, even if your search turned up nothing. (Try searching 'purple monkey blueberry muffins'.) I wrote a simple observer that runs when the data is done loading from the back end. 

<code>
var myObserver = new Object;
myObserver.onPostLoad = function(dataSet, data) {
	var results = $("resultText");
	var total = dataSet.getRowCount();
	results.innerHTML = "Your search returned "+total+" result(s).";
};
dsResults.addObserver(myObserver);
</code>

Pretty simple I think. I basically cut and paste the code from the documentation for observers. Basically I'm telling Spry to run this function when my dataset gets loaded. I call the getRowCount() function and then use that to display the total count of the results.

As a follow up to this article - I think I may actually switch to using Verity and see if I can find a nice way to return the suggestions data!