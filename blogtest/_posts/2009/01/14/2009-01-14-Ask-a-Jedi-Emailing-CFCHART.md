---
layout: post
title: "Ask a Jedi: Emailing CFCHART"
date: "2009-01-14T23:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/14/Ask-a-Jedi-Emailing-CFCHART
guid: 3194
---

Abhishek asks:

<blockquote>
<p>
I've a doubt, what i'm doing is that i'm generating chart using
cfchart inside cfsavecontent and then i want to send the entire data of the cfsavecontent in mail using cfmail. Mail is working fine but unable to get the chart in the mail instead of that there comes red x image and in view source it is showing a path somewhat like this /CFID/GraphData.cfm?graphCache=wc5. Please give some solution.
</p>
</blockquote>
<!--more-->
Well, don't forget that, by default, when you use cfhcart you are going to get object/embed tags pointing back to your server to load a dynamic Flash SWF file. I'd be surprised if any mail client would render Flash client in context. 

You could switch to PNG of course. If you use HTML email you could then embed that image in one of two ways. One way would be to save the PNG to your web server. Your HTML email would then simply point to your web server. If the email is viewed offline then the image won't load, but that's probably not a huge concern. 

The other option is to the cfmailparam tag and an inline image. I had never used this before but the docs made it fairly simple. Here is a complete example and then I'll go over the salient points:

<code>
&lt;cfchart format="png" name="chart"&gt;
	&lt;cfchartseries type="pie"&gt;
		&lt;cfchartdata item="1Q Sales" value="500" /&gt;
		&lt;cfchartdata item="2Q Sales" value="400" /&gt;
		&lt;cfchartdata item="3Q Sales" value="700" /&gt;
		&lt;cfchartdata item="4Q Sales" value="200" /&gt;
	&lt;/cfchartseries&gt;
&lt;/cfchart&gt;

&lt;cfset savedFile = getTempFile(getTempDirectory(),"foremail") & ".png"&gt;
&lt;cfset fileWrite(savedFile,chart)&gt;

&lt;cfoutput&gt;#savedFile#&lt;/cfoutput&gt;
&lt;cfmail to="ray@camdenfamily.com" from="ray@camdenfamily.com" subject="Sales" type="html"&gt;
	&lt;cfmailparam contentID="img1" file="#savedFile#" disposition="inline"&gt;

&lt;h2&gt;Sales Figures&lt;/h2&gt;
&lt;p&gt;
Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. 
Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. 
Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. 
Lorem ipsum. Lorem ipsum. Lorem ipsum. Lorem ipsum. 
Lorem ipsum. Lorem ipsum. 
&lt;/p&gt;

&lt;img src="cid:img1" /&gt;

&lt;/cfmail&gt;
</code> 

The chart (in this case a hard coded chart) is stored into a variable using the name attribute. I save the file in the temp directory. The cfmailparam tag points to the file and provides an ID that the HTML can refer to later. Notice the image tag uses cid: instead of http:

I did test this just to make sure it actually worked, and it did (which always tends to surprise me!):

<img src="https://static.raymondcamden.com/images/Picture 132.png">