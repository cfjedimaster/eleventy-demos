---
layout: post
title: "Using CFDIV for Paging (ColdFusionBloggers.org Update)"
date: "2007-07-24T23:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/24/Using-CFDIV-for-Paging-ColdFusionBloggersorg-Update
guid: 2218
---

So once again I'm messing with <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a> to show off some ColdFusion 8 AJAX goodness. This time the idea came from <a href="http://cfsilence.com/blog/client/">Todd Sharp</a>. He suggested making the paging AJAX based. That way when you move from page to page, only the content is loaded. Turns out the change was rather simple. 

My original code simply got the data and displayed it inside a layout custom tag. I began by changing my index.cfm page to this:

<code>
&lt;cfajaximport tags="cftooltip"&gt;

&lt;cf_layout title="coldfusionBloggers"&gt;

&lt;cfdiv bind="url:content.cfm" id="content" /&gt;

&lt;/cf_layout&gt;
</code>

I'll explain the import in a sec. But basically I moved all of the content into a new file. I then used cfidv and bound it to my new file, content.cfm. 

Now why do I need an import? Some ColdFusion 8 Ajax tags lets you point to an external source for content, as I did here. If <i>those</i> pages make use of ColdFusion Ajax tags they need certain JavaScript files to load. These JavaScript files are not included when the pages are loaded via Ajax themself. Not quite sure if that makes sense so let me know if not. Since I'm using cftooltip in my content, I needed to tell the parent to import the proper libraries for the tag.

Content.cfm contains everything that used to be index.cfm, except for the layout. I had to make one change though. My previous and next links continued to reload the entire page. That is the default behavior for links inside containers. I can get around that by just using ajaxLink. So instead of:

<code>
&lt;a href="http://www.cnn.com"&gt;CNN&lt;/a&gt;
</code>

I switched to:

<code>
&lt;a href="#ajaxLink('http://www.cnn.com')#"&gt;CNN&lt;/a&gt;
</code>

I didn't have to do this for the blog links as I wanted them to reload the entire page. 

My next change was to the search form. I considered leaving the search form as is. It would cause a page reload but any previous or next link for the search terms would still be loaded dynamically. But I figured why go half way when I can go all the way. I changed the form submit button to fire off a JavaScript event. I then wrote the following:

<code>
function doSearch() {
	var searchvalue = document.getElementById("search_query").value;
	if(searchvalue == '') return false;
	ColdFusion.navigate('content.cfm?search_query='+escape(searchvalue),'content');
	return false;
}
</code>

So the first two lines aren't really fancy. They just get and check the value of the search box. The important line is the ColdFusion.navigate call. This simply loads the URL specified in my content div. 

As before I've updated the code zip if you want to take a look. Now one drawback to this approach is that it reduces the ability to bookmark. My assumption is that most folks will <i>not</i> need to bookmark. I could see needing to bookmark searches though, and I may potentially change my implementation there.