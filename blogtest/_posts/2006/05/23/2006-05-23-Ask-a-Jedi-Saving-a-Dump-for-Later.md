---
layout: post
title: "Ask a Jedi: Saving a Dump for Later"
date: "2006-05-23T18:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/23/Ask-a-Jedi-Saving-a-Dump-for-Later
guid: 1287
---

Ok, I have to admit - the four year old in me wrote that title. The cfdump is the single most useful tag in ColdFusion. But what if you want to use it and store the result for later? Don't forget one of the other extremely useful ColdFusion tags: cfsavecontent. For example:

<code>
&lt;cfsavecontent variable="thedump"&gt;
&lt;cfdump var="#application#" label="The Application Scope"&gt;
&lt;/cfsavecontent&gt;
</code>

This will take the entire dump and store the result in a string named thedump. Then you can use cffile to save it to the file system. If you do, I'd suggest saving it as an HTML file since cfdump contains a <i>lot</i> of HTML. Kind of like how the galaxy has a lot of stars. You can also cfmail it as well. Just remember to use HTML mail.