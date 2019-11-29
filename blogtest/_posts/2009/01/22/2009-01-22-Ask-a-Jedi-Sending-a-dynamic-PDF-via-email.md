---
layout: post
title: "Ask a Jedi: Sending a dynamic PDF via email"
date: "2009-01-22T13:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/22/Ask-a-Jedi-Sending-a-dynamic-PDF-via-email
guid: 3204
---

Chas asked:

<blockquote>
<p>
Thanks for your great series on working with PDFs.  I have a question I hope you can help me with.  I want to create a PDF (simple enough using cfdocument) but then I would like to email it without having to write it disk using a filename.  I can create it and save to "name", but I can't seem to be able to use that in the cfmailparam.  Any way to generate a PDF and email it on the fly?
</p>
</blockquote>

Turns out this is rather simple, if you are using ColdFusion 8.0.1. CF801 added the ability to use cfmailparam to attach files stored in a variable. For example:

<code>
&lt;cfdocument format="pdf" name="pdfdoc"&gt;
&lt;h1&gt;Snazzy PDF&lt;/h1&gt;
	
Here is your cool PDF that is dynamic: &lt;cfoutput&gt;#randRange(1,100)#&lt;/cfoutput&gt;
&lt;/cfdocument&gt;

&lt;cfmail to="ray@camdenfamily.com" from="foo@foo.com" subject="Your PDF"&gt;
&lt;cfmailparam file="doc.pdf" content="#pdfdoc#"&gt;
Attached please find your cool PDF. Enjoy!
&lt;/cfmail&gt;

Done.
</code>

The first part of the template creates a simple dynamic PDF. Then I mail it to myself. Note that cfmailparam uses both file and content attributes. The content will be the actual data attached to the email while the file attribute will be used for the file name.

In case you are wondering why this isn't in the docs, or why I didn't do this in my <a href="http://www.raymondcamden.com/index.cfm/2009/1/14/Ask-a-Jedi-Emailing-CFCHART">'emailing cfchart'</a> blog post, it is simply the fact that the main docs have not been updated for 8.0.1. You will be able to find this documented, along with everything else new, in the 8.0.1 release notes: <a href="http://www.adobe.com/support/documentation/en/coldfusion/releasenotes.html#801">http://www.adobe.com/support/documentation/en/coldfusion/releasenotes.html#801</a>