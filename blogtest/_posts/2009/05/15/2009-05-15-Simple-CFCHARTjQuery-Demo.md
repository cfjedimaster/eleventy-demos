---
layout: post
title: "Simple CFCHART/jQuery Demo"
date: "2009-05-15T12:05:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2009/05/15/Simple-CFCHARTjQuery-Demo
guid: 3356
---

I had some time to kill today and I decide to mix cfchart up with some jQuery love. You can see the demo of this <a href="http://www.raymondcamden.com/demos/jquerychart/">here</a>. When the chart loads, click on the bars, and you will see a detail load beneath the graph.

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 326.png">

The code behind this is fairly trivial. I've got a file I include to generate my chart data. Normally this would be a proper database query. The main template's code consists of:

<code>
&lt;cfinclude template="data.cfm"&gt;

&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
function loadData(l) {
	$("#detail").load('detail.cfm?name='+escape(l)).hide().fadeIn('slow')
}
&lt;/script&gt;

&lt;cfchart chartWidth="500" chartHeight="250" format="flash" url="javascript:loadData('$ITEMLABEL$')"&gt;
	&lt;cfchartseries type="bar" query="data" itemcolumn="name" valuecolumn="sales" /&gt; 
&lt;/cfchart&gt;

&lt;div id="detail" style="width:500"&gt;&lt;/div&gt;
</code>

The cfchart makes use of the url attribute to specify what should happen when you click. In this case, I'm simply calling a function, loadData(). This then uses jQuery to make a remote call to detail.cfm. Note that I pass the name. Normally you would pass a primary key, but we don't have (easy) access to that (see <a href="http://www.coldfusionjedi.com/index.cfm/2009/4/24/Handling-additional-non-charted-values-in-CFCHART">this entry</a> for more info) value so we have to work with the name instead. That's it. All detail.cfm does is look up the detail information:

<code>
&lt;cfinclude template="data.cfm"&gt;

&lt;cfparam name="url.name" default=""&gt;

&lt;!--- get detail based on label ---&gt;
&lt;cfquery name="detail" dbtype="query"&gt;
select	*
from	data
where	name = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#url.name#"&gt;
&lt;/cfquery&gt;
	
&lt;cfif detail.recordCount is 1&gt;

	&lt;cfoutput&gt;
	&lt;h2&gt;#url.name#&lt;/h2&gt;
	&lt;p&gt;
	Founded: #detail.yearfounded#&lt;br/&gt;
	Sales: #dollarFormat(detail.sales)#&lt;br/&gt;
	#paragraphFormat(detail.bio)#
	&lt;/cfoutput&gt;

&lt;/cfif&gt;
</code>

Not terribly useful I guess, but fun.