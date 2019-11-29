---
layout: post
title: "Spry Tip - Paged Datasets, Filters, and Row Numbering"
date: "2008-12-18T13:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/12/18/Spry-Tip-Paged-Datasets-Filters-and-Row-Numbering
guid: 3154
---

A reader wrote in asking an interesting question. He was using a Spry PagedView (a nice way to present a 'paged' interface to data loaded in via Ajax) and ran into an issue when trying to display the row number. When he used {% raw %}{ds_RowNumberPlus1}{% endraw %}, the row was relative to the page. So on page 2, he saw 1 instead of 11. I read over the <a href="http://labs.adobe.com/technologies/spry/samples/data_region/SpryPagedViewSample.html">docs</a> a bit and nothing seemed like it would work. I then created the following demo to help me test this.
<!--more-->
<code>
&lt;html&gt;

&lt;head&gt;
&lt;script src="http://localhost/Spry_1_6_1/includes/xpath.js"&gt;&lt;/script&gt;
&lt;script src="http://localhost/Spry_1_6_1/includes/SpryData.js"&gt;&lt;/script&gt;
&lt;script src="http://localhost/Spry_1_6_1/includes/SpryPagedView.js"&gt;&lt;/script&gt;
&lt;script&gt;
var mydata = new Spry.Data.XMLDataSet("data.cfm","/people/person"); 
var pvdata = new Spry.Data.PagedView(mydata, {% raw %}{ pageSize: 10 }{% endraw %});

var myFilterFunc = function(dataSet, row, rowNumber) {

	if(Spry.$("keyword_filter") == null) return row;
	var regExpStr = Spry.$("keyword_filter").value;

	if(regExpStr == '') return row;
	var regExp = new RegExp(regExpStr, "i");
	
	if(row["name"].search(regExp) != -1) return row;
	return null;
}
mydata.filter(myFilterFunc);

&lt;/script&gt;
&lt;/head&gt;
	
&lt;body&gt;

&lt;form name="filterForm"&gt;&lt;input type="text" name="keyword_filter" id="keyword_filter" onkeyup="mydata.filter(myFilterFunc);"&gt;&lt;/form&gt;

&lt;div spry:region="pvdata"&gt;

&lt;div spry:state="loading"&gt;Loading - Please stand by...&lt;/div&gt;
&lt;div spry:state="error"&gt;Oh crap, something went wrong!&lt;/div&gt;
&lt;div spry:state="ready"&gt;
	
&lt;p&gt;

&lt;table width="500" border="1"&gt;
	&lt;tr&gt;
		&lt;th onclick="pvdata.sort('name','toggle');" style="cursor: pointer;"&gt;Name&lt;/th&gt;
	&lt;/tr&gt;
	&lt;tr spry:repeat="pvdata"&gt;
		&lt;td style="cursor: pointer;"&gt;
		ds_RowID={% raw %}{ds_RowID}{% endraw %} ds_RowNumber={% raw %}{ds_RowNumber}{% endraw %} ds_RowNumberPlus1={% raw %}{ds_RowNumberPlus1}{% endraw %}&lt;br/&gt;
		ds_PageFirstItemNumber={% raw %}{ds_PageFirstItemNumber}{% endraw %} ds_CurrentRowNumber={% raw %}{ds_CurrentRowNumber}{% endraw %}&lt;br/&gt;
		&lt;b&gt;{% raw %}{name}{% endraw %}&lt;/b&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;	
&lt;/p&gt;
&lt;/div&gt;

&lt;div id="pagination"&gt;
	&lt;div id="pagination" class="pageNumbers"&gt;
	&lt;span spry:if="{% raw %}{ds_UnfilteredRowCount}{% endraw %} == 0"&gt;No matching data found!&lt;/span&gt;	
	&lt;span spry:if="{% raw %}{ds_UnfilteredRowCount}{% endraw %} != 0" spry:content="[Page {% raw %}{ds_PageNumber}{% endraw %} of {% raw %}{ds_PageCount}{% endraw %}]"&gt;&lt;/span&gt;
	&lt;/div&gt;
	&lt;div id = "pagination" class = "nextPrevious"&gt;
	&lt;span spry:if="{% raw %}{ds_UnfilteredRowCount}{% endraw %} != 0"&gt;
	&lt;a href="javaScript:pvdata.previousPage()"&gt;&lt;&lt; Previous&lt;/a&gt; | 
	&lt;a href="javaScript:pvdata.nextPage()"&gt;Next &gt;&gt;&lt;/a&gt;
	&lt;/span&gt;
	&lt;/div&gt;
&lt;/div&gt;
	
&lt;/div&gt;


&lt;/body&gt;
&lt;/html&gt;
</code>

The code behind the XML was rather simple:

<code>
&lt;cfsavecontent variable="str"&gt;
&lt;people&gt;
&lt;cfloop index="x" from="1" to="100"&gt;
	&lt;cfif randRange(1,10) lt 3&gt;
		&lt;cfoutput&gt;&lt;person&gt;&lt;name&gt;Sam #x#&lt;/name&gt;&lt;/person&gt;&lt;/cfoutput&gt;
	&lt;cfelse&gt;
		&lt;cfoutput&gt;&lt;person&gt;&lt;name&gt;Person #x#&lt;/name&gt;&lt;/person&gt;&lt;/cfoutput&gt;
	&lt;/cfif&gt;
&lt;/cfloop&gt;
&lt;/people&gt;
&lt;/cfsavecontent&gt;
&lt;cfcontent type="text/xml" reset="true"&gt;&lt;cfoutput&gt;#str#&lt;/cfoutput&gt;
</code>

Once this was done, I quickly ran the demo and saw that there seemed to be no built in variable that would work. The closest thing I saw was that {% raw %}{ds_PageFirstItemNumber}{% endraw %} represented the first row of the current page, and if I added ds_RowNumber, together I got a proper value.

Ok, so long story short, I whipped up a quick function to handle the addition:

<code>
function FormattedRowNum(region, lookupFunc) { 
	return parseInt(lookupFunc("{% raw %}{ds_PageFirstItemNumber}{% endraw %}")) + parseInt(lookupFunc("{% raw %}{ds_RowNumber}{% endraw %}"));
}
</code>

And then added this to my display: {% raw %}{function::FormattedRowNum}{% endraw %}

This worked fine, both before and after I applied a filter. However, I figured I was missing something and I pinged the Spry team. Kin wrote me back and suggested I use {% raw %}{ds_PageItemNumber}{% endraw %} instead. That worked perfectly! The reason I had not tried was due to the description:

<blockquote>
<p>
The unfiltered item number for the current row being processed. This is the unfiltered row index of the row plus one. 
</p>
</blockquote>

I guess when I saw "unfiltered", I figured it wouldn't work with a filtered dataset.