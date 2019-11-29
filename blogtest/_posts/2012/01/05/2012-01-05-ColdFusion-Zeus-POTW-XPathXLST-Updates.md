---
layout: post
title: "ColdFusion Zeus POTW - XPath/XLST Updates"
date: "2012-01-05T16:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/01/05/ColdFusion-Zeus-POTW-XPathXLST-Updates
guid: 4483
---

For the most part, I try to avoid XML. I almost always go towards using JSON - both as a consumer and a producer. That being said, probably the only thing I find cool about XML is XPath and XSLT. I haven't used XSLT much, but XPath can be a real useful tool. It allows you to perform queries against XML data (something you can't do with JSON as far as I know). In ColdFusion Zeus, we've upgraded both XSLT and Xpath to version 2 of the specification. Here's some details on this update.
<!--more-->
<p>

First off - if you want to know everything about XPath2, you can hit up a few URLs to do some deep research:

<p>

<ul>
<li><a href="http://www.w3.org/TR/xpath20/">Official Spec</a> (exciting! read it to your kids! you won't put it down!)
<li><a href="http://en.wikipedia.org/wiki/XPath_2.0">Wikipedia entry</a> (much simpler, skip the one above and read this one)
<li><a href="http://www.xml.com/pub/a/2002/03/20/xpath2.html">What's new in XPath2</a> (from XML.com)
</ul>

<p>

Now that you've read up, let's look at a few examples. First, our sample XML.

<p>

<code>
&lt;?xml version="1.0" encoding="ISO-8859-1"?&gt;
&lt;bookstore&gt;
&lt;book&gt;
&lt;title lang="eng"&gt;Harry Potter&lt;/title&gt;
&lt;price&gt;29.99&lt;/price&gt;
&lt;pages&gt;200&lt;/pages&gt;
&lt;released&gt;2001-01-01&lt;/released&gt;
&lt;/book&gt;
&lt;book&gt;
&lt;title lang="eng"&gt;Learning XML&lt;/title&gt;
&lt;price&gt;39.95&lt;/price&gt;
&lt;pages&gt;100&lt;/pages&gt;
&lt;released&gt;2003-01-01&lt;/released&gt;
&lt;/book&gt;
&lt;book&gt;
&lt;title lang="eng"&gt;Learning JSON&lt;/title&gt;
&lt;price&gt;49.95&lt;/price&gt;
&lt;pages&gt;22&lt;/pages&gt;
&lt;released&gt;2003-01-01&lt;/released&gt;
&lt;/book&gt;
&lt;cd&gt;
&lt;title lang="eng"&gt;The Downward Spiral&lt;/title&gt;
&lt;price&gt;39.95&lt;/price&gt;
&lt;released&gt;2009-01-01&lt;/released&gt;
&lt;/cd&gt;
&lt;/bookstore&gt;
</code>

<p>

The primary place XPath2 is updated (at least from what I can tell) is in terms of all the functions that are supported. So for example, you can do a date function search like so:

<p>

<code>
&lt;cfset booksAfter2002 = xmlSearch(xmlDoc,"/bookstore/book[year-from-date(released) &gt; 2002]")&gt;
&lt;cfdump var="#booksAfter2002#" label="Books after 2002"&gt;
</code>

<p>

You can also do interesting math on the XML:

<p>

<code>
&lt;cfset minpages = xmlSearch(xmlDoc,"/bookstore/book[pages=min(/bookstore/book/pages)]")&gt;
&lt;cfdump var="#minpages#" label="Min Pages"&gt;

&lt;cfset maxprice = xmlSearch(xmlDoc,"/bookstore/book[price=max(/bookstore/book/price)]")&gt;
&lt;cfdump var="#maxprice#" label="Max Price"&gt;

&lt;cfset avgprice = xmlSearch(xmlDoc,"avg(/bookstore/book/price)")&gt;
&lt;cfoutput&gt;Average price: #dollarFormat(avgprice)#&lt;p&gt;&lt;/cfoutput&gt;
</code>

<p>

The first returns the book with the fewest pages, the second the one with the highest price. They both return the full XML node so you have access to the entire block of data. The last one returns an average price for the books: $39.96

<p>

How about regular expressions? That works too:

<p>

<code>
&lt;cfset regex = xmlSearch(xmlDoc,"/bookstore/book[matches(title,""L*arning"")]")&gt;
&lt;cfdump var="#regex#" label="Regex"&gt;
</code>

<p>

Sorry that isn't the best regex in the world, but you get the idea. Finally, you can even build expressions that take attributes:

<p>

<code>
&lt;cfscript&gt;
	params = {% raw %}{"test"="cd"}{% endraw %};
&lt;/cfscript&gt;
&lt;!--- find all nodes with element name as passed by  variable test ---&gt;
&lt;cfset result = xmlsearch(xmldoc,"/bookstore/*[local-name() eq $test]", params)&gt;
&lt;cfdump var="#result#"&gt;
</code>

<p>

You get the idea. Please note the XSLT has also been updated. Frankly I don't know enough about XSLT 2 to comment on this, but overall, it's a good improvement to ColdFusion's built in XML support.