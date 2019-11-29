---
layout: post
title: "Yet Another Update to my INeedIt Vue.js App"
date: "2017-11-24"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2017/11/24/yet-another-update-to-my-ineedit-vuejs-app
---

This is the last update to my INeedIt app - I promise. At least until I get another idea or two for a good update. But then that will be the last one - honest. (Ok, probably not. ;) Before I begin, be sure to read the [first post](https://www.raymondcamden.com/2017/11/16/another-vuejs-demo-ineedit/) about this demo and the [update](https://www.raymondcamden.com/2017/11/21/update-to-my-vuejs-ineedit-demo/) from a few days ago. The last update was relatively minor. This one is pretty radical.

One of the things I ran into when working on this app was that my [app.js](https://github.com/cfjedimaster/webdemos/blob/master/ineedit2/app.js) file was getting a bit large. To be clear, 260 lines isn't really large per se, but it gave me a slight code smell to have my components and main application setup all in one file. I especially didn't like the layout portions. While template literals make them a lot easier to write, having my HTML in JavaScript is something I'd like to avoid. Heck, just the lack of color coding is a bit annoying:

![No color coding here](https://static.raymondcamden.com/images/2017/11/wpvue.jpg)

The solution is [single file components](https://vuejs.org/v2/guide/single-file-components.html). As you can guess, they let you use one file per component. Here is a trivial sample.

<pre><code class="language-markup">
&lt;template&gt;
&lt;div&gt;
  &lt;strong&gt;My favorite pie is {% raw %}{{pie}}{% endraw %}.&lt;/strong&gt;
&lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
module.exports = {
  data:function() {
    return {% raw %}{ pie:'pecan' }{% endraw %};
  }
}
&lt;/script&gt;

&lt;style scoped&gt;
div {
  background-color: yellow;
}
&lt;/style&gt;
</code></pre>

Each single file component (SFC) may be comprised of a template (layout), script (logic) and style (design) block. 

So this is cool - however - using this form requires a build process of some sort. I'm definitely not opposed to a build process, but I was a bit hesitant to move to one for Vue. I loved how simple Vue was to start with and I was concerned that moving to a more complex process wouldn't be as much fun. Plus, I found the docs for SFC to be a bit hard to follow. In general, I love the Vue docs, but I was a bit loss in this area as it assumes some basic familiarity with Webpack. 

When I first encountered this, I stopped what I was doing and tried to pick up a bit of Webpack. I ran across an incredibly good introduction on Smashing Magazine: [Webpack - A Detailed Introduction](https://www.smashingmagazine.com/2017/02/a-detailed-introduction-to-webpack/). This gave me enough basic understanding to be a bit more familiar with how to use it with Vue. I still don't quite get everything, but I was able to build a new version of the app using SFCs and the Webpack template. 

To begin working with the Webpack template, you need the [Vue CLI](https://github.com/vuejs/vue-cli). The CLI is a scaffolding and build tool. You can install it via npm: `npm i -g vue-cli`. Then you can scaffold a new app via `vue init webpack appname`. This will run you through a series of questions (do you want to lint, do you want to test, etc), and at the end, you've got a new project making use of SFCs. 

The new project is a bit overwhelming at first. Maybe I just suck, but it was rather involved. You've got a built in web seerver, auto reload, and more, but in the end it felt much like working with Ionic. I'd edit a file and Webpack would handle all the work for me. 

So how did I build INeedIt in this template? The template has a main App component that simply creates a layout and includes a `router-view`. As I learned [earlier this month](https://www.raymondcamden.com/2017/11/12/working-with-routes-in-vue/), that's how the Vue router knows where to inject the right component based on the current URL. I removed that image since I didn't have anything that was always visible. 

<pre><code class="language-markup">&lt;template&gt;
  &lt;div id=&quot;app&quot;&gt;
    &lt;router-view&#x2F;&gt;
  &lt;&#x2F;div&gt;
&lt;&#x2F;template&gt;

&lt;script&gt;
export default {
  name: &#x27;app&#x27;
}
&lt;&#x2F;script&gt;

&lt;style&gt;
#app {
  font-family: &#x27;Avenir&#x27;, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
&lt;&#x2F;style&gt;
</code></pre>

I then began the process of creating a SFC for each of my three views. For the most part, this was literally just copying and pasting code into new files. Here is ServiceList.vue:

<pre><code class="language-markup">&lt;template&gt;
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
&lt;&#x2F;template&gt;

&lt;script&gt;
export default {
    name:&#x27;ServiceList&#x27;,
    data () {
        return {
            error:false,
            loading:true,
            lat:null,
            lng:null,
            serviceTypes:[
                {% raw %}{&quot;id&quot;:&quot;accounting&quot;,&quot;label&quot;:&quot;Accounting&quot;}{% endraw %},{% raw %}{&quot;id&quot;:&quot;airport&quot;,&quot;label&quot;:&quot;Airport&quot;}{% endraw %},{% raw %}{&quot;id&quot;:&quot;amusement_park&quot;,&quot;label&quot;:&quot;Amusement Park&quot;}{% endraw %},{% raw %}{&quot;id&quot;:&quot;aquarium&quot;,&quot;label&quot;:&quot;Aquarium&quot;}{% endraw %},
            ]
        }
    },
    mounted:function () {
        this.$nextTick(function () {
            if (this.lat === null) {
                console.log(&#x27;get geolocation&#x27;, this.lat);
                let that = this;
                navigator.geolocation.getCurrentPosition(function (res) {
                    console.log(res);
                    that.lng = res.coords.longitude;
                    that.lat = res.coords.latitude;
                    that.loading = false;
                }, function (err) {
                    console.error(err);
                    that.loading = false;
                    that.error = true;
                });
            }
        })
    }
}
&lt;&#x2F;script&gt;
</code></pre>

Note - as before I've removed 90% of the serviceTypes values to save space. Next I built TypeList.vue:

<pre><code class="language-markup">&lt;template&gt;
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
&lt;&#x2F;template&gt;

&lt;script&gt;
const SEARCH_API = &#x27;https:&#x2F;&#x2F;openwhisk.ng.bluemix.net&#x2F;api&#x2F;v1&#x2F;web&#x2F;rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space&#x2F;googleplaces&#x2F;search.json&#x27;;

&#x2F;&#x2F; used for search max distance
const RADIUS = 2000;

export default {
    name:&#x27;ServiceList&#x27;,
    data () {
        return {
			results:[],
			loading:true
        }
    },
	created:function () {
		fetch(SEARCH_API +
		&#x27;?lat=&#x27; + this.lat + &#x27;&amp;lng=&#x27; + this.lng + &#x27;&amp;type=&#x27; + this.type + &#x27;&amp;radius=&#x27; + RADIUS)
		.then(res =&gt; res.json())
		.then(res =&gt; {
			console.log(&#x27;res&#x27;, res);
			this.results = res.result;
			this.loading = false;
		});
	},
	props:[&#x27;name&#x27;,&#x27;type&#x27;,&#x27;lat&#x27;,&#x27;lng&#x27;]
}
&lt;&#x2F;script&gt;
</code></pre>

And finally, here is Detail.vue:

<pre><code class="language-markup">&lt;template&gt;
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
&lt;&#x2F;template&gt;

&lt;script&gt;
const DETAIL_API = &#x27;https:&#x2F;&#x2F;openwhisk.ng.bluemix.net&#x2F;api&#x2F;v1&#x2F;web&#x2F;rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space&#x2F;googleplaces&#x2F;detail.json&#x27;;

export default {
    name:&#x27;Detail&#x27;,
    data () {
        return {
			detail:[],
			loading:true
        }
    },
   	methods:{
		goBack:function () {
			this.$router.go(-1);
		}
	},
	created:function () {
		fetch(DETAIL_API +
		&#x27;?placeid=&#x27; + this.placeid)
		.then(res =&gt; res.json())
		.then(res =&gt; {
			console.log(&#x27;res&#x27;, res.result);
			&#x2F;*
			modify res.result to include a nice label for price
			*&#x2F;
			res.result.price = &#x27;&#x27;;
			if (res.price_level) {
				if (res.result.price_level === 0) res.result.price = &quot;Free&quot;;
				if (res.result.price_level === 1) res.result.price = &quot;Inexpensive&quot;;
				if (res.result.price_level === 2) res.result.price = &quot;Moderate&quot;;
				if (res.result.price_level === 3) res.result.price = &quot;Expensive&quot;;
				if (res.result.price_level === 4) res.result.price = &quot;Very expensive&quot;;
			}
			this.detail = res.result;

			&#x2F;&#x2F; add a google maps url
			this.detail.mapUrl = `https:&#x2F;&#x2F;maps.googleapis.com&#x2F;maps&#x2F;api&#x2F;staticmap?center=${% raw %}{this.detail.geometry.location.lat}{% endraw %},${% raw %}{this.detail.geometry.location.lng}{% endraw %}&amp;zoom=14&amp;markers=color:blue{% raw %}%7C${this.detail.geometry.location.lat}{% endraw %},${% raw %}{this.detail.geometry.location.lng}{% endraw %}&amp;size=310x310&amp;sensor=true&amp;key=AIzaSyBw5Mjzbn8oCwKEnwI2gtClM17VMCaNBUY`;
			this.loading = false;
		});
	},
	props:[&#x27;placeid&#x27;]
}
&lt;&#x2F;script&gt;
</code></pre>

Finally, I modified `router/index.js`, which as you can guess handles routing logic for the app.

<pre><code class="language-javascript">import Vue from &#x27;vue&#x27;
import Router from &#x27;vue-router&#x27;
import ServiceList from &#x27;@&#x2F;components&#x2F;ServiceList&#x27;
import TypeList from &#x27;@&#x2F;components&#x2F;TypeList&#x27;
import Detail from &#x27;@&#x2F;components&#x2F;Detail&#x27;

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: &#x27;&#x2F;&#x27;,
      name: &#x27;ServiceList&#x27;,
      component: ServiceList
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
})
</code></pre>

All I did here was import my components and set up the path.

And that was it! Ok, I lie. When I made my app I accepted the defaults for ESLint and it was *quite* anal retentive about what it wanted, which is to be expected, but I disabled a lot of the rules just so I could get my initial code working. In a real app I would have kept the rules. 

I got to say... I freaking like it. I still feel like it's a big step up from "just include vue in a script tag", but as I worked on the app it was a great experience. If you want to see the final code, you can find it here: https://github.com/cfjedimaster/webdemos/tree/master/ineedit3

Take a look at the `dist` folder specifically. This is normally .gitignore'd, but I modified the settings so it would be included in the repo. You'll see that Webpack does an awesome job converting my code into a slim, optimized set of files. You can actually run the demo here: https://cfjedimaster.github.io/webdemos/ineedit3/dist/index.html

Finally, take a look at Sarah Drasner's article on the Vue CLI: [Intro to Vue.js: Vue-cli and Lifecycle Hooks](https://css-tricks.com/intro-to-vue-3-vue-cli-lifecycle-hooks/) Her entire series on Vue is *definitely* worth reading.