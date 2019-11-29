---
layout: post
title: "Random code I'm sharing for no good reason"
date: "2014-11-09T22:11:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2014/11/09/Random-code-Im-sharing-for-no-good-reason
guid: 5346
---

<p>
Ok, the title should be your warning. I'm only posting this because it is Sunday night and I'm bored. I'm working on a demo for my jQuery video (did I mention I'm working on a jQuery video?) that mimics a typical car dealership inventory search. As we just upgraded our car I'm pretty familiar with these. The demo will focus on building the UI to create a search engine that can filter cars by model, trim, color, price, and features. In order to actually have something to search against, I wrote a script that creates an inventory of cars. Here is that script. Enjoy.
</p>
<!--more-->
<pre><code class="language-javascript">&#x2F;**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 *&#x2F;
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

&#x2F;*
A utility to create my car data.

We have models
Models have trims (which they all share)
cars have a color
and an array of features from a list of possible ones
*&#x2F;

var models = [&quot;Alpha&quot;, &quot;Beta&quot;, &quot;Gamma&quot;, &quot;Delta&quot;, &quot;Epsilon&quot;];
var trims = [&quot;XT&quot;, &quot;XTE&quot;, &quot;Super&quot;, &quot;Ultimate&quot;];
var colors = [&quot;Red&quot;, &quot;Blue&quot;, &quot;Silver&quot;, &quot;Gold&quot;, &quot;Black&quot;, &quot;White&quot;];
var features = [&quot;Air Conditioning&quot;, &quot;Cruise Control&quot;, &quot;Backup Camera&quot;, &quot;Power Steering&quot;, &quot;Internet&quot;, &quot;Sat Radio&quot;, &quot;4WD&quot;, &quot;Moon Roof&quot;];

var inventory = [];

&#x2F;*
Ok, loop over each model. Each model will have 5-20 (rnd) of each trim.
Each car will have a random color.
Each car will have a random chance of having a feature with higher trims having a better chance of having it.
Each car will have a price btn 20K-40K with each level of trim adding +10k to make them, normally, higher

*&#x2F;
for(var i=0; i &lt; models.length; i++) {
	var model = models[i];
	for(var k=0; k &lt; trims.length; k++) {
		var trim = trims[k];
		var numberToAdd = getRandomInt(8, 23);
		console.log(&quot;Going to make &quot;+numberToAdd+&quot; &quot;+model+&quot; &quot;+trim);
		
		for(var j=0; j&lt;numberToAdd; j++) {
			var car = {
				model:model,
				trim:trim
			};
			car.color = colors[getRandomInt(0, colors.length-1)];
			car.price = getRandomInt(20000, 40000) + (k*10000);
			car.features = [];
			for(var z=0; z&lt;features.length; z++) {
				if(getRandomInt(1,10) + k &gt; 6) {
					car.features.push(features[z]);
					car.price += (car.features.length+1)*1000;
				}
			}
			inventory.push(car);
		}
		
	}
}

&#x2F;&#x2F;so i can see it
console.table(inventory);
&#x2F;&#x2F;so i can copy it
console.log(JSON.stringify(inventory));</code></pre>

<p>
In case you're curious, I'm going to write a simple module that wraps calls to this data so that I don't have to use an application server to serve it up.
</p>