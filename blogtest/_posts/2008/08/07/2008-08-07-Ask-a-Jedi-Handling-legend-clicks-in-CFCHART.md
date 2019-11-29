---
layout: post
title: "Ask a Jedi: Handling legend clicks in CFCHART"
date: "2008-08-07T12:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/07/Ask-a-Jedi-Handling-legend-clicks-in-CFCHART
guid: 2962
---

Dave asks:

<blockquote>
<p>
I have a drill down chart application that allows users to look both at the big picture and drill down to the detail on the charts.  Today (after the application has been running for over a year) the customer noticed that if they click on the legend it tried to go to the detail page. However it doesn't send the $ItemLabel (because they didn't click on a data item.) I looked in Webchart 3D to see if there were any options but don't see any for links. Is there a way around this or do I need to remove the legend and replace it with a
text legend?
</p>
</blockquote>
<!--more-->
This was an interesting question. I had never even tried to click on a legend in cfchart. I wrote up a quick demo to see if I could reproduce this:

<code>
&lt;cfset q = queryNew("dept,sales")&gt;

&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "dept", "Alpha")&gt;
&lt;cfset querySetCell(q, "sales", 239)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "dept", "Beta")&gt;
&lt;cfset querySetCell(q, "sales", 80)&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "dept", "Gamma")&gt;
&lt;cfset querySetCell(q, "sales", 120)&gt;

&lt;cfdump var="#url#" label="URL"&gt;

&lt;cfchart format="flash" showLegend="true" url="test.cfm?v=$VALUE$&il=$ITEMLABEL$&sl=$SERIESLABEL$"&gt;
&lt;cfchartseries type="bar" query="q" itemcolumn="dept" valuecolumn="sales"&gt;
&lt;/cfchartseries&gt;
&lt;/cfchart&gt;
</code>

All I have here is a simple, hard coded query and a bar chart. Notice too that I dump the URL. When clicking on a bar, I get all 3 values passed as I expected. Clicking on the legend resulted in itemLabel being passed (I assume Dave just typoed in his question) but the serieslabel and value entries were blank.

Now this may not be a bug at all. You may even want this. You could set it up so that clicking on the bar takes you to sales figures for that department, but clicking on the legend takes you to generic info for the department. You would have to use server-side code to sniff the URL values and redirect accordingly. But if you don't want this, what do you do?

Do not forget (and I've blogged on this before) that you can use JavaScript URLs for cfchart. This means you can run a JavaScript function when the user clicks on the chart. It is a trivial matter then to note the values and react accordingly:

<code>
&lt;script&gt;
function handleClick(v,il,sl)	 {
	if(v != "") document.location.href='test.cfm?v='+escape(v)+'&il='+il+'&sl='+sl;
}
&lt;/script&gt;
&lt;cfchart format="flash" showLegend="true" url="javascript:handleClick('$VALUE$','$ITEMLABEL$','$SERIESLABEL$')"&gt;
&lt;cfchartseries type="bar" query="q" itemcolumn="dept" valuecolumn="sales"&gt;
&lt;/cfchartseries&gt;
&lt;/cfchart&gt;
</code>

All I've done here is to note the empty value attribute. If it isn't value, we go ahead and load the URL as we did in the first version.