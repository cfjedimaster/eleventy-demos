---
layout: post
title: "CFCHARTs with Custom Markers"
date: "2009-04-03T14:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/04/03/CFCHARTs-with-Custom-Markers
guid: 3304
---

Last night I <a href="http://www.raymondcamden.com/index.cfm/2009/4/2/Two-quickies--Cache-Clearer-Admin-Extension-and-CFCHART-Doc-Typo">blogged</a> about a typo in the CF Reference in regards to charts and markers. The docs make reference to a marker style called 'letter', whereas the real setting is 'letterx'. The user I was communicating with about this issue asked if there was someway to use <i>other</i> letters. So for example, letterA or letterB. While you can't do that, I did discover that the Chart Editor has an option to specify a graphic for the marker.
<!--more-->
If you expand the Elements attribute in the editor, then Series, you can edit the Marker attribute. This is a per series setting so you want to add an index value in the blank field and click Add before modifying the settings. The index value must be a number. I used 0 as I assumed that it would match the 1st series in my chart:
 <p/>
<img src="https://static.raymondcamden.com/images/cfjedi//Picture 229.png">
 <p/>

I selected Bitmap and picked an image. The XML generated from this change is:
 <p/>

<code>
&lt;series index="0"&gt;
  &lt;marker type="Bitmap" bitmap="/Users/ray/Desktop/unicorn4.gif"/&gt;
&lt;/series&gt;
</code>
 <p/>

Here is a full example. The XML is a bit verbose and you don't need a lot of what is in here, but the final example is nice.
 <p/>

<code>
&lt;cfsavecontent variable="cxml"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;frameChart is3D="false"&gt;
          &lt;frame xDepth="3" yDepth="1" leftAxisPlacement="Back" isHStripVisible="true"&gt;
               &lt;background minColor="#FDFEF6"/&gt;
          &lt;/frame&gt;
          &lt;xAxis&gt;
               &lt;labelFormat pattern="#,##0.###"/&gt;
               &lt;parseFormat pattern="#,##0.###"/&gt;
          &lt;/xAxis&gt;
          &lt;legend isVisible="false"&gt;
               &lt;decoration style="None"/&gt;
          &lt;/legend&gt;
          &lt;elements place="Default" shape="Line" drawShadow="true"&gt;
               &lt;morph morph="Grow"/&gt;
               &lt;series index="0"&gt;
                    &lt;marker type="Bitmap" bitmap="/Users/ray/Desktop/unicorn4.gif"/&gt;
               &lt;/series&gt;
          &lt;/elements&gt;
&lt;/frameChart&gt;
&lt;/cfsavecontent&gt;

&lt;cfchart style="#cxml#" scalefrom="0" scaleto="100"&gt;
       &lt;cfchartseries type="line" seriesColor="##FF0099"&gt;
               &lt;cfchartdata item="col1" value="20"&gt;
               &lt;cfchartdata item="col2" value="30"&gt;
               &lt;cfchartdata item="col3" value="10"&gt;
               &lt;cfchartdata item="col4" value="80"&gt;
               &lt;cfchartdata item="col5" value="60"&gt;
       &lt;/cfchartseries&gt;
&lt;/cfchart&gt;
</code>
 <p/>

And the result? <b>The most beautiful chart in the world.</b>
 <p/>


<img src="https://static.raymondcamden.com/images/cfjedi//Picture 321.png">