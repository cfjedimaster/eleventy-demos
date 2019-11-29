---
layout: post
title: "Spry, Detail Regions, and hiding content until a click"
date: "2008-08-28T17:08:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/08/28/Spry-Detail-Regions-and-hiding-content-until-a-click
guid: 2993
---

That's not a great title up there, but I worked with a reader this week on an interesting problem with Spry. The issue seemed simple enough. How do you hide a detail region until the user actually selects a row in a data set? Turns out though that this is more difficult then it seems.
<!--more-->
When you loop over a query in ColdFusion, there is always a concept of a current row. The same applies to datasets in Spry. There is always a current row. Period. So if you use a detailregion it will be bound to the current row, which by default will be the first row.

I worked on it a bit and came across the following hack/solution. If you hide the detailregion using CSS, you can use a click event to unhide it. Here is a sample:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Spry Test&lt;/title&gt;
&lt;script type="text/javascript" src="/spryjs/xpath.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/spryjs/SpryData.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/spryjs/SpryUtils.js"&gt;&lt;/script&gt;

&lt;script type="text/javascript"&gt;
var mydata = new Spry.Data.XMLDataSet("people.cfm","/people/person"); 
mydata.setColumnType("age","numeric");

function showit() {
	console.log('ran it');
	Spry.$("dregion").style.display="block";
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div spry:region="mydata"&gt;

	&lt;table width="500" border="1"&gt;
		&lt;tr&gt;
			&lt;th spry:sort="name" style="cursor: pointer;"&gt;Name&lt;/th&gt;
			&lt;th spry:sort="age" style="cursor: pointer;"&gt;Age&lt;/th&gt;
			&lt;th spry:sort="gender" style="cursor: pointer;"&gt;Gender&lt;/th&gt;
		&lt;/tr&gt;
		&lt;tr spry:repeat="mydata" spry:setrow="mydata" onClick="showit()"&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{name}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{age}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{gender}{% endraw %}&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;	
	
&lt;/div&gt;

&lt;div spry:detailregion="mydata" id="dregion" style="display:none"&gt;
&lt;p&gt;
Selected name: {% raw %}{name}{% endraw %}
&lt;/p&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

Look at this template from the bottom up. First note the CSS in the detailregion block. This hides the content. Then note the click event for the table row. Finally look at showit. This will simply unhide the div block at the bottom.

There are two things I could do to improve this. One, my showit function could check to see if the region is still hidden before bothering to unhide it. 

Secondly I could have used unobtrusive JavaScript. Spry provides a nice function for this, addEventListener. However, I had trouble with this. I forgot that when Spry 'writes' out it's data, it blows away the content in your divs. So my addEventListener call didn't work. I could have made it work, however, by simply running the function after the region was drawn. Spry supports this easily enough.

I shared my code with the Spry team (warning to Adobians - never give me your email address or I'll bug you to death!) and Kin Blas made an interesting suggestion. 

Spry supports 'states' for regions. This makes it easy to show X during loading and Y when done. This can all be done without a lick of JavaScript which is cool. But Spry also lets you do any custom state you want. You could then use this in your Spry code as a way of hiding content. This still feels a bit weird to me, but it works. Consider:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;title&gt;Spry Test&lt;/title&gt;
&lt;script type="text/javascript" src="/spryjs/xpath.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/spryjs/SpryData.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/spryjs/SpryUtils.js"&gt;&lt;/script&gt;

&lt;script type="text/javascript"&gt;
var mydata = new Spry.Data.XMLDataSet("people.cfm","/people/person"); 
mydata.setColumnType("age","numeric");

function showit() {
	var rgn = Spry.Data.getRegion("dregion");
	rgn.mapState("ready", "firstClick");
	rgn.updateContent();
	console.log('ran');
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;div id="mydatadiv" spry:region="mydata"&gt;

	&lt;table width="500" border="1"&gt;
		&lt;tr&gt;
			&lt;th spry:sort="name" style="cursor: pointer;"&gt;Name&lt;/th&gt;
			&lt;th spry:sort="age" style="cursor: pointer;"&gt;Age&lt;/th&gt;
			&lt;th spry:sort="gender" style="cursor: pointer;"&gt;Gender&lt;/th&gt;
		&lt;/tr&gt;
		&lt;tr spry:repeat="mydata" spry:setrow="mydata" onClick="showit()"&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{name}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{age}{% endraw %}&lt;/td&gt;
			&lt;td style="cursor: pointer;"&gt;{% raw %}{gender}{% endraw %}&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;	
	
&lt;/div&gt;

&lt;div spry:detailregion="mydata" id="dregion" spry:state="firstClick"&gt;
&lt;p&gt;
Selected name: {% raw %}{name}{% endraw %}
&lt;/p&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

Again, go from the bottom up. I supplied a custom state, firstClick, to my detail region. My click handler then says: For so and so region, the 'ready' state is really named firstClick. So when the page loads, Spry doesn't have a valid ready state for the detail region and therefore doesn't draw it. When I click, Spry is told: "Hey buddy, the ready state is really named firstClick." Since the data is ready (it was ready before I clicked), it immediately draws the content.

Kin made the point that this method will actually prevent Spry from writing out the detail region. My method didn't do that - it just hid it from the user.