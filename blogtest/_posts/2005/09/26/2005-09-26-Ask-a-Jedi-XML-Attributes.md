---
layout: post
title: "Ask a Jedi: ColdFusion and XML Attributes"
date: "2005-09-26T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/26/Ask-a-Jedi-XML-Attributes
guid: 809
---

Chris asks:

<blockquote>
Can CF7 read this type of XML entry?  I'm having problems reading it...

&lt;Bios name="Phoenix ROM BIOS PLUS Version 1.10 A04" date="(17-May-2004)"/&gt;
</blockquote>

So I knew the answer to this was yes, but to be sure, I wrote up a quick test case:

<code>
&lt;cfxml variable="test"&gt;
&lt;Bios name="Phoenix ROM BIOS PLUS Version 1.10 A04" date="(17-May-2004)"/&gt;
&lt;/cfxml&gt;

&lt;cfdump var="#test#"&gt;
</code>

This dumped the XML just fine, and revealed the hint that Chris probably needed to read the data. The name and date value exist in the xmlAttributes key. So in order to get those specific values (assuming he has already created an XML object called test, as I did above), he could use the following code:

<code>
&lt;cfoutput&gt;
Name: #test.bios.xmlAttributes.name#&lt;br/&gt;
Date: #test.bios.xmlAttributes.date#&lt;br/&gt;
&lt;/cfoutput&gt;
</code>