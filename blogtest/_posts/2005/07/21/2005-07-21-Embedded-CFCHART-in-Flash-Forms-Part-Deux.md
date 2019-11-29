---
layout: post
title: "Embedded CFCHART in Flash Forms Part Deux!"
date: "2005-07-21T15:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/21/Embedded-CFCHART-in-Flash-Forms-Part-Deux
guid: 636
---

In my <a href="http://ray.camdenfamily.com/index.cfm/2005/7/19/Embedded-CFCHART-in-Flash-Forms">previous post</a>, I talked about how you can embed a Flash chart inside a Flash-based CFFORM. I used a textarea, set it’s HTML property and pointed it at a Flash chart I had previously saved. This works fine, but it requires you to save the SWF before you can use it. Let’s make things a bit simpler and try to get rid of the file completely. As I mentioned in the previous post, it is possible to get the binary data from cfchart saved into a variable. In theory, we could just use cfcontent to serve up the chart. Consider this code:

<div class="code"><FONT COLOR=MAROON>&lt;cfsetting enablecfoutputonly=<FONT COLOR=BLUE>"true"</FONT> showdebugoutput=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfchart name=<FONT COLOR=BLUE>"chartData"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartseries type=<FONT COLOR=BLUE>"bar"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"apples"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"oranges"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"pears"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfchartseries&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfchart&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfcontent type=<FONT COLOR=BLUE>"application/x-shockwave-flash"</FONT>&gt;</FONT>#chartdata#</div>

Everything looks fine and dandy, right? However, when I viewed this file in my browser, it didn’t load. Flash data was there, I could right click and see the normal right menu options for Flash, but the movie didn’t load correctly. What I didn’t realize was that for binary data, you need to use the <b>variable</b> attribute for cfcontent. Here is the modified version:

<div class="code"><FONT COLOR=MAROON>&lt;cfsetting enablecfoutputonly=<FONT COLOR=BLUE>"true"</FONT> showdebugoutput=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfchart name=<FONT COLOR=BLUE>"chartData"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartseries type=<FONT COLOR=BLUE>"bar"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"apples"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"oranges"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"pears"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfchartseries&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfchart&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfcontent type=<FONT COLOR=BLUE>"application/x-shockwave-flash"</FONT> variable=<FONT COLOR=BLUE>"#chartData#"</FONT>&gt;</FONT></div>

Running this version in my browser made the chart show up perfectly. So far, so good. Now let’s modify the earlier example we had so it loads my new dynamic chart.

<div class="code"><FONT COLOR=MAROON>&lt;cfform name=<FONT COLOR=BLUE>"test"</FONT> format=<FONT COLOR=BLUE>"flash"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cftextarea name=<FONT COLOR=BLUE>"chartArea"</FONT> width=<FONT COLOR=BLUE>"400"</FONT> height=<FONT COLOR=BLUE>"400"</FONT>&gt;</FONT><FONT COLOR=MAROON>&lt;/cftextarea&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset onClick = <FONT COLOR=BLUE>"_root.chartArea.html=true;_root.chartArea.htmlText='<FONT COLOR=NAVY><FONT COLOR=PURPLE>&lt;img src="</FONT><FONT COLOR=BLUE>"test_b_data.cfm?"</FONT><FONT COLOR=BLUE>"/&gt;</FONT></FONT></FONT>'+'<B><I>&amp;nbsp;</I></B>'"</FONT>&gt;<br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"button"</FONT> name=<FONT COLOR=BLUE>"submit"</FONT> value=<FONT COLOR=BLUE>"Test Flash"</FONT> <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; onClick=<FONT COLOR=BLUE>"#onClick#"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT></div>

I won’t spend a lot of time on this since it the same code as before. The only difference is that I moved the onClick code into a variable so it is a bit easier to read. Also note that my image source is poinging to test_b_data.cfm, the file I created above.

When I run this, and click the button – nothing happens though. This one confused me for a while until Nimer suggested a trick. I added ?bar=.swf to the URL for the image – and it worked fine. Turns out – Flash must be doing some validation on the HTML. It sees an image source tag – and it sees a non-image extension – and it ignores the HTML. By adding bar=.swf to the URL, it is enough for Flash to be tricked. Here is the final version:

<div class="code"><FONT COLOR=MAROON>&lt;cfform name=<FONT COLOR=BLUE>"test"</FONT> format=<FONT COLOR=BLUE>"flash"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cftextarea name=<FONT COLOR=BLUE>"chartArea"</FONT> width=<FONT COLOR=BLUE>"400"</FONT> height=<FONT COLOR=BLUE>"400"</FONT>&gt;</FONT><FONT COLOR=MAROON>&lt;/cftextarea&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset onClick = <FONT COLOR=BLUE>"_root.chartArea.html=true;_root.chartArea.htmlText='<FONT COLOR=NAVY><FONT COLOR=PURPLE>&lt;img src="</FONT><FONT COLOR=BLUE>"test_b_data.cfm?bar=.swf"</FONT><FONT COLOR=BLUE>"/&gt;</FONT></FONT></FONT>'+'<B><I>&amp;nbsp;</I></B>'"</FONT>&gt;<br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"button"</FONT> name=<FONT COLOR=BLUE>"submit"</FONT> value=<FONT COLOR=BLUE>"Test Flash"</FONT> <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; onClick=<FONT COLOR=BLUE>"#onClick#"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT></div>

Lastly, here is a screen shot. The cool thing is that you can click the button and the chart redraws. My next post will show a cooler example of this.

<img src="http://ray.camdenfamily.com/images/chart1.jpg">