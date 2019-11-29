---
layout: post
title: "Snap.svg demo - Census Data"
date: "2013-10-28T09:10:00+06:00"
categories: [development,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2013/10/28/Snapsvg-demo-Census-Data
guid: 5070
---

<p>
Last week I <a href="http://www.raymondcamden.com/index.cfm/2013/10/23/Introducing-Snapsvg">blogged</a> about the release of <a href="http://www.snapsvg.io">Snap.svg</a>, a new library for modern browsers to simplify the creation, usage, and animation of SVG assets. Over the past few days I've worked on a new demo of Snap.svg that I'd like to share with you.
</p>
<!--more-->
<p>
My demo makes use of the <a href="http://www.census.gov/developers/">American Census data API</a>, specifically a collection of data from 2010. The Census API has - in my opinion - pretty poor documentation. It was pretty painful figuring stuff out. Their support forum though is active and I was able to get help there. Once I got over a few hurdles it was relatively simple to figure out the rest. 
</p>

<p>
I began with a simple SVG map of America (you can view this <a href="http://www.raymondcamden.com/demos/2013/oct/26/Blank_US.svg">here</a>). I found this on Wikipedia (and unfortunately forgot to copy the source URL) and while it was pretty good as is, for some reason the ID for Virginia was left out. I then dug up a JSON file for American states (credit: <a href="https://gist.github.com/mshafrir/2646763">https://gist.github.com/mshafrir/2646763</a>) to give me a list of states I could work with. 
</p>

<p>
At this point, I had everything I needed. My blank map. My list of states. And finally - Snap.svg itself to give me a library to work with it together. Next, I began work on a simple Census wrapper. I only built the bare minimum of what I needed for the demo and it is focused on getting data for every state, but in theory I could take this and expand upon it later.  While you can obviously view source, here is the library.
</p>

<pre><code class="language-javascript">&#x2F;* global $ *&#x2F;
var CensusLib = function() {
	var apikey;
	
	function getBaseURL() {
		return &quot;http:&#x2F;&#x2F;api.census.gov&#x2F;data&#x2F;2010&#x2F;acs5?key=&quot;+apikey;
	}
	function setAPIKey(key) {
		apikey = key;
	}
	
	&#x2F;&#x2F;Data translator:
	&#x2F;&#x2F;I do a few things to the result set.
	function translate(d,valuekey) {
		var result = [];
		var i,len;
		&#x2F;&#x2F;the &#x27;header&#x27; is the first row
		var header = [];
		for(i=0; i&lt;d[0].length; i++) {
			header.push(d[0][i]);
		}
		for(i=1,len=d.length; i&lt;len; i++) {
			var item = {};
			for(var j=0;j&lt;header.length;j++) {
				if(header[j] === valuekey) {
					item.value = Number(d[i][j]);
				} else {
					item[header[j]] = d[i][j];
				}
			}
			result.push(item);
		}
		return result;
	}
	
	function getMedianAge(cb) {
		var url = getBaseURL() + &quot;&amp;get=B01002_001E,NAME&amp;for=state:*&quot;;
		$.get(url, {}, function(res,code) {
			var data = translate(res,&quot;B01002_001E&quot;);
			cb(data);
		}, &quot;JSON&quot;);
		
	}
	
	function getMedianIncome(cb) {
		var url = getBaseURL() + &quot;&amp;get=B19013_001E,NAME&amp;for=state:*&quot;;
		$.get(url, {}, function(res,code) {
			var data = translate(res,&quot;B19013_001E&quot;);
			cb(data);
		}, &quot;JSON&quot;);		
	}
	
	&#x2F;&#x2F;Utility function that returns min&#x2F;max based on census data
	function getRangeFromData(d) {
		var result = {% raw %}{min:Number.POSITIVE_INFINITY, max:Number.NEGATIVE_INFINITY}{% endraw %};
		for(var i=0, len=d.length; i&lt;len; i++) {
			if(d[i].value &gt; result.max) result.max = d[i].value;
			if(d[i].value &lt; result.min) result.min = d[i].value;
		}
		return result;
	}
	
	return {
		setAPI:setAPIKey,
		getMedianAge:getMedianAge,
		getMedianIncome:getMedianIncome,
		getRangeFromData:getRangeFromData
	};
	
}();</code></pre>

<p>
For the most part, the Snap.svg portion is pretty trivial (which I think is a sign of a good library). On startup, I load in my map. I also make a list of State fragments (essentially pointers) so I can use them later.
</p>

<pre><code class="language-javascript">Snap.load("Blank_US.svg", function(f) {

	for(var s in states) {
		stateFragments[s] = f.select("#"+s);
	}

	snapOb.append(f);

	start();

});</code></pre>

<p>
Finally, here is an example of one of the datasets. This is called when the button is clicked to load the data. Note I'm using local storage to cache the census data.
</p>

<pre><code class="language-javascript">function doMedianAge() {
	var cachedData = window.localStorage.getItem("census_median");
	
	if(cachedData) {
		renderMedianAge(JSON.parse(cachedData));
	} else {
		CensusLib.getMedianAge(function(data) {
			console.log('back from census');
			window.localStorage.setItem("census_median", JSON.stringify(data));
			renderMedianAge(data);
		});
	}
	
	
	function renderMedianAge(data) {
		//First - figure out min/max values
		var range = CensusLib.getRangeFromData(data);
		var lowerBound = Math.floor(range.min/10)*10;
		var upperBound = Math.ceil(range.max/10)*10;
		//To Do: Handle tooltips for data
		//Begin rendering
		var diff = upperBound-lowerBound;

		for(var state in stateFragments) {
			//some states (territories) not there
			if(stateFragments[state]) {
				//console.log("Doing "+state);
				var value = findValueInData(data, state);
				//color is from white to black with white == lowerBound, black == upperBound
				var perc = Math.round(((value-lowerBound)/diff)*100);
				stateFragments[state].animate({% raw %}{"fill":"000000","fill-opacity":perc/100}{% endraw %},500);
			} 
		}
		
		legendBlock.children().hide();
		comparitiveAgeText.show();
		$(".leftLabel").text(lowerBound);
		$(".rightLabel").text(upperBound);
		
	}
	
}</code></pre>

<p>
And that's it. As I said above - the Snap.svg portion of this isn't terribly exciting - but that's the way it <i>should</i> be in my opinion. There is one thing missing here that I'm currently researching. SVG elements support a <code>title</code> attribute that gives hover text on mouseover. Currently though I've not been able to get Snap.svg to handle adding this dynamically. Anyway, check it out. Take special note of California and Florida. CA has a younger population with a higher income while Florida is almost the exact opposite.
</p>

<p>
<a href="http://www.raymondcamden.com/demos/2013/oct/26/state.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>  
</p>

<p>
p.s. Yes, this works on mobile, at least iOS. The buttons aren't optimized for touch on a small screen so they are a pain to click, but outside of that the demo works great.
</p>