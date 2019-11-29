---
layout: post
title: "Creating a custom display for Google's Analytics Embed Library"
date: "2015-09-17T09:44:11+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/09/17/creating-a-custom-display-for-googles-analytics-embed-library
guid: 6777
---

I've blogged a few times now about Google's <a href="https://developers.google.com/analytics/devguides/reporting/embed/v1/">Analytics Embed</a> library. I really dig it as it makes working with their Analytics API pretty darn simple. It really opens up the ability to create interesting mashups and <a href="http://www.raymondcamden.com/2015/07/07/using-the-google-analytics-embed-api-to-build-a-dashboard">custom dashboards</a> on your sites with just plain JavaScript. Recently, a reader asked me a question about how he could have more control over the data displayed by the library.

<!--more-->

His <a href="http://www.raymondcamden.com/2015/06/10/quick-example-of-the-google-analytics-embed-api#comment-2254640163">question</a> involved formatting of the "TABLE" display supported by the library. This is a format I had not used myself yet so I built up a quick demo (and as the reader supplied some code it made it a bit easier). Let's look at the code and then I'll show the result.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;Embed API Demo&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;!-- Step 1: Create the containing elements. --&gt;

&lt;section id=&quot;auth-button&quot;&gt;&lt;/section&gt;

&lt;h2&gt;RaymondCamden.com&lt;/h2&gt;
&lt;section id=&quot;timeline&quot;&gt;&lt;/section&gt;

&lt;!-- Step 2: Load the library. --&gt;

&lt;script&gt;
(function(w,d,s,g,js,fjs){
  g=w.gapi{% raw %}||(w.gapi={}{% endraw %});g.analytics={% raw %}{q:[],ready:function(cb){this.q.push(cb)}{% endraw %}};
  js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
  js.src='https://apis.google.com/js/platform.js';
  fjs.parentNode.insertBefore(js,fjs);js.onload=function(){% raw %}{g.load('analytics')}{% endraw %};
}(window,document,'script'));
&lt;/script&gt;

&lt;script&gt;
gapi.analytics.ready(function() {

  // Step 3: Authorize the user.

  var CLIENT_ID = '818125206534-g1r0datdtu9serq2pf9cp5vkuih3h8pv.apps.googleusercontent.com';

  gapi.analytics.auth.authorize({
    container: 'auth-button',
    clientid: CLIENT_ID,
	userInfoLabel:&quot;&quot;
  });

  // Step 5: Create the timeline chart.
  var timeline = new gapi.analytics.googleCharts.DataChart({
    reportType: 'ga',
    query: {
      'dimensions': 'ga:date',
      'metrics': 'ga:sessions,ga:avgSessionDuration',
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
     'ids': &quot;ga:31405&quot;
    },
    chart: {
      type: 'TABLE',
      container: 'timeline'
    }
  });

  gapi.analytics.auth.on('success', function(response) {
  	//hide the auth-button
  	document.querySelector(&quot;#auth-button&quot;).style.display='none';
  	
    timeline.execute();

  });

});
&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

I'm assuming you are somewhat familiar with my older posts, but if not, the basic idea here is that the Embed library will handle authentication and it provides rendering capabilities. You can see the DataChart call there handling both a query (what data to fetch) and how to render it (a table). Here is the result:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot11.png" alt="shot1" width="393" height="590" class="aligncenter size-full wp-image-6778 imgborder" />

Nice, but what if you wanted more control over the rendering? Specifically, the user wanted to change the seconds column into a report that showed the minutes instead. Unfortunately, you don't get the ability to modify the format of the table. Fortunately, Google makes it easy to get the data manually and do whatever the heck you want. Let's look at an updated version of the script.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
	&lt;title&gt;Embed API Demo&lt;/title&gt;
	&lt;link rel=&quot;stylesheet&quot; href=&quot;https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css&quot;&gt;
	&lt;script src=&quot;https://code.jquery.com/jquery-2.1.4.min.js&quot;&gt;&lt;/script&gt;
	&lt;script src=&quot;moment.min.js&quot;&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;


&lt;div class=&quot;container&quot;&gt;
	
	&lt;section id=&quot;auth-button&quot;&gt;&lt;/section&gt;
	
	&lt;h2&gt;RaymondCamden.com&lt;/h2&gt;
	&lt;div id=&quot;status&quot;&gt;&lt;/div&gt;
	&lt;table id=&quot;dataTable&quot; class=&quot;table&quot;&gt;
		&lt;thead&gt;&lt;tr&gt;&lt;th&gt;Date&lt;/th&gt;&lt;th&gt;Sessions&lt;/th&gt;&lt;th&gt;Avg. Session Duration&lt;/th&gt;&lt;/tr&gt;&lt;/thread&gt;
		&lt;tbody&gt;&lt;/tbody&gt;
	&lt;/table&gt;

&lt;/div&gt;

&lt;script&gt;
(function(w,d,s,g,js,fjs){
  g=w.gapi{% raw %}||(w.gapi={}{% endraw %});g.analytics={% raw %}{q:[],ready:function(cb){this.q.push(cb)}{% endraw %}};
  js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
  js.src='https://apis.google.com/js/platform.js';
  fjs.parentNode.insertBefore(js,fjs);js.onload=function(){% raw %}{g.load('analytics')}{% endraw %};
}(window,document,'script'));
&lt;/script&gt;

&lt;script&gt;
var $tbody;
var $status;
var intl = false;

$(document).ready(function() {
	
	if(window.Intl) intl = true;
	
	$tbody = $(&quot;#dataTable tbody&quot;);
	$status = $(&quot;#status&quot;);
	$status.html(&quot;&lt;i&gt;Please stand by - loading data...&lt;/i&gt;&quot;);

	gapi.analytics.ready(function() {
	
	
		var CLIENT_ID = '818125206534-g1r0datdtu9serq2pf9cp5vkuih3h8pv.apps.googleusercontent.com';
		
		gapi.analytics.auth.authorize({
			container: 'auth-button',
			clientid: CLIENT_ID,
			userInfoLabel:&quot;&quot;
		});
	
		gapi.analytics.auth.on('success', function(response) {
			//hide the auth-button
			document.querySelector(&quot;#auth-button&quot;).style.display='none';
			
			gapi.client.analytics.data.ga.get({
				'ids': 'ga:31405',
				'metrics': 'ga:sessions,ga:avgSessionDuration',
				'start-date': '30daysAgo',
				'end-date': 'yesterday',
				'dimensions':'ga:date'
			}).execute(function(results) {
				$status.html(&quot;&quot;);
				renderData(results.rows);
			});
		
	
		});
	
	});
	
});


function formatDate(str) {
	var year = str.substring(0,4);
	var month = str.substring(4,6);
	var day = str.substring(6,8);
	if(intl) {
		var d = new Date(year,month-1,day); 
		return new Intl.DateTimeFormat().format(d);
	} 
	return month + &quot;/&quot; + day + &quot;/&quot; + year;
}

function formatNumber(str) {
	if(intl) return new Intl.NumberFormat().format(str);
	return str;
}

function formatTime(str) {
	var dur = moment.duration(parseInt(str,10), 'seconds');
	var minutes = dur.minutes();
	var seconds = dur.seconds();
	return minutes + &quot; minutes and &quot; + seconds + &quot; seconds&quot;;
}

function renderData(data) {
	var s = &quot;&quot;;
	for(var i=0;i&lt;data.length;i++) {
		s += &quot;&lt;tr&gt;&lt;td&gt;&quot; + formatDate(data[i][0]) + &quot;&lt;/td&gt;&quot;;
		s += &quot;&lt;td&gt;&quot; + formatNumber(data[i][1]) + &quot;&lt;/td&gt;&quot;;
		s += &quot;&lt;td&gt;&quot; + formatTime(data[i][2]) + &quot;&lt;/td&gt;&lt;/tr&gt;&quot;;
	}
	$tbody.html(s);
}
&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

The biggest change here is that now I ask for the data so that I can do whatever I want with it. You can see this in the <code>gapi.client.analytics.data.ga.get</code> call. Once I have the data, I'm free to format it as I want. I decided to get a bit fancy.

First, I made use of Intl to format the dates and numbers nicely. This is a cool web standard (see my article here - <a href="http://code.tutsplus.com/tutorials/working-with-intl--cms-21082">Working with Intl</a>) that is incredibly easy to use. It doesn't work on iOS yet, but luckily you can do 'snap to' with CSS in iOS which is far more important than internationalization. 

To handle the minute display, I made use of the awesome <a href="http://www.momentjs.com">MomentJS</a> library. It has a <code>duration</code> API that makes showing the parts of a span of time very easy. I'm not terribly happy with how I showed it - but obviously you could modify this to your needs. Here is the result.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/shot21.png" alt="shot2" width="736" height="562" class="aligncenter size-full wp-image-6779 imgborder" />

There ya go. Hopefully this helps. I'd share an online version but it is currently tied to my web property so it wouldn't work for you. To be clear, you can easily change the property, or add support for letting the user select their property.