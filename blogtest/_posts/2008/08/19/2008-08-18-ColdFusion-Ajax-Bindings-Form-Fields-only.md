---
layout: post
title: "ColdFusion Ajax Bindings - Form Fields only?"
date: "2008-08-19T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/19/ColdFusion-Ajax-Bindings-Form-Fields-only
guid: 2977
---

Jose asks:

<blockquote>
<p>
I just got started using cfdiv an the other AJAX related tags and I have a question about passing params in the bind attribute. I have the following test code:

&lt;cfinput name="EmployeeID" type="hidden" value="#variables.EmployeeID#" /&gt;<br />
<br />
&lt;cfgrid name="goals" format="html" striperows="yes" 
bind="cfc:ab.model.goals.goalsGateway.getGoalsGridRecordSet(page={% raw %}{cfgridpage}{% endraw %}, pagesize={% raw %}{cfgridpagesize}{% endraw %}, gridSortColumn={% raw %}{cfgridsortcolumn}{% endraw %}, gridSortDirection={% raw %}{cfgridsortdirection}{% endraw %}, EmployeeID={% raw %}{EmployeeID}{% endraw %})"&gt;<br />
<br />
Does it mean I can only pass filter params for the cfcs I am using thru having those hidden "pass thru" fields? What I am missing?
</p>
</blockquote>
<!--more-->
The short answer is yes. Bindings allow you to speak to JavaScript, CFCs, and vanilla URLs, and they allow you to automatically monitor values of form fields. (As well as events.) But it doesn't mean you have to use a hidden form field as you have here. You could have simply hard coded the value like so:

bind="cfc:ab.model.goals.goalsGateway.getGoalsGridRecordSet(page={% raw %}{cfgridpage}{% endraw %}, pagesize={% raw %}{cfgridpagesize}{% endraw %}, gridSortColumn={% raw %}{cfgridsortcolumn}{% endraw %}, gridSortDirection={% raw %}{cfgridsortdirection}{% endraw %}, EmployeeID=#variables.employeid#)"

Note when I say 'hard coded', what I mean is that the value is still dynamic (see the #s?) but it isn't a client side bound variable. 

Just to be clear - this doesn't mean that ColdFusion's Ajax support can only work with form fields. It's just that the bindings to allow for automatic updates are tied to form fields. (And Spry datasets as well, but that's another story.) You can still easily call server side code using cfajaxproxy for example, and pass anything you want, but this does mean you have to write a few lines of JavaScript.