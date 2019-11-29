---
layout: post
title: "Like the ColdFusion Cookbook? Bored?"
date: "2006-01-21T15:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/21/Like-the-ColdFusion-Cookbook-Bored
guid: 1044
---

Do you like the <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a> site? Are you bored to tears and want something only marginally less boring to do?

Today I added a cool feature to the Cookbook. (Added it locally I mean.) The new feature will scan cookbook answers for CFML functions and tags. When it finds it, it will automatically hot link to live docs. It will also add a new section called "Referenced CFML" (or some such) with an alphabetical list of tags/functions (again, hyperlinked). 

To drive this, though, I need a static list of functions and tags. I'm driving this through XML now. Here is what I have so far:

<code>
&lt;cfml&gt;
&lt;functions&gt;
&lt;function label="createUUID()" url="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000436.htm##1102827" /&gt;
&lt;/functions&gt;
&lt;/cfml&gt;
</code>

As you can see, each function has a label and a url. The label is in the camel case I prefer. Obviouslly tags will be in a tags/tag section. 

So what do I need? If you are incredibly bored, go to the pages in livedocs that list out all the functions and all the tags, and create the XML for them. 

I know - you need to be crazy bored to do this - but I figure it can't hurt to ask. If you want to do this, please post a comment. Something like, "I'll do all functions, A-C". That way people won't duplicate the work. Be sure to copy the link on the <i>listing</i> page. I believe the URL you see <i>on</i> the page itself won't work due to the fancy JS stuff they have there. (I really wish they would go back to "simple" pages. Ever since the fancy JS stuff was added the site seems a bit... wierd at times. Although I'd keep the comments in.) Anyway, everything clear? Let me know if not. I <i>will</i> give credit to my submitters. That won't buy you much, but you can at least say you helped build the site. :)