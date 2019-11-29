---
layout: post
title: "Quick example - jQuery code to add confirmations to links"
date: "2009-10-19T23:10:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/10/19/Quick-example-jQuery-code-to-add-confirmations-to-links
guid: 3569
---

I'm not a big fan of confirmations. I mean, if I wasn't sure I wanted to do some action than I wouldn't have clicked the link, right? But sometimes clients ask us to add such confirmations to potentially dangerous operations, like deletes for example. Here is a super simple example of how to quickly add a confirmation to a range of actions on a page - delete or whatever.
<!--more-->
To begin - lets add a class to links that we want confirmations on. For fun we will call them dangerous links. 

<code>
&lt;p&gt;
&lt;a href="http://www.cnn.com"&gt;CNN&lt;/a&gt;&lt;br/&gt;
&lt;a href="http://www.aetna.com" class="dangerous"&gt;Aetnacrap&lt;/a&gt;&lt;br/&gt;
&lt;a href="http://www.foxnews.com" class="dangerous"&gt;Fox News&lt;/a&gt;&lt;br/&gt;
&lt;a href="http://www.yahoo.com"&gt;Yahoo&lt;/a&gt;
&lt;/p&gt;
</code>

Noticed that for the four links, I've only marked two of them as dangerous. (And yes, I'm being political and angry so please forgive me. If the text bothers you, ignore it.)

Now for the code:

<code>
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {

	$("a.dangerous").click(function() {
		return confirm("Are you sure you want to do this?")
	})
	
})
&lt;/script&gt;
</code>

As you can see, I simply create a selector to match all anchor tags with a class of dangerous. I bind to the click function and return true or false based on how you answer the confirmation dialog. Notice I kept the message vague. I didn't mention "delete" or any other particular action. I just gave a simple warning.

That's it. Hope this is helpful for others.