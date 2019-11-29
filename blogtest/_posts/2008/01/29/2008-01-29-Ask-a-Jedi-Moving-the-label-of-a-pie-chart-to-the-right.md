---
layout: post
title: "Ask a Jedi: Moving the label of a pie chart to the right"
date: "2008-01-29T13:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/29/Ask-a-Jedi-Moving-the-label-of-a-pie-chart-to-the-right
guid: 2621
---

Andy asks:

<blockquote>
<p>
Dear Jedi. How can I get the legend to show up on the right of my pie chart. It seems perpetually stuck at the top. I'm using cf7 (and will upgrade to 8 in the next few months).
</p>
</blockquote>

There is no direct way, but once again, the Chart Editor that ships with ColdFusion comes to the rescue. I loaded it up, selected a Pie chart, and edited the Legend property. I selected Right alignment, and took the generated XML. Now the XML I got had a few extra elements, but I stripped it down to this:

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;pieChart&gt;
          &lt;legend placement="Right"/&gt;
&lt;/pieChart&gt;
</code>

All together, the code then is:

<code>
&lt;cfsavecontent variable="style"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;pieChart&gt;
          &lt;legend placement="Right"/&gt;
&lt;/pieChart&gt;
&lt;/cfsavecontent&gt;

&lt;cfchart format="flash" show3d="true" style="#style#"&gt;
	&lt;cfchartseries type="pie"&gt;
		&lt;cfchartdata item="Like Pacman" value="75"&gt;
		&lt;cfchartdata item="Not like Pacman" value="25"&gt;		
	&lt;/cfchartseries&gt;
&lt;/cfchart&gt;
</code>

Here is a screen shot of the default pie chart followed by the modified one. As you can see, the colors change a bit too, but if you don't like the colors you can tweak that as well.

<img src="https://static.raymondcamden.com/images//Picture 15.png">