---
layout: post
title: "ColdFusion Splendor/Thunder Public Betas"
date: "2014-02-19T16:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/02/19/ColdFusion-SplendorThunder-Public-Betas
guid: 5156
---

<p>
Unless you live under a rock (or have had the <i>incredibly</i> good sense to avoid Twitter), you know that today we announced the public betas of ColdFusion Splendor (that's the next version of the server) and ColdFusion Thunder (the IDE). 
</p>
<!--more-->
<p>
You can grab the bits here: <a href="http://labs.adobe.com/technologies/coldfusion/">http://labs.adobe.com/technologies/coldfusion/</a>
</p>

<p>
Unfortunately there isn't a cool logo for the betas but as I've said for a while now that the code names sound like 1980s X-Men, I'm going with this until Adobe Legal or Marvel tells me otherwise:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Byrne-X-men-Montage-Small.jpg" />
</p>

<p>
So first off, some tips. Want to quickly see what's new? Go here: <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/New+in+ColdFusion">New in ColdFusion</a>. A more focused list is here: <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/CFML+Reference+-+New+in+Splendor">CFML Reference - New in Splendor</a>. 
</p>

<p>
So what am I excited about? Here are a few things in no particular order.
</p>

<h2>The Getting Started Server</h2>
<p>
This is a new way to try out ColdFusion. Just download, unzip, and run. No installation necessary. You can find docs <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/The+Getting+Started+Server">here</a>. Speaking of the docs - this tripped up both Adam Cameron and me. The default password for the Admin is... admin. The text file that includes the password properties shows a blank value, but apparently the logic is "if blank, use admin", which wasn't something I'd guess. 
</p>

<h2>Script Support for Tags</h2>
<p>
About. Damn. Time. So every single possible thing now is available in script. Even cfheader. Even custom tags. As an example:
</p>

<pre><code class="language-javascript">header(name="Access-Control-Allow-Origin" value="*");</code></pre>

<h2>QueryExecute</h2>
<p>
Ok, frankly, I didn't mind the "Query as a CFC" thing we had in CF9 and 10. It matched how other languages handled queries. Yes it was verbose, but honestly it didn't bug me. That being said, yeah, I'm never using it again. Now you can just use queryExecute.
</p>

<pre><code class="language-javascript">queryExecute("select beer from bar where country=:country and type=:type", {% raw %}{country:'USA', type:'IPA'}{% endraw %});</code></pre>

<h2>JSON Updates</h2>
<p>
There were a few changes here. First, structs now will preserve their case when you serialize to JSON. Nice. Second, CF will preserve the type for queries. This has been an issue for a while. In fact, I highly recommend Ben's <a href="http://www.bennadel.com/blog/2505-JsonSerializer-cfc-A-Data-Serialization-Utility-For-ColdFusion.htm">JSONSerializer</a> as a way to completely bypass JSON serialization in ColdFusion 10. (Well, if you run into issues of course.) It looks like this may finally(?) be licked in Splendor. Please check it out.
</p>

<p>
Finally, the way ColdFusion serializes queries has been updated to support a new struct form. The docs specifically call out jQuery (sigh), but obviously this applies to ANY JavaScript code. Here is an example output with the new form.
</p>

<pre><code class="language-javascript">[
 {% raw %}{"colour":"red","id":1}{% endraw %},
 {% raw %}{"colour":"green","id":2}{% endraw %},
 {% raw %}{"colour":"blue","id":3}{% endraw %}
]</code></pre>

<p>
You can read about the above changes <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/ColdFusion+Language+Enhancements#ColdFusionLanguageEnhancements-JSONserialization">here</a>.
</p>

<p>
One more quick note. The <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/REST+Enhancements">REST Enhancements</a> docs talk about how you can customize the serializer/deserializer. <strong>This is NOT for REST only!</strong> I just did a test where I simply ran serializeJSON on a CF variable in a simple CFM and my custom serializer was used.
<h2>Member Functions</h2>
<p>
So yeah... do you find yourself typing somearr.length() instead of arrayLen(somearr.length)? Now you can do somearr.len(). Member functions have been added all over the place - for arrays, strings, lists, structs, dates, images, spreadsheets, XML objects, and queries.
</p>

<h2>QueryGetRow</h2>
<p>
How many times have I written code to loop over the first row of a one row query to turn it into a struct? Too many times. <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/ColdFusion+Language+Enhancements#ColdFusionLanguageEnhancements-SupportforQueryGetRowNew">Done</a>.
</p>

<h2>DDX - 100%</h2>
<p>
Ok, DDX isn't sexy but I thought it was a cool feature even when it was limited. Now it isn't. Awesome.
</p>

<h2>Oh, and...</h2>
<p>
I've been very public about not being a fan of ColdFusion Builder. I think it is an <strong>incredible</strong> tool and a great IDE. But I'm doing much more client-side development lately and CFB hasn't been very good for that. I can say the new version actually does HTML/JS pretty darn good. Is it enough to make me switch? Probably not. But I currently use Sublime for ColdFusion and I may stop and return to CFB when working with ColdFusion. It is still Eclipse - which roughly feels like the 40-year-old guy at the college bar trying to look cool - but I'm going to give it a shot.
</p>