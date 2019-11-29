---
layout: post
title: "ColdFusion 11's new Struct format for JSON (and how to use it in ColdFusion 10)"
date: "2014-05-08T18:05:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2014/05/08/ColdFusion-11s-new-Struct-format-for-JSON-and-how-to-use-it-in-ColdFusion-10
guid: 5219
---

<p>
One of the nicer new features in ColdFusion 11 is a new way to serialize queries to JSON. If you've ever returned a query over the wire to JavaScript, then you are probably aware that ColdFusion has a ... unique way of serializing the query. The default serialization for queries is based on returning data in a lightweight, efficient format over the network. It isn't difficult to deal with - but it can be awkward if you aren't expecting it. We can argue (and I just did with a fellow ColdFusion community member ;) about whether that choice was wise or not, but instead, I'd rather talk about how ColdFusion 11 addresses this, and how you can mimic the same behavior in earlier versions of ColdFusion.
</p>
<!--more-->
<p>
The default form for query serialization to JSON looks a bit like so:
</p>

<p>
{% raw %}{"COLUMNS":["NAME","AGE"],"DATA":[["ray",33],["todd",43],["scott",53]]}{% endraw %}
</p>

<p>
When loaded by your JavaScript code, you've got an object with two properties, COLUMNS and DATA. COLUMNS is an array of columns (duh), and DATA is an array of arrays, where the Nth element of each index represents the Nth column. As I said, a bit awkward, but this form saves quite a bit (see the diversion towards the end) of size in the resulting JSON string. 
</p>

<p>
ColdFusion 11 adds a new "struct" form for query serialization. (ColdFusion already had two forms of query serialization - but I'm not going to bother covering the second.) If you serialize your query and pass "struct" as the second argument, serializeJSON(myAwesomeFrakingQuery, "struct"), you'll get something that may be a bit more familiar:
</p>

<p>
[{% raw %}{"NAME":"ray","AGE":33}{% endraw %},{% raw %}{"NAME":"todd","AGE":43}{% endraw %},{% raw %}{"NAME":"scott","AGE":53}{% endraw %}]
</p>

<p>
If you are calling a CFC method (the normal way you get JSON), you can ask for this format by adding this to the url: queryformat=struct. So a CFC request in your JavaScript code could look like this: service.cfc?method=getPeople&returnformat=json&queryformat=struct.
</p>

<p>
As another tip, you can actually set those values as defaults, right in your CFC. On the top of the file (after the component begins of course), outside any methods, you can do: url.returnformat="json" and url.queryformat="struct". Then your JavaScript code can use a simpler URL: service.cfc?method=getPeople.
</p>

<p>
Lastly, you can set the default serialization for queries directly in Application.cfc. The <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/Application+variables">documentation</a> is missing this (and I have edit rights to it but I've not gotten around to it) but you specify the default like so: this.serialization.serializequeryas = "struct".
</p>

<p>
Finally (well, before the diversion), how would you do something similar in ColdFusion 10 (or earlier)? Simple - write a utility function to convert the query. Here is an example.
</p>

<pre><code class="language-javascript">component {

	url.returnformat=&quot;json&quot;;

	remote function getPeople() {
		&#x2F;&#x2F;number of test rows
		var rows = 500;
		var result = queryNew(&quot;id,propername,age,gender&quot;);
		for(var i=1; i&lt;= rows; i++) {
			queryAddRow(result, {% raw %}{id:i, propername:&quot;Name #i#&quot;, age:i%{% endraw %}25, gender:1});
		}
		return queryToArray(result);
	}

	private function queryToArray(q) {
		var s = [];
		var cols = q.columnList;
		var colsLen = listLen(cols);
		for(var i=1; i&lt;=q.recordCount; i++) {
			var row = {};
			for(var k=1; k&lt;=colsLen; k++) {
				row[lcase(listGetAt(cols, k))] = q[listGetAt(cols, k)][i];
			}
			arrayAppend(s, row);
		}
		return s;
	}
}</code></pre>

<p>
In the CFC above, the main method, getPeople, is what would be called from your code. It makes use of the utility method, queryToArray, to return a nice result. getPeople isn't specifying a return type, but if you do add one, be sure to specify array, not query.
</p>

<p>
Ok, you can stop reading now. Seriously. The rest of this is just numbers BS for fun.
</p>

<p>
<img src="https://static.raymondcamden.com/images/31058511.jpg" />
</p>

<p>
For the heck of it, I did some testing to compare the size of JSON responses between the "old, slim" style and the new sexy style. I used neither ColdFusion 11 nor my utility function; I simply did a hard-coded conversion:
</p>

<pre><code class="language-javascript">remote function getPeople1() {
	&#x2F;&#x2F;number of test rows
	var rows = 500;
	var result = queryNew(&quot;id,propername,age,gender&quot;);
	for(var i=1; i&lt;= rows; i++) {
		queryAddRow(result, {% raw %}{id:i, propername:&quot;Name #i#&quot;, age:i%{% endraw %}25, gender:1});
	}
	return result;
}

remote function getPeople2() {
	var data = getPeople1();
	var result = [];
	for(var i=1; i&lt;=data.recordCount; i++) {
		arrayAppend(result, {% raw %}{&quot;id&quot;:data.id[i], &quot;propername&quot;:data.propername[i], &quot;age&quot;:data.age[i], &quot;gender&quot;:data.gender[i]}{% endraw %});
	}
	return result;
}</code></pre>

<p>
On every test I did, the slimmer style was slimmer, and got more slimmer when the number of rows got higher and the column names changed. For example, just changing the column "name" to "propername" saw a jump. At 500 rows, the slim style was 11.6KB. The array form was 27.6KB -- more than twice as a big. Of course, 28KB is still relatively slim so - there ya go.
</p>

<p>
To make things more interesting, Ryan Guill did some testing where he enabled GZIP on the results. <strong>Talk about making a difference.</strong> You can see the full results <a href="https://gist.github.com/ryanguill/b48ecbca0d20af322166">here</a>, but in general, he saw approximately 50%, <i>and higher</i>, reductions in size. Nice. 
</p>