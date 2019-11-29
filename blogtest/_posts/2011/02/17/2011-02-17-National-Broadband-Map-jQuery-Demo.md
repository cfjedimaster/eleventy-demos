---
layout: post
title: "National Broadband Map (jQuery Demo)"
date: "2011-02-17T21:02:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/02/17/National-Broadband-Map-jQuery-Demo
guid: 4129
---

Earlier today an anonymous reader (not sure why they didn't share their name) shared a cool site with me - the <a href="http://www.broadbandmap.gov/">National Broadband Map (www.broadbandmap.gov)</a>. The site is a collection of data related to geography, education, age, income factors compared to broadband access. It has multiple ways to parse the data. For example, just entering your zip (here is <a href="http://www.broadbandmap.gov/internet-service-providers/70508/lat=30.1471824/long=-92.033638/">mine</a>) returns a report showing local providers and their advertised speeds. You can also use a "Google-Map-ish" type interface (<a href="http://www.broadbandmap.gov/technology">here</a>) to see factors broadly across the country. But the coolest of all is that there is a <b>large</b> list of APIs available on their <a href="http://www.broadbandmap.gov/developer">developer</a> page. Multiple APIs are offered in both JSON and XML flavors. As of my testing tonight their JSONP format is <i>not</i> working for me. I've sent an email to them but it could certainly be my fault. I thought it would be kind of fun to build a demo with their data. While my demo isn't as pretty as theirs, it highlights some interesting things that I've never had a chance to play with before in jQuery. Let's take a look.

<p>
<!--more-->
<p>

First - I thought it would be nice to work with an image map of the United States. I did a quick Google search and came across this <a href="http://en.wikipedia.org/wiki/Template:USA_imagemap_with_state_names">Wikipedia page</a> that had both the graphic and the image map as well. It's been <i>forever</i> since I worked with image maps but I was surprised how quickly the syntax came back to me. In my code samples below I'll be trimming some of the data a bit, but you can view source on the Wikipedia page (or my demo) for the full image map code. I began with that and a simple div I'll be using to show some data.

<p>

<code>
&lt;!-- credit: http://en.wikipedia.org/wiki/Template:USA_imagemap_with_state_names --&gt;
&lt;map name="USImageMap" id="USImageMap"&gt; 
&lt;area href="/wiki/Alabama" shape="poly" coords="537,310,556,377,518,382,518,395,506,391,504,312" alt="Alabama" title="Alabama" /&gt; 
&lt;area href="/wiki/Alaska" shape="poly" coords="127,381,128,451,148,457,171,481,171,491,153,491,132,461,98,456,83,473,10,482,55,456,34,431,43,391,60,375,89,365" alt="Alaska" title="Alaska" /&gt; 
&lt;area href="/wiki/Kansas" shape="poly" coords="307,224,301,278,407,280,407,243,401,238,404,231,393,224" alt="Kansas" title="Kansas" /&gt; 
&lt;area href="/wiki/Kentucky" shape="poly" coords="485,286,565,275,582,259,569,241,544,234,528,258,502,261" alt="Kentucky" title="Kentucky" /&gt; 
&lt;area href="/wiki/Louisiana" shape="poly" coords="421,407,426,382,416,367,418,351,461,351,463,363,456,385,479,385,488,396,495,416,456,421" alt="Louisiana" title="Louisiana" /&gt; 
&lt;area href="/wiki/Vermont" shape="rect" coords="607,53,651,72" alt="Vermont" title="Vermont" /&gt; 
&lt;area href="/wiki/Rhode_Island" shape="rect" coords="720,163,796,184" alt="Rhode Island" title="Rhode Island" /&gt;
&lt;/map&gt;
&lt;img alt="Map of USA with state names.svg" src="800px-Map_of_USA_with_state_names.svg.png" width="800" height="495" usemap="#USImageMap" /&gt; 

&lt;div id="result"&gt;&lt;/div&gt;
</code>

<p>

Just to be clear - I deleted a <i>lot</i> from the map above but even if you've never seen an image map before you can guess as to how it's working. Each state has a polygon of coordinates defined. The image tag points to the map block and this creates a "hot" link over the image that can link to different URLs. I didn't bother removing the HREFs but note that in my demo they aren't going to be used. Ok, let's get into the jQuery!

<p>

<code>
var cache = {};

$("#USImageMap area").click(function(e) {
	var item = $(this).attr("title");
	e.preventDefault();
	if(item in cache) {
		renderResult(item);
		return;
	}
	$.getJSON("load.cfm", {% raw %}{"state":item}{% endraw %}, function(res,code) {
		if(res.status != "OK") {
			alert("Oops - it broke.");
			return;
		}
			
		//We should have one object we care about in Results
		var myResult = res.Results[0];
		cache[item] = myResult;
		renderResult(item);
			
	});
});
</code>

<p>

I begin with a click handler based on area tags within my image map. Since the title is the same as the state, I grab that from the dom and see if it's in my cache. I don't use a cache very often but I'm trying to be more cognizant lately of how my Ajax demos perform. If there isn't a cache for the item I have to make a network call. I said earlier that their APIs are supposed to support JSON/P. It wasn't working for me so I quickly switched to using a ColdFusion proxy. All that file does is take the state and make a call to the API. My demo is making use of the <a href="http://www.broadbandmap.gov/developer/api/demographics-api-by-geography-type-and-geography-name">demographic API</a> which provides population, race, age, and income data. Once ColdFusion "echos" the JSON back to the client  I do basic result handling and store it in the cache if the API call was good. Now let's look at renderResult. This is where my design skills get kicked into full gear.

<p>

<code>
function perc(x) {
	var perc_form = {% raw %}{decimalSeparator:".", thousandSeparator:",",numberOfDecimals:2}{% endraw %};
	x = x*100;
	return $().number_format(x,perc_form) + "%";
};

function renderResult(state) {
	//used by number_format
	var num_form = {% raw %}{decimalSeparator:".", thousandSeparator:",",numberOfDecimals:0}{% endraw %};

	var myResult = cache[state];
	var s= "&lt;h2&gt;" + myResult.geographyName + "&lt;/h2&gt;";
	s += "&lt;p&gt;";
	s += "&lt;table width=\"400\"&gt;";
	s += "&lt;tr class=\"trHeader\"&gt;&lt;td colspan=\"2\"&gt;&lt;strong&gt;Population&lt;/strong&gt;&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Total:&lt;/td&gt;&lt;td&gt;" + $().number_format(myResult.population,num_form) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Asians:&lt;/td&gt;&lt;td&gt;" + perc(myResult.raceAsian) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Blacks:&lt;/td&gt;&lt;td&gt;" + perc(myResult.raceBlack) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Hispanics:&lt;/td&gt;&lt;td&gt;" + perc(myResult.raceHispanic) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Native Americans:&lt;/td&gt;&lt;td&gt;" + perc(myResult.raceNativeAmerican) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Whites:&lt;/td&gt;&lt;td&gt;" + perc(myResult.raceWhite) +"&lt;/td&gt;&lt;/tr&gt;";
		
	s += "&lt;tr &gt;&lt;td colspan=\"2\"&gt;&lt;br/&gt;&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr class=\"trHeader\"&gt;&lt;td colspan=\"2\"&gt;&lt;strong&gt;Income&lt;/strong&gt;&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Median Income&lt;/td&gt;&lt;td&gt;" + "$" + $().number_format(myResult.medianIncome, num_form) + "&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Income Below Poverty&lt;/td&gt;&lt;td&gt;" + "$" + $().number_format(myResult.incomeBelowPoverty, num_form) + "&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Income &lt; 25K:&lt;/td&gt;&lt;td&gt;" + perc(myResult.incomeLessThan25) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Income 25K-50K:&lt;/td&gt;&lt;td&gt;" + perc(myResult.incomeBetween25to50) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Income 50K-100K:&lt;/td&gt;&lt;td&gt;" + perc(myResult.incomeBetween50to100) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Income 100K-200K:&lt;/td&gt;&lt;td&gt;" + perc(myResult.incomeBetween100to200) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Income &gt; 200K:&lt;/td&gt;&lt;td&gt;" + perc(myResult.incomeGreater200) +"&lt;/td&gt;&lt;/tr&gt;";

	s += "&lt;tr &gt;&lt;td colspan=\"2\"&gt;&lt;br/&gt;&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr class=\"trHeader\"&gt;&lt;td colspan=\"2\"&gt;&lt;strong&gt;Age&lt;/strong&gt;&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Age Below 5&lt;/td&gt;&lt;td&gt;" + perc(myResult.ageUnder5) + "&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Age 5-19:&lt;/td&gt;&lt;td&gt;" + perc(myResult.ageBetween5to19) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Age 20-34:&lt;/td&gt;&lt;td&gt;" + perc(myResult.ageBetween20to34) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Age 35-59:&lt;/td&gt;&lt;td&gt;" + perc(myResult.ageBetween35to59) +"&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Age Above 60:&lt;/td&gt;&lt;td&gt;" + perc(myResult.ageGreaterThan60) +"&lt;/td&gt;&lt;/tr&gt;";

	s += "&lt;tr &gt;&lt;td colspan=\"2\"&gt;&lt;br/&gt;&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr class=\"trHeader\"&gt;&lt;td colspan=\"2\"&gt;&lt;strong&gt;Education&lt;/strong&gt;&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Bachelor or Higher&lt;/td&gt;&lt;td&gt;" + perc(myResult.educationBachelorOrGreater) + "&lt;/td&gt;&lt;/tr&gt;";
	s += "&lt;tr&gt;&lt;td&gt;Highschool Graduater&lt;/td&gt;&lt;td&gt;" + perc(myResult.educationHighSchoolGraduate) + "&lt;/td&gt;&lt;/tr&gt;";

	s += "&lt;/table&gt;";
	s += "&lt;/p&gt;";
		
	$("#result").html(s);

}
</code>

<p>

That's a huge code block - and I apologize - but it really comes down to a few small things. "myResult" is the data result from the API. It contains a number of demographic values for a state. The perc function I wrote is a simple way to handle their percentile values. Lastly - the number_format function you see is a jQuery plugin by Ricardo Andrietta Mendes. (You can find the source <a href="http://plugins.jquery.com/files/jquery.number_format.js_1.txt">here</a>.) But really - it's just making a big ole HTML string and printing it to the DOM. This is a great example of where jQuery Templates would make things a lot nicer.

<p>

So the end result is: You've got a map. You click on a state and an Ajax call is made (if it was the first time) to National Broadband's site to get the data. This data is then displayed below the map. Take a look at the demo below.

<p>

<a href="http://www.raymondcamden.com/demos/feb172011/test.html"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>