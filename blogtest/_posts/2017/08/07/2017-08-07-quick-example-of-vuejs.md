---
layout: post
title: "Quick Example of Vue.js"
date: "2017-08-07T07:36:00-07:00"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2017/08/07/quick-example-of-vuejs
---

Last week I was attending a conference and sat in a good session on [Vue.js](https://vuejs.org/). I've seen Vue before, even attended another session, but I think I must have paid better attention to this one as I was really impressed with what I saw. In general, my go to JavaScript framework for building applications is Angular, and I really like it. (Despite the painful transition to Angular 2, no wait Angular 3, no wait 4, oh yeah it's just Angular now.) However, if I'm not building an "app" and just using a bit of JavaScript to embellish a page, it feels like overkill. 

I'm sure folks can (and do) use Angular in more limited ways, but for me, if I'm not building an entire application with it then it just doesn't feel like a proper fit. This is where Vue really seems to shine though. With Vue, I can do my "non-app" stuff in a much smaller way. You can build complete applications with Vue, but out of the box, it's very light weight. I can see Vue being much more appropriate for the typical thing I do with JavaScript - simple applications that have to work with the DOM and perform updates based on some form of logic.

Don't take my word for it of course - I suggest going through the [guide](https://vuejs.org/v2/guide/) and play with the code there. I'm not trying to write a "How To" guide here since one already exists. What I do want to share though is a quick sample I wrote at the airport this weekend. You should absolutely not take this as a "Best Practice" example. Rather, I just wanted to write a simple application and then rewrite it in Vue. 

Ok, so here is the initial, non-Vue code.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;title&gt;&lt;&#x2F;title&gt;
        &lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
        &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
    &lt;&#x2F;head&gt;
    &lt;body&gt;

        &lt;p&gt;
        &lt;input type=&quot;search&quot; placeholder=&quot;Search for name...&quot; id=&quot;search&quot;&gt;
        &lt;&#x2F;p&gt;
    
        &lt;div id=&quot;results&quot;&gt;&lt;&#x2F;div&gt;

        &lt;script&gt;
        let API = &#x27;https:&#x2F;&#x2F;openwhisk.ng.bluemix.net&#x2F;api&#x2F;v1&#x2F;web&#x2F;rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space&#x2F;default&#x2F;nameSearch.json?search=&#x27;;
        let $search, $results;

        document.addEventListener(&#x27;DOMContentLoaded&#x27;, init, false);

        function init() {
            $search = document.querySelector(&#x27;#search&#x27;);
            $results = document.querySelector(&#x27;#results&#x27;);

            $search.addEventListener(&#x27;input&#x27;, doSearch, false);
        }

        function doSearch(e) {
            let term = $search.value;
            if(term.length &lt; 3) return;
            fetch(API + encodeURIComponent(term))
            .then(res =&gt; res.json())
            .then(res =&gt; {
                let s = &#x27;&lt;ul&gt;&#x27;;
                res.names.forEach((name) =&gt; {
                    s += `&lt;li&gt;${% raw %}{name}{% endraw %}&lt;&#x2F;li&gt;`;
                });
                s += &#x27;&lt;&#x2F;ul&gt;&#x27;;
                $results.innerHTML = s;
            });
        }
        &lt;&#x2F;script&gt;
    &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

The code here is adding an event listener to an input field. On entering text, it performs a search against an OpenWhisk serverless API that simply returns names that match the input. When the result is returned, I then update the DOM with the result.

You can run this sample live right here: https://static.raymondcamden.com/demos/2017/8/7/search1.html

Note that I'm using the Fetch API which is not supported in older browsers. Anything modern though will run it just fine. 

Ok, now let's look at the Vue version (and once again, I'm not saying this is the best, or even the "right" implementation):

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;style&gt;
		[v-cloak] {
			display: none;
		}
		&lt;&#x2F;style&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;div id=&quot;myApp&quot; v-cloak&gt;
			&lt;p&gt;
			&lt;input type=&quot;search&quot; 
			placeholder=&quot;Search for name...&quot;
			v-model=&quot;search&quot; 
			v-on:input=&quot;searchNames&quot;&gt;
			&lt;&#x2F;p&gt;
		
			&lt;ul&gt;
				&lt;li v-for=&quot;name in names&quot;&gt;{% raw %}{{ name }}{% endraw %}&lt;&#x2F;li&gt;
			&lt;&#x2F;ul&gt;
	    &lt;&#x2F;div&gt;
			
		&lt;script src=&quot;https:&#x2F;&#x2F;unpkg.com&#x2F;vue&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script&gt;
		let API = &#x27;https:&#x2F;&#x2F;openwhisk.ng.bluemix.net&#x2F;api&#x2F;v1&#x2F;web&#x2F;rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space&#x2F;default&#x2F;nameSearch.json?search=&#x27;;

		let myApp = new Vue({
			el:&#x27;#myApp&#x27;,
			data:{
				search:&#x27;&#x27;,
				names:[]
			},
			methods:{
				searchNames:function() {
					if(this.search.length &lt; 3) return;
					fetch(API + encodeURIComponent(this.search))
					.then(res =&gt; res.json())
					.then(res =&gt; {
						console.log(res);
						this.names = res.names;
					});
					
				}
			}
		});
		&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

Ok, let's look at the changes. First off, I've created a new Vue app to handle my logic. I love how... I don't know... "compact" this is. I've basically set up the logic for my "as you type/search/render" thing and it's nicely contained on my site. (Of course, normally I'd have this in it's own JS file.) 

Next - look at how I assign the event listener to my search field. Using event handlers in HTML is something we moved away from years ago, but the way it is done here feels very nice. I like being able to see my control and note, "Oh there is an event happening when 'input' is fired." Also note the use of `v-model` to handle a sync between the value of the field and data in my code. 

Now - look at `searchNames`. Outside of how I address stuff, this is pretty similar, but, I love that when I'm done, I simply update my local array, and then the rendering takes over. 

I love client-side templating (so much so that I wrote a [book](https://www.amazon.com/gp/product/1491935111/ref=as_li_tl?ie=UTF8&tag=raymondcamd06-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=1491935111&linkId=239944c4f3cbf1e35ce47f4eb857b2a7) on it) and having it built-in here works really well. 

Finally - the last issue I had to clear up with the "FOUC" (flash of unstyled content) on load, which is done using a `v-clock` CSS declaration.

All in all, I think this is roughly the same amount of code, but it felt a heck of a lot easier to use and I especially liked being able to skip all the querySelector and DOM-writing tasks.

Yeah, I keep saying it "feels" good, which isn't very scientific, but if a framework is enjoyable to write, I'm probably going to use the hell out of it. On the flip side, I just don't feel that way about React, and I know React is an incredibly powerful framework, and the hottest thing on the planet now, but I just don't enjoy using it. 

Anyway, you can test the Vue version here: https://static.raymondcamden.com/demos/2017/8/7/search2.html

In both cases, try searching for "abe" to see some results. I plan on spending more time learning Vue and blogging on it, and maybe even giving a presentation on it too later this year. I'd love to hear my readers who are using Vue and what they think about it. I'd also love to hear from folks who looked at it and *didn't* like it. Let me know in the comments below!