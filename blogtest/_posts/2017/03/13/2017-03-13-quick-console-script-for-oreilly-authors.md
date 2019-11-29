---
layout: post
title: "Quick console script for O'Reilly Authors"
date: "2017-03-13T17:04:00-07:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2017/03/13/quick-console-script-for-oreilly-authors
---

So... let me start off by saying that this blog post will be useful to approximately 0.01% of you. I'm really just blogging this so I can copy and paste the code later
when I want it again. But I thought it also might be a useful reminder for folks that your browser console is useful for many things, including for 'fixing' issues you may have with a particular page.

I've worked with many publishers, and by a large margin, [O'Reilly](https://www.oreilly.com/) is my favorite. They aren't too pushy about how you write the book while still working hard to ensure you create something good. In general, every book project I've had with them has been great. There's one aspect though that kinda bugs me. Their portal for authors gives you a nice quick shot of your sales over time:

![Chart](https://static.raymondcamden.com/images/2017/3/ora1.png)

I've scrambled the text on the left side of the bar (but they are high numbers, honest!) but you can get the basic idea. I can see spikes in my sales and get a general idea of how well the book is doing.

However... notice anything missing from the chart? You can mouse over a data point to see totals, but nowhere is the actual *total* sales presented. I can get that data if I look at my royalty statements, but what I really want is: "You've sold X units."

So I did what any self-respecting web developer did. First, I emailed O'Reilly. Because, come on, they can't read my mind, right? Then I did view source. I noticed the charts were built from raw data on the page (again, numbers changed):

<pre><code class="language-javascript">
var data61068 = [ 
{
   &quot;key&quot; : &quot;Digital&quot;,
values: [
{% raw %}{x: 1476601200000, y: 0}{% endraw %},{% raw %}{x: 1478415600000, y: 0}{% endraw %},{% raw %}{x: 1480233600000, y: 65}{% endraw %},{% raw %}{x: 1480233600000, y: 65}{% endraw %},{% raw %}{x: 1480838400000, y: 24}{% endraw %},{% raw %}{x: 1481443200000, y: 239}{% endraw %},{% raw %}{x: 1482048000000, y: 9}{% endraw %},{% raw %}{x: 1482652800000, y: 5}{% endraw %},{% raw %}{x: 1483257600000, y: 1}{% endraw %},{% raw %}{x: 1483862400000, y: 3}{% endraw %},{% raw %}{x: 1484467200000, y: 71}{% endraw %},{% raw %}{x: 1485072000000, y: 3}{% endraw %},{% raw %}{x: 1485676800000, y: 1}{% endraw %},{% raw %}{x: 1486281600000, y: 0}{% endraw %},{% raw %}{x: 1486886400000, y: 1}{% endraw %},{% raw %}{x: 1488096000000, y: 3}{% endraw %},{% raw %}{x: 1488096000000, y: 2}{% endraw %},{% raw %}{x: 1488700800000, y: 10}{% endraw %},{% raw %}{x: 1489305600000, y: 3}{% endraw %},{% raw %}{x: 1489305600000, y: 3}{% endraw %},]
},{
   &quot;key&quot; : &quot;Print&quot;,
   &quot;color&quot; : &quot;#ff7f0e&quot;,
values: [
{% raw %}{x: 1476601200000, y: 1}{% endraw %},{% raw %}{x: 1478415600000, y: 1}{% endraw %},{% raw %}{x: 1480233600000, y: 1}{% endraw %},{% raw %}{x: 1480233600000, y: 1}{% endraw %},{% raw %}{x: 1480838400000, y: 0}{% endraw %},{% raw %}{x: 1481443200000, y: 0}{% endraw %},{% raw %}{x: 1482048000000, y: 0}{% endraw %},{% raw %}{x: 1482652800000, y: 0}{% endraw %},{% raw %}{x: 1483257600000, y: 0}{% endraw %},{% raw %}{x: 1483862400000, y: 0}{% endraw %},{% raw %}{x: 1484467200000, y: 0}{% endraw %},{% raw %}{x: 1485072000000, y: 0}{% endraw %},{% raw %}{x: 1485676800000, y: 0}{% endraw %},{% raw %}{x: 1486281600000, y: 1}{% endraw %},{% raw %}{x: 1486886400000, y: 0}{% endraw %},{% raw %}{x: 1488096000000, y: 1}{% endraw %},{% raw %}{x: 1488096000000, y: 1}{% endraw %},{% raw %}{x: 1488700800000, y: 0}{% endraw %},{% raw %}{x: 1489305600000, y: 1}{% endraw %},{% raw %}{x: 1489305600000, y: 1}{% endraw %},]
},];
  nv.addGraph(function() {
    var chart = nv.models.lineChart().useInteractiveGuideline(true);
    chart.margin({% raw %}{right:30}{% endraw %});
    chart.xAxis.axisLabel('Week').tickFormat(function(d) {% raw %}{ return d3.time.format('%{% endraw %}x')(new Date(d)) });
    chart.yAxis.axisLabel('Units').tickFormat(d3.format('d'));
    d3.select('#graph61068 svg')
        .datum(data61068)
      .transition().duration(500).call(chart);
      nv.utils.windowResize(chart.update);
      return chart;
  });
</code></pre>

I noticed there was one variable named "dataXXXX" for each of my products. So based on that, I wrote this script for the console:

<pre><code class="language-javascript">
(function() {
	for(let foo in window) {
		if(foo.indexOf('data') !== 0) continue;
		console.log('Item '+foo);
		let total = 0;
		let breakDown = [];
		window[foo].forEach( item =&gt; {
			let thisTotal = item.values.reduce(function(acc, val) {
				return acc + val.y;
			}, 0);
			let thisLabel = item.key;
			total += thisTotal;
			breakDown.push({% raw %}{type:thisLabel, sales:thisTotal}{% endraw %});
		});
		console.log('Total for item is '+total);
		console.table(breakDown);
	}
})()
		
</code></pre>

It's not rocket science - it just looks for those global variables and then parses the data. I store the breakdown (video vs print vs digital) and then print it out using console.table. I'm not terribly pleased with the output, but it works:

![Data](https://static.raymondcamden.com/images/2017/3/ora2.png)

Boom! And as I said - yes - this will be useful for me and.... um... probably no one else. But hopefully it serves as a good reminder - your browser isn't just a document viewing platform. It is a tool - make use of it!