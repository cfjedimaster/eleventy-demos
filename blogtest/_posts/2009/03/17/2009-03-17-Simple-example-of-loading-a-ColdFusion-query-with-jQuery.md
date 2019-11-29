---
layout: post
title: "Simple example of loading a ColdFusion query with jQuery"
date: "2009-03-17T14:03:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/03/17/Simple-example-of-loading-a-ColdFusion-query-with-jQuery
guid: 3279
---

Earlier last week a reader (and forgive me, I wrote down your idea, not your name) asked for a simple demonstration of how to use jQuery to load in a ColdFusion query via Ajax. I whipped up a quick, and hopefully simple, set of demos to help show how easy this is.
<!--more-->
First, please remember that there are many ways we can this. Just like ColdFusion provides many ways to skin the cat, so does jQuery. I'm going to demonstrate two main ways as I feel it really shows the two types of Ajax calls most folks will use. 

In broad terms, most folks will use Ajax to either load rendered content or pure data. So let's say you want to show a list of people on a page. You want to load this via Ajax. You could have the server return the list, printed out with HTML, line breaks, etc. This is rather simple and is especially useful for times when your formatting needs are complex. It is a <b>heck</b> of a lot easier to format dates in ColdFusion then JavaScript. (Although I bet jQuery has a good date library!) 

The alternative is to load pure data. This can be XML or JSON (typically JSON) which is then handled on the client. This requires more work, but typically results in less 'traffic' as you are only sending the data, not data plus formatting.

So which should you use? Whichever works best for you! (Yes, I know, a non-answer. Sorry.) Here are two demos of both in action.

<pre><code class="language-javascript">
&lt;html&gt;

&lt;head&gt;
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

function loadQuery() {
	$.get('data.cfm',{},function(data){
		$("#content").html(data)
	})
	return false
}

$(document).ready(function() {
	$("#loadLink").click(loadQuery)
});

&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;p&gt;
	&lt;a href="" id="loadLink"&gt;Load Query&lt;/a&gt;
&lt;/p&gt;

&lt;div id="content"&gt;
&lt;/div&gt;

&lt;/body&gt;

&lt;/html&gt;
</code></pre>

In my first example, I have a simple page that consists of one link and one empty div. Notice then loadQuery handles making the Ajax request and publishing it to the empty div. The ColdFusion file handles both creating the query and rendering it (although normally I'd get the query elsewhere, from a CFC for example):

<pre><code class="language-javascript">
&lt;cfset q = queryNew("person,coolness")&gt;

&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "person", "Scott Slone")&gt;
&lt;cfset querySetCell(q, "coolness", "100")&gt;

&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "person", "Scott Stroz")&gt;
&lt;cfset querySetCell(q, "coolness", randRange(1,100))&gt;

&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "person", "Raymond Camden")&gt;
&lt;cfset querySetCell(q, "coolness", randRange(1,100))&gt;

&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "person", "Todd Sharp")&gt;
&lt;cfset querySetCell(q, "coolness", randRange(1,100))&gt;

&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "person", "Scott Pinkston")&gt;
&lt;cfset querySetCell(q, "coolness", randRange(1,100))&gt;

&lt;h1&gt;People&lt;/h1&gt;

&lt;cfoutput query="q"&gt;
&lt;b&gt;#person#&lt;/b&gt; has a cool score of #coolness#.&lt;br/&gt;
&lt;/cfoutput&gt;
</code></pre>

There isn't anything special about the query, except for a shout out to Scott Slone for feeding my Star Wars addiction via woot.com today!

You can see this in action here: (Removed demo link, see note at bottom) 

Now let's look at the alternative. I'll start on the server side first. Here is data2.cfm. Same query, but now we serve it up as JSON and don't perform any formatting:

<pre><code class="language-javascript">
&lt;cfset q = queryNew("person,coolness")&gt;
... querySetCells cut from code to make it shorter ...

&lt;cfset data = serializeJSON(q)&gt;
&lt;cfcontent type="application/json" reset="true"&gt;&lt;cfoutput&gt;#data#&lt;/cfoutput&gt;
</code></pre>

The front end now needs to get a bit more complex. I've only modified the loadQuery function so I'll just paste in that:

<pre><code class="language-javascript">
function loadQuery() {
	$.getJSON('data2.cfm',{},function(data){
		
		//map columns to names
		var columnMap = {}
		
		for (var i = 0; i &lt; data.COLUMNS.length; i++) {
			columnMap[data.COLUMNS[i]] = i	
		}

		//begin making my str
		var str = '&lt;h1&gt;People&lt;/h1&gt;'
		
		for (var i = 0; i &lt; data.DATA.length; i++) {
			str += '&lt;b&gt;'+data.DATA[i][columnMap.PERSON]+'&lt;/b&gt;'
			str += ' has a cool score of '+data.DATA[i][columnMap.COOLNESS]+'&lt;br/&gt;'
		}
	
		$("#content").html(str)

	})
	return false
}
</code></pre>

Ok, so the first change is the switch from get to getJSON. This just tells jQuery to go ahead and expect JSON and turn it into a native JavaScript object for me. At that point I wasn't sure what to do. Where do I turn when I want to just... play/test/etc with JavaScript? Firebug. I ran this:

	console.dir(data)

So I could look at the result. The result had 2 keys: COLUMNS and DATA. COLUMNS was an array of column names. DATA was an array of data (big surprise there). I realized that the first column in the COLUMNS array matched the first column of data. So if I wanted the person column, I could either hard code the value 0, or, do what I did here, which is to create an object that stored the column name and the corresponding position. 

I then create my string. Notice how I make use of columnMap to address the data in the array. Once done, I then simply place the HTML in the div. 

You can see this in action here: (Removed demo link, see note at bottom)

Enjoy!

For folks looking for the old code for this, you can download a zip of it here: https://static.raymondcamden.com/enclosures/jquerycfquery.zip