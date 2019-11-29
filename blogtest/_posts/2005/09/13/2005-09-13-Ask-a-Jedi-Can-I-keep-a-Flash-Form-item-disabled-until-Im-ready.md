---
layout: post
title: "Ask a Jedi: Can I keep a Flash Form item disabled until I'm ready?"
date: "2005-09-13T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/13/Ask-a-Jedi-Can-I-keep-a-Flash-Form-item-disabled-until-Im-ready
guid: 770
---

Rich asks:

<blockquote>
Is there a way to keep a cfform field "disabled” until it is selected in a cfgrid (assuming it was bound from a querry in the grid to the form field)? So the form field would be activated once the (bound) grid item was selected?
</blockquote>

Using Flash forms, you can mark certain fields as being disabled. This means any text in them will not be editable and they will show up in a nice gray color. However, if you want to re-enable the field you have to use a bit of ActionScript. Here is an example:

<div class="code"><FONT COLOR=MAROON>&lt;cfset data = queryNew(<FONT COLOR=BLUE>"name,age,gender"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"50"</FONT>&gt;</FONT><br>
   <FONT COLOR=MAROON>&lt;cfset queryAddRow(data)&gt;</FONT><br>
   <FONT COLOR=MAROON>&lt;cfset querySetCell(data,<FONT COLOR=BLUE>"name"</FONT>,<FONT COLOR=BLUE>"Name #x#"</FONT>)&gt;</FONT><br>
   <FONT COLOR=MAROON>&lt;cfset querySetCell(data,<FONT COLOR=BLUE>"age"</FONT>,randRange(<FONT COLOR=BLUE>20</FONT>,<FONT COLOR=BLUE>40</FONT>))&gt;</FONT><br>
   <FONT COLOR=MAROON>&lt;cfif randRange(<FONT COLOR=BLUE>0</FONT>,<FONT COLOR=BLUE>1</FONT>) is<FONT COLOR=BLUE> 1</FONT>&gt;</FONT><br>
      <FONT COLOR=MAROON>&lt;cfset querySetCell(data,<FONT COLOR=BLUE>"gender"</FONT>,<FONT COLOR=BLUE>"Male"</FONT>)&gt;</FONT><br>
   <FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
      <FONT COLOR=MAROON>&lt;cfset querySetCell(data,<FONT COLOR=BLUE>"gender"</FONT>,<FONT COLOR=BLUE>"Female"</FONT>)&gt;</FONT><br>
   <FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"onchange"</FONT>&gt;</FONT><br>
if(data.selectedIndex != undefined) {<br>
&nbsp;&nbsp;&nbsp;name.enabled = true;<br>
} else { <br>
&nbsp;&nbsp;&nbsp;name.enabled = false;<br>
&nbsp;&nbsp;&nbsp;name.text = '';<br>
}<br>
<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfform format=<FONT COLOR=BLUE>"flash"</FONT> name=<FONT COLOR=BLUE>"foo"</FONT> width=<FONT COLOR=BLUE>"400"</FONT> height=<FONT COLOR=BLUE>"400"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfgrid query=<FONT COLOR=BLUE>"data"</FONT> name=<FONT COLOR=BLUE>"data"</FONT> onChange=<FONT COLOR=BLUE>"#onchange#"</FONT>/&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"name"</FONT> width=<FONT COLOR=BLUE>"150"</FONT> bind=<FONT COLOR=BLUE>"{% raw %}{data.dataProvider[data.selectedIndex]['name']}{% endraw %}"</FONT> disabled=true&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT></div>

Completely ignore the first portion as all it does is create our data. Instead pay attention to the onchange variable. This is run whenever anyone clicks in the grid. The first thing we do is check to see if something was selected. If the user holds their CTRL key down while clicking on an item, it will actually <i>deselect</i> the row, so we check selectedIndex to make sure it actually equals something. If it does, we simply turn on the control. Notice, however, that we say enabled=true in ActionScript, but disabled=true in the cfinput tag. 

If there is no selectedIndex, I re-disable the field. Also note the name.text='' line. I use this because the value will turn to "undefined" if you deselect a grid row. I could have done some fancy work in my bind as well to handle that, but I was lazy.

Ok, I won't be lazy. If you want to remove the name.text='' line, you can use this binding expression: 

{% raw %}{data.selectedIndex!=undefined?data.dataProvider[data.selectedIndex]['name']:''}{% endraw %}