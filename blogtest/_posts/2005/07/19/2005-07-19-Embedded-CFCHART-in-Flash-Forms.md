---
layout: post
title: "Embedded CFCHART in Flash Forms"
date: "2005-07-19T16:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/19/Embedded-CFCHART-in-Flash-Forms
guid: 632
---

One question often is if you can embed a CFCHART inside a CFFORM Flash Form. The short answer is no. However, various people have gotten it working. After seeing a wonderful demo of this at CFUNITED, I decided to look into it a bit more. I spoke with Amit, the developer who showed off the impressive Flash Form demo during one of the keynotes. He told me how he was embedding CFCHART and gave me the ideas I needed to push it further.

Let’s start simple with the code that Amit showed me. You start off by adding a text area to your flash form:

<div class="code"><FONT COLOR=MAROON>&lt;cftextarea name=<FONT COLOR=BLUE>"chartArea"</FONT>&gt;</FONT><FONT COLOR=MAROON>&lt;/cftextarea&gt;</FONT></div>

This is where the CFCHART will pop up. Next we need a way to load the chart. I’m going to tie the chart load to a button.

<div class="code"><FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"button"</FONT> name=<FONT COLOR=BLUE>"submit"</FONT> value=<FONT COLOR=BLUE>"Test Flash"</FONT> <br>onClick = <FONT COLOR=BLUE>"_root.chartArea.html=true;_root.chartArea.htmlText='<FONT COLOR=NAVY><FONT COLOR=PURPLE>&lt;img src="</FONT><FONT COLOR=BLUE>"test.swf"</FONT><FONT COLOR=BLUE>"/&gt;</FONT></FONT></FONT><B><I>&amp;nbsp;</I></B>'"</FONT>&gt;</div>

What is going on here? First we define a button and add a onClick attribute. We set the HTML property of the text area to true. Next we simply set the HTML value of the text area. We use the IMG tag and point it to a SWF. I didn’t even know that was possible, but it works just fine.

What’s the deal with the non-breaking space at the end? For the life of me I couldn’t get the image to render without some text as well. I spoke with a few people and they said this may be due to the fact that Flash doesn’t know what size the image is. Setting the height and width didn’t help any – but I didn’t explore it further. For now though – adding a simple character to the HTML works fine.

So where does test.swf come from? When you use CFCHART with the NAME attribute, it takes the binary output of the Flash chart and stores it in the variable specified by the NAME value. You can then save that data using CFFILE. 

Let’s look at a complete example:
<div class="code"><FONT COLOR=MAROON>&lt;cfchart name=<FONT COLOR=BLUE>"data"</FONT> chartwidth=<FONT COLOR=BLUE>"350"</FONT> chartheight=<FONT COLOR=BLUE>"350"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartseries type=<FONT COLOR=BLUE>"bar"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"apples"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"oranges"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfchartdata item=<FONT COLOR=BLUE>"pears"</FONT> value=<FONT COLOR=BLUE>"#randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE>100</FONT>)#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfchartseries&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfchart&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cffile action=<FONT COLOR=BLUE>"write"</FONT> file=<FONT COLOR=BLUE>"#expandPath("</FONT>./test.swf<FONT COLOR=BLUE>")#"</FONT> output=<FONT COLOR=BLUE>"#data#"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfform name=<FONT COLOR=BLUE>"test"</FONT> format=<FONT COLOR=BLUE>"flash"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cftextarea name=<FONT COLOR=BLUE>"chartArea"</FONT> width=<FONT COLOR=BLUE>"400"</FONT> height=<FONT COLOR=BLUE>"400"</FONT>&gt;</FONT><FONT COLOR=MAROON>&lt;/cftextarea&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"button"</FONT> name=<FONT COLOR=BLUE>"submit"</FONT> value=<FONT COLOR=BLUE>"Test Flash"</FONT> <br>onClick = <FONT COLOR=BLUE>"_root.chartArea.html=true;_root.chartArea.htmlText='<FONT COLOR=NAVY><FONT COLOR=PURPLE>&lt;img src="</FONT><FONT COLOR=BLUE>"test.swf?"</FONT><FONT COLOR=BLUE>"/&gt;</FONT></FONT></FONT>'+<br>'<B><I>&amp;nbsp;</I></B>'"</FONT>&gt;<br>
<br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT></div>

Nice and easy, right? In my next blog entry, I’ll show you how you can get rid of the file and dynamically change the chart based on values in your Flash Form.