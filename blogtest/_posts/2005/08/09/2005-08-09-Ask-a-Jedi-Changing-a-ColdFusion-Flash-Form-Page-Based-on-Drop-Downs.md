---
layout: post
title: "Ask a Jedi: Changing a ColdFusion Flash Form \"Page\" Based on Drop Downs"
date: "2005-08-09T12:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/09/Ask-a-Jedi-Changing-a-ColdFusion-Flash-Form-Page-Based-on-Drop-Downs
guid: 686
---

A user on the CF irc channel asked about how a Flash Form "page" (a tab or accordion doohicky) can be updated based on a drop down. Turns out the code is rather simple:

<div class="code"><FONT COLOR=MAROON>&lt;cfform format=<FONT COLOR=BLUE>"flash"</FONT> name=<FONT COLOR=BLUE>"foo"</FONT> width=<FONT COLOR=BLUE>"400"</FONT>&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"change"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tabs.selectedIndex=chooser.selectedIndex;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfselect name=<FONT COLOR=BLUE>"chooser"</FONT> onChange=<FONT COLOR=BLUE>"#change#"</FONT> label=<FONT COLOR=BLUE>"Navigator"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"1"</FONT>&gt;</FONT></FONT>Tab One<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"2"</FONT>&gt;</FONT></FONT>Tab Two<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfselect&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"tabnavigator"</FONT> id=<FONT COLOR=BLUE>"tabs"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"page"</FONT> label=<FONT COLOR=BLUE>"Tab One"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"textone"</FONT> label=<FONT COLOR=BLUE>"Text One"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"page"</FONT> label=<FONT COLOR=BLUE>"Tab Two"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"texttwo"</FONT> label=<FONT COLOR=BLUE>"TextTwo"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT></div>

As you can see, the code is all of one line - we bind the selectedIndex of the tab group to the selectedIndex of the drop down. This assumes they are equal of course. The one thing to note - in order to get this to work you need to add an ID attribute to the tab navigator.