---
layout: post
title: "Another Vue.js Demo - INeedIt"
date: "2017-11-16T01:40:00-07:00"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2017/11/16/another-vuejs-demo-ineedit
---

Ok, so ditto my previous warnings about being new to [Vue.js](https://vuejs.org) and how my code is probably crap, blah blah blah. You get the idea. I'm learning. I'm sharing. Expect the code not to be perfect. Let's move on!

I began with mobile development using Flex Mobile many, many years ago. I can remember getting a free phone at Adobe MAX (I think that was the year where we also got a Google TV) and downloading the Flex SDK that night in the hotel. The first app I built was something called "INeedIt". The idea was simple - you are in a strange city and need to find... something. A bank. A restaurant. An ATM. The app presented a list of categories, you selected one, and then it would tell you the businesses matching that category that were nearby. You could then click for details. 

If you're really curious about the old Flex Mobile version, you can read [blog post](https://www.raymondcamden.com/.../INeedIt-Simple-Flex-Mobile-example/) from way back in 2011. I then [rebuilt it](https://www.raymondcamden.com/2014/.../AngularJS-Doesnt-Suck/) in AngularJS in early 2014 and [again](https://www.raymondcamden.com/.../my-perspective-of-working-with-the- ionic-framework/) in Ionic. I thought it would be fun to build it - once again - in Vue.

Before getting into the code, let's look at some screens. This has *no* design whatsoever, it's just plain text. I've got some ideas about how to make it look nicer, but I thought it made sense to start with the functionality first, and then make it pretty later.

On the first screen, I do two things - load your location via Geolocation, and then present the list of categories.

![First screen](https://static.raymondcamden.com/images/2017/11/invue1.jpg)

After selecting a category, the Google [Places API](https://developers.google.com/places/) is used to find businesses matching that categories within 2000 meters of your location.

![Second screen](https://static.raymondcamden.com/images/2017/11/invue2.jpg)

Finally you can click on a business for detail. In the screen shot below, you are seeing a small set of the data returned from the API. It's actually quite intensive.

![Third screen](https://static.raymondcamden.com/images/2017/11/invue3.jpg)

And there you go - that's it. Pretty simple, and no different than what you'd get if you Google for "foo near me", but as an app, it's the perfect kind of thing for me to build to get some practice. Now let's look at the code. I'll be sharing a link both to the online demo and GitHub repo at the end. I'll also remind folks that this is "rough" code. I've already gotten some *great* feedback from [Ted Patrick](http://light.ly/). His feedback was so darn good, I've decided to turn it into a follow up for later this week. 

Let's begin with the HTML, which is rather simple.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;div id=&quot;app&quot;&gt;
			&lt;router-view&gt;&lt;&#x2F;router-view&gt;
		&lt;&#x2F;div&gt;

		&lt;script src=&quot;https:&#x2F;&#x2F;unpkg.com&#x2F;vue&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;https:&#x2F;&#x2F;unpkg.com&#x2F;vue-router&#x2F;dist&#x2F;vue-router.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script src=&quot;app.js&quot;&gt;&lt;&#x2F;script&gt;

	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

Basically I just use an empty div and a `router-view`. After that I load up Vue, the Vue Router, and my own code. Everything shown on screen will be rendered via Vue components that are loaded based on the particular view of the app. All of my code is in app.js, but let me break it into smaller chunks for easier reading.

First, let's look at the 'meta' code for the application, basically the routing and initial Vue setup.

<pre><code class="language-javascript">const router = new VueRouter({
	routes:[
		{
			path:&#x27;&#x2F;&#x27;,
			component:ServiceList
		},
		{
			path:&#x27;&#x2F;type&#x2F;:type&#x2F;name&#x2F;:name&#x2F;lat&#x2F;:lat&#x2F;lng&#x2F;:lng&#x27;,
			component:TypeList,
			name:&#x27;typeList&#x27;, 
			props:true
		},
		{
			path:&#x27;&#x2F;detail&#x2F;:placeid&#x27;,
			component:Detail,
			name:&#x27;detail&#x27;,
			props:true
		}
	]
});

const app = new Vue({
	el:&#x27;#app&#x27;,
	router
});
</code></pre>

I've got 3 routers that map to my three screens. Each uses a particular component. Note the path in the `typeList` route. It's rather long. It includes a type id value, a type name, and the location values. I felt a bit weird passing so much in the URL, but then realized that this allowed for bookmarking and sharing, which is pretty cool. 

Now let's look at each component. Here is the initial view, `ServiceList`.

<pre><code class="language-javascript">const ServiceList = Vue.component(&#x27;ServiceList&#x27;, {
	template:`
&lt;div&gt;
&lt;h1&gt;Service List&lt;&#x2F;h1&gt;
	&lt;div v-if=&quot;loading&quot;&gt;
	Looking up your location...
	&lt;&#x2F;div&gt;

	&lt;div v-if=&quot;error&quot;&gt;
	I&#x27;m sorry, but I had a problem getitng your location. Check the console for details.
	&lt;&#x2F;div&gt;

	&lt;div v-if=&quot;!loading &amp;&amp; !error&quot;&gt;
	&lt;ul&gt;
	&lt;li v-for=&quot;service in serviceTypes&quot; :key=&quot;service.id&quot;&gt;
		&lt;router-link :to=&quot;{% raw %}{name:&#x27;typeList&#x27;, params:{type:service.id, name:service.label, lat:lat, lng:lng}{% endraw %} }&quot;&gt;{% raw %}{{service.label}}{% endraw %}&lt;&#x2F;router-link&gt;
	&lt;&#x2F;li&gt;
	&lt;&#x2F;ul&gt;
	&lt;&#x2F;div&gt;

&lt;&#x2F;div&gt;
	`,
	data:function() { 
		return {
			error:false,
			loading:true,
			lat:0,
			lng:0,
			serviceTypes:[
				{% raw %}{&quot;id&quot;:&quot;accounting&quot;,&quot;label&quot;:&quot;Accounting&quot;}{% endraw %},{% raw %}{&quot;id&quot;:&quot;airport&quot;,&quot;label&quot;:&quot;Airport&quot;}{% endraw %},{% raw %}{&quot;id&quot;:&quot;amusement_park&quot;,&quot;label&quot;:&quot;Amusement Park&quot;}{% endraw %},{% raw %}{&quot;id&quot;:&quot;aquarium&quot;,&quot;label&quot;:&quot;Aquarium&quot;}{% endraw %}
			]
		}
	},
	created:function() {
		console.log(&#x27;setup for geolocation&#x27;);
		let that = this;
		navigator.geolocation.getCurrentPosition(function(res) {
			console.log(res);
			that.lng = res.coords.longitude;
			that.lat = res.coords.latitude;
			that.loading = false;
		}, function(err) {
			console.error(err);
			that.loading = false;
			that.error = true;
		});
	}

});
</code></pre>

The component consists of a template and then various bits of code to support the functionality. The template has to handle three states:

* initially getting the user's location
* handling an error with that process
* rendering the list of services

You can see the logic to get the user's location in the `created` handler. It's just a vanilla Geolocation API call. The service list is a hard coded array of values set in my data function. I've trimmed a *significant* amount of data from the listing above. It's about 100 items or so. I felt bad embedding that big string in the code. It's ugly. But honestly it felt like the most practical way of handling it. It doesn't change often and making an Ajax call to load it seemed silly. I could move it to the top of my code as a simple constant (I did that for a few other values), but for now I'm just going to live with it.

After you select a service type, the `TypeList` component is loaded.

<pre><code class="language-javascript">const TypeList = Vue.component(&#x27;TypeList&#x27;, {
	template:`
&lt;div&gt;

	&lt;h1&gt;{% raw %}{{name}}{% endraw %}&lt;&#x2F;h1&gt;

	&lt;div v-if=&quot;loading&quot;&gt;
	Looking up data...
	&lt;&#x2F;div&gt;

	&lt;div v-if=&quot;!loading&quot;&gt;
		&lt;ul&gt;
			&lt;li v-for=&quot;result in results&quot; :key=&quot;result.id&quot;&gt;
			&lt;router-link :to=&quot;{% raw %}{name:&#x27;detail&#x27;, params:{placeid:result.place_id}{% endraw %} }&quot;&gt;{% raw %}{{result.name}}{% endraw %}&lt;&#x2F;router-link&gt;
			&lt;&#x2F;li&gt;
		&lt;&#x2F;ul&gt;

		&lt;p v-if=&quot;results.length === 0&quot;&gt;
		Sorry, no results.
		&lt;&#x2F;p&gt;

		&lt;p&gt;
		&lt;router-link to=&quot;&#x2F;&quot;&gt;Back&lt;&#x2F;router-link&gt;
		&lt;&#x2F;p&gt;
	&lt;&#x2F;div&gt;

&lt;&#x2F;div&gt;
	`,
	data:function() {
		return {
			results:[],
			loading:true
		}
	},
	created:function() {
		fetch(SEARCH_API+
		&#x27;?lat=&#x27;+this.lat+&#x27;&amp;lng=&#x27;+this.lng+&#x27;&amp;type=&#x27;+this.type+&#x27;&amp;radius=&#x27;+RADIUS)
		.then(res =&gt; res.json())
		.then(res =&gt; {
			console.log(&#x27;res&#x27;, res);
			this.results = res.result;
			this.loading = false;
		});
	}, 
	props:[&#x27;name&#x27;,&#x27;type&#x27;,&#x27;lat&#x27;,&#x27;lng&#x27;]
});
</code></pre> 

Once again, I start off with a template, a rather simple one, but like before I made it handle a "loading" state so the user knows things are happening. Those "things" are a call to get the results for businesses in this particular category near the location requested. The Google Places API does *not* support CORS. But guess what? It took me five minutes to write a wrapper in OpenWhisk and [IBM Cloud Function](https://www.ibm.com/cloud/functions). I'm not going to share that code in the post, but it's in the GitHub repo. What's nice is that I not only get around the CORS issue but I can embed my API key there instead of in my code. Alright, now let's look at the final component, `Detail`.

<pre><code class="language-javascript">const Detail = Vue.component(&#x27;Detail&#x27;, {
	template:`
&lt;div&gt;
	&lt;div v-if=&quot;loading&quot;&gt;
	Looking up data...
	&lt;&#x2F;div&gt;

	&lt;div v-if=&quot;!loading&quot;&gt;

		&lt;div&gt;
			&lt;img :src=&quot;detail.icon&quot;&gt;
			&lt;h2&gt;{% raw %}{{detail.name}}{% endraw %}&lt;&#x2F;h2&gt;
			&lt;p&gt;{% raw %}{{detail.formatted_address}}{% endraw %}&lt;&#x2F;p&gt;
		&lt;&#x2F;div&gt;

		&lt;div&gt;

			&lt;p&gt;
				This business is currently 
				&lt;span v-if=&quot;detail.opening_hours&quot;&gt;
					&lt;span v-if=&quot;detail.opening_hours.open_now&quot;&gt;open.&lt;&#x2F;span&gt;&lt;span v-else&gt;closed.&lt;&#x2F;span&gt;
				&lt;&#x2F;span&gt;
				&lt;br&#x2F;&gt;
				Phone: {% raw %}{{detail.formatted_phone_number}}{% endraw %}&lt;br&#x2F;&gt;
				Website: &lt;a :href=&quot;detail.website&quot; target=&quot;_new&quot;&gt;{% raw %}{{detail.website}}{% endraw %}&lt;&#x2F;a&gt;&lt;br&#x2F;&gt;
				&lt;span v-if=&quot;detail.price&quot;&gt;Items here are generally priced &quot;{% raw %}{{detail.price}}{% endraw %}&quot;.&lt;&#x2F;span&gt;
			&lt;&#x2F;p&gt;

			&lt;p&gt;
			&lt;img :src=&quot;detail.mapUrl&quot; width=&quot;310&quot; height=&quot;310&quot; class=&quot;full-image&quot; &#x2F;&gt;
			&lt;&#x2F;p&gt;

		&lt;&#x2F;div&gt;

		&lt;p&gt;
		&lt;a href=&quot;&quot; @click.prevent=&quot;goBack&quot;&gt;Go Back&lt;&#x2F;a&gt;
		&lt;&#x2F;p&gt;

	&lt;&#x2F;div&gt;
&lt;&#x2F;div&gt;
	`,
	data:function() {
		return {
			detail:[],
			loading:true
		}
	},	
	methods:{
		goBack:function() {
			this.$router.go(-1);
		}
	},
	created:function() {
		fetch(DETAIL_API+
		&#x27;?placeid=&#x27;+this.placeid)
		.then(res =&gt; res.json())
		.then(res =&gt; {
			console.log(&#x27;res&#x27;, res.result);
			&#x2F;*
			modify res.result to include a nice label for price
			*&#x2F;
			res.result.price = &#x27;&#x27;;
			if(res.price_level) {
				if(res.result.price_level === 0) res.result.price = &quot;Free&quot;;
				if(res.result.price_level === 1) res.result.price = &quot;Inexpensive&quot;;
				if(res.result.price_level === 2) res.result.price = &quot;Moderate&quot;;
				if(res.result.price_level === 3) res.result.price = &quot;Expensive&quot;;
				if(res.result.price_level === 4) res.result.price = &quot;Very expensive&quot;;
			}
			this.detail = res.result;

			&#x2F;&#x2F; add a google maps url
			this.detail.mapUrl = `https:&#x2F;&#x2F;maps.googleapis.com&#x2F;maps&#x2F;api&#x2F;staticmap?center=${% raw %}{this.detail.geometry.location.lat}{% endraw %},${% raw %}{this.detail.geometry.location.lng}{% endraw %}&amp;zoom=14&amp;markers=color:blue{% raw %}%7C${this.detail.geometry.location.lat}{% endraw %},${% raw %}{this.detail.geometry.location.lng}{% endraw %}&amp;size=310x310&amp;sensor=true&amp;key=AIzaSyBw5Mjzbn8oCwKEnwI2gtClM17VMCaNBUY`;
			this.loading = false;
		});

	},
	props:[&#x27;placeid&#x27;]
});
</code></pre>

So I've got a few things going on here. In the code, note that I make two manipulations of the data to enable some nice features in the display. First, I rewrite the `price_level` value to a string that is more useful (hopefully) to the user. Second, I create an image URL for the location using the Google Static Maps API. I do have my key embedded there but I've locked it down to my domain.

Another interesting thing - note the use of `this.$router.go(-1)` for progromatic navigation. Ok I guess it isn't that interesting, it just works, but I dig it!

Want to see this yourself? You can run it online here: https://cfjedimaster.github.io/webdemos/ineedit. The code may be found here: https://github.com/cfjedimaster/webdemos/tree/master/ineedit. Comments and suggestions about my code are *definitely* welcome. As I said, I already have some great feedback from Ted and I'll be sharing that next!