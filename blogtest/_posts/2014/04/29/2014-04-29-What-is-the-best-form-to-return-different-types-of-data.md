---
layout: post
title: "What is the \"best\" form to return different types of data?"
date: "2014-04-29T23:04:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2014/04/29/What-is-the-best-form-to-return-different-types-of-data
guid: 5214
---

<p>
I'm helping a friend deal with an AJAX issue and ran across something he was doing that was - in my opinion - a bit wrong. Specifically it involved how he was returning complex data from a remote service. I thought I'd whip up some quick advice about this. While his issue involved AJAX, this advice should really apply to just about anything, and as always, I assume folks have their own opinions/suggestions as well. Add 'em to the comments below!
</p>
<!--more-->
<h2>One value</h2>

<p>
Returning just a simple value? Cool. Just return it. That was easy. 
</p>

<h2>A set of values</h2>

<p>
Return an array. Boom, easy too. 
</p>

<h2>A set of sets</h2>

<p>
OK, now this is why I wrote the blog post in general. He was returning a set of results where each individual result was also a set of values. His mistake, in my opinion, was the form of his result. His result data looked like this.
</p>

<pre><code class="language-javascript">
[["ray",41,true,39],["bob",39,true,21],["joe",52,false,48]]
</code></pre>

<p>
So what exactly is that? In this case the data represents a list of people. He used an array of arrays where each person was an array and the individual person data was also array elements. The first item is the name, the second is their age, the third was a boolean indicating their job status, and the final result was the number of books they read last year.
</p>

<p>
No wait... sorry... the 4th item is the age and the 2nd item is the number books.
</p>

<p>
No... shoot... see the problem? A better solution would be an array of maps (or structs):
</p>

<pre><code class="language-javascript">
[{% raw %}{"name":"ray","age":41,"job":true,"books":39}{% endraw %},{% raw %}{"name":"bob","age":39,"job":true,"books":21}{% endraw %},{% raw %}{"name":"joe","age":52,"job":false,"books":48}{% endraw %}]
</code></pre>

<p>
Woot - much better! Of course, it is also about twice as big too, so it isn't always straightforward. If you are dealing with AJAX then this should be a concern. How much data should you expect your service to <i>normally</i> return? Do you have a limit on the server side? It is entirely possible you <strong>do</strong> want to send a few thousand results (perhaps as part of an initial data seed) and in that case, using the array of arrays might be better.
</p>

<p>
p.s. While I was specifically helping him with a ColdFusion problem, I didn't write this post to be specific to ColdFusion. I do want to point out that ColdFusion 11 offers a new way to return query data - one much like the array of structs above. It too is a lot easier to deal with than the "normal" way ColdFusion returns a serialized query. But the normal way is also a lot slimmer, much like the array of arrays was as well. There was definitely some logic to how it was done.
</p>