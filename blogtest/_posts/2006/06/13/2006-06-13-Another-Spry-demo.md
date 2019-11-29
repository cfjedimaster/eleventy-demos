---
layout: post
title: "Another Spry demo"
date: "2006-06-13T13:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/06/13/Another-Spry-demo
guid: 1329
---

The more I play with <a href="http://labs.adobe.com/technologies/spry/">Spry</a>, the more I like it. I'd like to show you one more demo...

<blockquote>
<a href="http://ray.camdenfamily.com/spry/blog3.cfm">http://ray.camdenfamily.com/spry/blog3.cfm</a>
</blockquote>

I've added two cool things here. First is the alt-table row colors. This is done by Spry's support for conditionals. Here is the code behind it:

<code>
&lt;tbody spry:repeat="dsEntries"&gt;
&lt;tr spry:if="({% raw %}{ds_RowNumber}{% endraw %} {% raw %}% 2) == 0" class="even" onclick="dsEntries.setCurrentRow('{ds_RowID}{% endraw %}');" &gt;
	&lt;td&gt;{% raw %}{TITLE}{% endraw %}&lt;/td&gt;
	&lt;td&gt;{% raw %}{POSTED}{% endraw %}&lt;/td&gt;
	&lt;td&gt;{% raw %}{COMMENTCOUNT}{% endraw %}&nbsp;&lt;/td&gt;
&lt;/tr&gt;
&lt;tr spry:if="({% raw %}{ds_RowNumber}{% endraw %} {% raw %}% 2) != 0" class="odd" onclick="dsEntries.setCurrentRow('{ds_RowID}{% endraw %}');" &gt;
	&lt;td&gt;{% raw %}{TITLE}{% endraw %}&lt;/td&gt;
	&lt;td&gt;{% raw %}{POSTED}{% endraw %}&lt;/td&gt;
	&lt;td&gt;{% raw %}{COMMENTCOUNT}{% endraw %}&nbsp;&lt;/td&gt;
&lt;/tr&gt;
&lt;/tbody&gt;
</code>

Notice the spry:if check. This handles checking the current row number and using a different CSS class for each row. Nice and simple. The only thing I wasn't sure about was how to use it. The <a href="http://ray.camdenfamily.com/spry/blog3.cfm">last version</a> applied the spry:repeat to the TR tag. Since I needed the condition in the TR, I wasn't sure how they would mix. One of the Spry demos showed the technique above though and it worked like a charm.

In the zip you can download from Adobe, they have a few additional examples not demonstrated on the Labs site. One is pagination. View source on the demo to see the JavaScript behind it. Just to be clear - I didn't write this. I simply cut and pasted from the example in the zip, but I'm again impressed with how simple this is. Note the use of the filter function in the xml call:

<code>
var dsEntries = new Spry.Data.XMLDataSet("blogspry.cfc?method=getentries&category={% raw %}{dsCategories::CATEGORYID}{% endraw %}", "entries/entry", {% raw %}{ filterFunc: MyPagingFunc }{% endraw %});
</code>

You can obviously filter by other methods as well. Anyway, check it out, view source, and enjoy. I didn't update the zip, but the only change to the CFC was that I upped the max number of results to 100 so that paging would actually work.