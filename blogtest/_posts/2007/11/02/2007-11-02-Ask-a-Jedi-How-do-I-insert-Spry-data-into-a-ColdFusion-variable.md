---
layout: post
title: "Ask a Jedi: How do I insert Spry data into a ColdFusion variable?"
date: "2007-11-02T13:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/02/Ask-a-Jedi-How-do-I-insert-Spry-data-into-a-ColdFusion-variable
guid: 2449
---

Rual asks:

<blockquote>
<p>
I tried a search on your blog and on the LiveDocs of Spry for how to insert Spry data into a ColdFusion variable, currently is trowing an error this expression.
#LsDateFormat({% raw %}{FECHANACIMIENTO}{% endraw %}, "dd/mm/yyyy")#

Gives this error<br />
Invalid CFML construct found on line 35 at column 50.
ColdFusion was looking at
the following text:

{

Thanks for your time and help. The line 35 is the line pasted above. I am using JSON and the data outputs fine it just errors out when I insert it into a ColdFusion function.
</p>
</blockquote>

This is a rather simple problem - and I have a feeling we are going to see many questions like this. Now that CF8 makes Ajax easy (as does Spry), some of the "old" questions begin to crop up.

The short answer is that you have a basic misunderstanding. Spry is completely client side. It uses Ajax to request data and then renders it on your browser client. ColdFusion is entirely server side. 

Think of it like this:

<ol>
<li>User requests a page.
<li>Web server hands off the request to ColdFusion.
<li>ColdFusion processes the page and returns HTML (rendered text) to the web server.
<li>Web server returns the simple text back to the browser.
<li>The browser begins to render the HTML.
<li>Spry runs what it has to do - including making new HTTP requests to load XML/JSON/HTML type data.
<li>It then uses JavaScript to rewrite content on screen.
</ol>

As you can see - Spry (and any other JavaScript framework) comes into play after ColdFusion is out of the picture.

Now if you simply wanted to format date data... heh, well, that's kind of fun. Spry does support firing JavaScript events before rendering. This would let you modify a column of data before it is displayed. See this <a href="http://labs.adobe.com/technologies/spry/samples/data_region/CustomColumnsSample.html">sample</a> and this <a href="http://www.raymondcamden.com/index.cfm/2006/12/27/Custom-columns-in-Spry">blog entry</a> for some examples. The real trouble you run into is the formatting.