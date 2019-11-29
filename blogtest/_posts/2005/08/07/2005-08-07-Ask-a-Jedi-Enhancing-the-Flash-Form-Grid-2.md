---
layout: post
title: "Ask a Jedi: Enhancing the Flash Form Grid (2)"
date: "2005-08-07T22:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/07/Ask-a-Jedi-Enhancing-the-Flash-Form-Grid-2
guid: 678
---

In my last <a href="http://ray.camdenfamily.com/index.cfm/2005/8/6/Ask-a-Jedi-Enhancing-the-Flash-Form-Grid">entry</a>, I talked about how the cfgrid control could be enhanced to make it a bit more powerful. The basic idea is to use a detail panel to show items that won't quite fit in the grid, or won't work in the grid. My example code was a bit too simple, however, and didn't really show a good example of binding a truly dynamic select. The example I gave actually had a static select. (On a side note, I left "bind" code in the cfselect that doesn't actually work.) 

Here is the enhanced code:
<!--more-->
<div class="code"><FONT COLOR=MAROON>&lt;cfset q = queryNew(<FONT COLOR=BLUE>"name,age,gender,department"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"10"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset queryAddRow(q)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"name"</FONT>, <FONT COLOR=BLUE>"Name #x#"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"age"</FONT>, randRange(<FONT COLOR=BLUE>20</FONT>,<FONT COLOR=BLUE>50</FONT>) )&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif x mod 2&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"gender"</FONT>, <FONT COLOR=BLUE>"Male"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"gender"</FONT>, <FONT COLOR=BLUE>"Female"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset querySetCell(q, <FONT COLOR=BLUE>"department"</FONT>, randRange(<FONT COLOR=BLUE>1</FONT>,<FONT COLOR=BLUE> 4</FONT>))&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"onChange"</FONT>&gt;</FONT><br>
if( people.dataProvider[people.selectedIndex]['gender'] == 'Male' ) { <br>
&nbsp;&nbsp;&nbsp;gender.selectedIndex=0; } else { gender.selectedIndex=1; <br>
}<br>
for(var i=0;i &lt; department.getLength();i++) if(department.getItemAt(i).data == people.dataProvider[people.selectedIndex]['department']) {% raw %}{department.selectedIndex=i }{% endraw %}<br>
&nbsp;&nbsp;&nbsp;<br>
<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfform format=<FONT COLOR=BLUE>"flash"</FONT> name=<FONT COLOR=BLUE>"foo"</FONT> width=<FONT COLOR=BLUE>"400"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfgrid name=<FONT COLOR=BLUE>"people"</FONT> query=<FONT COLOR=BLUE>"q"</FONT> rowHeaders=false <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onChange=<FONT COLOR=BLUE>"#onChange#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfgridcolumn name=<FONT COLOR=BLUE>"name"</FONT> header=<FONT COLOR=BLUE>"Name"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfgridcolumn name=<FONT COLOR=BLUE>"age"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfgridcolumn name=<FONT COLOR=BLUE>"gender"</FONT> display=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfgridcolumn name=<FONT COLOR=BLUE>"department"</FONT> display=<FONT COLOR=BLUE>"false"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfgrid&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"panel"</FONT> label=<FONT COLOR=BLUE>"Detail View"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"moo"</FONT> bind=<FONT COLOR=BLUE>"{% raw %}{people.dataProvider[people.selectedIndex]['name']}{% endraw %}"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfselect name=<FONT COLOR=BLUE>"gender"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"Male"</FONT>&gt;</FONT></FONT>Male<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"Female"</FONT>&gt;</FONT></FONT>Female<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfselect&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfselect name=<FONT COLOR=BLUE>"department"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"4"</FONT> index=<FONT COLOR=BLUE>"x"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"#x#"</FONT>&gt;</FONT></FONT>Department #x#<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfselect&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT></div>

So what's different?  I modified the 'fake' source query to include a department ID value. You can imagine this as being a foreign key value. The next big change is that I moved the ActionScript into a cfsavecontent block. This allows me to a bit more verbose and simply pass the value to the onChange attribute of the cfgrid tag. With me so far? The ActionScript contains both the simple gender code I had last time, and a truly dynamic check against the department drop down. Basically we check the data value of each item in the drop down. (In Flash, the data value is like "value" portion of the option tag.) I compare this against the currently selected row in the grid and when a match is made, I set the selectedIndex. 

Anyway, I hope this is a slightly better example.