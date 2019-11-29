---
layout: post
title: "Ask a Jedi: Enhancing the Flash Form Grid"
date: "2005-08-06T23:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/06/Ask-a-Jedi-Enhancing-the-Flash-Form-Grid
guid: 677
---

Scott asks:

<blockquote>
Ray, I'm starting work on an invoicing app, and I'd like to do it entirely with Flash Forms. For my line items I'd like to use a cfgrid, but the fact that the flash format of cfgrid doesn't support a select box (for part number selection) pretty much kills that idea. Another other ideas for a good implementation of this?
</blockquote>

I've run into this problem as well. What I've done is use a combination of a grid and a detail panel below. When a row is selected in the grid, the details populate in the panel below. The only issue is that you can't use bind on cfselect. However, you can use the onChange attribute in the grid tree. Below is a simple example. The text field uses bind whereas the select is populated via onChange. I hope this helps.

<div class="code"><FONT COLOR=MAROON>&lt;cfset q = queryNew(<FONT COLOR=BLUE>"name,age,gender"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"10"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset queryAddRow(q)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"name"</FONT>, <FONT COLOR=BLUE>"Name #x#"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"age"</FONT>, randRange(<FONT COLOR=BLUE>20</FONT>,<FONT COLOR=BLUE>50</FONT>) )&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif x mod 2&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"gender"</FONT>, <FONT COLOR=BLUE>"Male"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"gender"</FONT>, <FONT COLOR=BLUE>"Female"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfform format=<FONT COLOR=BLUE>"flash"</FONT> name=<FONT COLOR=BLUE>"foo"</FONT> width=<FONT COLOR=BLUE>"400"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfgrid name=<FONT COLOR=BLUE>"people"</FONT> query=<FONT COLOR=BLUE>"q"</FONT> rowHeaders=false <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onChange=<FONT COLOR=BLUE>"if( people.dataProvider[people.selectedIndex]['gender'] == <br>
'Male' ) {% raw %}{ gender.selectedIndex=0; }{% endraw %} else { <br>
gender.selectedIndex=1; }"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfgridcolumn name=<FONT COLOR=BLUE>"name"</FONT> header=<FONT COLOR=BLUE>"Name"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfgridcolumn name=<FONT COLOR=BLUE>"age"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfgridcolumn name=<FONT COLOR=BLUE>"gender"</FONT> display=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfgrid&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"moo"</FONT> bind=<FONT COLOR=BLUE>"{% raw %}{people.dataProvider[people.selectedIndex]['name']}{% endraw %}"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfselect name=<FONT COLOR=BLUE>"gender"</FONT> bind=<FONT COLOR=BLUE>"{% raw %}{people.dataProvider[people.selectedIndex]['gender']}{% endraw %}"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"Male"</FONT>&gt;</FONT></FONT>Male<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"Female"</FONT>&gt;</FONT></FONT>Female<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfselect&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT></div>