---
layout: post
title: "Coolest CFCHART Trick Ever"
date: "2008-01-18T16:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/18/Coolest-CFCHART-Trick-Ever
guid: 2601
---

Ok, maybe not ever, but interesting nonetheless. A few days ago a reader pinged me to ask about gauge charts. Those are charts that act like speedometers. I knew it wasn't supported by ColdFusion out of the box, but I recommended he take a look at the WebCharts design tool that ships with ColdFusion. When I did so - I saw right off the bat that it was supported, and there were quite a few of them.

I generated my style xml, passed it to the CFCHART, and promptly got an error about gauge charts not being supported. Darn. I was as frustrated as Britney Spears in a library.
<!--more-->
Yesterday the topic of CFCHART came up again, this time on the CFAUSSIE mail list. When I made the same point there, a user named Simon Haddan shared an interesting fact. You can actually use Java to speak directly to the WebCharts engine embedded in ColdFusion. (Christopher Wigginton <a href="http://www.intersuite.com/client/index.cfm/2005/11/15/ColdFusion-Tip-Using-the-included-webcharts3d-engine-in-CFMX-7">blogged</a> on this as well back in 2005.) 

Essentially, you can use the WebChart's designed to create a WCP file, which is just an XML file. You can then grab the relevant bits out and speak directly to WebCharts. And guess what?

No limits.

Not as far as I can tell. I made this lovely PNG gauge below. (And yes, SWF is supported too.)

<img src="https://static.raymondcamden.com/images/cfjedi/dial.png">

The code is a bit complex, and involves some string manipulation, but could be made easier if someone felt like creating a nice CFC for it. Here is the code, and remember credit goes to Simon and Christopher:

<code>
&lt;!--- Read the WCP file ---&gt;
&lt;cfset sChartStyle = fileRead(expandPath("./raygauge.wcp"))&gt;

&lt;!--- Get the frameChart component ---&gt;
&lt;cfset iStart = findNoCase("&lt;gauge",sChartStyle)&gt;
&lt;cfset iEnd = findNoCase("&lt;/gauge&gt;",sChartStyle)&gt;
&lt;cfsavecontent variable="chartStyle"&gt;
    &lt;cfoutput&gt;&lt;?xml version="1.0" encoding="UTF-8"?&gt;
    #mid(sChartStyle,iStart,iEnd-iStart+13)#
    &lt;/cfoutput&gt;
&lt;/cfsavecontent&gt;

&lt;cfsavecontent variable="chartModel"&gt;&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;XML type="default"&gt;
&lt;COL&gt;2000&lt;/COL&gt;
&lt;ROW col0="88.0"&gt;Sample 0:&lt;/ROW&gt;
&lt;/XML&gt;&lt;/cfsavecontent&gt;

&lt;cfscript&gt;
    oMyWebChart = createObject("Java","com.gp.api.jsp.MxServerComponent");
    oMyApp = getPageContext().getServletContext();
    oSvr = oMyWebChart.getDefaultInstance(oMyApp);
    oMyChart2 = oSvr.newImageSpec();
    oMyChart2.width = 375;
    oMyChart2.height= 375;
    oMyChart2.type = "png";
    oMyChart2.style = "#chartStyle#";
    oMyChart2.model = "#chartModel#";
&lt;/cfscript&gt;
&lt;!--- Create html tag set ---&gt;
&lt;cfsavecontent variable="chartImgTag"&gt;
      &lt;cfoutput&gt;#oSvr.getImageTag(oMyChart2,"http://192.168.1.108/CFIDE/GraphData.cfm?graphCache=wc50&graphID=")#&lt;/cfoutput&gt;
&lt;/cfsavecontent&gt;
&lt;!--- Good old Webcharts loves to add an extra /Images/ to the URL ---&gt;
&lt;cfset chartImgTag = replace(chartImgTag,"http://192.168.1.108/Images/","http://localhost/","All")&gt;

&lt;cfoutput&gt;
#htmlEditFormat(chartimgtag)#
&lt;p&gt;
#chartimgtag#
&lt;/cfoutput&gt;
</code>

The first part of the file grabs the style portion from the WCP file. I believe this is the same XML you would normally grab from the style tab. The chartModel section is the data. For a gauge it is rather simple - one value. I'm not sure where "Sample 0:" is even used, but the value, 88, is.

Next up we do the Java magic. Note the getImageTag portion expects a URL. This URL represents the same "magic" URL ColdFusion uses to display images/SWF stuff. You probably wouldn't want to hard code an IP like I did. WebCharts also wants to add /Images to this so it has to be stripped out.

The last thing I do is output the HTML in a form I can read, and as is, which works just fine.

Pretty cool, eh? In theory, one could build a custom tag that lets you paste in a MCP and it would run form that, but the data would be hard coded.