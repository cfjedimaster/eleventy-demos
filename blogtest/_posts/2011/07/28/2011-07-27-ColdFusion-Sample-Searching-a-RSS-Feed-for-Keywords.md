---
layout: post
title: "ColdFusion Sample - Searching a RSS Feed for Keywords"
date: "2011-07-28T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/07/28/ColdFusion-Sample-Searching-a-RSS-Feed-for-Keywords
guid: 4310
---

A while back I wrote a ColdFusion Sample that dealt with <a href="http://www.raymondcamden.com/index.cfm/2011/6/5/ColdFusion-Sample--Reading-a-RSS-Feed">reading RSS feeds</a>. In today's sample, I'm going to expand on that a bit and create an application that reads a RSS feed and searches for keywords. This also ties nicely in with my ColdFusion sample on <a href="http://www.coldfusionjedi.com/index.cfm/2011/6/12/ColdFusion-Sample--Building-a-daily-scheduled-report">scheduled tasks</a>. The code I show here is meant to be used as a scheduled task that can run nightly, or hourly depending on how active the RSS feed is.
<!--more-->
<p/>

Let's begin our sample with few simple variables:

<p/>

<code>
&lt;!--- Feed to scan ---&gt;
&lt;cfset rssUrl = "http://rss.cnn.com/rss/cnn_topstories.rss"&gt;
&lt;!--- Keywords ---&gt;
&lt;cfset keywords = "obama,debt"&gt;
&lt;!--- Person who gets the email ---&gt;
&lt;cfset receiver = "raymondcamden@gmail.com"&gt;
</code>

<p/>

I assume these variables are self-explanatory, but note that keywords would most likely be dynamic. I could see them being hard coded though if you are building something simple for a client. By the way, if you download this code, please change receiver. I get enough email. :) Moving on....

<p/>

<code>
&lt;cffeed action="read" source="#rssUrl#" query="entries"&gt;
&lt;cfoutput&gt;
The feed has #entries.recordcount# entries.&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

<p/>

This code grabs the RSS feed and turns it into a query. I mentioned earlier that this script would most likely be a scheduled task. That being said, there's no reason why I can't include some text in the output. Don't forget ColdFusion allows you to save the result of a scheduled task so you can look at it later. Ok, now for the fun part - the actual processing...

<p/>

<code>
&lt;cfloop index="keyword" list="#keywords#"&gt;
	
	&lt;cfquery name="getMatches" dbtype="query"&gt;
	select	title, rsslink, publisheddate
	from	entries
	where	upper(title) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#ucase(keyword)#%{% endraw %}"&gt;
	or		upper(content) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#ucase(keyword)#%{% endraw %}"&gt;
	&lt;/cfquery&gt;
	
	&lt;cfoutput&gt;
	The keyword #keyword# matched #getMatches.recordCount# entries.&lt;br/&gt;
	&lt;/cfoutput&gt;
	
	&lt;cfif getMatches.recordCount&gt;
		&lt;cfmail to="#receiver#" from="#receiver#" subject="Keyword match in RSS Feed." type="html"&gt;
		&lt;cfoutput&gt;
		&lt;h2&gt;RSS Matches Found: #keyword#&lt;/h2&gt;
		
		&lt;p&gt;
		Matches in the RSS feed for the keyword "#keyword#" have been found:
		&lt;/p&gt;
		
		&lt;ul&gt;
		&lt;cfloop query="getMatches"&gt;
			&lt;li&gt;&lt;a href="#rsslink#"&gt;#title#&lt;/a&gt;&lt;/li&gt;
		&lt;/cfloop&gt;
		&lt;/ul&gt;
		&lt;/cfoutput&gt;
		&lt;/cfmail&gt;	
	&lt;/cfif&gt;
	
&lt;/cfloop&gt;
</code>

<p>

We begin by looping over each keyword. For my report, I want one result per keyword. You could create one result instead. I just thought it would be nicer to have a separate set of results. I make use of Query of Queries to scan for my keyword. <b>Notice the upper!</b> LIKE matches in QoQ are case sensitive. By using upper in the SQL and uCase in CFML I can ensure a case-insensitive match. If we find a match, then I simply fire off an email. That's it. I ended my template with a quick "I'm done" message. Here is the entire template.

<p/>

<code>

&lt;!--- Feed to scan ---&gt;
&lt;cfset rssUrl = "http://rss.cnn.com/rss/cnn_topstories.rss"&gt;
&lt;!--- Keywords ---&gt;
&lt;cfset keywords = "obama,debt"&gt;
&lt;!--- Person who gets the email ---&gt;
&lt;cfset receiver = "raymondcamden@gmail.com"&gt;

&lt;cffeed action="read" source="#rssUrl#" query="entries"&gt;
&lt;cfoutput&gt;
The feed has #entries.recordcount# entries.&lt;br/&gt;
&lt;/cfoutput&gt;

&lt;cfloop index="keyword" list="#keywords#"&gt;
	
	&lt;cfquery name="getMatches" dbtype="query"&gt;
	select	title, rsslink, publisheddate
	from	entries
	where	upper(title) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#ucase(keyword)#%{% endraw %}"&gt;
	or		upper(content) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#ucase(keyword)#%{% endraw %}"&gt;
	&lt;/cfquery&gt;
	
	&lt;cfoutput&gt;
	The keyword #keyword# matched #getMatches.recordCount# entries.&lt;br/&gt;
	&lt;/cfoutput&gt;
	
	&lt;cfif getMatches.recordCount&gt;
		&lt;cfmail to="#receiver#" from="#receiver#" subject="Keyword match in RSS Feed." type="html"&gt;
		&lt;cfoutput&gt;
		&lt;h2&gt;RSS Matches Found: #keyword#&lt;/h2&gt;
		
		&lt;p&gt;
		Matches in the RSS feed for the keyword "#keyword#" have been found:
		&lt;/p&gt;
		
		&lt;ul&gt;
		&lt;cfloop query="getMatches"&gt;
			&lt;li&gt;&lt;a href="#rsslink#"&gt;#title#&lt;/a&gt;&lt;/li&gt;
		&lt;/cfloop&gt;
		&lt;/ul&gt;
		&lt;/cfoutput&gt;
		&lt;/cfmail&gt;	
	&lt;/cfif&gt;
	
&lt;/cfloop&gt;

&lt;cfoutput&gt;
Done processing.&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

<p/>

And here is a sample email:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip146.png" />

<p/>

Nice and simple, right? My goal for these "ColdFusion Sample" blog entries are to keep it that way. I want to provide samples in ColdFusion for common problems. That being said, you should stop reading now. What follows is superfluous, unnecessary, and just plain silly. 

<h2>Here be dragons...</h2>

Folks know I have something of a geek crush on <a href="http://www.openamplify.com">OpenAmplify</a>. What if we were to use OpenAmplify to tell us what <i>type</i> of match was found, specifically, if it was a positive or negative match. Consider this modified version:

<p/>

<code>
&lt;!--- Feed to scan ---&gt;
&lt;cfset rssUrl = "http://rss.cnn.com/rss/cnn_topstories.rss"&gt;
&lt;!--- Keywords ---&gt;
&lt;cfset keywords = "obama,debt"&gt;
&lt;!--- Person who gets the email ---&gt;
&lt;cfset receiver = "raymondcamden@gmail.com"&gt;
&lt;!--- OpenAmplify CFC ---&gt;
&lt;cfset openAmp = new openamplify("my key is better than yours, like my milkshake")&gt;

&lt;cffeed action="read" source="#rssUrl#" query="entries"&gt;
&lt;cfoutput&gt;
The feed has #entries.recordcount# entries.&lt;br/&gt;
&lt;/cfoutput&gt;

&lt;cfloop index="keyword" list="#keywords#"&gt;
	
	&lt;cfquery name="getMatches" dbtype="query"&gt;
	select	title, rsslink, publisheddate, content
	from	entries
	where	upper(title) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#ucase(keyword)#%{% endraw %}"&gt;
	or		upper(content) like &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="{% raw %}%#ucase(keyword)#%{% endraw %}"&gt;
	&lt;/cfquery&gt;
	
	&lt;cfoutput&gt;
	The keyword #keyword# matched #getMatches.recordCount# entries.&lt;br/&gt;
	&lt;/cfoutput&gt;
	
	&lt;cfif getMatches.recordCount&gt;
	
		&lt;!--- get OA values ---&gt;
		&lt;cfset queryAddColumn(getMatches,"mood","cf_sql_varchar",[])&gt;
		&lt;cfset queryAddColumn(getMatches,"moodval","cf_sql_varchar",[])&gt;
		&lt;cfloop query="getMatches"&gt;
			&lt;cfset oaResult = openAmp.parse(text=content,analysis="Styles")&gt;
			&lt;cfset moodLabel = oaResult.Styles.Polarity.Mean.Name&gt;
			&lt;cfset moodValue = oaResult.Styles.Polarity.Mean.Value&gt;
			&lt;cfset querySetCell(getMatches, "mood", moodlabel, currentRow)&gt;			
			&lt;cfset querySetCell(getMatches, "moodval", moodValue, currentRow)&gt;			
		&lt;/cfloop&gt;

		&lt;cfmail to="#receiver#" from="#receiver#" subject="Keyword match in RSS Feed." type="html"&gt;
		&lt;cfoutput&gt;
		&lt;h2&gt;RSS Matches Found: #keyword#&lt;/h2&gt;
		
		&lt;p&gt;
		Matches in the RSS feed for the keyword "#keyword#" have been found:
		&lt;/p&gt;
		
		&lt;ul&gt;
		&lt;cfloop query="getMatches"&gt;
			&lt;li&gt;&lt;a href="#rsslink#"&gt;#title#&lt;/a&gt; 
				&lt;cfif moodVal lt 0&gt;&lt;font color="red"&gt;&lt;cfelseif moodVal gt 0&gt;&lt;font color="green"&gt;&lt;cfelse&gt;&lt;font&gt;&lt;/cfif&gt;
				#mood#
				&lt;/font&gt;
			&lt;/li&gt;
		&lt;/cfloop&gt;
		&lt;/ul&gt;
		&lt;/cfoutput&gt;
		&lt;/cfmail&gt;	
	&lt;/cfif&gt;
	
&lt;/cfloop&gt;

&lt;cfoutput&gt;
Done processing.&lt;br/&gt;
&lt;/cfoutput&gt;
</code>

<p>

I'll point out the differences here. First - note I make use of the OpenAmplify CFC. (Which has been updated - please grab the download zip!) Later on, if we have matches in the RSS feed, I do a "Styles" analysis of the content from the feed. This will most likely not be very deep. It depends on how much text was in the RSS feed. You could actually tell OpenAmplify to parse the URL. Their API supports that as well. Once I have the result I grab the mean label and numerical value and simply add it to the query of results. Now look in the email. I can check those values and dynamically color based on the mood. Negative? Red. Positive? Green. Forgive me for using the font tag but it works. Here's an example of the updated email.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip147.png" />

<p/>

I've included both test templates and the new version of openamplify.cfc to the end of this blog entry.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ftempforblog%{% endraw %}2Erar'>Download attached file.</a></p>