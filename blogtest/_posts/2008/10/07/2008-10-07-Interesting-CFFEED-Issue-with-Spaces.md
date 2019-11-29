---
layout: post
title: "Interesting CFFEED Issue with Spaces"
date: "2008-10-07T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/07/Interesting-CFFEED-Issue-with-Spaces
guid: 3046
---

Heh, yes, I'm back to my favorite tag to pick on. A user sent in an interesting problem he was having with cffeed. When he used a value for the source that came from a query, he got an error. When he hard coded a URL in, it worked just fine. I looked over his code and as far as I could see, everything seemed fine. The error itself was pretty weird as well:
<!--more-->
<blockquote>
<p>
Unable to read the feed source file /Users/ray/Documents/Web Sites/webroot/http:/rss.news.yahoo.com/rss/mideast 
</p>
</blockquote>

As you can see, the feed url (http://rss.news.yahoo.com/rss/mideast) was somehow being munged into a local path. I added a debug statement to the output and then I noticed it. A slight space between my debug line and the actual value. Turned out the data from the query had an extra white space in front of the URL. You can reproduce this problem yourself with the following code:

<code>
&lt;cfset theURL = " http://rss.news.yahoo.com/rss/mideast"&gt;

&lt;cffeed action="read" source="#theURL#" properties="meta" query="items"&gt;
&lt;cfdump var="#items#"&gt;
</code>

Most likely the data was based on user input and he forgot to trim before entering the data into the database. It was easy enough to fix of course:

<code>
&lt;cfset theURL = " http://rss.news.yahoo.com/rss/mideast"&gt;

&lt;cffeed action="read" source="#trim(theURL)#" properties="meta" query="items"&gt;
&lt;cfdump var="#items#"&gt;
</code>