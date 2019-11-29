---
layout: post
title: "ColdFusion's ArrayEach and Struct JSON Serialization"
date: "2014-09-17T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/09/17/ColdFusions-ArrayEach-and-Struct-JSON-Serialization
guid: 5310
---

<p>
Ok, technically, the two topics mentioned in the subject have nothing to do with each other, but both were interesting things I ran into during my <a href="http://www.raymondcamden.com/2014/9/14/Video-My-top-features-of-ColdFusion-11">presentation</a> on Sunday so I thought I'd call them out.
</p>
<!--more-->
<p>
First - I had a question about arrayEach. Does it recalculate the size of the array on every iteration? The answer is yes and you can see it with this code sample.
</p>

<pre><code class="language-javascript">names = ["Ray","Scott","Dave","Todd"];

names.each(function(x) {
	writeoutput(x & "<br>");
	if(names.len() &lt; 10) {% raw %}{ names.append("foo"); }{% endraw %}
});</code></pre>

<p>
This will loop over the array and while it is fewer than ten items long, actually append to the array as well. The output is what you expect, the names followed by some foo items. Again, totally expected I think but I wanted to verify it when asked.
</p>

<p>
The next question I got was about the new struct format of query serialization. I blogged about this <a href="http://www.raymondcamden.com/2014/5/8/ColdFusion-11s-new-Struct-format-for-JSON-and-how-to-use-it-in-ColdFusion-10">back in May</a>. The question was - will this apply if the query is a subkey of the data being serialized? The answer is yes. I did <i>not</i> expect this and I'm happy it does work. An example:
</p>

<pre><code class="language-javascript">q = queryNew("name,age","varchar,integer");

q.addRow({% raw %}{name:"ray",age:33}{% endraw %});
q.addRow({% raw %}{name:"3",age:33}{% endraw %});
s = {};
s.x=q;
writeoutput(serializejson(s,"struct"));
</code></pre>

<p>
To be clear, <code>struct</code> as used above is a flag to the CF compiler to serialize queries in struct format. It has nothing to do with the fact that I'm passing a struct in. An array with a query as an item would have worked as well.
</p>