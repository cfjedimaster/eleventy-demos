---
layout: post
title: "Sometimes it's the small mistakes..."
date: "2010-01-01T11:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/01/Sometimes-its-the-small-mistakes
guid: 3672
---

I recently released an <a href="http://www.blogcfc.com/index.cfm/2010/1/1/BlogCFC-Update--First-in-2010">update to BlogCFC</a>. One of the fixes includes a performance update that I'd like to detail. It isn't that big of a deal. In fact, I assume most folks will consider it quite obvious when they see it. But I missed it for years and figured it would be good to share. To give you a clue - the issue only came about when I updated to the latest <a href="http://coldfish.riaforge.org">ColdFish</a> and also involved the large number of subscribers I have at the blog here. I had noticed for a while now that whenever I published a blog entry, it took a good 10-15 seconds to go through. Let me show you the code and tell me if you can see the issue:
<!--more-->
<code>
&lt;cffunction name="mailEntry" access="public" returnType="void" output="false"
				hint="Handles email for the blog."&gt;
	&lt;cfargument name="entryid" type="uuid" required="true"&gt;
	&lt;cfset var entry = getEntry(arguments.entryid,true)&gt;
	&lt;cfset var subscribers = getSubscribers(true)&gt;
	&lt;cfset var theMessage = ""&gt;
	&lt;cfset var mailBody = ""&gt;

	&lt;cfloop query="subscribers"&gt;
		
		&lt;cfsavecontent variable="theMessage"&gt;
		&lt;cfoutput&gt;
&lt;h2&gt;#entry.title#&lt;/h2&gt;
&lt;b&gt;URL:&lt;/b&gt; &lt;a href="#makeLink(entry.id)#"&gt;#makeLink(entry.id)#&lt;/a&gt;&lt;br /&gt;
&lt;b&gt;Author:&lt;/b&gt; #entry.name#&lt;br /&gt;

#renderEntry(entry.body,false,entry.enclosure)#&lt;cfif len(entry.morebody)&gt; 
&lt;a href="#makeLink(entry.id)#"&gt;[Continued at Blog]&lt;/a&gt;&lt;/cfif&gt;
				
&lt;p&gt;
You are receiving this email because you have subscribed to this blog.&lt;br /&gt;
To unsubscribe, please go to this URL:
&lt;a href="#getRootURL()#unsubscribe.cfm?email=#email#&token=#token#"&gt;#getRootURL()#unsubscribe.cfm?email=#email#&token=#token#&lt;/a&gt;
&lt;/p&gt;
		&lt;/cfoutput&gt;
		&lt;/cfsavecontent&gt;
			
		&lt;cfif instance.mailserver is ""&gt;
			&lt;cfmail to="#email#" from="#instance.owneremail#" subject="#variables.utils.htmlToPlainText(htmlEditFormat(instance.blogtitle))# / #variables.utils.htmlToPlainText(entry.title)#" type="html"&gt;#theMessage#&lt;/cfmail&gt;
		&lt;cfelse&gt;
			&lt;cfmail to="#email#" from="#instance.owneremail#" subject="#variables.utils.htmlToPlainText(htmlEditFormat(instance.blogtitle))# / #variables.utils.htmlToPlainText(entry.title)#"
						server="#instance.mailserver#" username="#instance.mailusername#" password="#instance.mailpassword#" type="html"&gt;#theMessage#&lt;/cfmail&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
			
&lt;/cffunction&gt;
</code>

(Note, I removed a few lines that weren't relevant.) See the issue? Notice that I loop over the subscribers query. Remember that for my blog here, that query was 300+ users. I loop over every single user and for each, I'm generating a rendered blog entry. Imagine a blog entry with 4 code blocks in it. I ended up running ColdFish's rendering code 1200 times. Ouch. 

I rewrote the code to simply pull out the function calls, like so:

<code>
&lt;cfset var renderedText = renderEntry(entry.body,false,entry.enclosure)&gt;
&lt;cfset var theLink = makeLink(entry.id)&gt;
&lt;cfset var rootURL = getRootURL()&gt;

&lt;cfloop query="subscribers"&gt;

	&lt;cfsavecontent variable="theMessage"&gt;
	&lt;cfoutput&gt;
&lt;h2&gt;#entry.title#&lt;/h2&gt;
&lt;b&gt;URL:&lt;/b&gt; &lt;a href="#theLink#"&gt;#theLink#&lt;/a&gt;&lt;br /&gt;
&lt;b&gt;Author:&lt;/b&gt; #entry.name#&lt;br /&gt;

#renderedText#&lt;cfif len(entry.morebody)&gt;
&lt;a href="#theLink#"&gt;[Continued at Blog]&lt;/a&gt;&lt;/cfif&gt;

&lt;p&gt;
You are receiving this email because you have subscribed to this blog.&lt;br /&gt;
To unsubscribe, please go to this URL:
&lt;a href="#rooturl#unsubscribe.cfm?email=#email#&token=#token#"&gt;#rooturl#unsubscribe.cfm?email=#email#&token=#token#&lt;/a&gt;
&lt;/p&gt;
	&lt;/cfoutput&gt;
	&lt;/cfsavecontent&gt;
</code>

There are probably other ways to do this too - but I guess the important take from this is - remember to pay special attention to loops. If you see yourself running some type of function within the loop, consider pulling that out (if possible) so you don't repeat the calls.