---
layout: post
title: "jQuery Sortable with ColdFusion"
date: "2009-02-25T20:02:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/02/25/jQuery-Sortable-with-ColdFusion
guid: 3252
---

Earlier today my coworker mentioned the need for a way to easily move items up and down on a web page. In this case the idea was to sort a list of documents. We've probably all done this before. You list out each item and the one on top has a down arrow, the one on the bottom has an up arrow, and all the rest have both up and down controls. Turns out - and no big surprise here - there is actually a cool little jQuery utility to make this a bit simpler - the <a href="http://jqueryui.com/demos/sortable/">Sortable</a> control.
<!--more-->
If you follow the link to the demo (and please do, it's rather slick!) you will see how nice this control works. Instead of slowly clicking items up and down, a user can simply drag and drop the order they want. A big +1 for usability here (in my opinion). What isn't so obvious though is how you persist these changes. Let's dig a bit into the control and I'll show you how you can tie it to ColdFusion.

First, let's look at a simple version that just does the sorting:

<pre><code class="language-markup">
&lt;html&gt;

&lt;head&gt;
&lt;script src="jquery-1.3.1.js"&gt;&lt;/script&gt;
&lt;script src="jquery-ui-personalized-1.6rc6.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function(){
    $("#sortable").sortable();
  });
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h1&gt;Test&lt;/h1&gt;

&lt;ul id="sortable"&gt;
	&lt;li&gt;First&lt;/li&gt;
	&lt;li&gt;Second&lt;/li&gt;
	&lt;li&gt;Third&lt;/li&gt;
&lt;/ul&gt;

&lt;/body&gt;

&lt;/html&gt;
</code></pre>

I absolutely love this. Seriously. I want to form a domestic partnership with jQuery and never look at another framework again. <strike>You can see a demo of this <a href="http://www.raymondcamden.com/demos/jquerysortable/test1.html">here</a>.</strike> But this is just a front end demo. Simple and sexy, but we need something real, and a lot of times that is where things can break down. I began by making the data dynamic.

<pre><code class="language-markup">
&lt;cfset data = queryNew("id,title","integer,varchar")&gt;
&lt;cfloop index="x" from="1" to="5"&gt;
	&lt;cfset queryAddRow(data)&gt;
	&lt;cfset querySetCell(data, "id", x)&gt;
	&lt;cfset querySetCell(data, "title", "Title #x#")&gt;
&lt;/cfloop&gt;
</code></pre>

Normally that would be set in my controller code or a CFC at least, but you get the idea. I then changed my UL/LI:

<pre><code class="language-markup">
&lt;ul id="sortable"&gt;
	&lt;cfoutput query="data"&gt;
		&lt;li id="item_#id#"&gt;#title#&lt;/li&gt;
	&lt;/cfoutput&gt;
&lt;/ul&gt;
</code></pre>

Ok, not rocket science, but you get the idea. I then added a button:

<pre><code class="language-markup">
&lt;input type="button" id="saveBtn" value="Persist"&gt;
</code></pre>

and modified my document.ready:

<pre><code class="language-javascript">
$(document).ready(function(){
    $("#sortable").sortable();
    $("#saveBtn").click(persist)
  });
</code></pre>

My persist function will take care of saving the data. The <a href="http://docs.jquery.com/UI/Sortable">docs</a> for Sortable are pretty extensive. What we want is the serialize function. As you can guess, it will serialize the sortable data. It does this by grabbing the id values from the items you had marked as sortable. My persist function looks like so:

<pre><code class="language-javascript">
function persist() {
	console.log('running persist....')
	var data = $("#sortable").sortable('serialize')
	console.log(data)
}
</code></pre>

When run, the console reports:

<blockquote>
<p>
item[]=3&item[]=2&item[]=1&item[]=4&item[]=5
</p>
</blockquote>

Kind of an odd format. You can change it up a bit by passing additional parameters to the sortable call, but you get the basic idea. <strike>A demo of this version may be found <a href="http://www.coldfusionjedi.com/demos/jquerysortable/test.cfm">here</a>.</strike> Obviously you need Firebug installed and open to see the console messages.

Alright, so let's take it a step further. As I said, I thought that format was a bit odd. Sortable supports serializing to arrays as well:

<pre><code class="language-javascript">
var data = $("#sortable").sortable('toArray')
</code></pre>

and we can tie this to an Ajax call

<pre><code class="language-javascript">
$.post('data.cfc?method=saveData',{% raw %}{order:data}{% endraw %},function(res,txtStatus) {
		console.log(txtStatus)
	})
</code></pre>

At this point I ran into a bit of trouble. I forgot that you can't send a complex data structure 'as is' over the wire. jQuery was smarter than me in this case and simply converted the data back into a list, much like the first serialize example. This time though it was just a list of values:

<blockquote>
<p>
item_N,item_X,item_Z
</p>
</blockquote>

My CFC would have to parse the list and note both the position and the ID value from each item:

<pre><code class="language-markup">
&lt;cffunction name="saveData" access="remote" returnType="void" output="false"&gt;
	&lt;cfargument name="order" type="any" required="true"&gt;
	&lt;cfset var x = ""&gt;
	&lt;cfset var id = ""&gt;
	&lt;cfset var item = ""&gt;
	
	&lt;!--- loop through and make a new order ---&gt;
	&lt;cfloop index="x" from="1" to="#listLen(arguments.order)#"&gt;
		&lt;cfset item = listGetAt(arguments.order, x)&gt;
		&lt;cfset id = listGetAt(item,2,"_")&gt;
		&lt;cflog file="ajax" text="setting id #id# to position #x#"&gt;
	&lt;/cfloop&gt;

&lt;/cffunction&gt;
</code></pre>

Normally this would actually run a query, but I think you get the idea. I've included my sample code as an attachment. 

I have to admit - I thought the 'interactions' section of jQuery UI wasn't that exciting, but I'm beginning to see some real benefit here.
<p>

<a href='https://static.raymondcamden.com/enclosures/jquerysortable%2Ezip'>Download attached file.</a></p>