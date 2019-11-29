---
layout: post
title: "New features in Spry"
date: "2006-07-14T10:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/07/14/New-features-in-Spry
guid: 1401
---

Here is a quick look at some new features in Spry. I modified my older <a href="http://www.cflib.org/spry/index.cfm">CFLib Spry</a> demo to show off a few new things. You can find the new demo here:

<blockquote>
<a href="http://www.cflib.org/spry/index2.cfm">http://www.cflib.org/spry/index2.cfm</a>
</blockquote>

So what is new? First off, notice the status messages as the page loads and you change categories. If you view source on the <a href="http://www.cflib.org/spry/index2.cfm">older demo</a>, you will see some fancy JavaScript being used to handle that. How is it done now? By just using the spry:state block. Consider this code block:
<!--more-->
<code>
&lt;div id="Libraries_DIV" spry:region="dsLibraries" class="box"&gt;
	&lt;h2&gt;Libraries&lt;/h2&gt;
	
	&lt;select id="Libraries_Table" onchange="dsLibraries.setCurrentRow(this.selectedIndex);document.filterForm.filter.value='';"&gt;
		&lt;option spry:repeat="dsLibraries" id="{% raw %}{ID}{% endraw %}"&gt;{% raw %}{NAME}{% endraw %}&lt;/option&gt;
	&lt;/select&gt;
	
	&lt;div class="loading" spry:state="loading"&gt;Loading ...&lt;/div&gt;
		
&lt;/div&gt;
</code>

By using spry:state="loading" on the region, I don't have to worry about showing or hiding the block. It is done for me with Spry. Spry supports the following states: loading, error, ready. You can also build in your own custom states as well. So for example, maybe you have a call that performs a search for records. You could create a custom state for the state where no records were returned. You can also bind a state to multiple datasets. That way you could use one error handler for all your dynamic regions.

The second new feature is simple but powerful. Consider this old code to handle even/odd states in the table:

<code>
&lt;tr spry:if="({% raw %}{ds_RowNumber}{% endraw %} {% raw %}% 2) == 0" class="even" onclick="dsUDFs.setCurrentRow('{ds_RowID}{% endraw %}');" &gt;
	&lt;td&gt;{% raw %}{NAME}{% endraw %}&lt;/td&gt;
	&lt;td&gt;{% raw %}{CATNAME}{% endraw %}&lt;/td&gt;
	&lt;td&gt;{% raw %}{LASTUPDATED}{% endraw %}&lt;/td&gt;
&lt;/tr&gt;
&lt;tr spry:if="({% raw %}{ds_RowNumber}{% endraw %} {% raw %}% 2) != 0" class="odd" onclick="dsUDFs.setCurrentRow('{ds_RowID}{% endraw %}');" &gt;
	&lt;td&gt;{% raw %}{NAME}{% endraw %}&lt;/td&gt;
	&lt;td&gt;{% raw %}{CATNAME}{% endraw %}&lt;/td&gt;
	&lt;td&gt;{% raw %}{LASTUPDATED}{% endraw %}&lt;/td&gt;
&lt;/tr&gt;
</code>

While this worked, it was a bit of a pain to update column names since you needed to do it in two places. Now there is a way to simply get the even/odd state of the current row: {% raw %}{ds_EvenOddRow}{% endraw %}. This is the new version of the above code:

<code>
&lt;tr class="{% raw %}{ds_EvenOddRow}{% endraw %}" onclick="dsUDFs.setCurrentRow('{% raw %}{ds_RowID}{% endraw %}');" &gt;
	&lt;td&gt;{% raw %}{NAME}{% endraw %}&lt;/td&gt;
	&lt;td&gt;{% raw %}{CATNAME}{% endraw %}&lt;/td&gt;
	&lt;td&gt;{% raw %}{LASTUPDATED}{% endraw %}&lt;/td&gt;
&lt;/tr&gt;
</code>

The last new feature I'm going to demonstrate is the debugging ability. I've added code to my demo such that if url.debug exists, I output this JavaScript line:

<code>
Spry.Data.Region.debug = true;
</code>

To see this in action, visit this link:

<blockquote>
<a href="http://www.cflib.org/spry/index2.cfm?debug=dharma">http://www.cflib.org/spry/index2.cfm?debug=dharma</a>
</blockquote>