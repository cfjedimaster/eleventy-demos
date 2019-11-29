---
layout: post
title: "More on the JavaScript bug I had - and how it relates to Spry"
date: "2007-01-21T18:01:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2007/01/21/More-on-the-JavaScript-bug-I-had-and-how-it-relates-to-Spry
guid: 1784
---

So, a few hours ago I <a href="http://ray.camdenfamily.com/index.cfm/2007/1/21/Setting-the-disabled-property-of-a-form-field-help-needed">posted</a> about an odd JavaScript issue I was having where I couldn't set a field's disabled property. Turns out it was an issue with Spry, and one that makes sense if you think of it. My code was doing something like so:

<code>
if(offset == 0) $("prevbutton").disabled=true;
else $("prevbutton").disabled=false; 

if((offset + pageSize) &gt;= numRows) $("nextbutton").disabled=true;
else $("nextbutton").disabled=false;

Spry.Data.updateRegion("issues");
</code>

This code was run anytime you would click the Previous or Next buttons. It was a basic page handler for my dataset. The updateRegion call basically redrew the region. I had code inside it to check and see if a row should be displayed:

<code>
&lt;tr spry:repeat="dsIssues" spry:even="adminList0" spry:odd="adminList1" spry:test="{% raw %}{ds_RowNumber}{% endraw %} &gt;= pageOffset &amp;&amp; {% raw %}{ds_RowNumber}{% endraw %} &lt; pageStop"&gt;
</code>

The problem came up due to the fact that I had this inside the region:

<code>
&lt;input type="button" id="prevbutton" value="Prev" onclick="UpdatePage(pageOffset - pageSize);" disabled="true"&gt;
</code>

I had the previous button disabled at first since, obviously, you start on the first page. However, when I ran the updateRegion command, Spry essentially "reloaded" my initial HTML, which means the disabled=true was also being rerun. 

Obvious. But of course - most bugs are (after you fix them).