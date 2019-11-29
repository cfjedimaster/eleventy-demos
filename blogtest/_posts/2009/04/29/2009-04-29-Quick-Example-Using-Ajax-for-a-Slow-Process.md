---
layout: post
title: "Quick Example - Using Ajax for a Slow Process"
date: "2009-04-29T14:04:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/04/29/Quick-Example-Using-Ajax-for-a-Slow-Process
guid: 3334
---

A reader sent me a question earlier today about handling a slow process. He had a page where a particular CFC call was taking 2-3 seconds to run. He needed the output of the CFC to be in the middle of the page. He used cfflush above the call to at least present something to the user, but this wasn't optimal. They saw half a page load, then a delay, and finally the rest of the page. I suggested simply switching to an Ajax based solution and offered to create a quick demo so he could see it in action. As I'm an expert at writing slow code, I thought this would be a fun way to spend lunch. Let's start with the non-Ajax version first.
<!--more-->
<code>
&lt;h2&gt;This is a test page&lt;/h2&gt;

&lt;p&gt;
This is some content that is above the slow part. I'm going to use cfflush to expose the content earlier.
You should see it while CF then works on the slow part.
&lt;/p&gt;
	
&lt;cfflush&gt;

&lt;cfset ob = createObject("component","foo")&gt;
&lt;cfoutput&gt;
&lt;p&gt;
#ob.doSomethingSlow()#
&lt;/p&gt;
&lt;/cfoutput&gt;

&lt;p&gt;
This is the end of the file. Nothing dynamic, nothing really interesting.
&lt;/p&gt;
</code>

As you can see, the page contains a header and footer that is simple HTML. In the middle is a cfflush and then a call to my component. Let's take a look at the component.

<code>
&lt;cfcomponent output="false"&gt;

&lt;cffunction name="doSomethingSlow" output="false" returnType="any"&gt;
	&lt;cfset sleep(5000)&gt;
	&lt;cfreturn "I'm down with the slow process. The result was foo."&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

Yeah, I won't bother going over that. As you can see, it just uses the sleep function to pause for 5 seconds. (I was going to link to this demo. It works fine locally. Oddly it did not on production. I wonder if IIS7 is doing something to block the flush action? Actually it may be working - my connection seems slow enough today where the 5 seconds may be too short.) If you run this code you should see the first half of the page, a delay, and then the rest of the page.

Ok, so how can we switch this to an Ajax-based solution? You guys know I'm somewhat of a jQuery Fanboy now, but the simplest solution is to just use what's built in to ColdFusion 8. Consider:

<code>
&lt;h2&gt;This is a test page&lt;/h2&gt;

&lt;p&gt;
This is some content that is above the slow part. I'm going to use cfflush to expose the content earlier.
You should see it while CF then works on the slow part.
&lt;/p&gt;

&lt;cfdiv bind="url:slow.cfm"  /&gt;

&lt;p&gt;
This is the end of the file. Nothing dynamic, nothing really interesting.
&lt;/p&gt;
</code>

I've gotten rid of the flush, and just moved the createObject/function call to slow.cfm. You can see this in action <a href="http://www.raymondcamden.com/demos/slowexample/test2.cfm">here</a>.

Pretty simple? I couldn't <i>not</i> write a jQuery example, so here it is, one more time, with jQuery:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	
	$('#slowdiv').html('Loading...')
	$('#slowdiv').load('slow.cfm')	
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h2&gt;This is a test page&lt;/h2&gt;

&lt;p&gt;
This is some content that is above the slow part. I'm going to use cfflush to expose the content earlier.
You should see it while CF then works on the slow part.
&lt;/p&gt;

&lt;div id="slowdiv"&gt;&lt;/div&gt;

&lt;p&gt;
This is the end of the file. Nothing dynamic, nothing really interesting.
&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

Just a slight bit more complex. 4 or so lines more. Not bad though. Also, you have more control over the loading message. You can see this in action <a href="http://www.coldfusionjedi.com/demos/slowexample/test3.cfm">here</a>.

Hope this helps!