---
layout: post
title: "Last Update, Honest, to My Vue.js INeedIt Demo"
date: "2017-11-28"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2017/11/28/last-update-honest-to-my-vuejs-ineedit-demo
---

Ok, I know I said my [last post](https://www.raymondcamden.com/2017/11/24/yet-another-update-to-my-ineedit-vuejs-app/) on my Vue.js INeedIt app was the last post, but I had an idea for just *one more* tweak and couldn't resist taking a stab at it. It didn't quite work out the way I wanted it too, but it was an interesting iteration to the app and I think now I can put it down and move on to the next thing I want to build. For this final version of the app, I decided to apply a bit of UI to make it look a bit nicer. I thought Bootstrap would be great for this, and I was excited to discover that there was actually a [Bootstrap + Vue](https://bootstrap-vue.js.org/) project that made this easy (somewhat).

![Bootstrap + Vue = Love](https://static.raymondcamden.com/images/2017/11/bv.png)

Bootstrap-Vue lets you use Bootstrap in your project via components. I really like Bootstrap, but I can never remember the class names and such to use certain features. But the component version is *much* easier to use I think and it just feels a lot more natural.

As an example, check out how tabs look:

<p data-height="400" data-theme-id="0" data-slug-hash="GOYMOV" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="bootstrap-vue tabs" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/GOYMOV/">bootstrap-vue tabs</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

I really, really like that format. Actually using the library requires a few steps. This is covered in the [Getting Started](https://bootstrap-vue.js.org/docs) guide. Since I had a Webpack app, I followed the instructions there. I don't know about you, but it still weirds me out to "install" a client-side library via npm. Even more weird was when I used import statements to load the CSS. It worked, but it just felt... odd. This is how my main.js looks now:

<pre><code class="language-javascript">// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {% raw %}{ App }{% endraw %}
})
</code></pre>

The new lines are right on top. I import Bootstrap-vue and then the CSS. And literally that was it. So for example, here is the new initial page that lists the types of services available:

![Screenshot](https://static.raymondcamden.com/images/2017/11/bv2a.png)

Here is the template portion of the component:

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
            &lt;b-list-group&gt;
                &lt;b-list-group-item v-for=&quot;service in serviceTypes&quot; :key=&quot;service.id&quot;&gt;
                    &lt;router-link :to=&quot;{% raw %}{name:&#x27;typeList&#x27;, params:{type:service.id, name:service.label, lat:lat, lng:lng}{% endraw %} }&quot;&gt;{% raw %}{{service.label}}{% endraw %}&lt;&#x2F;router-link&gt;
                &lt;&#x2F;b-list-group-item&gt;
            &lt;&#x2F;b-list-group&gt;
        &lt;&#x2F;div&gt;

    &lt;&#x2F;div&gt;
&lt;&#x2F;template&gt;
</code></pre>

It isn't that much different - mainly just the new `b-list-group` and `b-list-group-item` tags.

The service listing page makes use of the same component with the addition of a button to return back. Note the "blue link" border around it. I'm not sure why that's there (and it won't be in the next view), but as I was tired of fighting other issues (more on that later) I just didn't bother correcting it.

![Screenshot](https://static.raymondcamden.com/images/2017/11/bv3.png)

Here's that template:

<pre><code class="language-markup">&lt;template&gt;
    &lt;div&gt;

        &lt;h1&gt;{% raw %}{{name}}{% endraw %}&lt;&#x2F;h1&gt;

        &lt;div v-if=&quot;loading&quot;&gt;
        Looking up data...
        &lt;&#x2F;div&gt;

        &lt;div v-if=&quot;!loading&quot;&gt;
            &lt;b-list-group&gt;
                &lt;b-list-group-item v-for=&quot;result in results&quot; :key=&quot;result.id&quot;&gt;
                &lt;router-link :to=&quot;{% raw %}{name:&#x27;detail&#x27;, params:{placeid:result.place_id}{% endraw %} }&quot;&gt;{% raw %}{{result.name}}{% endraw %}&lt;&#x2F;router-link&gt;
                &lt;&#x2F;b-list-group-item&gt;
            &lt;&#x2F;b-list-group&gt;

            &lt;p v-if=&quot;results.length === 0&quot;&gt;
            Sorry, no results.
            &lt;&#x2F;p&gt;

            &lt;p&gt;
            &lt;b-button block variant=&quot;primary&quot; to=&quot;&#x2F;&quot; style=&quot;margin-top:10px&quot;&gt;Go Back&lt;&#x2F;b-button&gt;
            &lt;&#x2F;p&gt;
        &lt;&#x2F;div&gt;

    &lt;&#x2F;div&gt;
&lt;&#x2F;template&gt;
</code></pre>

Finally - I decided on a "card" interface for the result page. This is where I ran into the most trouble. First, I ran into issues with Google's API for Google Places. I set up a new key to use their Photo API and the Static Maps API. This key was restricted to localhost and my GitHub repo. Unfortunately, it never worked consistently. Sometimes both were blocked with 403 errors and sometimes just the place pictures were. I reported it to a friend at Google, but because of this, I can't share a public version of the app. I then ran into sizing issues using the card component. I switched to the carousel and had sizing issues there. I took my best stab at it and it's ok, but still not right. But I think it's pretty cool.

Anyway - here is an example:

![Screenshot](https://static.raymondcamden.com/images/2017/11/bv4.jpg )

Scrolling down, the pictures are in a carousel you can browse.

![Screenshot](https://static.raymondcamden.com/images/2017/11/bv4.2.jpg )

Here's the display code:

<pre><code class="language-markup">&lt;template&gt;
    &lt;div&gt;
        &lt;div v-if=&quot;loading&quot;&gt;
        Looking up data...
        &lt;&#x2F;div&gt;

        &lt;div v-if=&quot;!loading&quot;&gt;

            &lt;b-card :title=&quot;detail.name&quot; :sub-title=&quot;detail.formatted_address&quot;&gt;

                &lt;p class=&quot;card-text&quot;&gt;
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

                &lt;b-carousel id=&quot;carousel1&quot;
                controls
                indicators
                :interval=&quot;0&quot;
                &gt;
                      &lt;b-carousel-slide 
                        v-for=&quot;img in detail.photos&quot; :key=&quot;img.url&quot; style=&quot;height:300px&quot;&gt;
                            &lt;img slot=&quot;img&quot; :src=&quot;img.url&quot; class=&quot;d-block img-fluid w-100&quot; style=&quot;overflow:hidden&quot;&gt;
                      &lt;&#x2F;b-carousel-slide&gt;
                &lt;&#x2F;b-carousel&gt;
            &lt;&#x2F;b-card&gt;

            &lt;b-button block variant=&quot;primary&quot; @click.prevent=&quot;goBack&quot; style=&quot;margin-top:10px&quot;&gt;Go Back&lt;&#x2F;b-button&gt;
        &lt;&#x2F;div&gt;
    &lt;&#x2F;div&gt;
&lt;&#x2F;template&gt;
</code></pre>

Pretty cool - even with the issues I ran into. You can browse the entire code base here: https://github.com/cfjedimaster/webdemos/tree/master/ineedit4

I hope this progresive look at one app has been helpful to others. Now I'm ready to leave this demo behind and get to work om my next one!