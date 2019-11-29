---
layout: post
title: "Exporting from CFGRID"
date: "2007-09-04T19:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/04/Exporting-from-CFGRID
guid: 2323
---

A user asked me today if it was possible to export data from the new HTML-based grid in ColdFusion 8. While there is no direct support, you can roll your own. Let's take a look at one solution to this problem.
<!--more-->
The first thing I'll do is share the base code that will power my grid. I have one cfc, test, with a getData method that looks like so:

<code>
&lt;cffunction name="getData" access="remote" returnType="struct" output="false"&gt;
	&lt;cfargument name="page" type="numeric" required="true"&gt;
	&lt;cfargument name="size" type="numeric" required="true"&gt;
	&lt;cfargument name="sortcol" type="string" required="true"&gt;
	&lt;cfargument name="sortdir" type="string" required="true"&gt;
	&lt;cfset var q = ""&gt;
	
	&lt;cfquery name="q" datasource="cfartgallery"&gt;
	select	*
	from	art
	&lt;cfif len(arguments.sortcol)&gt;
	order by #arguments.sortcol#
			&lt;cfif len(arguments.sortdir)&gt;
			#arguments.sortdir#
			&lt;/cfif&gt;
	&lt;/cfif&gt;
	&lt;/cfquery&gt;
	
	&lt;cfreturn queryConvertForGrid(q, arguments.page, arguments.size)&gt;
&lt;/cffunction&gt;
</code>

There isn't anything special about this method - except for the fact that it was specifically built to handle CFGRID ajax calls. Note the 4 attributes and the queryConvertForGrid used in the return. Now let's take a look at my form:

<code>
&lt;cfform name="myform"&gt;
&lt;cfgrid name="reportsGrid" format="html" pageSize="10" stripeRows="true"          
		bind="cfc:test.getData({% raw %}{cfgridpage}{% endraw %},{% raw %}{cfgridpagesize}{% endraw %},{% raw %}{cfgridsortcolumn}{% endraw %},{% raw %}{cfgridsortdirection}{% endraw %})"
&gt;
	&lt;cfgridcolumn name="artname" header="Name"&gt;
	&lt;cfgridcolumn name="price"&gt;
&lt;/cfgrid&gt;
&lt;cfinput type="button" name="Download" value="Download" onClick="doDownload()"&gt;
&lt;/cfform&gt;
</code>

Ok - so far nothing special, but I did add a download button that runs a JavaScript function named doDownload. 

At this point I figured out what solution I would use. I would simply look at the grid - get the current sort column, sort direction, and page, and make a call to a page that would run the same call my grid was. Turns out though that was harder said then done. Believe it or not, there was no API for the Grid (over at Ext's docs) that specifically returned the current sort or page. My buddy <a href="http://www.cfsilence.com/blog/client">Todd Sharp</a> did some digging and found that properties existed for these values, you just had to digg a bit. So let's take a look at the complete function and I'll explain what each line is doing.

<code>
&lt;script&gt;
function doDownload() {
	var mygrid = ColdFusion.Grid.getGridObject('reportsGrid');
	var mydata = mygrid.getDataSource();
	var params = mydata.lastOptions.params;
	var sort = params.sort;
	var dir = params.dir;
	page = params.start/params.limit+1;
	document.location.href='download.cfm?page='+page+'&sort='+sort+'&dir='+dir+'&size='+params.limit;
}
&lt;/script&gt;
</code>

The first thing I do is get the Ext grid object using the ColdFusion.Grid.getGridObject function. This is documented in the CF Reference. I then get the DataSource object for the grid. What is that? I'm not quite sure. The API docs mention the function, but don't fully explain what the DataSource is. Todd found that within this object there was a 'lastOptions.params' key that stored all the values I needed. This includes the sort and dir (although the values are undefined if you don't click anything), and a start and limit value that lets me get the current page. At this point I have everything ColdFusion had when it made its Ajax request. So I just duplicate it a bit and push the user to download.cfm. Here is the code for that page:

<code>
&lt;cfparam name="url.page" default="1"&gt;
&lt;cfparam name="url.limit" default="10"&gt;
&lt;cfparam name="url.sort" default=""&gt;
&lt;cfparam name="url.dir" default=""&gt;

&lt;cfinvoke component="test" method="getData" page="#url.page#" 
			size="#url.size#" sortcol="#url.sort#" sortdir="#url.dir#"
			returnVariable="result"&gt;

&lt;cfheader name="Content-Disposition" value="inline; filename=download.pdf"&gt;
&lt;cfdocument format="pdf"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;th&gt;Name&lt;/th&gt;
		&lt;th&gt;Price&lt;/th&gt;
	&lt;/tr&gt;
	&lt;cfoutput query="result.query"&gt;
	&lt;tr&gt;
		&lt;td&gt;#artname#&lt;/td&gt;
		&lt;td&gt;#price#&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/table&gt;
&lt;/cfdocument&gt;
</code> 

All I've done here is hit the same CFC my grid was hitting. I output the result within cfdocument to create a simple page.