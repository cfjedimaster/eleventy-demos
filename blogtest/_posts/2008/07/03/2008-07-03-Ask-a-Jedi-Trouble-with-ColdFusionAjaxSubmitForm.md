---
layout: post
title: "Ask a Jedi: Trouble with ColdFusion.Ajax.SubmitForm"
date: "2008-07-03T13:07:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2008/07/03/Ask-a-Jedi-Trouble-with-ColdFusionAjaxSubmitForm
guid: 2913
---

Andy asks:

<blockquote>
<p>
This is probably a stupid question but I can't seem to get this to work. I'm using a ColdFusion.Ajax.submitForm and I thought that I would be able to return something from the form's submit handler page using my callback function.  I
can't seem to get this to work.  I tried to <cfoutput> a variable on the submit handler page to give it back to the caller page where the form lives but I just get a giant javascript dialog when I try to test this out using an alert in the callback function to display my callbackMsg.  Should I be taking a different approach?  I really need to get the primary key of the newly inserted record back and can't seem to return it to the calling page.
</p>
</blockquote>

Now now, Andy, as we all know, there are no stupid questions, just stupid <a href="http://www.php.net">programming languages</a>. That being said, I have a good idea of what you are running into.
<!--more-->
Let's start with a super simple example. I'll build a form with two text fields. These fields will represents two numbers. A third field will be used for the answer. Finally I'll add a button:

<code>
&lt;form id="myform"&gt;
&lt;input type="text" name="number1"&gt; + 
&lt;input type="text" name="number2"&gt; = 
&lt;input type="text" id="result"&gt;
&lt;input type="button" value="Solve" onclick="solve()"&gt;
&lt;/form&gt;
</code>

Notice that the onclick runs solve. Let's look at that:

<code>
function solve() {
	console.log('running...');
	ColdFusion.Ajax.submitForm('myform','test.cfm',resultHandler);
	console.log('done...');
}
</code>

First and foremost - look at my use of console.log. You need to stop using Alert. I know it's easy. But Alert can be a real pain in the you know what. Download Firebug and get used to doing your debugging there. Ok, so in between two debug statements I'm running a submitForm action. I've said to submit myform to test.cfm and then run resultHandler. 

I made test.cfm simply cfoutput a random number for testing purposes. 

The first thing I ran into was that ColdFusion.Ajax.submitForm didn't exist. Remember that ColdFusion only loads the Ajax functionality it thinks it needed. Since I didn't really use any ColdFusion tags, it didn't load squat. The trick to handle this was discovered by Todd Sharp, just add this to the top of your page:

<code>
&lt;cfajaximport /&gt;
</code>

Ok, so now I can run my application and see the request, how do we handle it, and why is he getting a large alert? First look at a more full test.cfm:

<code>
&lt;cfparam name="form.number1" default="0"&gt;
&lt;cfparam name="form.number2" default="0"&gt;

&lt;cfset form.number1 = val(form.number1)&gt;
&lt;cfset form.number2 = val(form.number2)&gt;

&lt;cfoutput&gt;#form.number1+form.number2#&lt;/cfoutput&gt;
</code>

(And by the way, I should be more anal with my URL checks in this code.) Now let's look at resultHandler:

<code>
function resultHandler(result) {
	console.log('result handler ran...');
	console.log(result);
}
</code>

When I ran my test, I noticed that result was indeed a large string with a lot of white space. That could be what you are seeing in the large alert. The white space is simply a result of ColdFusion liking whitespace like a Lohan needs publicity. 

We can fix this a few ways. We can reduce the whitespace in the CFM with a simple CFSETTING. But that's kinda boring. When I saw this on <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a. a few minutes ago I thought it was perfect timing:

<a href="http://blog.crankybit.com/trimming-a-string-in-javascript/">Cranky Bit: Trimming a String in JavaScript</a>

I added his code (note his regex is missing a \ in front of each s) and ended up with this:

<code>
&lt;script&gt;
String.prototype.trim = function() {% raw %}{ return this.replace(/^\s+|{% endraw %}\s+$/g,""); }

function resultHandler(result) {
	console.log('result handler ran...');
	console.log(result.trim());
}

function solve() {
	console.log('running...');
	ColdFusion.Ajax.submitForm('myform','test.cfm',resultHandler);
	console.log('done...');
}
&lt;/script&gt;
</code>

Now when I ran the code I got a nicely trimmed response. I added one more line to set the result value:

<code>
document.getElementById("result").value = result.trim();
</code>