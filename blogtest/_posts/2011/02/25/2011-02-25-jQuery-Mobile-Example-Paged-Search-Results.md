---
layout: post
title: "jQuery Mobile Example - Paged Search Results"
date: "2011-02-25T13:02:00+06:00"
categories: [coldfusion,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/02/25/jQuery-Mobile-Example-Paged-Search-Results
guid: 4139
---

A reader asked me earlier this week if I could show an example of search, with paged results, under the <a href="http://www.jquerymobile.com">jQuery Mobile</a> framework. I whipped up a simple demo in five or so minutes. This is not a testament to my coding ability, but rather to just how fracking cool jQuery Mobile is. Before I begin though so important disclaimers. This was built using jQuery Mobile Alpha 3. If you are currently wearing a jetpack then you are reading this in the future and should expect that the code I show here may not quite work the same in the final version of jQuery Mobile. Also - I've been using jQuery Mobile for all of one month. Take my "solution" with a huge grain of salt. Make that two grains just to be safe. Ok, enough with the disclaimers, let's get to work.
<!--more-->
<p>

I began by creating a simple home page for my demo. (Note - I'm not going to cover every little detail of how jQuery Mobile works here - for that, please consult the <a href="http://jquerymobile.com/demos/1.0a3/">docs</a>.) 

<p>

<code>
&lt;!DOCTYPE html&gt; 
&lt;html&gt; 
	&lt;head&gt; 
	&lt;title&gt;Search Art&lt;/title&gt; 
	&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a3/jquery.mobile-1.0a3.min.css" /&gt;
	&lt;script src="http://code.jquery.com/jquery-1.5.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://code.jquery.com/mobile/1.0a3/jquery.mobile-1.0a3.min.js"&gt;&lt;/script&gt;
&lt;/head&gt; 
&lt;body&gt; 

&lt;div data-role="page" data-theme="e"&gt;

	&lt;div data-role="header"&gt;
		&lt;h1&gt;Art Search&lt;/h1&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;div data-inline="true"&gt;
		&lt;form action="search.cfm" method="post"&gt;
		&lt;input type="search" name="search" data-inline="true"&gt; &lt;input type="submit" value="Search" data-inline="true"&gt;
		&lt;/form&gt;
		&lt;/div&gt;
	&lt;/div&gt;

&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

You can see I include the relevant libraries on top and my content is really just a simple form. The search form type isn't supported by all clients, but jQuery Mobile (jqm from now on) has unicorn magic and can make it work pretty much anywhere:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip31.png" />

<p>

So - notice the form posts to search.cfm. Let's look at that.

<p>

<code>

&lt;cfparam name="url.search" default=""&gt;
&lt;cfparam name="form.search" default="#url.search#"&gt;
&lt;cfparam name="url.start" default="1"&gt;
&lt;cfset perpage = 10&gt;
&lt;cfif len(trim(form.search))&gt;
	&lt;cfset search = "{% raw %}%" & trim(form.search) & "%{% endraw %}"&gt;
	&lt;cfquery name="getart"&gt;
	select 	artname, price, description
	from	art
	where	artname like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#search#"&gt;
	or		description like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#search#"&gt;
	&lt;/cfquery&gt;
&lt;cfelse&gt;
	&lt;cfset noSearch = true&gt;
&lt;/cfif&gt;
&lt;cfif not isNumeric(url.start) or url.start lte 0 or round(url.start) neq url.start&gt;
	&lt;cfset url.start = 1&gt;
&lt;/cfif&gt;

&lt;div data-role="page" data-theme="e"&gt;

	&lt;div data-role="header"&gt;
		&lt;a href="" data-rel="back"&gt;Back&lt;/a&gt;
		&lt;h1&gt;Search Results&lt;/h1&gt;
		&lt;a href="index.cfm" data-theme="b"&gt;Home&lt;/a&gt;
	&lt;/div&gt;

	&lt;div data-role="content"&gt;	
		&lt;cfif structKeyExists(variables,"noSearch")&gt;
			&lt;p&gt;
			Please &lt;a href="index.cfm"&gt;enter a search&lt;/a&gt; term.
			&lt;/p&gt;
		&lt;cfelseif getart.recordCount is 0&gt;
			&lt;cfoutput&gt;
			&lt;p&gt;
			Sorry, there were no results for #form.search#.
			&lt;/p&gt;
			&lt;/cfoutput&gt;
		&lt;cfelse&gt;
			&lt;cfloop query="getart" startrow="#url.start#" endrow="#url.start+perpage-1#"&gt;
				&lt;cfoutput&gt;
				&lt;p&gt;
				#currentrow# &lt;b&gt;#artname#&lt;/b&gt;
				#description#
				&lt;/p&gt;
				&lt;/cfoutput&gt;
			&lt;/cfloop&gt;

			&lt;div data-inline="true"&gt;
			&lt;cfoutput&gt;
			&lt;cfif url.start gt 1&gt;
				&lt;a href="search.cfm?search=#urlEncodedFormat(form.search)#&start=#max(1,url.start-perpage)#" data-role="button" data-inline="true"&gt;Previous&lt;/a&gt;
			&lt;cfelse&gt;
				&lt;!--- Didn't work... &lt;a href="" data-role="button" disabled data-inline="true"&gt;Previous&lt;/a&gt;---&gt;
			&lt;/cfif&gt;
			&lt;cfif url.start+perpage-1 lt getart.recordCount&gt;
				&lt;a href="search.cfm?search=#urlEncodedFormat(form.search)#&start=#url.start+perpage#" data-role="button" data-theme="b" data-inline="true"&gt;Next&lt;/a&gt;
			&lt;cfelse&gt;
				&lt;!--- See above...
				&lt;a href="" data-role="button" data-theme="b" disabled data-inline="true"&gt;Next&lt;/a&gt;
				---&gt;
			&lt;/cfif&gt;	
			&lt;/cfoutput&gt;
			&lt;/div&gt;		
			

		&lt;/cfif&gt;
	&lt;/div&gt;
	
&lt;/div&gt;
</code>

<p>

Ok, we've got a bit more going on here then before. The top portion handles my search. I'm using ColdFusion (of course), but any server side language would suffice. Scroll on down to inside the div with the data-role content. My first two IF blocks handle no search or no results. The final block handles outputting the results. For my pagination I used the same old code I've used in the past. The only difference is that I made use of JQM's ability to automatically turn links into buttons. For the most part this works really well. What did not work for me, and you can see it commented out above, was passing a "disabled" along. I probably could have simply used a 'grey' theme for my buttons. But for now I simply hid them. Here is an example:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip32.png" />

<p>

Not bad, right? You can demo this here:

<p>

<a href="http://www.coldfusionjedi.com/demos/feb252011/"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

For the most part, I think you see that nothing special was done to make this work. JQM does so much of the work for you that I literally just had to use the right markup to get it to look pretty. If you test this in your browser, mobile or not, you will see my form post, and navigation, is all being done via Ajax. Do you see any JavaScript in my code? Any? Nope? That's right. jQuery Mobile is so powerful it could even defeat Chuck Norris probably.  I decided to kick things up a notch though and work on a slightly sexier version...

<p>

<a href="http://www.coldfusionjedi.com/demos/feb252011/index2.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

This version was done using simple UL tags. You can view source to see it yourself. It's an incredibly small modification. The detail page you see took an additional 2 minutes of work.