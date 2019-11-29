---
layout: post
title: "Followup to XML Post"
date: "2007-11-13T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/13/Followup-to-XML-Post
guid: 2470
---

Yesterday I wrote a <a href="http://www.raymondcamden.com/index.cfm/2007/11/12/When-is-XML-not-XML">post</a> about an issue I found with isXML. Lots of good suggestions/ideas were posted in the comments, including one by Rick O which seems to have nailed down the issue. Basically, if you have an invalid tag within a CDATA block, ColdFusion will report the XML as being invalid. The <a href="http://www.w3schools.com/xml/xml_cdata.asp">specs</a> say (from what I found), that anything should be allowed in CDATA. It seems like this would be a bug in ColdFusion. Here is a simple sample:

<code>
&lt;cfsavecontent variable="test"&gt;
&lt;foo&gt;
&lt;![CDATA[
&lt;b&gt;fdoo&lt;/i
]]&gt;
&lt;/foo&gt;
&lt;/cfsavecontent&gt;

&lt;cfoutput&gt;#isxml(test)#&lt;/cfoutput&gt;
</code>

The bad I tag at the end is enough to break ColdFusion's isXML function. 

Something to look out - and of course - don't forget the issues with xmlFormat as well. xmlFormat will ignore "high" characters (like funky Microsoft quotes) resulting in XML that won't be valid. My <a href="http://www.coldfusionjedi.com/projects/toxml/">toXML</a> CFC has it's own xmlFormat function that tries to get around this.