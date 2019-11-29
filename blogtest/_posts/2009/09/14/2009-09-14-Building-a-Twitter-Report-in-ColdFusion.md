---
layout: post
title: "Building a Twitter Report in ColdFusion"
date: "2009-09-14T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/14/Building-a-Twitter-Report-in-ColdFusion
guid: 3524
---

For a while now I've made use of a service called <a href="http://www.twilert.com">Twilert</a>. The site has one simple purpose. It allows you to create Twitter search profiles and
generate an email report to you daily (or weekly, etc). I thought it might be interesting to look at how difficult this would be to build in ColdFusion. Luckily Twitter goes a <i>long</i>
way to providing both a simple to use API and a very <i>powerful</i> API as well. Here's what I came up with - and hopefully this can be useful to others.
<!--more-->
First - let me define what I want to build. Like the Twilert service, I'll start with a set of search terms. I'll perform my search daily via a scheduled task that runs right past midnight
and then delivers the report to me via email. The Twitter API is very nicely <a href="http://apiwiki.twitter.com/">documented</a>. In particular, the <a href="http://apiwiki.twitter.com/Twitter-Search-API-Method%3A-search">Search</a> API is the one we care about. Also of note are the <a href="http://apiwiki.twitter.com/Rate-limiting">rate limits</a> Twitter applies. While my code won't hit that limit, it is something to keep in mind. I'd suggest spending a few minutes scanning all of the previous links to get a feel
for the Twitter API and what is supports. Now that you've done done (ok, be honest, if you are like me, you probably decided to skip it and read it later), let's start to build out our
report generator.

First, the search term. This could be dynamic, perhaps based on the URL, which would then make it easy to set up a few scheduled tasks, each with different values. For now though I just hard coded it:

<code>
&lt;!--- Search terms, max 140, minus date portion ---&gt;
&lt;cfset search = "coldfusion"&gt;
</code>

Twitter supports basic AND/OR style searches as well. But I'll keep it simple and just one word. Now, I mentioned the rate limits before. Another thing to note is that when you perform a search, you can only return 100 results at one time. Twitter supports a Page attribute, but they limit you to 15 pages. That's 1500 results which seems a bit much, especially for an email. I created a variable to represent the total number of network requests, or pages, of data to get:

<code>
&lt;!--- Max number of HTTP requests ---&gt;
&lt;cfset maxRequests = 10&gt;
</code>

For the most part, this is pretty arbitrary. If I got an email with 1000 results in it I doubt I'd read past the first twenty or so. Obviously this is something you can change to your
liking, within the limits of Twitter's API. 

<code>
&lt;!--- current page ---&gt;
&lt;cfset page = 1&gt;

&lt;!--- max results per page is 100 ---&gt;
&lt;cfset max = 100&gt;
</code>

The page variable just tracks the current page and max will be sent to Twitter to request the maximum amount of results possible. 

<code>
&lt;!--- Loop until we run out of results or hit maxRequests. Use a simple boolean to check both ---&gt;
&lt;cfset done = false&gt;

&lt;!--- A flag to see if something went wrong. ---&gt;
&lt;cfset errorFlag = false&gt;

&lt;!--- A flag to determine if we maxed out our search ---&gt;
&lt;cfset maxFlag = false&gt;
</code>

These three variables are just flags. I'll be using the done variable in a loop coming up. The errorFlag will notice if something goes wrong with one of the HTTP calls. The maxFlag
will be used if we hit the maximum number of requests. 

<code>
&lt;!--- append yesterdays date to the search url ---&gt;
&lt;cfset yesterday = dateAdd("d", -1, now())&gt;
&lt;cfset searchURL = search & " since:#dateFormat(yesterday,'yyyy-mm-dd')#"&gt;
&lt;cfset searchURL = urlEncodedFormat(search)&gt;
</code>

Next up we add the date filter to our search terms. Remember I'm running this every day so I want to limit the results to entries from yesterday. This is done with the since operator. Twitter also supports an until operator, but as I plan on running this report right past midnight, it won't matter. (You can see a good report of all the operators <a href="http://search.twitter.com/operators">here</a>.)

<code>
&lt;cfset results = []&gt;
</code>

The last bit of code before we actually begin to search is to create the array that will store our results. Ok - so everything so far was setup - now let's look at the actual search:

<code>
&lt;cfloop condition="not done"&gt;
	
	&lt;cfhttp url="http://search.twitter.com/search.json?page=#page#&rpp=#max#&q=#searchURL#" result="result"&gt;

	&lt;cfif result.responseheader.status_code is "200"&gt;
		&lt;cfset content = result.fileContent.toString()&gt;
		&lt;cfset data = deserializeJSON(content)&gt;

		&lt;cfloop index="item" array="#data.results#"&gt;
			&lt;cfset arrayAppend(results, item)&gt;
		&lt;/cfloop&gt;
		&lt;cfif structKeyExists(data, "next_page")&gt;
			&lt;cfset page++&gt;
			&lt;cfif page gt maxRequests&gt;
				&lt;cfset maxFlag = true&gt;
				&lt;cfset done = true&gt;
			&lt;/cfif&gt;
		&lt;cfelse&gt;
			&lt;cfset done = true&gt;
		&lt;/cfif&gt;
	&lt;cfelse&gt;
		&lt;cfset errorFlag = true&gt;
		&lt;cfset done = true&gt;
	&lt;/cfif&gt;
	
&lt;/cfloop&gt;
</code>

Ok, let me describe this line by line. The loop will continue until the done variable is true. In each iteration I use cfhttp to hit Twitter. Notice that I ask for JSON back, pass in both page and max, and pass in my search query. 

If the result status is 200, it should be good. I get the content and deserialize the JSON. I loop through each result and simply append it to the global results array. If the result JSON contains a next_page value, then more data exists. I do a check first though to see that I've not made too many requests. Lastly, I've got an ELSE block for times when the status wasn't 200. I could add additional logging here, but for now I just use the simple error flag. 

Now that we have results, let's begin the display portion:

<code>
&lt;!--- prepare result ---&gt;
&lt;cfsavecontent variable="report"&gt;
&lt;cfoutput&gt;
&lt;style&gt;
h2, p, .twit_date {% raw %}{ font-family: Verdana, Geneva, Arial, Helvetica, sans-serif; }{% endraw %}

.twit_date {% raw %}{ font-size: 10px; }{% endraw %}

.twit_odd {
	padding: 10px;
}
.twit_even {
	padding: 10px;
	background-color: ##f0f0f0;
}
&lt;/style&gt;
</code>

I've begun my display with a cfsavecontent. The reason for this is that I considered also generating a PDF report as well. I didn't end up doing it, but since I'll have my report in a 
nice variable, I'll be able to do just about anything with it. I then put on my designer hat (it has stars on it) and whipped up some simple CSS I'll use later. <i>Please</i> feel free
to send suggestions on nicer CSS. 

<code>
&lt;h2&gt;Twitter Search Results&lt;/h2&gt;
&lt;p&gt;
The following report was generated for the search term(s): #search#.&lt;br/&gt;
It contains matches found from &lt;b&gt;#dateFormat(yesterday,"mmmm dd, yyyy")#&lt;/b&gt; to now.&lt;br/&gt;
A total of &lt;b&gt;#arrayLen(results)#&lt;/b&gt; result(s) were found.&lt;br/&gt;
&lt;cfif maxFlag&gt;&lt;b&gt;Note: The maximumum number of results were found. More may be available.&lt;/b&gt;&lt;br/&gt;&lt;/cfif&gt;
&lt;cfif errorFlag&gt;&lt;b&gt;Note: An error ocurred during the report.&lt;/b&gt;&lt;br/&gt;&lt;/cfif&gt;
&lt;/p&gt;
</code>

Next up is a simple header. I report on the search term, the date, number of results, and on my flags. 

<code>
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
	
	&lt;p class="#class#"&gt;
	&lt;img src="#twit.profile_image_url#" align="left"&gt;
	&lt;a href="http://twitter.com/#twit.from_user#"&gt;#twit.from_user#&lt;/a&gt; #twit.text#&lt;br/&gt;
	&lt;span class="twit_date"&gt;#twitdate#&lt;/span&gt;
	&lt;br clear="left"&gt;
	&lt;/p&gt;
&lt;/cfloop&gt;
</code>

Now I loop over each Twit. Twitter reports a variety of fields for each result. I decided to only care about the time, the user (and his or her profile image), and the text. Please keep in
mind though that there is even more information in the results. This is what I decided was important. The display is rather simple. Profile picture to the left, name and text on top, and the formatted date below it. (FYI: Notice the x mod 2 if clause there? I actually had the ColdFusion 9 ternary clause first and it was a lot slimmer. I know I could switch it to IIF but I hate that function.)

<code>
&lt;/cfoutput&gt;
&lt;/cfsavecontent&gt;

&lt;cfoutput&gt;#report#&lt;/cfoutput&gt;
</code>

The final bits simply close up our tags and then output to screen. So I did lie a bit - I don't actually email the report, but as you can imagine, that would take about two seconds. I'd just wrap the report result in cfmail tags. I've got a few ideas on how to make this report even slicker. That will be in the next entry. So - is this useful? I could imagine this being a great way for a business to automate monitoring of their name and products. 

You can download the full bits below.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Freport%{% endraw %}2Ezip'>Download attached file.</a></p>