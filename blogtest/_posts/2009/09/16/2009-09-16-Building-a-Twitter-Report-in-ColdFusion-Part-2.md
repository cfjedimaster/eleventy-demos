---
layout: post
title: "Building a Twitter Report in ColdFusion (Part 2)"
date: "2009-09-16T14:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/16/Building-a-Twitter-Report-in-ColdFusion-Part-2
guid: 3528
---

Before I begin this entry, I wanted to post a quick notice about the code in my <a href="http://www.raymondcamden.com/index.cfm/2009/9/14/Building-a-Twitter-Report-in-ColdFusion">previous entry</a>. I discovered a bug that broke the date filter. I've mentioned the fix in the comments but have <b>not</b> updated the zip. Rather, in this entry, I will include the fixed code along with the new version of the report I'll be discussing below. Even if you don't care for the new features I'm showing here, please grab the updated code if you want to run the simpler Twitter report. Thanks.
<!--more-->
In my last blog entry, I talked about how you can use the <a href="http://apiwiki.twitter.com/">Twitter API</a> within ColdFusion to create a custom report. While reading through the documentation I found something interesting. Twitter's search (both API and public) includes some cool <a href="http://search.twitter.com/operators">search operators</a>. The two that interested me the most were the attitude flags. By appending either :) or :( to a search you can return tweets that have a positive or negative attitude. This could be very useful. For a company, it could help flag tweets that need a quicker response. For trending, you can see if a marketing campaign results in higher or lower positive results. Really, the use cases for this are endless. So how can we make use of this?

Unfortunately, there isn't (as far as I know) a way to get the "attitude" rating for general searches. This means that you have to perform a separate search to get the filtered results. Give my previous code, it means we would have to follow up the 10 (at most) network requests with 10 more (at most) requests. I'd have to perform N searches for positive results and N searches for negative results. Most likely these would be far less than 10 since we can assume Twitter hasn't built the "perfect" language parser yet. I'd then have to loop over these new results and match them up with the general results. I did ask on the Twitter Dev newsgroup if there was some way to get the attitude flag on generic searches, but I've yet to hear back.

So given that a) I assume their language parsing isn't perfect anyway and b) I don't really want to do more network requests, I've come up with a simpler system. I've created a simple UDF that works with two lists - a positive and negative list. For each I populated them with common words that you see in positive or negative tweets. So for example, #fail is <i>very</i> common in complaint tweets, so that is on my list. While certainly far from perfect, it does have another advantage as well. A company, like Adobe for example, could tailor the list to their needs. So for example, "slow" could be considered a negative term in regards to ColdFusion. "buggy" as well. So a company specific Twitter report could edit the lists to include stuff like that. You could also add your competition to the negative list as well. 

So with that in mind, here is the simple UDF I built. If foul language offends you, well, you probably don't write much code. ;)

<code>
&lt;!---
I return a mood value of either: positive, negative, or I return an empty string.
I attempt to determine the mood using simple keyword checks. You can modify/improve
by editing the lists.
---&gt;
&lt;cffunction name="determineMood" output="false" returnType="string"&gt;
	&lt;cfargument name="twit" type="string" required="true"&gt;

	&lt;!--- List of positive stuff. Makes you feel warm and fuzzy. ---&gt;
	&lt;cfset var positiveList = ":),:&gt;,:-),##ftw,awesome,great"&gt;
	&lt;!--- The negative list. Here lies darkness and dispair... ---&gt;
	&lt;cfset var negativeList = ":(,##fail,sucks,sux,shit,crap"&gt;
	&lt;cfset var i = ""&gt;
	
	&lt;cfloop index="i" list="#positiveList#"&gt;
		&lt;cfif findNoCase(i, arguments.twit)&gt;
			&lt;cfreturn "positive"&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
	&lt;cfloop index="i" list="#negativeList#"&gt;
		&lt;cfif findNoCase(i, arguments.twit)&gt;
			&lt;cfreturn "negative"&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
	&lt;cfreturn ""&gt;
&lt;/cffunction&gt;
</code>

As you can see, this is extremely simply code here. Loop over each keyword in each list and leave immediately if there is a match. I do not pretend to be a language expert. But for basic checking this seems to work nice.

In my report I also added a simple counter. This then lets me parse the Twits and keep track:

<code>
&lt;cfloop index="item" array="#data.results#"&gt;
	&lt;!--- do mood scanning. ---&gt;
	&lt;cfset mood = determineMood(item.text)&gt;
	&lt;cfif mood eq "positive"&gt;
		&lt;cfset positiveCount++&gt;
		&lt;cfset item.mood = "positive"&gt;
	&lt;cfelseif mood is "negative"&gt;
		&lt;cfset negativeCount++&gt;				
		&lt;cfset item.mood = "negative"&gt;
	&lt;cfelse&gt;
		&lt;cfset item.mood = ""&gt;
	&lt;/cfif&gt;
	&lt;cfset arrayAppend(results, item)&gt;
&lt;/cfloop&gt;
</code>

I'm adding the mood before I append to my total results. Finally, I added the count to my report header and used some nice CSS to add a border to the tweets:

<code>
&lt;h2&gt;Twitter Search Results&lt;/h2&gt;
&lt;p&gt;
The following report was generated for the search term(s): #search#.&lt;br/&gt;
It contains matches found from &lt;b&gt;#dateFormat(yesterday,"mmmm dd, yyyy")#&lt;/b&gt; to now.&lt;br/&gt;
A total of &lt;b&gt;#arrayLen(results)#&lt;/b&gt; result(s) were found.&lt;br/&gt;
A total of &lt;b&gt;#positiveCount#&lt;/b&gt; positive results were found.&lt;br/&gt;
A total of &lt;b&gt;#negativeCount#&lt;/b&gt; negative results were found.&lt;br/&gt;
&lt;cfif maxFlag&gt;&lt;b&gt;Note: The maximumum number of results were found. More may be available.&lt;/b&gt;&lt;br/&gt;&lt;/cfif&gt;
&lt;cfif errorFlag&gt;&lt;b&gt;Note: An error ocurred during the report.&lt;/b&gt;&lt;br/&gt;&lt;/cfif&gt;
&lt;/p&gt;

&lt;cfloop index="x" from="1" to="#arrayLen(results)#"&gt;
	&lt;cfset twit = results[x]&gt;
	&lt;cfif x mod 2 is 0&gt;
		&lt;cfset class = "twit_even"&gt;
	&lt;cfelse&gt;
		&lt;cfset class = "twit_odd"&gt;
	&lt;/cfif&gt;
	
	&lt;!--- massage date a bit to remove +XXXX ---&gt;
	&lt;cfset twitdate = twit.created_at&gt;
	&lt;cfset twitdate = listDeleteAt(twitdate, listLen(twitdate, " "), " ")&gt;
	
	&lt;p class="#class# &lt;cfif twit.mood neq ''&gt;twit_#twit.mood#&lt;/cfif&gt;"&gt;
	&lt;img src="#twit.profile_image_url#" align="left" class="twit_profile_image"&gt;
	&lt;a href="http://twitter.com/#twit.from_user#"&gt;#twit.from_user#&lt;/a&gt; #twit.text#&lt;br/&gt;
	&lt;span class="twit_date"&gt;#twitdate#&lt;/span&gt;
	&lt;br clear="left"&gt;
	&lt;/p&gt;
&lt;/cfloop&gt;
</code>

The result is a bit large but I saved it as HTML and uploaded it <a href="http://www.coldfusionjedi.com/downloads/report2.html">here</a>. As you scroll, notice the items with the green border on the left, or the red. 

I've attached a zip of this to the blog entry. Oh, and I also added some CSS to help keep the images from being too large. Someone stop me before I turn into a designer.

Enjoy.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ftwitterreport%{% endraw %}2Ezip'>Download attached file.</a></p>