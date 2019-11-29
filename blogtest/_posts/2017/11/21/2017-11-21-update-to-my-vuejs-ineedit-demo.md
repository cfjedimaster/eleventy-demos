---
layout: post
title: "Update to my Vue.js INeedIt Demo"
date: "2017-11-21T02:11:00-07:00"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2017/11/21/update-to-my-vuejs-ineedit-demo
---

A few days ago I [shared](https://www.raymondcamden.com/2017/11/16/another-vuejs-demo-ineedit/) a simple Vue.js demo for an app called INeedIt. While not a terribly a complex application, it was something fun to build just to get some practice with Vue. Before I shared that post, I let my friend [Ted Patrick](http://light.ly/) take a look at the code and he had some feedback I thought would be nice to incorporate into a second version. I've made his suggested changes and I thought I'd quickly review them here. This is version two of the app and I've already got a third version of the app to share later. Anyway, here are the changes he suggested.

First, and this is the simplest, was a change in the script tags I used. The first version had this:

<pre><code class="language-markup">&lt;script src="https://unpkg.com/vue"&gt;&lt;/script&gt;
&lt;script src="https://unpkg.com/vue-router/dist/vue-router.js"&gt;&lt;/script&gt;
</code></pre>

This will load the most recent version of Vue, and the Vue Router, but also has some delays in terms of loading. How much of a delay? Half a second. While that doesn't sound like much, every delay adds up, and switching to a specific version removes that delay. Here is the simple update:

<pre><code class="language-markup">&lt;script src=&quot;https:&#x2F;&#x2F;unpkg.com&#x2F;vue@2.5.3&#x2F;dist&#x2F;vue.min.js&quot;&gt;&lt;&#x2F;script&gt;
&lt;script src=&quot;https:&#x2F;&#x2F;unpkg.com&#x2F;vue-router@3.0.1&#x2F;dist&#x2F;vue-router.min.js&quot;&gt;&lt;&#x2F;script&gt;
</code></pre>

The second change was more important and fixes an obvious bug in the first version. My initial version used the `created` event to request the user's location. Unfortunately, this ran every time the route was loaded as the component was created each time the view was shown. Ted suggested a simple change to the code that addressed this.

He moved the data for the component (which included a few flags, the set of services, and the location) into the global scope. So the top of my app.js now has this:

<pre><code class="language-javascript">const SEARCH_API = 'https://openwhisk.ng.bluemix.net/api/v1/web/rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space/googleplaces/search.json';
const DETAIL_API = 'https://openwhisk.ng.bluemix.net/api/v1/web/rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space/googleplaces/detail.json';

//used for search max distance
const RADIUS = 2000;

let model = {
	error:false,
	loading:true,
	lat:null,
	lng:null,
	serviceTypes:[
		{% raw %}{"id":"accounting","label":"Accounting"}{% endraw %},{% raw %}{"id":"airport","label":"Airport"}{% endraw %},{% raw %}{"id":"amusement_park","label":"Amusement Park"}{% endraw %},{% raw %}{"id":"aquarium","label":"Aquarium"}{% endraw %},
		{% raw %}{"id":"travel_agency","label":"Travel Agency"}{% endraw %},{% raw %}{"id":"university","label":"University"}{% endraw %},
		{% raw %}{"id":"veterinary_care","label":"Veterinary Care"}{% endraw %},{% raw %}{"id":"zoo","label":"Zoo"}{% endraw %}
	]
};
</code></pre>

Once again I removed a bunch of the serviceTypes values to save space. Next, the component's data function was changed to this:

<pre><code class="language-javascript">data:function() { 
	return model;
},
</code></pre>

This will point to the global variable and ensure that the values are not lost when navigating away and then back again. Finally, the `created` event was changed to `mounted` and now checks for GPS data.

<pre><code class="language-javascript">mounted:function() {
	this.$nextTick(function() {
		if(this.lat === null) {
			console.log('get geolocation', this.lat);
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
}
</code></pre>

I don't like having the flags in the global scope and if I cared enough I could get around that, but this did work well and made the application run quicker, all good things, right?

And that's it. As I said, not a lot of changes, but I wanted to separate them out so I could see a "progression" of the app. You can view the demo here: https://cfjedimaster.github.io/webdemos/ineedit2. The source for it may be found here: https://github.com/cfjedimaster/webdemos/tree/master/ineedit2

As always - feedback and comments are welcome. Tomorrow I'll be posting the third version which I'm pretty excited about! (Actually it's in GitHub now if you want to take a gander. ;)