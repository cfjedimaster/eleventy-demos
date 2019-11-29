---
layout: post
title: "Use Google Analytics and Ajax? Remember to update your code"
date: "2009-02-15T14:02:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2009/02/15/Use-Google-Analytics-and-Ajax-Remember-to-update-your-code
guid: 3239
---

Just a quick tip to remind you that if you use Google Analytics with a heavily Ajax driven site, you may want to update your code to track your Ajax requests. Google details this here:

<a href="http://www.google.com/support/analytics/bin/answer.py?hl=en&answer=55519">How do I track AJAX applications?</a>

I updated <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a> to add this code and did a bit of cleanup. Previously I had 4 different functions that loaded content into the main div for the site. There was loadContent(), which was called when you first hit the page, previous and next, called with pagination, and the search button. All of these used jQuery's .load() function to load a URL and then ran a callback function named cbfunc. (Yes, real imaginative.) 

cbfunc took care of turning off the loading animation. I thought it would be a great place to handle logging the request with Google. Unfortunately, I didn't have access to the URL requested from within the call back function. I could have rewritten the 4 main functions to do something like so:

<code>
$("#content").load(u, function() {
$("#loadingmsg").hide();
pageTracker._trackPageview(u);
});
</code>

That would have worked - but it felt like a lot of repetition. I added a new method to handle everything called loadDiv():

<code>
function loadDiv(theurl) {
	$("#content").load(theurl,function() {
		&lt;cfif not structKeyExists(variables, "isiphone") or not variables.isiphone&gt;
		$("#loadingmsg").hide();
		&lt;/cfif&gt;
		&lt;cfif not application.dev&gt;
		pageTracker._trackPageview(theurl);
		&lt;/cfif&gt;	
	});
}
</code>

The iPhone check in there simply disables hiding the loading indicator for the iPhone version. The application.dev check simply blocks Google Analytics from running when I test locally.

Anyway, I'll let folks know what kind of impact this has on my stats. To be honest, I don't ever go beyond page 1 myself, except when I'm searching. Still though I'm curious.