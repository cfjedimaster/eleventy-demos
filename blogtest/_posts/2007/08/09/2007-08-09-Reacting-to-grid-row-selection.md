---
layout: post
title: "Reacting to grid row selection"
date: "2007-08-09T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/09/Reacting-to-grid-row-selection
guid: 2267
---

This week must be grid week. First we have Bruce Phillips' <a href="http://www.brucephillips.name/blog/index.cfm/2007/8/8/Updating-and-Adding-Records-Being-Displayed-In-ColdFusion-8s-cfgrid">post on cfgrid</a> last night, and today Todd Sharp <a href="http://cfsilence.com/blog/client/index.cfm/2007/8/9/Filtering-Records-In-An-Ajax-Grid">posted</a> on it as well. I thought I'd follow the crowd and share a tip as well. How do you do something (anything) when a user clicks on a grid, specifically when using the new HTML cfgrid in ColdFusion 8?
<!--more-->
Technically there isn't a attribute that you can add to the grid itself. However, other form fields can easily bind to the grid itself. So if you wanted to build an edit form, for example, that is pretty easy (and again, see Bruce Phillips' <a href="http://www.brucephillips.name/blog/index.cfm/2007/8/8/Updating-and-Adding-Records-Being-Displayed-In-ColdFusion-8s-cfgrid">post</a>).
But what if you wanted more fine grained control? This is where CFAJAXPROXY comes in.

Now if you are like me - you looked at the docs on CJAJAXPROXY and were impressed with how cool it is to be able to create a connection to a CFC. That's amazing, and in my mind, I think it is the most impressive new feature in ColdFusion 8.

But what people may miss (I know I did!) is that CFAJAXPROXY has a whole other... "mode" we shall call it, that lets the tag act in a complete separate manner. In fact, it is so different I'm not quite sure why another tag wasn't made, like CFBIND for example. This other mode takes one main attribute, bind. You can also use a onSuccess and onError attribute. In this mode, the tag simply acts as a listener. So image my grid is named entries. I can bind to it like so:

<code>
&lt;cfajaxproxy bind="javascript:noteChange({% raw %}{entries.title}{% endraw %})"&gt;
</code>

All this says is - when the grid changes - call a JavaScript function and pass the value of the Title column. I could also use a CFC or CFM bind as well, but you get the idea. Again, I think CFBIND would be a better name since in this form the tag isn't creating a proxy object for a remote CFC. But that's neither here nor there - lets get back to the original question - how do I react to a grid change?

First you need to figure out what values you want. In my code sample above, I grabbed the title column. If I wanted something different, like ID, I'd do:

<code>
&lt;cfajaxproxy bind="javascript:noteChange({% raw %}{entries.id}{% endraw %})"&gt;
</code>

Or I can do both:

<code>
&lt;cfajaxproxy bind="javascript:noteChange({% raw %}{entries.title}{% endraw %},{% raw %}{entries.id}{% endraw %})"&gt;
</code>

Now for a complete example:

<code>
&lt;cfajaxproxy bind="javascript:noteChange({% raw %}{entries.title}{% endraw %},{% raw %}{entries.id}{% endraw %})"&gt;

&lt;script&gt;
function noteChange(title,id) {
	alert(title+' '+id);
}
&lt;/script&gt;

&lt;cfquery name="entries" datasource="blogdev"&gt;
select	*
from	tblblogentries
limit   0,10
&lt;/cfquery&gt;

&lt;cfform name="test"&gt;
&lt;cfgrid autowidth="true" name="entries" format="html" query="entries" pageSize="10"&gt;
	&lt;cfgridcolumn name="id" display="false"&gt;

	&lt;cfgridcolumn name="title" header="Title"&gt;
	&lt;cfgridcolumn name="posted" header="Posted"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;
</code>

In this example I'm loading up my HTML grid with a query (yes, you don't have to use Ajax for HTML grids). On the top of my template I bound my JavaScript function to the entries grid. Whenever I selected an entry in my grid, an alert will be fired.

I want to point out one last thing. Take a look at the first cfgridcolumn. Why do I have a column that I don't bother displaying? When you specify the columns to show - you are also limiting the data actually stored in the grid. If I didn't have that hidden column there, I wouldn't be able to use the ID column in my bind.