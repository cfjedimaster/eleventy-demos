---
layout: post
title: "Custom Y-Axis Labels in ColdFusion Charting"
date: "2013-10-09T07:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/10/09/Custom-YAxis-Labels-in-ColdFusion-Charting
guid: 5056
---

<p>
This question came in via a reader and led to some interesting aspects of the <a href="http://www.zingchart.com">ZingChart</a> engine embedded in ColdFusion 10 (remember though that this is Enterprise only). The reader wanted to replace the numeric labels on the Y-Axis with strings instead. From my experience with ZingChart in the past, I assumed this was probably possible. The engine is incredibly powerful and has about a bazillion options. I reached out to the company on Twitter and with their help, I was able to get it working. 
</p>
<!--more-->
<p>
First, let's start with a simple bar chart.
</p>

<pre><code class="language-markup">
&lt;cfscript&gt;
&#x2F;&#x2F;sample data
data = queryNew(&quot;name,age&quot;, &quot;cf_sql_varchar,cf_sql_integer&quot;, [
	{% raw %}{name:&quot;Ray&quot;,age:40}{% endraw %},
	{% raw %}{name:&quot;Dave&quot;,age:41}{% endraw %},
	{% raw %}{name:&quot;Todd&quot;,age:38}{% endraw %},
	{% raw %}{name:&quot;Scott&quot;,age:55}{% endraw %}

]);

writedump(data);
&lt;&#x2F;cfscript&gt;

&lt;p&#x2F;&gt;
	
&lt;cfchart format=&quot;html&quot; showLegend=&quot;false&quot; &gt;

	&lt;cfchartseries type=&quot;bar&quot; query=&quot;data&quot; valueColumn=&quot;age&quot; itemColumn=&quot;name&quot; &gt;
	&lt;&#x2F;cfchartseries&gt;

&lt;&#x2F;cfchart&gt;
</code></pre> 

<p>
I've got a fake query (and fake data, Scott really isn't <i>that</i> old) that I pass to cfchart. Here is the result.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_10_9_13_5_44_AM.jpg" />
</p>

<p>
The goal now is to change the y-axis values so that I can label a few values from young, to medium, and to old. There are two things you need to do in order to make this work. First, you need to specify your y-axis values instead of letting this happen automatically. For a chart involving age, this is rather easy. Depending on your data this may or may not be a big deal. This can be done via the yaxisvalues attribute of cfchart: yaxisvalues="#[10,20,30,40,50,60,70]#".
</p>

<p>
That helps define the actual range on the yaxis. To define the labels, you will use the yaxis attribute. This takes a structure of options. I <i>believe</i> the documentation for what you can send is defined <a href="http://www.zingchart.com/reference/json-syntax.html#graph__scale-y">here</a>, but I'm not entirely sure about that. With the ZingChart folks helping me out on Twitter, I was told specifically what to pass - a labels key. Let's look at an updated example.
</p>

<pre><code class="language-markup">
&lt;cfchart yaxisvalues=&quot;#[10,20,30,40,50,60,70]#&quot; yaxis=&quot;#{% raw %}{&quot;labels&quot;:[&quot;&quot;,&quot;&quot;,&quot;young&quot;,&quot;medium&quot;,&quot;old&quot;,&quot;&quot;,&quot;&quot;]}{% endraw %}#&quot; format=&quot;html&quot; showLegend=&quot;false&quot; &gt;

	&lt;cfchartseries type=&quot;bar&quot; query=&quot;data&quot; valueColumn=&quot;age&quot; itemColumn=&quot;name&quot; &gt;
	&lt;&#x2F;cfchartseries&gt;

&lt;&#x2F;cfchart&gt;
</code></pre> 

<p>
Notice how some of the labels are blank. This creates the effect of a chart with only the string labels, not the numbers.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_10_9_13_5_50_AM.jpg" />
</p>

<p>
If you want to keep the numbers as well as the strings, simply include them in the labels.
</p>

<pre><code class="language-markup">
&lt;cfchart yaxisvalues=&quot;#[10,20,30,40,50,60,70]#&quot; yaxis=&quot;#{% raw %}{&quot;labels&quot;:[&quot;10&quot;,&quot;20&quot;,&quot;young&quot;,&quot;medium&quot;,&quot;old&quot;,&quot;60&quot;,&quot;70&quot;]}{% endraw %}#&quot; format=&quot;html&quot; showLegend=&quot;false&quot; &gt;

	&lt;cfchartseries type=&quot;bar&quot; query=&quot;data&quot; valueColumn=&quot;age&quot; itemColumn=&quot;name&quot; &gt;
	&lt;&#x2F;cfchartseries&gt;

&lt;&#x2F;cfchart&gt;
</code></pre> 

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_10_9_13_5_51_AM.jpg" />
</p>

<p>
All in all, pretty nice. You can do other things with the labels including rotating them, sizing them, etc. As I said, ZingChart has a <strong>huge</strong> amount of options. For those of you not using ColdFusion 10 Enterprise, it may be worth purchasing as is and just using it natively. The price is $250 for a single domain and while there are many free options out there, I've been very impressed with ZingChart and their technical support. (As I mentioned above, they helped me out on Twitter and this is not the first time they have done so.)
</p>