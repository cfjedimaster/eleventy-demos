---
layout: post
title: "Interesting Verity Bug"
date: "2006-02-19T15:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/19/Interesting-Verity-Bug
guid: 1111
---

I ran into an interesting issue with Verity today. I was working on the <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a> today and noticed something odd. When I did a search for file, one of the entries had this for a title: Cached File Example

I knew that couldn't be right. A quick click on the link took me <a href="http://www.coldfusioncookbook.com/entry/56/Cached-File-Example">here</a>, where I saw the real title: "How can I generate static HTML from a dynamic ColdFusion page?"

I looked over my code and saw that I was passing the right information. (Obviously or my search results would have been real crazy. I then noticed something odd about this <a href="http://www.coldfusioncookbook.com/entry/56/Cached-File-Example">entry</a>, inside the body was a set of html title tags. On a whim, I created a quick test:

<code>
&lt;cfsavecontent variable="body"&gt;
hi world, how do you do today
&lt;html&gt;
&lt;head&gt;
&lt;title&gt;Not the right title&lt;/title&gt;
&lt;/head&gt;

&lt;/cfsavecontent&gt;

&lt;cfindex collection="test"
	     type="custom"
		 action="update" 
		 key="#createUUID()#"
		 title="The Title"
		 body="#body#"
		 &gt;

&lt;cfsearch collection="test" criteria="*" name="foo" status="status"&gt;
&lt;cfdump var="#foo#"&gt;
&lt;cfdump var="#status#"&gt;
</code>

My first few tests simply had "hi world, how do you do today" in the body.  My search results showed my hard coded title. When I added the text you see above, my hard coded title was ignored, and the title from the content was used.

A quick check of the docs for cfindex say this about the title attribute (emphasis mine): 

<blockquote>
Provides a title for the document <i><u>if one cannot be extracted</u></i> from the document.
</blockquote>

So maybe this isn't a bug at all. The title is only a hint. But I can see - especially for custom data - where this would be very undesirable. For the cookbook I'm going to have to resort to using one of the custom fields, so it won't be a big deal to get around, but it is certainly something to keep in mind.