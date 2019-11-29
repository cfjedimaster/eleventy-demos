---
layout: post
title: "Do you have to use a remote source for Spry datasets?"
date: "2007-03-02T14:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/03/02/Do-you-have-to-use-a-remote-source-for-Spry-datasets
guid: 1875
---

A user on cf-talk today <a href="http://www.houseoffusion.com/groups/CF-Talk/message.cfm/messageid:271337">posted</a> about a problem he was having with Spry. He had tested with an XML file, but then he switched to passing an XML string directly to Spry:

<code>
&lt;script&gt;
var dsTasks = new Spry.Data.XMLDataSet("&lt;cfoutput&gt;#tasks#&lt;/cfoutput&gt;","tasks/task");
&lt;/script&gt;
</code>

This isn't valid. However, there is a way to do this in Spry. Simply create your dataset with a null url:

<code>
var dsTasks = new Spry.Data.XMLDataSet(null, "tasks/task");
</code>

Then create an XML object out of your string:

<code>
var xmlDOMDocument = Spry.Utils.stringToXMLDoc(xmlStr);
</code>

Finally, tell the dataset to use your XML object as the data:

<code>
dsTasks.setDataFromDoc(xmlDOMDocument);
</code>

A live example of this may be found here:

<a href="http://labs.adobe.com/technologies/spry/samples/data_region/XMLStringSample.html">http://labs.adobe.com/technologies/spry/samples/data_region/XMLStringSample.html</a>