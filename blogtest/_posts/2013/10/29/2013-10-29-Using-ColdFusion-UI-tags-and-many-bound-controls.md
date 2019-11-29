---
layout: post
title: "Using ColdFusion UI tags and many bound controls"
date: "2013-10-29T13:10:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2013/10/29/Using-ColdFusion-UI-tags-and-many-bound-controls
guid: 5073
---

<p>
So, as a rule, I refuse to answer questions about ColdFusion UI tags. I definitely blogged about them in the past, but like others, I've come to realize that they cause more problems then they solve. To quote the great one...
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/Yoda_Empire_Strikes_Back.png" />
</p>

<blockquote>
CFUI controls are the path to the dark side. CFGIRD leads to CFLAYOUT. CFLAYOUT leads to CFPOD. CFPOD leads to suffering.
</blockquote>

<p>
However, there are two reasons I'm helping out here. One, the person who wrote me used a bad email address so I couldn't reply directly. Secondly, the issue he ran into is one I've run into myself outside of ColdFusion's UI tags. With that out of the way, let's look at his question.
</p>

<blockquote>
Is there a character/length limit to the number of arguments/parameters that one can pass into a ColdFusion Grid using the bind attribute?
<br/><br/>
The reason I ask, I have a search/filter that passes over 56 arguments into a function on a CFC.  As soon as I try and add another argument (57th) I get an error on the grid in the AJAX debugger and firebug that states the CFC can no longer be found (http: Error invoking CFC /documentsearch/documentadvancedsearch.cfc : Not Found).  I understand that this the standard error when there is an issue.
</blockquote>

<p>
So yes, indeed, there is a size issue. When making an XHR (Ajax) request, there is an upper limit to the size of the URL you can send. If you pass data via query string parameters, it is definitely possible to hit the limit.This is pretty easy to replicate. I built a simple grid and added an additional bind to a large textarea. (And by size I mean the size of the data inside.) Consider:
</p>

<pre><code class="language-markup">
&lt;cfform&gt;
	&lt;cftextarea name=&quot;fieldpoo&quot; value=&quot;#repeatString(&#x27;x &#x27;,1999)#&quot; width=&quot;400&quot; height=&quot;400&quot; &#x2F;&gt;

&lt;cfgrid bind=&quot;cfc:testingzone.test2.getData({% raw %}{cfgridpage}{% endraw %},{% raw %}{cfgridpagesize}{% endraw %},{% raw %}{cfgridsortcolumn}{% endraw %},{% raw %}{cfgridsortdirection}{% endraw %},{% raw %}{fieldpoo}{% endraw %})&quot;
name=&quot;mygrid&quot; format=&quot;html&quot; width=&quot;400&quot;&gt;
	&lt;cfgridcolumn name=&quot;title&quot;&gt;
&lt;&#x2F;cfgrid&gt;
&lt;&#x2F;cfform&gt;
</code></pre>

<p>
Note how the textarea is prepopulated with a huge string. If you run this in your browser you end up with an error:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2013-10-29 at 12.34.53 PM.png" />
</p>

<p>
You can modify that textarea to use a smaller value and suddenly see it start working. So how do you fix this?
</p>

<p>
Unfortunately, as far as I know, <strong>you're screwed</strong>. CF UI controls offer three types of bindings: To a CFC, to a URL, and to a JavaScript function. For both the CFC and URL versions, GET requests are used. It wouldn't make sense to change it for the URL version, and the code behind CF's UI stuff uses GET for the CFC version. In theory it would be a quick tweak if you edited CF's JavaScript files, but I'm not sure I'd recommend it.
</p>

<p>
What about binding to a JavaScript function? Unfortunately the bind requires you to return an immediate response. If you used a JavaScript function that then did an XHR call to load your data, you would be using an asynchronous response and it would throw an error.
</p>

<p>
So to be clear, I do not believe you can get around this (easily) using CFGRID. I'm happy to be proven wrong of course. If you want to fix this, then I think the only method would be to find the proper ColdFusion JavaScript library and change it to use POST instead of GET. From what I can see this is line 127 in cfajax.js. (Well, around line 127.) Even if you force that method to POST, note that CF has already created the URL string and it is already too large, so that's probably not going to be a route for you as well.
</p>

<p>
Finally, as you can hopefully tell, the title of this entry isn't exactly appropriate. Even with <strong>one</strong> control, if you have too much data you will (possibly) run into this issue. I beg of you: Tell your coworkers, tell your friends, tell <i>everyone</i>, <strong>just learn JavaScript!</strong>