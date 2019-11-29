---
layout: post
title: "Spry adds support for CSV and TSV datasets"
date: "2007-10-23T11:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/10/23/Spry-adds-support-for-CSV-and-TSV-datasets
guid: 2431
---

When preparing for my last Spry presentation, I noticed two new files that weren't documented: SpryCSVDataSet.js and SpryTSVDataSet.js. I pinged the Spry team and discovered that 1.6 added support for both comma separated value files and tab separated files. They just didn't have time to document it - but the cool thing is that - just like JSON support, once you make the dataset your work is done. Everything else is the same. Consider this example:
<!--more-->
<code>
&lt;html&gt;

&lt;head&gt;
&lt;script src="/spryjs/SpryData.js"&gt;&lt;/script&gt;
&lt;script src="/spryjs/SpryCSVDataSet.js"&gt;&lt;/script&gt;

&lt;script&gt;
var ds1 = new Spry.Data.CSVDataSet("people.txt");
&lt;/script&gt;
&lt;style&gt;
	.hover {% raw %}{ background-color: yellow; }{% endraw %}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div spry:region="ds1"&gt;
&lt;table border="1" cellpadding="10"&gt;
	&lt;tr&gt;
		&lt;th onClick="ds1.sort('name','toggle')"&gt;Name&lt;/th&gt;
		&lt;th onClick="ds1.sort('group','toggle')"&gt;Group&lt;/th&gt;
	&lt;/tr&gt;
	&lt;tr spry:repeat="ds1" spry:hover="hover"&gt;
		&lt;td&gt;{% raw %}{name}{% endraw %}&lt;/td&gt;&lt;td&gt;{% raw %}{group}{% endraw %}&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

As you can see - the only thing in this file unlike other Spry demos I've shown is the use of the new JS file and the creation of a CSVDataSet. Spry supports both cases where CSV files contain the headers in the first row and when they do not. If your CSV file does not contain headers in the first row, you simply flag it when creating the dataset. You can optionally assign it headers as well:

<code>
var ds1 = new Spry.Data.CSVDataSet("employees-01.txt", {% raw %}{firstRowAsHeaders: false, columnNames: [ "lastname", "firstname","userid" ] }{% endraw %});
</code>

For TSV support, you can even specify a different delimiter:

<code>
var ds1 = new Spry.Data.TSVDataSet("employees-01.txt", {% raw %}{ delimiter: "|{% endraw %}"});
</code>

Here are two examples:<br>
<a href="http://www.raymondcamden.com/demos/sprycsv/test1.html">CSV Example</a><br>
<a href ="http://www.coldfusionjedi.com/demos/sprycsv/test2.html">TSV Example</a><br>

If you are using Firebug, you can take a look at the text files being loaded. Thanks to Kin Blas for the help!