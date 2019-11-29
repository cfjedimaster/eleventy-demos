---
layout: post
title: "Model-Glue Unity and Generic Database Messages"
date: "2006-07-18T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/18/ModelGlue-Unity-and-Generic-Database-Messages
guid: 1409
---

One of my favorite new features of <a href="http://www.model-glue.com">Model-Glue: Unity</a> is "Generic Database Messages". What are those? MG: Unity can use the power of Reactor to allow for simple CRUD (Create/Read/Update/Delete) operations. You don't need to build a controller or model CFCs, you simply follow a standard format within your configuration XML. Let me focus on the basic "Get All" type functionality. Imagine you have a table of groups (this is exactly what I was working on last night). You could get all the groups by adding this to your event:

<code>
&lt;message name="modelglue.GenericList"&gt;
	&lt;argument name="object" value="Groups" /&gt;
&lt;/message&gt;
</code>

This by itself will place a query named GroupsQuery in your view state. You can also customize the result by telling Model-Glue what viewState value to use:

<code>
&lt;message name="modelglue.GenericList"&gt;
	&lt;argument name="object" value="Groups" /&gt;
	&lt;argument name="queryname" value="groupQuery" /&gt;
&lt;/message&gt;
</code>

Let's make it even more complex. Let's filter by some arbitrary property and add a quick sort:

<code>
&lt;message name="modelglue.GenericList"&gt;
	&lt;argument name="object" value="Groups" /&gt;
	&lt;argument name="queryname" value="groupQuery" /&gt;
	&lt;argument name="criteria" value="name"/&gt;
	&lt;argument name="orderBy" value="name" /&gt;
&lt;/message&gt;
</code>

The criteria value tells Model-Glue to look in the event for a filter property. (Remember that Model-Glue automatically folds in all form and url variables to the event.) So if url.filter was "dharma", then the result query would be filtered by items where the name was dharma. The orderBy does exactly what you would think - order the result by name, ascending. (And yes, you can switch to descending by just adding another argument.)

For more information, see this entry in the <a href="http://livedocs.model-glue.com">Model-Glue docs</a>:

<blockquote>
<a href="http://livedocs.model-glue.com/How_To_s/How_To_Use_Generic_Database_Messages/How_To_Use_Generic_Database_Messages.htm">How to Use Generic Database Messages</a>
</blockquote>

(As a side note, the above link will take you to the "home" page for that section. If you click the Show link, you will get the full navigation, loaded to the right page. I wish Robohelp would provide a "Link to Here" type functionality. All sites with frames should provide such support.) 
This is incredibly useful for rapid development. If you need to employ a customized solution, you can always return later and add a "real" set of Controller/Model CFCs.