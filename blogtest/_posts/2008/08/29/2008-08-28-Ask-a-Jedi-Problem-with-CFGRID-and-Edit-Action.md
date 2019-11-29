---
layout: post
title: "Ask a Jedi: Problem with CFGRID and Edit Action"
date: "2008-08-29T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/29/Ask-a-Jedi-Problem-with-CFGRID-and-Edit-Action
guid: 2994
---

Patrice asks:

<blockquote>
<p>
This ajax cfgrid lets you enter a percentage, then updates
the database. I have to pass two parameters to my update query, WORKORDER and DIVISION_NO. I need to pass the DIVISION_NO that is on the same row as the
percentage entered. My problem is that after entering the percent, the update fires off, but with the DIVISION_NO from what ever row your cursor ends up on. Any help would be appreciated. Thanks!
</p>
</blockquote>
<!--more-->
This was a subtle error on her part. Let's look at her grid (which I modified a bit to work in my environment) to see what went wrong. 

<code>
&lt;cfset variables.workorder = 99&gt;

&lt;cfform name="form01"&gt;
&lt;cfinput type="Hidden" name="WORKORDER" value="#variables.WORKORDER#"&gt;
&lt;cfinput type="hidden" name="DIVISION_NO" bind="{% raw %}{grid01.DIVISION_NO}{% endraw %}" bindonload="Yes"&gt;

   &lt;cfgrid format="html" name="grid01" pagesize=26 selectonload="False" stripeRows=true stripeRowColor="##c0c0c0" colheaderbold="Yes"
			bind="cfc:test.getTaskorderDivision({% raw %}{cfgridpage}{% endraw %},{% raw %}{cfgridpagesize}{% endraw %},{% raw %}{cfgridsortcolumn}{% endraw %},{% raw %}{cfgridsortdirection}{% endraw %},{% raw %}{WORKORDER}{% endraw %})"
           delete="yes" selectmode="edit" onchange="cfc:test.editData({% raw %}{cfgridaction}{% endraw %},{% raw %}{cfgridrow}{% endraw %},{% raw %}{cfgridchanged}{% endraw %},{% raw %}{WORKORDER}{% endraw %},{% raw %}{DIVISION_NO}{% endraw %})"&gt;

  &lt;cfgridcolumn name="DIVISION_NO" display=true header="Division" width="60" select="no"/&gt;
  &lt;cfgridcolumn name="DIV_NAME" display=true header="Division Name" width="180" select="no"/&gt;
  &lt;cfgridcolumn name="PERCENT" display=true header="Percent" width="60"/&gt;
&lt;/cfgrid&gt;

&lt;/cfform&gt;
</code>

Focus in on the onchange action. Note that it's going to call my test CFC, editData method, and pass four arguments: cfgridaction, cfgridrow, cfgridchanged, WORKORDER, DIVISION_NO. Believe it or not, as much as I had played with the new CFGRID in CF8, I had yet to try an edit action with it. I was surprised how easy it was to set up. But I did immediately see the issue when I examined the post in Firebug. (And yes, I'm going to mention Firebug again. 9 out of 10 problems sent to me would be fixed if people would use Firebug to help flesh out the issues. Even if your organization is an IE only shop, you need to install Firefox/Firebug on your development machine. <b>Please!</b>)

When I edited the percent column, I saw the following POST data sent:

gridaction=U - This means update, which makes sense. It was an edit event after all.

gridrow=<br />
division_no: 2<br />
div_name: div 2<br />
percent: 2

This represents the row you modified. Note the right division is there. (I had edited the percent value in the second row.)

gridrowchanged:<br />
percent: 20

This represents what you changed. I had changed percent from 2 to 20.

workorder: 99<br />
The hard coded work order. Well, hard coded for me test. Her code had it as a variable.

do: 1

This is what you are seeing wrong, but consider that your hidden form field, division_no, is bound to the grid. So this is what happens. I was on row 2. I edited, then clicked row 1. At that point 2 things happened. An edit event was raised. That edit event was ALSO bound to the hidden field, and THAT was bound to the grid and gets the CURRENT
value. Since I had clicked on row 1, it shows row 1 value.

So the fix here was to simply not bother passing the division number value at all. Since the entire row is sent in the post, you can get all the data from the row that was modified.