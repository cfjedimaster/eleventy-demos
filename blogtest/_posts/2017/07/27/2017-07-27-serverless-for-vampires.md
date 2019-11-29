---
layout: post
title: "Serverless for Vampires"
date: "2017-07-27T13:24:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/serverless_vampire.jpg
permalink: /2017/07/27/serverless-for-vampires
---

Ok, as a quick warning, this is a pretty stupid demo. I mean, I know that's my thing - I'm the person who makes demos with cats. But this *really* pushes it a bit too far. I was bored a week or so ago and found an interesting API, the [Sunrise Sunset](https://sunrise-sunset.org/api) API. This is a free API that returns sunrise and sunset times for a specific location. So obviously I saw that and thought it would be the perfect kind of service for vampires.

I mean - imagine you're nice and comfy in your incredibly gothic tomb, you've woken up from a nice nap, and aren't really sure what time it is.

![Horrible cell signal here](https://static.raymondcamden.com/images/2017/7/vc1.jpg)
<i>Pro Tip: Don't google for 'vampire crypt' at work. <a href="https://commons.wikimedia.org/wiki/File:University_College,_Durham_Crypt.jpg">Source</a></i>

Or perhaps you know the time, but aren't sure if the sun has risen yet. This is where the API comes in hand. Working with the API is pretty simple - for basic options you simply pass in a longitude and latitude. I began by building this OpenWhisk action:

<pre><code class="language-javascript">const rp = require(&#x27;request-promise&#x27;);

function main(args) {

	if(!args.lat || !args.lng) {
		return {% raw %}{ error:&#x27;Parameters lat and lng are required.&#x27; }{% endraw %};
	}

	return new Promise((resolve, reject) =&gt; {
		let now = new Date();
		let url = `https:&#x2F;&#x2F;api.sunrise-sunset.org&#x2F;json?lat=${% raw %}{args.lat}{% endraw %}&amp;lng=${% raw %}{args.lng}{% endraw %}&amp;formatted=0`;
		let options = {
			uri:url,
			json:true
		};

		rp(options).then(result =&gt; {
			let data = result.results;
			&#x2F;*
			if now &lt; data.sunrise || now &gt; data.sunset
			*&#x2F;
			let sunrise = new Date(data.sunrise);
			let sunset = new Date(data.sunset);
			
			resolve({% raw %}{result:(now &lt; sunrise |{% endraw %}{% raw %}| now &gt; sunset)}{% endraw %});
		}).catch(err =&gt; {
			reject({% raw %}{error:err}{% endraw %});
		});

	});

}
</code></pre>

From top to bottom - I do a bit of basic parameter validation and then just pass off a request to the API. Once I've got the result, I compare the current time to the sunrise and sunset times for the location. If the current time is after before sunrise or after sunset then I return true. I named this action isVampireSafe, so true means yes, it is perfectly for vampires to come out, have a good time, etc. 

I put this up on OpenWhisk and enabled it as a web action and with that, I was completely done with my vampire-safety API. This basically took me ten minutes or so and I've already done a public service for monsters everywhere. 

On the client side, I wrote up a quick application with a bit of minimal HTML and JavaScript. Here's the HTML:

<pre><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;style&gt;
			body {
				background-color:black;
			}

			h1, div {
				color: red;
			}
		&lt;&#x2F;style&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;h1&gt;Vampire Safe?&lt;&#x2F;h1&gt;

		&lt;div id=&quot;status&quot;&gt;&lt;&#x2F;div&gt;

		&lt;script src=&quot;client.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

As you can see, just a simple H1 label and an empty div. Forgive me for the inline style. And here is the JavaScript:

<pre><code class="language-javascript">let $status;
const API = &#x27;https:&#x2F;&#x2F;openwhisk.ng.bluemix.net&#x2F;api&#x2F;v1&#x2F;web&#x2F;rcamden@us.ibm.com_My%20Space&#x2F;safeToDelete&#x2F;isVampireSafe.json&#x27;;
const GOOD = `&lt;p&gt;It is totally safe to be outside as a vampire. Happy Hunting!&lt;&#x2F;p&gt;`;
const BAD = `&lt;p&gt;Sorry, the sun is up. Stay indoors!&lt;&#x2F;p&gt;`;

document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);
function init() {

	$status = document.querySelector(&#x27;#status&#x27;);

	&#x2F;&#x2F;First, get location
	navigator.geolocation.getCurrentPosition(gotLoc,locErr);

}

function locErr(e) {
	console.log(&#x27;location error&#x27;, e);
	$status.innerHTML = `
	&lt;p&gt;
	You need to let this app know your location in order for it to work. Or maybe you did
	and somethig else went wrong. I&#x27;m truly sorry.
	&lt;&#x2F;p&gt;`;
}

function gotLoc(pos) {
	console.log(&#x27;position&#x27;,pos.coords);

	fetch(API+&#x27;?lat=&#x27;+pos.coords.latitude+&#x27;&amp;lng=&#x27;+pos.coords.longitude).then((res) =&gt; {
		return res.json();
	}).then((res) =&gt; {
		console.log(res);
		if(res.result === true) {
			$status.innerHTML=GOOD;
		} else {
			$status.innerHTML=BAD;
		}
	});
}
</code></pre>

This just boils down to a quick Geolocation call and then a Fetch off to my API. Once I get my results I update the HTML. Here's a screen shot of it in action (note, it is currently 1:49PM my time and about 200 degrees).

![Vampire Safe](https://static.raymondcamden.com/images/2017/7/vc2.jpg)

Of course, if I wanted to get really precise, I could do a weather check as well and allow vampires to exit if it is cloudy/stormy outside, but that would be a silly waste of time of course. 

Want to try it yourself? You can visit the online location here: https://cfjedimaster.github.io/Serverless-Examples/vampire/client.html