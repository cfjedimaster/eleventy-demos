---
layout: post
title: "Ask a Jedi: Composite, Dynamic Views in Model-Glue?"
date: "2010-06-02T09:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/06/02/Ask-a-Jedi-Composite-Dynamic-Views-in-ModelGlue
guid: 3836
---

Frank asks:
<p>

<blockquote>
Hey Ray,<br/>
<br/>
I've been using a variant of Fusebox for most of my career, and have decided to pick up Model-Glue. A quick question: using MG, can one build all of the content as variables and then "insert" them into templates, and filter the template?
<br/>
<br/>
Asked otherwise: Fusebox has allowed me to build the pages in chunks, using cfsavecontent and simply replace [[some_chunk_of_text]] in a template with the contents of that chunk of text, then finally run filters on the whole shebang such as filtering out white space between tags.
<br/>
<br/>
Is something like this reasonably easy to set up using MG?
</blockquote>
<!--more-->
<p>

So this is two questions in one really. First, can we combine multiple views into one, and secondly, can we do operations on those views. The first one is simple. Model-Glue has always supported the ability to combine multiple views into one result sent back to the browser. Within any Model-Glue request, you can have multiple view statements defined in your event:

<p>

<code>
&lt;views&gt;
	&lt;include name="body" template="pages/index.cfm" /&gt;
	&lt;include name="main" template="templates/main.cfm" /&gt;
&lt;/views&gt;
</code>

<p>

Model-Glue will run both views, but only the result of the last one is sent to the screen. In order to create a combination you simply use the viewCollection API. So consider main.cfm, our template. It has access to the earlier views by using this:

<p>

<code>
viewCollection.getView("body")
</code>

<p>

So a typical template might then look like this:

<p>

<code>
&lt;html&gt;

&lt;head&gt;
	&lt;link rel="stylesheet" type="text/css" href="css/stylesheet.css"&gt;&lt;/link&gt;
&lt;/head&gt;

&lt;body&gt;
	&lt;div id="banner"&gt;Dynamic View&lt;/div&gt;
	
	&lt;!--- Display the view named "body" ---&gt;
	&lt;cfoutput&gt;#viewCollection.getView("body")#&lt;/cfoutput&gt;
	
&lt;/body&gt;

&lt;/html&gt;
</code>

<p>

You can have more than two views of course. Your final view would simply add more calls to the collection to display them. 

<p>

So again - thats pretty simple. Frank's second question is pretty interesting. He wants to know if we can operations on the views. It never really occurred to me to ever do that, but it definitely is possible. Here is a very simple example. Imagine we have a view which returns this:

<p>

<code>
&lt;p&gt;
	Model-Glue 3 seems to be up and running.  Have fun!
&lt;/p&gt;

&lt;p&gt;
	The time is {% raw %}{currenttime}{% endraw %}.
&lt;/p&gt;
</code>

<p>

Note the use of {% raw %}{currenttime}{% endraw %} in the output. Now let's look at our template.

<p>

<code>
&lt;cfset body = viewCollection.getView("body")&gt;
&lt;cfset body = replaceNoCase(body, "{% raw %}{currenttime}{% endraw %}", dateFormat(now(),"short") & " " & timeFormat(now(), "short") , "all")&gt;
&lt;html&gt;

&lt;head&gt;
	&lt;link rel="stylesheet" type="text/css" href="css/stylesheet.css"&gt;&lt;/link&gt;
&lt;/head&gt;

&lt;body&gt;
	&lt;div id="banner"&gt;Dynamic View&lt;/div&gt;
	
	&lt;!--- Display the view named "body" ---&gt;
	&lt;cfoutput&gt;#body#&lt;/cfoutput&gt;
	
&lt;/body&gt;

&lt;/html&gt;
</code>

<p>

I've changed the code to not just output the earlier view, but to get it and perform a simple replace on it. Now obviously this is kind of a dumb example. But it does demonstrate that you can take earlier views and change them. As I said, I've never done that before in a production application, but maybe some of my readers have?