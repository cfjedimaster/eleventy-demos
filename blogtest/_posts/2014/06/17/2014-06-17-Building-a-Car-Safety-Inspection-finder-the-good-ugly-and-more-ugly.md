---
layout: post
title: "Building a Car Safety Inspection Finder (the good, ugly, and more ugly)"
date: "2014-06-17T20:06:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2014/06/17/Building-a-Car-Safety-Inspection-finder-the-good-ugly-and-more-ugly
guid: 5246
---

<p>
Earlier this week I came across a person looking to find a local (to Louisiana) car safety inspection location. I think most states require this but they differ on schedules. Louisiana recently moved to letting you pay more for a two-year sticker which is nice, but it is still a bit of a hassle if you don't know where an inspection location can be found. Turns out - there is a web page for it: <a href="http://www.dps.state.la.us/safetydirections.nsf/f3f91999370ccaed862574a20074b158?OpenView">http://www.dps.state.la.us/safetydirections.nsf/f3f91999370ccaed862574a20074b158?OpenView</a>.
</p>
<!--more-->
<p>
I looked at this and thought - wouldn't it be cool if we could find the <i>nearest</i> station based on your current location. Turns out it was possible - just not very pretty. I've split this blog entry into two parts - getting the data - and using the data. If you don't care how I scraped the site, feel free to scroll down to the next part.
</p>

<h2>Scraping the Data</h2>

<p>
I had <i>hoped</i> the site was using fancy Ajax Ninja stuff with cool JSON-based data sources, but I quickly discovered that it was not. It was pure HTML. Lots, and lots, and, oh my god, lots of HTML. I began by figuring out how the site was set up. The home page contains a list of all the parishes:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s115.png" />
</p>

<p>
Clicking a triangle (but oddly, not the parish name) opens a list of places where you can get your car inspected.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s213.png" />
</p>

<p>
This gives you the location name and address. But to get hours of operation you need to click for details.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s36.png" />
</p>

<p>
All in all, this gave me two things to scrape. First was a list of the locations, which can only be found by first getting all the parishes. Then for each location we needed to get the detail page for the hours of operation. Finally, I could take all those addresses and do a geocode on them to get precise locations.
</p>

<p>
What follows is a set of ColdFusion scripts I wrote to perform this task. These files are ugly. The HTML used on these pages were messy as hell. The phone numbers had multiple spans/font tags etc. It was a mess. I also took the opportunity to try some fancy ColdFusion 11 updates as well. All in all, this code is quite disgusting, but I'll share it so you can use it to scare away monsters.
</p>

<p>
First, open up all the parishes and save the location data.
</p>

<pre><code class="language-javascript">&lt;cfscript&gt;

rootUrl = &quot;http:&#x2F;&#x2F;www.dps.state.la.us&#x2F;safetydirections.nsf&#x2F;f3f91999370ccaed862574a20074b158?OpenView&amp;Start=1&amp;Count=1200&quot;;

&#x2F;&#x2F;&lt;cfset links = rematch(&quot;&#x2F;safetydirections.nsf&#x2F;.*?Expand=.*?&quot;&quot;&quot;,cfhttp.fileContent)&gt;
&#x2F;&#x2F;&lt;cfdump var=&quot;#links#&quot;&gt;
&#x2F;&#x2F;&#x2F;safetydirections.nsf&#x2F;f3f91999370ccaed862574a20074b158?OpenView&amp;amp;Start=1&amp;amp;Count=1200&amp;amp;Expand=2#2&quot; target=&quot;_self&quot;&gt;

&#x2F;&#x2F;number of parishes but I call it pages, because.
totalPages = 62;
&#x2F;&#x2F;totalPages = 3;
locations = [];
for(i=1; i&lt;= totalPages; i++) {
	theUrl = rootUrl &amp; &quot;&amp;Expand=#i#&quot;;
	writeoutput(theUrl &amp; &quot;&lt;br&#x2F;&gt;&lt;hr&gt;&quot;);
	cfhttp(url=theUrl);
&#x2F;&#x2F;writeoutput(&quot;&lt;pre&gt;#htmlEditFormat(cfhttp.filecontent)#&lt;&#x2F;pre&gt;&quot;);
	matches = reMatch(&quot;&lt;font color=&quot;&quot;##0000ff&quot;&quot;&gt;.*?&lt;&#x2F;tr&gt;&quot;,cfhttp.fileContent);

	matches.each(function(m) {
		var location = {};
		var linkre = reFind(&quot;&lt;a href=&quot;&quot;(.*?)&quot;&quot;&gt;&quot;, m, 1, true);
		location[&quot;link&quot;] = m.mid(linkre.pos[2], linkre.len[2]);
		var namere = reFind(&quot;&lt;a href=&quot;&quot;.*?&quot;&quot;&gt;(.*?)&lt;&#x2F;a&gt;&quot;, m, 1, true);
		location[&quot;name&quot;] = m.mid(namere.pos[2], namere.len[2]);
		var tds = reMatch(&quot;&lt;td&gt;(.*?)&lt;&#x2F;td&gt;&quot;, m);
		var address = rereplace(tds[1], &quot;&lt;td&gt;&lt;b&gt;&lt;font color=&quot;&quot;##0000ff&quot;&quot;&gt;(.*?)&lt;&#x2F;font&gt;&lt;&#x2F;b&gt;&lt;&#x2F;td&gt;&quot;, &quot;\1&quot;);
		address = address.replace(&quot;&lt;br&gt;&quot;,&quot;&quot;);
		location[&quot;address&quot;] = address;

		location[&quot;types&quot;] = [];
		var typeList = rereplace(tds[3], &quot;&lt;td&gt;&lt;b&gt;&lt;font color=&quot;&quot;##0000ff&quot;&quot;&gt;(.*?)&lt;&#x2F;font&gt;&lt;&#x2F;b&gt;&lt;&#x2F;td&gt;&quot;,&quot;\1&quot;);
		typeList = typeList.replace(&quot;&lt;br&gt;&quot;, &quot;,&quot;, &quot;all&quot;);
		typeList.each(function(t) {
			t = trim(t);
			location[&quot;types&quot;].append(t);			
		});
&#x2F;&#x2F;writedump(location);
&#x2F;&#x2F;		writedump(m);
		locations.append(location);
	});
&#x2F;&#x2F;	writedump(matches);
}

writedump(locations.len());
fileWrite(expandPath(&quot;.&#x2F;data1.json&quot;), serializeJSON(locations));
&lt;&#x2F;cfscript&gt;

</code></pre>

<p>
Next, get the details. This includes the hours of operation I mentioned earlier, as well as the phone number.
</p>

<pre><code class="language-javascript">&lt;cfscript&gt;
rootUrl = &quot;http:&#x2F;&#x2F;www.dps.state.la.us&#x2F;&quot;;

data = deserializeJSON(fileRead(expandPath(&quot;data1.json&quot;)));
&#x2F;&#x2F;filter by items w&#x2F;o a phone number
writeoutput(&quot;There are #data.len()# items.&lt;br&#x2F;&gt;&quot;);

&#x2F;*
filtered = data.filter(function(x) {
	return !structKeyExists(x, &quot;phoneNumber&quot;);
});

writeoutput(&quot;There are #data.len()# items to process.&lt;br&#x2F;&gt;&quot;);
*&#x2F;

counter=0;
data.each(function(l) {
	counter++;

	if(counter mod 100 is 0) {
		writeoutput(&quot;#counter#&lt;br&#x2F;&gt;&quot;);
		cfflush();
	}

	&#x2F;&#x2F;Only get if we don&#x27;t have the data already
	if(structKeyExists(l, &quot;phoneNumber&quot;)) continue;

	cfhttp(url=&quot;#rootUrl#&#x2F;#l.link#&quot;);
	var content = cfhttp.fileContent;

	var found = reMatch(&#x27;Area Code&lt;&#x2F;font&gt;&lt;&#x2F;b&gt;&lt;b&gt;&lt;font color=&quot;##0000FF&quot; face=&quot;HandelGotDLig&quot;&gt; &lt;&#x2F;font&gt;&lt;&#x2F;b&gt;&lt;b&gt;&lt;font color=&quot;##ff0000&quot; face=&quot;HandelGotDLig&quot;&gt;.*?&lt;&#x2F;font&gt;&#x27;, content);
	var areaCode = found[1].rereplace(&quot;.*&gt;([0-9]{% raw %}{3}{% endraw %})&lt;&#x2F;font&gt;&quot;, &quot;\1&quot;);
	
	found = reMatch(&#x27;Phone Number&lt;&#x2F;font&gt;&lt;&#x2F;b&gt;&lt;b&gt;&lt;font color=&quot;##FF0000&quot; face=&quot;HandelGotDLig&quot;&gt; &lt;&#x2F;font&gt;&lt;&#x2F;b&gt;&lt;b&gt;&lt;font color=&quot;##ff0000&quot; face=&quot;HandelGotDLig&quot;&gt;.*?&lt;&#x2F;td&gt;&#x27;, content);
	var phoneFirst = found[1].rereplace(&quot;.*&gt;([0-9]{% raw %}{3}{% endraw %})&lt;&#x2F;font&gt;.*&quot;, &quot;\1&quot;);
	var phoneSecond = found[1].rereplace(&quot;.*&gt;([0-9]{% raw %}{4}{% endraw %})&lt;&#x2F;font&gt;.*&quot;, &quot;\1&quot;);
	var phoneNumber = &quot;(&quot; &amp; areaCode &amp; &quot;) &quot; &amp; phoneFirst &amp; &quot;-&quot; &amp; phoneSecond;

&#x2F;&#x2F;	writeoutput(&quot;&lt;b&gt;#phoneNumber#&lt;&#x2F;b&gt;&lt;p&gt;&quot;);

	found = content.reMatch(&#x27;Hours of Operation.*?&lt;&#x2F;tr&gt;&#x27;);
	var hoo = found[1].rereplace(&quot;.*?&lt;&#x2F;td&gt;&lt;td width=&quot;&quot;536&quot;&quot;&gt;(.*?)&lt;&#x2F;td&gt;&lt;&#x2F;tr&gt;&quot;, &quot;\1&quot;);
	hoo = hoo.rereplace(&quot;&lt;.*?&gt;&quot;, &quot; &quot;, &quot;all&quot;);
	hoo = hoo.rereplace(&quot;[[:space:]]{% raw %}{2,}{% endraw %}&quot;, &quot; &quot;);

&#x2F;&#x2F;	writedump(found);
&#x2F;&#x2F;	writeOutput(&quot;&lt;pre&gt;&quot;&amp;htmlEditFormat(cfhttp.fileContent)&amp;&quot;&lt;&#x2F;pre&gt;&quot;);
&#x2F;&#x2F;	abort;
	l[&quot;phoneNumber&quot;] = phoneNumber;
	l[&quot;hours&quot;] = hoo;
	fileWrite(expandPath(&quot;data1.json&quot;), serializeJSON(data));
});

writeoutput(&quot;&lt;p&gt;Done!&lt;&#x2F;p&gt;&quot;);
&lt;&#x2F;cfscript&gt;</code></pre>

<p>
Finally, do the geocoding.
</p>

<pre><code class="language-javascript">&lt;cfscript&gt;
geo = new googlegeocoder3();

data = deserializeJSON(fileRead(expandPath(&quot;data1.json&quot;)));
writeoutput(&quot;There are #data.len()# items.&lt;br&#x2F;&gt;&quot;);

counter=0;
data.each(function(l) {
	counter++;

	if(counter mod 100 is 0) {
		writeoutput(&quot;#counter#&lt;br&#x2F;&gt;&quot;);
		cfflush();
	}

	&#x2F;&#x2F;Only get if we don&#x27;t have the data already
	if(structKeyExists(l, &quot;long&quot;)) continue;

	var res = geo.googlegeocoder3(address = l.address);
	l[&quot;long&quot;] = res.longitude[1];
	l[&quot;lat&quot;] = res.latitude[1];
	
	fileWrite(expandPath(&quot;data1.json&quot;), serializeJSON(data));
});

writeoutput(&quot;&lt;p&gt;Done!&lt;&#x2F;p&gt;&quot;);


&lt;&#x2F;cfscript&gt;</code></pre>

<p>
Note - I used one more script to remove the link property from my data file to make it a bit smaller. So at this point, I had a data.json file containing every location in Louisiana where you can get your car inspected. I also had their phone numbers, hours of operation, and longitude and latitude. Woot! Now for the fun stuff - the front end!
</p>

<h2>Using the Data</h2>

<p>
For my front end, I decided to go simple. No bootstrap. No UI framework at all. Just a simple div to display dynamic data. I could make this pretty, but why bother?
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
        &lt;title&gt;&lt;&#x2F;title&gt;
        &lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
        &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
    &lt;&#x2F;head&gt;
    &lt;body&gt;

	&lt;div id=&quot;status&quot;&gt;&lt;&#x2F;div&gt;

	&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.1.1&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
    &lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
The real fun happens in app.js. I'll share the entire file, then describe what each part does.
</p>

<pre><code class="language-javascript">var $status;
var geoData;
var myLong;
var myLat;

$(document).ready(function() {

	$status = $(&quot;#status&quot;);

	&#x2F;&#x2F;Do we have the data locally?
	geoData = localStorage[&quot;geocache&quot;];
	if(!geoData) {
		$status.html(&quot;&lt;i&gt;Fetching initial data set. Please stand by. This data will be cached for future operations.&lt;&#x2F;i&gt;&quot;);
		$.getJSON(&quot;data1.json&quot;).done(function(res) {
			console.log(&quot;Done&quot;);
			localStorage[&quot;geocache&quot;] = JSON.stringify(res);
			geoData = res;
			$status.html(&quot;&quot;);
			getLocation();
		});
	} else {
		geoData = JSON.parse(geoData);
		getLocation();
	}
});

function getLocation() {
	$status.html(&quot;&lt;i&gt;Getting your location.&lt;&#x2F;i&gt;&quot;);
	navigator.geolocation.getCurrentPosition(gotLocation, failedLocation);
}

function failedLocation() {
	$status.html(&quot;&lt;b&gt;Sorry, but we were unable to get your location.&lt;&#x2F;b&gt;&quot;);
}

function gotLocation(l) {
	myLong = l.coords.longitude;
	myLat = l.coords.latitude;
	appReady();
}

function appReady() {
	$status.html(&quot;&lt;i&gt;Now searching for nearby locations.&lt;&#x2F;i&gt;&quot;);
	for(var i=0;i&lt;geoData.length;i++) {
		var dist = getDistanceFromLatLonInKm(myLat, myLong, geoData[i].lat, geoData[i].long);
		geoData[i].dist = dist;
	}

	geoData.sort(function(x,y) {
		if(x.dist &gt; y.dist) return 1;
		if(x.dist &lt; y.dist) return -1;
		return 0;
	});


	var s = &quot;&lt;h2&gt;Nearby Locations&lt;&#x2F;h2&gt;&quot;;
	for(var i=0;i&lt;Math.min(9, geoData.length); i++) {
		s+= &quot;&lt;p&gt;&lt;b&gt;&quot;+geoData[i].name+&quot;&lt;&#x2F;b&gt;&lt;br&#x2F;&gt;&quot;;
		s+= geoData[i].address+&quot; &quot;+Math.round(geoData[i].dist)+&quot; km away&lt;br&#x2F;&gt;&quot;;
		s+= &quot;&lt;a href=&#x27;tel:&quot;+geoData[i].phoneNumber+&quot;&#x27;&gt;&quot;+geoData[i].phoneNumber+&quot;&lt;&#x2F;a&gt;&lt;br&#x2F;&gt;&quot;;
		s+= &quot;Hours: &quot;+geoData[i].hours+&quot;&lt;br&#x2F;&gt;&quot;;
		s+= &quot;Types: &quot;+geoData[i].types.join(&quot;, &quot;)+&quot;&lt;br&#x2F;&gt;&quot;;
		s+= &quot;&lt;&#x2F;p&gt;&quot;;
	}

	$status.html(s);

}

&#x2F;&#x2F;Credit: http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;27943&#x2F;52160
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; &#x2F;&#x2F; Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  &#x2F;&#x2F; deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat&#x2F;2) * Math.sin(dLat&#x2F;2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon&#x2F;2) * Math.sin(dLon&#x2F;2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; &#x2F;&#x2F; Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI&#x2F;180)
}</code></pre>

<p>
So, the first thing I wondered was - how do I handle the data? It was 700K, which isn't <i>too</i> big, but isn't tiny either. I decided to simply store the data in LocalStorage. I could also store an "update date" key so I knew when to refresh the data, but for now, what I have is sufficient. Get it - store it - and carry on. 
</p>

<p>
Once we have the data file, we then simply detect where you are. This is boilerplate geolocation stuff so it isn't terribly fancy.
</p>

<p>
Next - we need to determine the distance between you and each location. There were quite a few locations (1,916) so I was concerned about the timing, but this portion ran <i>very</i> quickly as well. Then it was simply a matter of a sort operation. I display the closest 10 locations and that's it. Of course, these numbers are a bit high as I'm in San Francisco. ;)
</p>

<p>
<img src="https://static.raymondcamden.com/images/s5.png" />
</p>

<p>
If you want to try this yourself, just hit the demo link below. Enjoy!
</p>

<a href="http://raymondcamden.com/demos/2014/jun/17/report.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>