---
layout: post
title: "Working with the Bluemix Personality Insights Service"
date: "2015-03-10T08:50:48+06:00"
categories: [development]
tags: [bluemix]
banner_image: 
permalink: /2015/03/10/working-with-the-bluemix-personality-insights-service
guid: 5804
---

As I continue to play around with <a href="https://console.ng.bluemix.net/">IBM Bluemix</a>, this week I spent some time playing with the <a href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/personality-insights.html">Personality Insights</a> service. This service uses IBM Watson to analyze textual input and try to determine personality aspects of the author. It focuses on three areas of analysis:

<!--more-->

<ul>
<li>Determining what the <strong>needs</strong> of the author are. These needs are narrowed to twelve main areas and rated on a 0-100 percentile scale. The needs are: Excitement, Harmony, Curiosity, Ideal, Closeness, Self-expression, Liberty, Love, Practicality, Stability, Challenge, and Structure.
<li>Determining what the <strong>values</strong> of the author are. These are things Watson believe will be important to the author. As with needs, values are focused on a set of core items: Self-transcendence / Helping others, Conservation / Tradition, Hedonism / Taking pleasure in life, Self-enhancement / Achieving success, and Open to change / Excitement.
<li>Finally, the PI service reports on the "Big Five" - this is a personality model that tries to describe how a person interacts with the world. 
</ul>

As you can imagine, this is pretty deep stuff, and frankly, my wife who is working on her sociology degree would probably have a better understanding of the results. You can check out the <a href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/personality-insights/">full docs</a> as well as look at the <a href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/apis/#!/personality-insights/profile">API docs</a> for more information.

For my demo, I decided to try something interesting. The PI service works best when it has at least 3500 words. A typical blog post may include five hundred or so words, and with a typical RSS feed being ten items, I decided to build an application that would analyze an RSS feed and try to determine the personality of the author. I called it the <strong>Blog Personality Scan</strong>. I'll link to the demo in a moment, but let's look at the code first.

First, we'll look at the app.js file for the Node app. It is pretty trivial as there are only two views - the home page and the API to send an RSS url.

<pre><code class="language-javascript">&#x2F;*jshint node:false *&#x2F;
&#x2F;* global console,require *&#x2F;
var express = require(&#x27;express&#x27;);
var hbs = require(&#x27;hbs&#x27;);
var url = require(&#x27;url&#x27;);

hbs.registerHelper(&#x27;raw-helper&#x27;, function(options) {
  return options.fn();
});

var rssReader = require(&#x27;.&#x2F;rssreader.js&#x27;);
var insightsAPI = require(&#x27;.&#x2F;insights.js&#x27;);

&#x2F;&#x2F; setup middleware
var app = express();
app.use(app.router);
app.use(express.errorHandler());
app.use(express.static(__dirname + &#x27;&#x2F;public&#x27;)); &#x2F;&#x2F;setup static public directory
app.set(&#x27;view engine&#x27;, &#x27;html&#x27;);
app.engine(&#x27;html&#x27;, hbs.__express);
app.set(&#x27;views&#x27;, __dirname + &#x27;&#x2F;views&#x27;); &#x2F;&#x2F;optional since express defaults to CWD&#x2F;views

&#x2F;&#x2F; render index page
app.get(&#x27;&#x2F;&#x27;, function(req, res){
	res.render(&#x27;index&#x27;);
});

app.get(&#x27;&#x2F;parse&#x27;, function(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(!query.rss) {
		res.json({% raw %}{error:&quot;Invalid data sent.&quot;}{% endraw %});
		return;
	}
	rssReader.parse(query.rss, function(err,content) {
		if(err) {
			res.json(err);
		} else {
			console.log(&#x27;bak with content, len is &#x27;+content.length);
			insightsAPI.parse(query.rss, query.rss, content, function(data) {
				console.log(&#x27;back from IAPI&#x27;);
				&#x2F;&#x2F;console.log(JSON.stringify(data));
				res.json(data);	
			});
		}
	});
});

&#x2F;&#x2F; There are many useful environment variables available in process.env.
&#x2F;&#x2F; VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION {% raw %}|| &quot;{}{% endraw %}&quot;);
&#x2F;&#x2F; TODO: Get application information and use it in your app.

&#x2F;&#x2F; VCAP_SERVICES contains all the credentials of services bound to
&#x2F;&#x2F; this application. For details of its content, please refer to
&#x2F;&#x2F; the document or sample of each service.
if(process.env.VCAP_SERVICES) {
	var services = JSON.parse(process.env.VCAP_SERVICES {% raw %}|| &quot;{}{% endraw %}&quot;);
	console.log(services);
	var apiUrl = services.personality_insights[0].credentials.url;
	var apiUsername = services.personality_insights[0].credentials.username;
	var apiPassword = services.personality_insights[0].credentials.password;
} else {
	var credentials = require(&#x27;.&#x2F;credentials.json&#x27;);
	var apiUrl = credentials.apiUrl;
	var apiUsername = credentials.apiUsername;
	var apiPassword = credentials.apiPassword;
}
insightsAPI.setAuth(apiUrl, apiUsername, apiPassword);
					
&#x2F;&#x2F; The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || &#x27;localhost&#x27;);
&#x2F;&#x2F; The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
&#x2F;&#x2F; Start server
app.listen(port, host);
console.log(&#x27;App started on port &#x27; + port);</code></pre>

Not terribly exciting and I wouldn't share it normally, but I specifically wanted to call out the bits that look at <code>process.env.VCAP_SERVICES</code>. This is how my app picks up the API credentials when running in the Bluemix environment. 

RSS reading is taken care of by the <a href="https://www.npmjs.com/package/feedparser">feedparser</a> NPM package. This is the same one I used for <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>. I'll skip that code as it isn't that exciting. 

The real fun part comes in the code used to interact with the PI service:

<pre><code class="language-javascript">var https = require('https');
var querystring = require('querystring');
var url = require('url');

var apiUsername;
var apiPassword;
var apiUrl;
var apiHost;
var apiPath;

function setAuth(apiurl, u, p) {
	apiUrl = apiurl;
	apiUsername=u;
	apiPassword=p;
	var parts = url.parse(apiUrl);
	apiHost = parts.host;
	apiPath = parts.pathname;
}

function sendInsights(user,source,input,cb) {
	//cb(fake);return;
	var data = {% raw %}{"contentItems":[]}{% endraw %};
	var item = {};
	item.userid = user;
	item.sourceid = source;
	this.id = this.userid + '_'+this.sourceid;
	item.contenttype = "text/plain";
	//todo - remove html from input. the service does it, but we can do it ourselves
	item.language = "en";
	item.content = input;
	
	data.contentItems.push(item);
	
	var postData = JSON.stringify(data);
	
	
	var options = {
		host: apiHost,
		port: 443, 
		path: apiPath + "/v2/profile",
		headers: {
			'Authorization': 'Basic ' + new Buffer(apiUsername + ':' + apiPassword).toString('base64'),
			'Content-Type':'application/json',
			'Content-Length': Buffer.byteLength(postData)
		},
		method:"post"
	};
	console.log(options);
	var req = https.request(options, function(resp) {
		var body = "";
		resp.on("data", function(chunk) {
			body += chunk;
		});
		
		resp.on("end", function() {
			//console.log("done");console.log(body);
			cb(JSON.parse(body));
		});
		
	});
	req.write(postData);
	req.end();
	
};

var InsightAPI = {
	setAuth:setAuth,
	parse:sendInsights
};

module.exports = InsightAPI;</code></pre>

Ok, perhaps "exciting" is a bit much. Honestly, it is just a HTTP hit and a JSON response. Simple - but that's kind of the point. A good service should be rather simple to use. 

The rest was just presenting the results. The folks at Bluemix created a <a href="https://watson-pi-demo.mybluemix.net/">cool demo</a> with charts and stuff, but I decided to keep it simple and just render the values - sorted. I used Handlebars to make it a bit nicer, which ended up being a bit confusing to me. It never occurred to me to consider what would happen when I used a Handlebars template for the client side in a view that was being run by a Node.js app using Handlebars on the client as well. As you can guess, it didn't work well at first. If you look back at that first code listing you'll see a helper called raw-helper. I needed to add this so I could use Handlebar's syntax in my view and have the server ignore it. This is how it looks in index.html:

<pre><code class="language-markup">&lt;script id=&quot;reportTemplate&quot; type=&quot;text&#x2F;x-handlebars-template&quot;&gt;
	{% raw %}{{{{raw-helper}}{% endraw %}}}
	&lt;div class=&quot;row&quot;&gt;
		&lt;div class=&quot;col-md-4&quot;&gt;
			&lt;h2&gt;Values&lt;&#x2F;h2&gt;
			{% raw %}{{#each values}}{% endraw %}
			&lt;div class=&quot;row&quot;&gt;
				&lt;div class=&quot;col-md-6&quot;&gt;&lt;strong&gt;{% raw %}{{name}}{% endraw %}&lt;&#x2F;strong&gt;&lt;&#x2F;div&gt;
				&lt;div class=&quot;col-md-6&quot;&gt;{% raw %}{{perc percentage}}{% endraw %}&lt;&#x2F;div&gt;
			&lt;&#x2F;div&gt;
			{% raw %}{{&#x2F;each}}{% endraw %}			
		&lt;&#x2F;div&gt;
		&lt;div class=&quot;col-md-4&quot;&gt;
			&lt;h2&gt;Needs&lt;&#x2F;h2&gt;
			{% raw %}{{#each needs}}{% endraw %}
			&lt;div class=&quot;row&quot;&gt;
				&lt;div class=&quot;col-md-6&quot;&gt;&lt;strong&gt;{% raw %}{{name}}{% endraw %}&lt;&#x2F;strong&gt;&lt;&#x2F;div&gt;
				&lt;div class=&quot;col-md-6&quot;&gt;{% raw %}{{perc percentage}}{% endraw %}&lt;&#x2F;div&gt;
			&lt;&#x2F;div&gt;
			{% raw %}{{&#x2F;each}}{% endraw %}
		&lt;&#x2F;div&gt;
		&lt;div class=&quot;col-md-4&quot;&gt;
			&lt;h2&gt;The Big 5&lt;&#x2F;h2&gt;
			{% raw %}{{#each big5}{% endraw %}}
			&lt;div class=&quot;row&quot;&gt;
				&lt;div class=&quot;col-md-6&quot;&gt;&lt;strong&gt;{% raw %}{{name}}{% endraw %}&lt;&#x2F;strong&gt;&lt;&#x2F;div&gt;
				&lt;div class=&quot;col-md-6&quot;&gt;{% raw %}{{perc percentage}}{% endraw %}&lt;&#x2F;div&gt;
			&lt;&#x2F;div&gt;
				{% raw %}{{#each children}}{% endraw %}
					&lt;div class=&quot;row&quot;&gt;
						&lt;div class=&quot;col-md-offset12 col-md-5 text-muted&quot;&gt;{% raw %}{{name}}{% endraw %}&lt;&#x2F;div&gt;
						&lt;div class=&quot;col-md-6 text-muted&quot;&gt;{% raw %}{{perc percentage}}{% endraw %}&lt;&#x2F;div&gt;
					&lt;&#x2F;div&gt;
				{% raw %}{{&#x2F;each}}{% endraw %}

			{% raw %}{{&#x2F;each}}{% endraw %}
		&lt;&#x2F;div&gt;
	&lt;&#x2F;div&gt;
	{% raw %}{{{{&#x2F;raw-helper}}{% endraw %}}}
&lt;&#x2F;script&gt;</code></pre>

Once I got this working, I was mostly OK, but then I did stupid crap like adding a helper in the Node.js app.js when I really needed it in the client-side app.js. I probably shouldn't have named those files the same. So what do the results look like? I'm going to link to the demo of course, but here are some examples. First, my own blog:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/pi_ray.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/pi_ray.png" alt="pi_ray" width="850" height="609" class="alignnone size-full wp-image-5805" /></a>

Next, Gruber of <a href="http://daringfireball.net/">Daring Fireball</a>:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/pi_df.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/pi_df.png" alt="pi_df" width="850" height="604" class="alignnone size-full wp-image-5806" /></a>

And finally, <a href="http://www.sarahpac.com/">Sarah Palin's blog</a>:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/pi_sp.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/pi_sp.png" alt="pi_sp" width="850" height="598" class="alignnone size-full wp-image-5807" /></a>

Want to try it yourself? Check out the demo here: <a href="http://bloginsights.mybluemix.net/">http://bloginsights.mybluemix.net/</a>. You can see the entire source code for the project here: <a href="https://github.com/cfjedimaster/bloginsights">https://github.com/cfjedimaster/bloginsights</a>.