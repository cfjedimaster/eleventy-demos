---
layout: post
title: "Working with Routes in Vue.js"
date: "2017-11-12T11:57:00-07:00"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2017/11/12/working-with-routes-in-vue
---

<strong>Warning - as I've made clear, I'm in the process of learning [Vue.js](https://vuejs.org). I want to share as I learn, but obviously, I'm still very new to it and you should not consider my code 'best practice', or heck, even 'experienced practice'. I full expect there are better ways of doing what I describe below, but I hope that sharing my learning process is helpful for others as well.</strong>

Out of the box, Vue does a few things, and does them darn well. If you want more, you have to add additional functionality, one of those things is route management. I'm not even sure that's the best term for the feature, but basically it covers the ability to map a URL (route, like /cats or /cats/10) to a particular view of your site. 

The official router for Vue.js is [vue-router](https://github.com/vuejs/vue-router). It supports what I described above as well as more complex routing, for example, nested routes like /user/5/posts. The [documentation](http://vuejs.github.io/vue-router) goes into detail and I suggest reading it of course, but I thought I'd share a couple of examples. For my first example, I'm using one from the docs with a few modifications. Let's start with the markup.

<pre><code class="language-markup">&lt;div id=&quot;app&quot;&gt;
  &lt;h1&gt;Hello App!&lt;/h1&gt;
  &lt;p&gt;
    &lt;router-link to=&quot;/foo&quot;&gt;Go to Foo&lt;/router-link&gt;
    &lt;router-link to=&quot;/bar&quot;&gt;Go to Bar&lt;/router-link&gt;
  &lt;/p&gt;
  &lt;router-view&gt;&lt;/router-view&gt;
&lt;/div&gt;
</code></pre>

Two things here to note. First, the `router-view` tag is simply a placeholder for where your content is loaded based on the current path. You could imagine that being the majority of your app's view with the rest being the header and footer for navigation. Speaking of navigation, you can see an example of that in the `router-link` tag. This maps to an anchor tag by default. The `to` attribute simply uses the path to link to, but you can also use more complex versions passing custom data to the next view.

One more quick note - I'm not including the rest of the HTML here, but note that the router takes a new JavaScript file as well. So the bottom of my HTML template includes this:

<pre><code class="language-markup">&lt;script src="https://unpkg.com/vue"&gt;&lt;/script&gt;
&lt;script src="https://unpkg.com/vue-router/dist/vue-router.js"&gt;&lt;/script&gt;
</code></pre>

Here's the JavaScript.

<pre><code class="language-javascript">const Foo = { 
  template: `
&lt;div&gt;
&lt;h2&gt;Foo&lt;/h2&gt;
&lt;p&gt;
This is the template for foo.
&lt;/p&gt;
&lt;/div&gt;
` 
};

const Bar = {% raw %}{ template: '&lt;div&gt;bar&lt;/div&gt;' }{% endraw %};

const routes = [
  {% raw %}{ path: '/foo', component: Foo }{% endraw %},
  {% raw %}{ path: '/bar', component: Bar }{% endraw %}
]

const router = new VueRouter({
  routes // short for `routes: routes`
});

const app = new Vue({
  el:'#app',
  router
});
</code></pre>

There's a few interesting things going on here. First note the definition of two components on top. This confused me. I've just started looking at [components](https://vuejs.org/v2/guide/components.html) in Vue, and apparently you can "fake them" with simple JavaScript objects instead of using `Vue.component`. I guess it's one of those "duck typing" things. Anyway, two components are defined and then set in a new array of objects called `routes`. Note the mapping of a URL path to a component. This is then used to define a VueRouter which is then passed to a new Vue object.

And that's it. Now when `/foo` is loaded, the Foo component will render in `router-view`, and ditto for `/bar`. While it isn't terribly exciting, you can see the full code and demo via the CodePen below:

<p data-height="265" data-theme-id="0" data-slug-hash="yPbqYw" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="example of routing in vue" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/yPbqYw/">example of routing in vue</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

One thing you won't see though is the URL changing. It does do that so if you bookmark the Bar view, it loads fine.

So.... yeah. That's all rather simple. Like - I keep thinking more should be involved, and as I said above, the router does have multiple more complex options, but I absolutely love how simple it is to do basic routing. 

I decided to try my hand at a more complex example, the typical list/detail view. I made a simple demo using the [Star Wars API](https://swapi.co/). The initial view loads a list of movies that you can then click into for a detail. Here it is in action, and then I'll share the code.

<p data-height="265" data-theme-id="0" data-slug-hash="Kyqwgd" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Kyqwgd" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/Kyqwgd/">Kyqwgd</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Here's the initial HTML:

<pre><code class="language-markup">&lt;div id=&quot;app&quot;&gt;
&lt;h1&gt;Star Wars Films&lt;/h1&gt;
&lt;router-view&gt;&lt;/router-view&gt;
&lt;/div&gt;
</code></pre>

As you can see, I've basically just got a header and the `router-view` tag is doing the rendering. Now the JavaScript.

<pre><code class="language-javascript">const List = Vue.component('List', {
template:`
&lt;div&gt;
	&lt;ul&gt;
		&lt;li v-for=&quot;film in films&quot; :key=&quot;film.episode_id&quot;&gt;
		&lt;router-link :to=&quot;{% raw %}{ name:'film', params:{id:film.id}{% endraw %} }&quot;&gt;{% raw %}{{ film.title }}{% endraw %}&lt;/router-link&gt;
		&lt;/li&gt;
	&lt;/ul&gt;
&lt;/div&gt;
	`,
	data:function() {
		return {
			films:[]
		}
	},
	created:function() {
		fetch('https://swapi.co/api/films')
		.then(res =&gt; res.json())
		.then(res =&gt; {
			/*
			there is no &quot;id&quot; field, just a URL one - so let's set it manually
			*/			
			this.films = res.results.map(film =&gt; {
				let parts = film.url.split('/');
				film.id = parts[parts.length-2];
				return film;
			});
		});
	}
});

const Detail = Vue.component('Detail', {
	template:`
&lt;div&gt;
&lt;h2&gt;{% raw %}{{film.title}}{% endraw %}&lt;/h2&gt;
&lt;p v-if=&quot;film.director&quot;&gt;
Director: {% raw %}{{film.director}}{% endraw %}&lt;br/&gt;
Released: {% raw %}{{film.release_date}}{% endraw %}&lt;br/&gt;
&lt;/p&gt;

&lt;p&gt;
{% raw %}{{film.opening_crawl}}{% endraw %}
&lt;/p&gt;

&lt;router-link to=&quot;/&quot;&gt;Back&lt;/router-link&gt;
&lt;/div&gt;
	`,
	data:function() {
		return {
			film:{}
		}
	},
	created:function() {
		fetch('https://swapi.co/api/films/'+this.$route.params.id)
		.then(res =&gt; res.json())
		.then(res =&gt; {
			console.log(res);
			this.film = res;
		});

	}

});

const router = new VueRouter({
	routes:[
		{
			path:'/',
			component:List,
		},
		{
			path:'/film/:id',
			name:'film',
			component:Detail
		}
	]
});

const app = new Vue({
	el:'#app',
	router
});
</code></pre>

Alright - so this one actually makes use of `Vue.component`. The first component, List, generates a simple `ul` list with data provided by the API. Note that I do a bit of manipulation on the results so I can get the ID in my display.  

Note how the link is made: 

	<router-link :to="{% raw %}{ name:'film', params:{id:film.id}{% endraw %} }">

Instead of just a path, I'm using an object that contains both a path name (film) and a set of parameters - in this case just the ID I made. (Technically I didn't need to do this - I could have passed the complete url value from the list to the detail, but... I don't know. I just felt like doing it. ;)

The next component, `Detail`, handles displaying the film. Note that I can use the passed in ID like so: `this.$route.params.id`. Again - simple. (Once again, technically, I don't need to do this. The Star Wars API returns all information for a film when you request all films. I already had all the data I needed. But I wanted to see how it would work if the initial "list" API had returned a slimmer set of data.)

Random Final Thoughts
===

Ok - so I just want to wrap up with a few random thoughts. As I said, I really like how simple this is. It's just pleasant. 

I dislike building my components in JavaScript. Template strings make it nicer of course, but I'd rather use something like Vue's [Single File Component](https://vuejs.org/v2/guide/single-file-components.html) feature. I love how they look - but I'm also trying to hold off on going into a build system. I've got nothing against using one of course, and that's why I took a look at Webpack recently (see my [suggestion](https://www.raymondcamden.com/2017/11/07/a-great-tutorial-for-webpack/) for a great way to learn it), but I feel like once I start using the CLI, Webpack, etc, I'm going to lose some of the "joy" of how simple Vue is. I'll get over it, but as I said, I'm putting it off.

Anyway, I hope this is helpful for people still considering if they want to learn Vue. I know it makes me happy and just more convinced that Vue is going to be my framework of choice in 2018.