---
layout: post
title: "Quick and Dirty JSON/Query Example"
date: "2007-09-20T10:09:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2007/09/20/Quick-and-Dirty-JSONQuery-Example
guid: 2359
---

Yesterday in the ColdFusion chat room someone asked a question (a technical question at that - guess how rare that is?) about how they could use a JSON-encoded query. I whipped up a quick example that I thought others might like as well. This example does <b>not</b> use Ajax to load the JSON data - which is also pretty rare - but I wanted something that I could run all in one file. So here we go...

<more>

The first thing I did was get a query of data and serialize it using SerializeJSON:

<pre><code class="language-markup">&lt;cfquery name="getstuff" datasource="blogdev" maxrows="5"&gt;
select	id, title, posted
from	tblblogentries
&lt;/cfquery&gt;

&lt;cfset jsondata = serializeJSON(getstuff)&gt;
</code></pre>

At this point, jsondata is a string. Here is what it looked like:

<blockquote>
{% raw %}{"COLUMNS":["ID","TITLE","POSTED"],"DATA":[["905D9689-0130-1A16-62272F586A771C0C","mmm","May, 15 2007 10:31:00"],["905DAAED-E300-3B9D-7E25E43985CA9507","nn","May, 15 2007 10:31:00"],["905DE931-B8DB-B1AD-F77FC505851C2E9A","j","May, 15 2007 10:31:00"],["905E0C6A-99B8-97EC-4862D9064B9EC659","mmmmm","May, 15 2007 10:31:00"],["905E5910-0E2D-C566-5DCD39E6FD48ED06","NUMBER 11","May, 15 2007 10:32:00"]]}{% endraw %}
</blockquote>

I wanted to work with this on the client side (the whole point of this entry), so I needed to set this data to a JavaScript variable. The cool thing about JSON is that it can be evaled (think of this like ColdFusion's evaluate function) directly to a variable, so I used this code to assign it:

<pre><code class="language-markup">&lt;script&gt;
mydata = eval(&lt;cfoutput&gt;#jsondata#&lt;/cfoutput&gt;)
</code></pre>

For my demo, I built a quick form with a button. The idea is that you would hit the button, and I'd then run code that would loop over the query and display the contents. Here is the form I used and the 'area' I would use for output:

<pre><code class="language-markup">&lt;input type="button" value="Show Data" onClick="showData()"&gt;
&lt;div id="content" /&gt;
</code></pre>

Ok, nothing complex yet. Now let's take a look at showData():

<pre><code class="language-javascript">function showData() {
	var output = document.getElementById('content');
	var colMap = new Object();
	
	//first - find my columns
	for(var i = 0; i &lt; mydata.COLUMNS.length; i++) {
		colMap[mydata.COLUMNS[i]] = i;		
	}
	
	for(var i = 0; i &lt; mydata.DATA.length; i++) {
		var str = mydata.DATA[i][colMap["TITLE"]] + " was posted at " + mydata.DATA[i][colMap["POSTED"]] + "&lt;br /&gt;";
		output.innerHTML += str;
	}
}
</code></pre>

The first line of code simply creates a pointer to my div. I'll be writing out to that later. Now I need to loop over my query. The question is - how? If you look at the JSON string I output earlier, you will see that it is an object with two main properties - columns and data. The columns property is a list of columns. The data property contains my rows of data. Note though that it isn't indexed by column names. Instead - the first item in the first row of data matches the first column name. So what I need to do is figure out what my columns are. To do this I create a column map - i.e., a mapping of columns to indexes. The first FOR loop does this.

Once I have that - then it is a trivial matter to loop over my rows of data and pick the values I need. So for example, to get the title for row i, I use:

<pre><code class="language-javascript">mydata.DATA[i][colMap["TITLE"]]
</code></pre>

Make sense? I'll include the full source of the code below, but before I do, a few notes:

<ol>
<li>The SerializeJSON function takes an optional second argument that is only used for queries. If set to true, the structure is pretty different than what I described above. I'll blog about that later today. (Someone will probably need to remind me.)
<li>While SerializeJSON is new to ColdFusion 8, ColdFusion 7 introduced the <a href="http://www.cfquickdocs.com/?getDoc=ToScript">toScript</a> function, which is another way to go from a ColdFusion variable to a JavaScript variable. (It is actually simpler than what I used above.)
</ol>

Now for the complete template:

<pre><code class="language-markup">&lt;cfquery name="getstuff" datasource="blogdev" maxrows="5"&gt;
select	id, title, posted
from	tblblogentries
&lt;/cfquery&gt;

&lt;cfset jsondata = serializeJSON(getstuff)&gt;

&lt;script&gt;
mydata = eval(&lt;cfoutput&gt;#jsondata#&lt;/cfoutput&gt;)

function showData() {
	var output = document.getElementById('content');
	var colMap = new Object();
	
	//first - find my columnsco
	for(var i = 0; i &lt; mydata.COLUMNS.length; i++) {
		colMap[mydata.COLUMNS[i]] = i;		
	}
	
	for(var i = 0; i &lt; mydata.DATA.length; i++) {
		var str = mydata.DATA[i][colMap["TITLE"]] + " was posted at " + mydata.DATA[i][colMap["POSTED"]] + "&lt;br /&gt;";
		output.innerHTML += str;
	}
}
&lt;/script&gt;

&lt;input type="button" value="Show Data" onClick="showData()"&gt;
&lt;div id="content" /&gt;
</code></pre>