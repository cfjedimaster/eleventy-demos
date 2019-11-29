---
layout: post
title: "Proof of Concept - Dashboard for Google Analytics"
date: "2014-01-24T12:01:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2014/01/24/Proof-of-Concept-Dashboard-for-Google-Analytics
guid: 5137
---

<p>
I'm somewhat OCD about checking my Google Analytics reports. I'm mainly concerned about this site, but I've got other sites I monitor as well. In the past I've used tools like <a href="http://www.happymetrix.com/">Happy Metrix</a> for this purpose, but their pricing now is a bit much for me. (To be clear, it is a kick ass product, but since my sites aren't commercial I can't justify the expense.) I knew that Google had an API for analytics so I thought I'd take a stab at writing my own dashboard.
</p>
<!--more-->
<p>
I began at the core documentation site: <a href="https://developers.google.com/analytics/">Google Analytics - Google Developers</a>. The API covers the full range of what you can do at the site itself - so both management of properties as well as basic stat fetching. For my purposes I focused on the <a href="https://developers.google.com/analytics/devguides/reporting/core/v3/">Core Reporting API</a>. I figured their API would be easy, but I was concerned about the authentication aspect. I assumed that would be rather complex. Turns out they actually have an <b>incredibly</b> simple <a href="https://developers.google.com/analytics/solutions/articles/hello-analytics-api">tutorial</a> that walks you through the authentication process and doing your first call. I was able to use their code as a starting point and focus more on the reporting calls. I can't tell you how helpful it was to have docs walk you through the <i>entire</i> process. Kudos to Google for spending the time to give us a complete example.
</p>

<p>
Once I had authentication working right and was able to get a bit of data returning, the next part was to play with their <a href="https://ga-dev-tools.appspot.com/explorer/">Data Explorer</a>. As you can imagine, this lets you use a simple form to test hitting your properties and fetching data.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_1_24_14__11_38_AM.png" />
</p>

<p>
To work with Google Analytics, you have to:
</p>

<ul>
<li>Authenticate of course
<li>Get the accounts for a user. Most people have one account but you could have multiple. I've got one core account and 2 sub accounts.
<li>Get the profiles. The profiles are the actual sites you track.
<li>Use the profile ID to make your request. So for example, given a profile of X, I can ask Google to report on the number of page views in a time period.
</ul>

<p>
And that's basically it - you just repeat those calls to get the metrics you want. As I said, the API itself (see the <a href="https://developers.google.com/analytics/devguides/reporting/core/v3/reference">reference</a>) is pretty direct and has handy features like being able to date filter using strings: "today", "3daysAgo", etc. 
</p>

<p>
So - my demo was rather simple. First, I fetch the accounts and cache them.
</p>

<pre><code class="language-javascript">
function beginReport() {

	$(&quot;#reports&quot;).html(&quot;&lt;p&gt;&lt;i&gt;Gathering data...&lt;&#x2F;i&gt;&lt;&#x2F;p&gt;&quot;);

	console.log(&#x27;begin report&#x27;);
	&#x2F;&#x2F;first, we know the GA account yet?
	var gAccounts = window.localStorage.getItem(&#x27;googleAccounts&#x27;);
	if(gAccounts) { 
		console.log(&#x27;loaded from cache&#x27;);
		googleAccounts = JSON.parse(gAccounts);
		accountId = googleAccounts[0].id;
		getProperties();
	} else {
		gapi.client.analytics.management.accounts.list().execute(handleAccounts);
	}

}

function handleAccounts(results) {
	if (!results.code) {
		if (results &amp;&amp; results.items &amp;&amp; results.items.length) {
	
			console.log(&#x27;handleAccounts&#x27;,results.items);
			&#x2F;&#x2F; Get the first Google Analytics account
			&#x2F;&#x2F;var firstAccountId = results.items[0].id;
	
			&#x2F;&#x2F;store
			window.localStorage.setItem(&#x27;googleAccounts&#x27;, JSON.stringify(results.items));

			accountId = results.items[0].id;
			getProperties();
	
		} else {
			console.log(&#x27;No accounts found for this user.&#x27;);
		}
	} else {
		console.log(&#x27;There was an error querying accounts: &#x27; + results.message);
	}
}
</code></pre>

<p>
Note that all error handling is done via console. That's sucky, but, it is a proof of concept. Also note that for this POC I work with your first account only. In theory it wouldn't be too difficult to provide a way to select an account. After getting the account I then fetch the profiles. Again, I cache this. (I don't provide a way to clear the cache, so for now you would need to use your dev tools to nuke it.)
</p>

<pre><code class="language-javascript">
function getProperties() {
	console.log(&#x27;Querying Properties.&#x27;);

	var props = window.localStorage.getItem(&#x27;googleProperties&#x27;);
	if(props) {
		googleProperties = JSON.parse(props);
		getData();
	} else {
		gapi.client.analytics.management.webproperties.list({% raw %}{&#x27;accountId&#x27;: accountId}{% endraw %}).execute(handleWebproperties);
	}
}

function handleWebproperties(results) {
	if (!results.code) {
		if (results &amp;&amp; results.items &amp;&amp; results.items.length) {
	
			&#x2F;&#x2F;console.log(&#x27;web props&#x27;, results.items);
			
			&#x2F;&#x2F;filter out properties with no profileCount
			var props = [];
			for(var i=0, len=results.items.length; i&lt;len; i++) {
				if(results.items[i].profileCount &gt;= 1) props.push(results.items[i]);
			}
			
			&#x2F;&#x2F;Now we get our profiles and update our main props object
			&#x2F;&#x2F;Again, assuming 1
			console.log(&quot;getting profiles for our props&quot;);
			gapi.client.analytics.management.profiles.list({
				&#x27;accountId&#x27;: accountId,
				&#x27;webPropertyId&#x27;: &#x27;~all&#x27;
			}).execute(function(res) {
				console.log(&#x27;ok back getting profiles&#x27;);
				&#x2F;&#x2F;in theory same order, but we&#x27;ll be anal
				for(var i=0, len=res.items.length;i&lt;len; i++) {
					var profile = res.items[i];
					for(var x=0, plen=props.length; x&lt;plen; x++) {
						if(profile.webPropertyId === props[x].id) {
							props[x].profile = profile;
							break;
						}
					}
				}

				googleProperties = props;
	
				&#x2F;&#x2F;store
				window.localStorage.setItem(&#x27;googleProperties&#x27;, JSON.stringify(props));
				
				getData();
			});
			
			
		} else {
			console.log(&#x27;No web properties found for this user.&#x27;);
		}
	} else {
		console.log(&#x27;There was an error querying webproperties: &#x27; + results.message);
	}
}
</code></pre>

<p>
Note that the API lets me fetch all the properties at once. This helps keep you under the quota limit! The final bit is to actually get the data. For my dashboard I wanted two weeks of page views. I use localStorage again, but this time I'm only caching for an hour.
</p>

<pre><code class="language-javascript">
function getData(counter) {
	if(!counter) counter = 0;
	
	var prop = googleProperties[counter];
	console.log(prop.name,prop.websiteUrl);
	&#x2F;&#x2F;do we have a cached version of the data that isn&#x27;t expired?
	var cacheKey = prop.profile.id;
	var cachedDataRaw = window.localStorage.getItem(cacheKey);
	if(cachedDataRaw) {
		var cachedData = JSON.parse(cachedDataRaw);
		if(((new Date().getTime()) - cachedData.time) &gt; (1000 * 60 * 60)) {
			window.localStorage.removeItem(cacheKey);	
		} else {
			console.log(&#x27;sweet, had a cache for &#x27;+cacheKey);
			prop.data = cachedData.data;
		}
	}
	if(!prop.data) {
		console.log(&#x27;no cache for &#x27;+cacheKey);
		gapi.client.analytics.data.ga.get({
		&#x27;ids&#x27;: &#x27;ga:&#x27; + prop.profile.id,
		&#x27;start-date&#x27;: &#x27;13daysAgo&#x27;,
		&#x27;end-date&#x27;: &#x27;today&#x27;,
		&#x27;metrics&#x27;: &#x27;ga:visits,ga:pageviews&#x27;,
		&#x27;dimensions&#x27;:&#x27;ga:date&#x27;
		}).execute(function(results) {
			prop.data = results;
			&#x2F;&#x2F;cache this bitch
			var toCache = {% raw %}{data:prop.data, time:new Date().getTime()}{% endraw %};
			window.localStorage.setItem(cacheKey, JSON.stringify(toCache));
			&#x2F;&#x2F;console.log(&#x27;got results and counter is currently &#x27;+counter);	
			if(counter+1 &lt; googleProperties.length) {
				getData(++counter);
			} else {
				displayReport();
			}
		});
	} else {
		&#x2F;&#x2F;TODO: Repeated the above shit, bad
		if(counter+1 &lt; googleProperties.length) {
			getData(++counter);
		} else {
			displayReport();
		}		
	}
	
}
</code></pre>

<p>
Woot! Now I just have to render this crap. I made use of <a href="http://handlebarsjs.com/">HandlebarsJS</a> for my template and <a href="http://www.chartjs.org/">Chart.js</a> because it was free, simple, and pretty.
</p>

<pre><code class="language-javascript">
function displayReport() {

	$(&quot;#reports&quot;).html(&quot;&quot;);

	var source   = $(&quot;#reportTemplate&quot;).html();
	var template = Handlebars.compile(source);
	var i, len, x;
	
	&#x2F;&#x2F;for charting, figure out labels - I could probably do this once
	var weekdays = [&quot;Sunday&quot;,&quot;Monday&quot;,&quot;Tuesday&quot;,&quot;Wednesday&quot;,&quot;Thursday&quot;,&quot;Friday&quot;,&quot;Saturday&quot;];
	
	var days = [];
	var d = new Date();
	for(i=0;i&lt;7;i++) {
		var dow = d.getDay();
		days.push(weekdays[dow]);
		d.setDate(d.getDate() - 1); 
	}
	days.reverse();
	
	&#x2F;*
	structure notes
	I believe array cols match dimensions&#x2F;metrics
	0=date, 1=visits,2=pageviews
	*&#x2F;
	for(i=0, len=googleProperties.length; i&lt;len; i++) {
		&#x2F;&#x2F;console.log(&quot;doing &quot;+i);
		var property = googleProperties[i];
		&#x2F;&#x2F;console.dir(property);
		var context = {};
		context.index = i;
		context.title = property.name;
		context.url = property.websiteUrl;
		context.pageViews = 0;
		context.pageViewsLastWeek = 0;
		var lastWeek = [];
		var thisWeek = [];
		&#x2F;&#x2F;get page views for this week
		for(x=7;x&lt;14;x++) {
			context.pageViews += parseInt(property.data.rows[x][2],10);
			thisWeek.push(parseInt(property.data.rows[x][2],10));
		}
		&#x2F;&#x2F;get for last week
		for(x=0;x&lt;7;x++) {
			context.pageViewsLastWeek += parseInt(property.data.rows[x][2],10);
			lastWeek.push(parseInt(property.data.rows[x][2],10));
		}
				
		var html = template(context);
		$(&quot;#reports&quot;).append(html);
		
		&#x2F;&#x2F;Setup chart
		var ctx = document.getElementById(&quot;chart&quot;+context.index).getContext(&quot;2d&quot;);
		var options = {% raw %}{animation:false}{% endraw %};
		var data = {
			labels : days,
			datasets : [
				{
					fillColor : &quot;rgba(220,220,220,0.5)&quot;,
					strokeColor : &quot;rgba(220,220,220,1)&quot;,
					pointColor : &quot;rgba(220,220,220,1)&quot;,
					pointStrokeColor : &quot;#fff&quot;,
					data : lastWeek
				},
				{
					fillColor : &quot;rgba(151,187,205,0.5)&quot;,
					strokeColor : &quot;rgba(151,187,205,1)&quot;,
					pointColor : &quot;rgba(151,187,205,1)&quot;,
					pointStrokeColor : &quot;#fff&quot;,
					data : thisWeek
				}
			]
		};

		var myNewChart = new Chart(ctx).Line(data,options);
		
	}
}</code></pre>

<p>
The end result is pretty cool I think. Here it is on my desktop (I've got 12 properties so this is only half of them):
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_1_24_14__11_49_AM.png" />
</p>

<p>
I also tested this on mobile. On my iPhone, the Chrome browser never closed the popup window for authorization, but it worked. Mobile Safari worked perfectly.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_1_24_14__11_51_AM.png" />
</p>

<p>
I tested on my Android and there Chrome had no problem with the authorization flow. So - want to see all the code? Try it yourself? Hit the link below, but please remember that a) you need to actually <i>use</i> Google Analytics and b) the error reporting is all done in console.
</p>

<p>
<a href="https://static.raymondcamden.com/demos/2014/jan/24/index.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>  
</p>