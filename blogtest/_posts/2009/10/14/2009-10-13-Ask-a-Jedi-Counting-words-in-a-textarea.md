---
layout: post
title: "Ask a Jedi: Counting words in a textarea"
date: "2009-10-14T09:10:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/10/14/Ask-a-Jedi-Counting-words-in-a-textarea
guid: 3563
---

Pema asks:

<blockquote>
Is there an easy way to count the number of words in a textarea using ColdFusion?
</blockquote>

The quick and not very helpful answer to this is no. ColdFusion is a server side language. It can't introspect anything in a form field until you actually submit the value. But can we do it both client side and server side? Sure! Here is a simple example.
<!--more-->
I began with a very simple form. 

<code>
&lt;form method="post"&gt;
&lt;textarea name="body" id="body"&gt;&lt;/textarea&gt; &lt;input type="submit"&gt;&lt;br/&gt;
&lt;span id="count"&gt;&lt;/span&gt;
&lt;/form&gt;
</code>

Notice I've added a span under my textarea. This span will be used to print out the number of words in the textarea. Now to hook up the JavaScript:

<code>
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {

    var status = $("#count")
	
    $("#body").keyup(function() {
        var cVal = $(this).val()
	cVal = $.trim(cVal)
	if(cVal.length == 0) return
	cVal = cVal.replace(/['\.\?"]/,"")
	var words = cVal.split(/\W/)
	status.text("You've written "+words.length+" word(s).")
    })
})

&lt;/script&gt;
</code>

I begin by including the CDN version of jQuery. The main thing I want to do is monitor the textarea, but I know that I'll be using that count span quite a bit so I create a variable for it immediately. This means jQuery doesn't need to find the span every time I want to update it.  

I've found to the keyup event for the textarea. Within it - I get the value of the text field and trim it. My code to handle the count is based on a blog entry I wrote two years ago: <a href="http://www.raymondcamden.com/index.cfm/2007/8/2/Counting-Word-Instances-in-a-String">Counting Word Instances in a String</a>. That entry detailed how you would get a count of unique words in a string. My needs are much simpler. I can break the string on word boundaries, using a regular expression, and then simply count it. The replace is there to handle some of the special cases mentioned in the comments. 

Of course - by itself that isn't enough. If you really wanted to limit the word count you would need to add code to bind to the form submit. I'd use caution though as this word count isn't perfect. Web developers typically treat form validation in a very binary fashion - either the data is right or wrong. But this is probably a good example of where we would want to let a field pass even if it has too many words. You can always flag it in an email for further investigation. 

Anyway - let's wrap this up now by adding the ColdFusion side:

<code>
&lt;cfif structKeyExists(form, "body")&gt;
    &lt;cfset wordstr = trim(form.body)&gt;
    &lt;cfset wordstr = replaceList(wordstr, "'.""?","")&gt;
    &lt;cfset words = reMatch("[[:word:]]+", wordstr)&gt;
    &lt;cfoutput&gt;
    &lt;p&gt;
    You submitted #arraylen(words)# word(s).
    &lt;/p&gt;
    &lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

This is pretty much the exact same code as the JavaScript version. Obviously all of this could be done <i>many</i> different ways. Altogether now - my complete template:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {

    var status = $("#count")
	
    $("#body").keyup(function() {
        var cVal = $(this).val()
		cVal = $.trim(cVal)
		if(cVal.length == 0) return
		cVal = cVal.replace(/['\.\?"]/,"")
		var words = cVal.split(/\W/)
		status.text("You've written "+words.length+" word(s).")
    })
})

&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form method="post"&gt;
&lt;textarea name="body" id="body"&gt;&lt;/textarea&gt; &lt;input type="submit"&gt;&lt;br/&gt;
&lt;span id="count"&gt;&lt;/span&gt;
&lt;/form&gt;

&lt;cfif structKeyExists(form, "body")&gt;
    &lt;cfset wordstr = trim(form.body)&gt;
    &lt;cfset wordstr = replaceList(wordstr, "'.""?","")&gt;
	&lt;cfset words = reMatch("[[:word:]]+", wordstr)&gt;
    &lt;cfoutput&gt;
	&lt;p&gt;
	You submitted #arraylen(words)# word(s).
	&lt;/p&gt;
	&lt;/cfoutput&gt;
&lt;/cfif&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>