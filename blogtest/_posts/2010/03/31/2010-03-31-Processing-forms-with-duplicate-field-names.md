---
layout: post
title: "Processing forms with duplicate field names"
date: "2010-04-01T00:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/31/Processing-forms-with-duplicate-field-names
guid: 3769
---

Recently Ben Nadel <a href="http://www.bennadel.com/blog/1887-Using-jQuery-To-Pass-Arrays-To-Remote-ColdFusion-Components.htm">posted a blog entry</a> that was in reply to an <a href="http://www.raymondcamden.com/index.cfm/2010/3/23/Using-jQuery-to-post-an-array-to-a-ColdFusion-Component">earlier entry</a> of mine. Both entries talk about passing arrays of data to the server via client side JavaScript. In the comments we got a bit side tracked into talking about how to handle multiple form fields with the same name. What do I mean? Consider a form that looks like this:
<!--more-->
<p>
<code>
&lt;form action="test4a.cfm" method="post"&gt;
&lt;input type="text" name="name" value="Camden,Raymond"&gt;
&lt;input type="text" name="name" value="Smith,John"&gt;
&lt;input type="submit"&gt;
&lt;/form&gt;
</code>
<p>
Notice that I have two fields with the name "name." This is kind of dumb, but I've seen it many times before. And while you may not ever code this, you may be working on code that listens for posts from remote services. Those services may choose to send their data like that and not leave you with much choice.
<p>
ColdFusion will nicely take those two form fields and combine them into one form.name value. ColdFusion will also nicely turn the two values into one - a list. However, look at my values. They both have commas already. When submitted, I end up with form.name being "Camden,Raymond,Smith,John." There is no way to tell what my data <i>really</i> was. 
<p>
I did a quick test though and looked at how getHTTPRequestData saw the values. I began by dumping the form scope and dumping the result of getHTTPRequestData():
<p>
<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-03-31 at 10.47.25 PM.png" title="Example of form/gethttprequestdata" />
<p>
Notice that the form scope is as I described - a list of munged data that we can't use. The result of getHTTPRequestData, however, is more clear. Notice specifically the content value:
<p>
name=Camden{% raw %}%2CRaymond&name=Smith%{% endraw %}2CJohn
<p>
We've got a list of URL encoded values. Most importantly - the list of values are separate. What this means is that we can quickly turn this into a proper array:
<p>
<code>
&lt;cfset data = []&gt;
&lt;cfif len(req.content)&gt;
	&lt;cfloop index="item" list="#req.content#" delimiters="&"&gt;
		&lt;cfset arrayAppend(data, urlDecode(listLast(item, "=")))&gt;		
	&lt;/cfloop&gt;
&lt;/cfif&gt;
</code>
<p>
As you can see, I simply treat the value as a & delimited list. For each item, I get the value to the right and urlDecode it. I append this to an array and I end up with my two values. Obviously this assumes that everything in the list is a NAME value. That would <b>not</b> be true if there were more form fields. But I think this is enough to give you a good start if you do indeed need to work with form data of this type.