---
layout: post
title: "Quick example of the Google Analytics Embed API"
date: "2015-06-10T13:31:36+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2015/06/10/quick-example-of-the-google-analytics-embed-api
guid: 6288
---

In my <a href="http://www.raymondcamden.com/2015/06/08/google-analytics-and-rss-report">blog post</a> from earlier this week, I mentioned how Google has a new <a href="https://developers.google.com/analytics/devguides/reporting/embed/v1/">Analytics Embed API</a>. While it still requires a bit of programming, it is a <i>greatly</i> simplified version of the code you needed before in order to work with Google Analytics. As you can guess, the primary use case (at least in my opinion) for this will be to embed charts on a web site so you don't have to go to the Google Analytics dashboard to see how well your site is doing. 

<!--more-->

Oddly though the docs don't show an actual example of that use case. Instead, all of the examples rely on your own particular Google Analytic site data and each demo asks you to select a property first. Now, I get that that makes it possible for us to actually <i>see</i> the demos. However, it doesn't give us an example of how you would embed this on a site and ensure that the report just shows that site's particular data. It's really relatively simple, but as I said, I was a bit surprised this wasn't demonstrated.

To see how you could do this, let's start with a demo that lets you pick a property, like the demos on the site. (And to be clear, this <i>is</i> a demo from their site, I didn't write it.)

<pre><code class="language-javascript">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;Embed API Demo&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;!-- Step 1: Create the containing elements. --&gt;

&lt;section id=&quot;auth-button&quot;&gt;&lt;/section&gt;
&lt;section id=&quot;view-selector&quot;&gt;&lt;/section&gt;
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
  });

  // Step 4: Create the view selector.

  var viewSelector = new gapi.analytics.ViewSelector({
    container: 'view-selector'
  });

  // Step 5: Create the timeline chart.

  var timeline = new gapi.analytics.googleCharts.DataChart({
    reportType: 'ga',
    query: {
      'dimensions': 'ga:date',
      'metrics': 'ga:sessions',
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
    },
    chart: {
      type: 'LINE',
      container: 'timeline'
    }
  });

  // Step 6: Hook up the components to work together.

  gapi.analytics.auth.on('success', function(response) {
    viewSelector.execute();
  });

  viewSelector.on('change', function(ids) {
    var newIds = {
      query: {
        ids: ids
      }
    }
    timeline.set(newIds).execute();
  });
});
&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

That's nice, right? As I said, when I was building my own Google Analytics mashup it was quite a bit more complex than this. Here is a screen shot of the result - don't forget you can see this, and other examples, on the <a href="https://ga-dev-tools.appspot.com/embed-api/">demo site</a> for the API.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot13.png" alt="shot1" width="470" height="397" class="aligncenter size-full wp-image-6289 imgborder" />

I've called out two things in the screen shot above. The first is the "You are logged in as" message. The Embed API does <strong>not</strong> let you remove this. You can change the text in front of the username, but even if you set the property to an empty string, the username will still show up. To me, this is useless information if I'm embedding in my site admin portal. And obviously the site picker itself is something we want to get rid of.

In order to make these changes, we just need to do a few things. Here's the updated code.

<pre><code class="language-javascript">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;Embed API Demo&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;!-- Step 1: Create the containing elements. --&gt;

&lt;section id=&quot;auth-button&quot;&gt;&lt;/section&gt;
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
      'metrics': 'ga:sessions',
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
     'ids': &quot;ga:31405&quot;
    },
    chart: {
      type: 'LINE',
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

So what did I change?

<ul>
<li>I set userInfoLabel to an empty string in my authorize code. As I said, Google will still show the username in the div it is associated with, and we're going to fix that too, but this will at least make the text size smaller.
<li>In the DataChart embed, I hard code the ID for my property.
<li>Next, in my authentication success method, I hide the div that contains the authentication info.
</ul>

And that's it. Here is the result - which would make more sense in an admin portal of some kind but I assume you can use your imagination:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/06/shot22.png" alt="shot2" width="482" height="271" class="aligncenter size-full wp-image-6290" />

By the way, you can customize the chart quite a bit as well. For example, here is a modification that adds a simple animation as the chart loads:

<pre><code class="language-javascript">  var timeline = new gapi.analytics.googleCharts.DataChart({
    reportType: 'ga',
    query: {
      'dimensions': 'ga:date',
      'metrics': 'ga:sessions',
      'start-date': '30daysAgo',
      'end-date': 'yesterday',
      'ids': "ga:31405"
    },
    chart: {
      type: 'LINE',
      container: 'timeline',
      options:{
        'animation.duration':200,
        animation:{
          duration:1000,
          startup:true
        }
      }
    }
  });</code></pre>

So, where did I get my ID value? Well for me, I simply modified the first code listing to console.log the ID value. Another way to get it would be to go your property settings, then to the View, and copy the View ID. Remember to add <code>ga:</code> in front.

I hope this helps. To be clear, this will only work if the authenticated user has access to this particular ID. You may be wondering how to handle that. You could add an error handler to the auth code, but the user may authenticate just fine and not have access. Luckily you can also add an error handler to the timeline - as simple as this:

<pre><code class="language-javascript"> timeline.on('error', function(e) {
    console.dir(e);
    console.log('timeline err')    
});</code></pre>

You wouldn't use the console to report the issue of course. You could easily add a message like, "Please contact Bob in IT so he can add you to the list of people who can access this GA account."