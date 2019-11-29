---
layout: post
title: "A quick Pokemon demo, because, Pokemon"
date: "2015-08-15T13:45:25+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/08/15/a-quick-pokemon-demo-because-pokemon
guid: 6633
---

So, I'm not really a Pokemon person (and yes, I know there's an accent in the word, but I'm not even going to bother trying to type that), but my son came to me last night with an interesting request. He is quite the artist, and he decided he wanted to start an incredibly ambitious project: Every day he is going to sketch a Pokemon. All 700 plus of them. His request was rather simple. Given that Pokemon had a number, he wanted me to generate a random list from 1 to 721. 

<!--more-->

I told him I could do that - but I had a better idea. I knew there was a Pokemon API (<a href="http://pokeapi.co/">Pokéapi</a>) and I thought I could probably whip up a quick list for him using that data. Unfortunately, the API doesn't support the ability to return all the Pokemon at once. But the API itself is 100% open source (<a href="https://github.com/phalt/pokeapi">https://github.com/phalt/pokeapi</a>) and it includes the raw CSV data behind the API. So I cloned a copy of the repo locally and built the following quick demo. As a warning, this is <strong>not</strong> optimized. I wanted to build something super quick (it was last night, I was tired, etc. etc.). 

<pre><code class="language-markup">&lt;html&gt;
&lt;head&gt;
	&lt;script src=&quot;https://code.jquery.com/jquery-2.1.4.min.js&quot;&gt;&lt;/script&gt;
	&lt;script&gt;
	function randomIntFromInterval(min,max)
	{
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	$(document).ready(function() {

		console.log(&quot;ready to go&quot;);
		$.get(&quot;pokeapi/data/v2/csv/pokemon.csv&quot;, function(res) {
			var lines = res.split(/\n/);
			//remove line 1
			lines.splice(0,1);

			//remove specials
			lines = lines.filter(function(line) {
				var parts = line.split(&quot;,&quot;);
				return parseInt(parts[parts.length-1],10) === 1;	
			});
			
			console.log(lines.length + &quot; lines of data&quot;);

			var s = &quot;&quot;;
			while(lines.length) {
				var chosen = randomIntFromInterval(0, lines.length-1);
				var poke = lines[chosen];
				var parts = poke.split(&quot;,&quot;);
				var sprite = &quot;&lt;img src=\&quot;pokeapi/data/Pokemon_XY_Sprites/&quot;+parts[0]+&quot;.png\&quot;&gt;&quot;;
				s += &quot;&lt;tr&gt;&lt;td&gt;&quot;+parts[0]+&quot;&lt;/td&gt;&lt;td&gt;&quot;+parts[1]+&quot;&lt;/td&gt;&lt;td&gt;&quot;+sprite+&quot;&lt;/td&gt;&lt;/tr&gt;&quot;;
				lines.splice(chosen,1);
			}
			$(&quot;table tbody&quot;).append(s);
		});

	})
	&lt;/script&gt;
	&lt;style&gt;
		th {
			width: 200px;
		}
		td {
			text-align: center;	
		}
	&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

	&lt;table border=&quot;1&quot;&gt;
		&lt;thead&gt;
			&lt;tr&gt;&lt;th&gt;ID&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Sprite&lt;/th&gt;&lt;/tr&gt;
		&lt;/thead&gt;
		&lt;tbody&gt;
		&lt;/tbody&gt;
	&lt;/table&gt;

&lt;/body&gt;
&lt;/html&gt;</code></pre>

I begin by simply Ajaxing the CSV file that contains all the Pokemon data. I strip off the first line (it just contains headers) and then filter out rows containing "non-default" Pokemon. My son can explain why that is important - frankly I didn't get it. Then I just pick a random item from the array and remove it. 

The GitHub repo also contains images (sprites) so I include that in the table display. Here is a quick snapshot of some of the report:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/08/shot14.png" alt="shot1" width="716" height="750" class="aligncenter size-full wp-image-6634 imgborder" />

If you want to run the demo yourself, you can do so here: <a href="https://static.raymondcamden.com/pokemon/">https://static.raymondcamden.com/pokemon/</a>