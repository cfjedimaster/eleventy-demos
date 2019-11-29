---
layout: post
title: "Don't Try This At Home: CFBASIC"
date: "2005-08-02T12:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/02/Dont-Try-This-At-Home-CFBASIC
guid: 663
---

So, a few years ago I was bored. Really bored. I decided to write a BASIC interperter in ColdFusion. It would allow for stuff like this:

<div class="code"><FONT COLOR=MAROON>&lt;CF_BASIC&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;20 x = 10<br>
&nbsp;&nbsp;&nbsp;30 if X &gt; 5  THEN goto 60<br>
&nbsp;&nbsp;&nbsp;40 println <FONT COLOR=BLUE>"x is less than 5"</FONT> <br>
&nbsp;&nbsp;&nbsp;50 goto 100<br>
&nbsp;&nbsp;&nbsp;60 println <FONT COLOR=BLUE>"x is more than 5"</FONT><br>
&nbsp;&nbsp;&nbsp;110 if x &gt; 5 then x = 2<br>
&nbsp;&nbsp;&nbsp;115 print <FONT COLOR=BLUE>"x is "</FONT><br>
&nbsp;&nbsp;&nbsp;120 println x<br>
&nbsp;&nbsp;&nbsp;130 if x == 3 then println <FONT COLOR=BLUE>"Yes x is<FONT COLOR=BLUE> 1</FONT><FONT COLOR=NAVY>&lt;P&gt;</FONT>"</FONT><br>
&nbsp;&nbsp;&nbsp;150 if x &gt; -1 then println <FONT COLOR=BLUE>"its 0 or higher"</FONT> <br>
&nbsp;&nbsp;&nbsp;160 x = -2<br>
&nbsp;&nbsp;&nbsp;170 if x &lt; 0 then println <FONT COLOR=BLUE>"it is negative"</FONT><br>
<FONT COLOR=MAROON>&lt;/CF_BASIC&gt;</FONT></div>

Why did I do this? As I said - I was bored. This is a completely dumb thing to code. That being said, it was fun. :) I have no formal training in writing computer languages, so this is far from perfect, but for those who want to take a look, you can download the code <a href="http://www.raymondcamden.com/downloads/basic.zip">here</a>. Please forgive the upper-case code. I was delusional a few years ago and thought that made for good code writing. The only slightly cool thing about this code is - the core of BASIC was done so that you could add a new feature by writing a UDF. So for example, here is how "print" was done:

<div class="code">//print<br><FONT COLOR=GRAY><I>
// currently we only support printing a string or a var</I></FONT>
function cfb_print(arg) {<br>
<FONT COLOR=GRAY><I>&nbsp;&nbsp;&nbsp;// strings must be <FONT COLOR=BLUE>" "</FONT></I></FONT>
&nbsp;&nbsp;&nbsp;if(left(arg,<FONT COLOR=BLUE>1</FONT>) IS <FONT COLOR=BLUE>""</FONT><FONT COLOR=BLUE>""</FONT> AND right(arg,<FONT COLOR=BLUE>1</FONT>) IS <FONT COLOR=BLUE>""</FONT><FONT COLOR=BLUE>""</FONT> and len(arg) gt<FONT COLOR=BLUE> 2</FONT>) WriteOutput(Mid(arg,<FONT COLOR=BLUE>2</FONT>,Len(Arg)-2));<br>
<FONT COLOR=GRAY><I>&nbsp;&nbsp;&nbsp;//ok, try to find it in the temp scope</I></FONT>
&nbsp;&nbsp;&nbsp;if(structKeyExists(CODETEMP,arg)) WriteOutput(CODETEMP[arg]);<br>
&nbsp;&nbsp;&nbsp;return;<br>
}</div>

The idea was - any UDF with "cfb_" in front was considered a BASIC function. Here is another example, my favorite:

<div class="code">//remarks do nothing<br>
function cfb_rem(arg) {<br>
&nbsp;&nbsp;&nbsp;return false;<br>
}</div>

Enjoy!