---
layout: post
title: "Ask a Jedi: Hack for percentage based CFCHART"
date: "2011-06-27T15:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/27/Ask-a-Jedi-Hack-for-percentage-based-CFCHART
guid: 4285
---

Mike asked: 
<p/>

<blockquote>
Do you know if there is a way to set an auto width to cfchart? Setting a pixel width doesn't work well when coding for touch screens with the different widths for portrait and landscape views. Thanks for any help you can provide.
</blockquote>
<p/>
<!--more-->
Interesting question. You may notice that cfchart's height and width attributes only accept real numbers, not percentages. I first tried a hack where I modified the output HTML containing the SWF:

<p/>

<code>
&lt;cfset d = []&gt;
&lt;cfset d[1] = {% raw %}{date="1/1/2011 03:22", value=99}{% endraw %}&gt;
&lt;cfset d[2] = {% raw %}{date="1/2/2011 04:22", value=80}{% endraw %}&gt;
&lt;cfset d[3] = {% raw %}{date="1/3/2011 09:22", value=79}{% endraw %}&gt;

&lt;cfsavecontent variable="html"&gt;
&lt;cfchart chartheight="500" chartwidth="500" title="Test Chart"
backgroundcolor="red"&gt;

       &lt;cfchartseries type="bar"&gt;
               &lt;cfloop index="item" array="#d#"&gt;
                       &lt;cfchartdata item="#item.date#" value="#item.value#"&gt;
               &lt;/cfloop&gt;
       &lt;/cfchartseries&gt;

&lt;/cfchart&gt;
&lt;/cfsavecontent&gt;

&lt;cfset html=replace(html, "WIDTH=""500""", "WIDTH=""100%""","all")&gt;
&lt;cfoutput&gt;#html#&lt;/cfoutput&gt;
</code>

<p/>

Technically that works - the resultant object/embed tags are updated and the SWF takes 100% of the available width, but the actual chart inside the SWF doesn't size with the change. I then tried the non-interactive version with an image. Because an image map is used normally, I had to store the bits of the image to the file system and then output it.

<p/>

<code>
&lt;cfset d = []&gt;
&lt;cfset d[1] = {% raw %}{date="1/1/2011 03:22", value=99}{% endraw %}&gt;
&lt;cfset d[2] = {% raw %}{date="1/2/2011 04:22", value=80}{% endraw %}&gt;
&lt;cfset d[3] = {% raw %}{date="1/3/2011 09:22", value=79}{% endraw %}&gt;

&lt;cfchart chartheight="500" chartwidth="500" title="Test Chart"
backgroundcolor="red" format="png" name="img"&gt;

       &lt;cfchartseries type="bar"&gt;
               &lt;cfloop index="item" array="#d#"&gt;
                       &lt;cfchartdata item="#item.date#" value="#item.value#"&gt;
               &lt;/cfloop&gt;
       &lt;/cfchartseries&gt;

&lt;/cfchart&gt;

&lt;cfset fileWrite(expandPath("./mychart.png"),img)&gt;

&lt;style&gt;
.chartimage {
       width: 100%;
}
&lt;/style&gt;
&lt;img src="mychart.png" class="chartimage"&gt;
</code>

<p/>

If you do use this code (and it does actually work), you would want to modify it to not generate and write on every request. It should intelligently determine if it needs to generate a new file first. I'll also remind people that while cfchart is pretty powerful, it's also a bit old. <b>It is not the only way to do charting in ColdFusion.</b> There are numerous other solutions as well.