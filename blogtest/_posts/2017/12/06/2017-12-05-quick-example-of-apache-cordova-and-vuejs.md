---
layout: post
title: "Quick Example of Apache Cordova and Vue.js"
date: "2017-12-06"
categories: [development,mobile]
tags: [javascript,vuejs,cordova]
banner_image: 
permalink: /2017/12/06/quick-example-of-apache-cordova-and-vuejs
---

Normally when building Cordova apps, I either use no JavaScript framework at all, or I use Angular with Ionic. But as you can tell by my recent posts, I've become infactuated with [Vue.js](https://vuejs.org/) lately. While the Ionic folks are working on making it easy to use Vue instead of Angular, I thought I'd demonstrate a quick example of how simple it is to use Vue with Cordova. I'm not going to worry about UI for this post, but rather show how to wait for the `deviceready` event in your Vue app.

As a reminder, the `deviceready` event is critical in Cordova applications. If you attempt to do anything "special" with the device via plugins before this event is fired, you'll get an error. Therefore most apps simply wait to do anything until that event has fired. 

I create a new Cordova project and then removed most of the code to start off a bit simpler. I modified the HTML to include a local copy of Vue (because my app could start offline) and then added a simple variable, status, to my display.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta http-equiv=&quot;Content-Security-Policy&quot; content=&quot;default-src &#x27;self&#x27; data: gap: https:&#x2F;&#x2F;ssl.gstatic.com &#x27;unsafe-eval&#x27;; style-src &#x27;self&#x27; &#x27;unsafe-inline&#x27;; media-src *; img-src &#x27;self&#x27; data: content:;&quot;&gt;
        &lt;meta name=&quot;format-detection&quot; content=&quot;telephone=no&quot;&gt;
        &lt;meta name=&quot;msapplication-tap-highlight&quot; content=&quot;no&quot;&gt;
        &lt;meta name=&quot;viewport&quot; content=&quot;user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width&quot;&gt;
        &lt;link rel=&quot;stylesheet&quot; type=&quot;text&#x2F;css&quot; href=&quot;css&#x2F;index.css&quot;&gt;
        &lt;title&gt;Vue App&lt;&#x2F;title&gt;
    &lt;&#x2F;head&gt;
    &lt;body&gt;
        &lt;div id=&quot;app&quot;&gt;
            App status: {% raw %}{{ status }}{% endraw %}
        &lt;&#x2F;div&gt;
        &lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;cordova.js&quot;&gt;&lt;&#x2F;script&gt;
        &lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;js&#x2F;vue.min.js&quot;&gt;&lt;&#x2F;script&gt;
        &lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;js&#x2F;index.js&quot;&gt;&lt;&#x2F;script&gt;
    &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

My plan here is to simply set status to true when `deviceready` has fired. Now let's look at the JavaScript.

<pre><code class="language-javascript">const app = new Vue({
    el:&#x27;#app&#x27;,
    data:{
        status:false
    },
    methods:{
        init:function() {
            this.status = true;
        }
    }
})

document.addEventListener(&#x27;deviceready&#x27;, app.init);
</code></pre>

I've got a Vue instnace on top where I default that `status` value to false. I added an `init` method that I then simply use as my listener for the `deviceready` event. I normally think of my Vue methods as being helpers for stuff inside my app, but you can also call them from outside the app by using the instance. In this case it's a great way to "turn on" the app and do stuff after my `deviceready` event has fired.

Here's an overly large example of this running in the Android emulator:

![Android emulator](https://static.raymondcamden.com/images/2017/12/vc1.jpg)

Trivial, right? So for a more 'real' example, I added the [Dialogs](http://cordova.apache.org/docs/en/latest/reference/cordova-plugin-dialogs/index.html) plugin and then modified my code a bit. First I added a button to the view:

<pre><code class="language-markup">&lt;div id=&quot;app&quot;&gt;
	&lt;button @click=&quot;showDialog&quot; :disabled=&quot;!ready&quot;&gt;Show Dialog&lt;&#x2F;button&gt;
&lt;&#x2F;div&gt;
</code></pre>

Note I've got two Vue related things going on. First, the button is disabled while a value, `ready`, is false. Secondly, I added a `click` handler to run a method called `showDialog`. Let's look at the JavaScript now.

<pre><code class="language-javascript">const app = new Vue({
    el:&#x27;#app&#x27;,
    data:{
        ready:false
    },
    methods:{
        init:function() {
            this.ready = true;
        },
        showDialog:function() {
            navigator.notification.alert(
                &#x27;Vue and Cordova is like peanut butter and chocolate!&#x27;,null,&#x27;Vue+Cordova&#x27;,&#x27;Done&#x27;
            );
        }
    }
})

document.addEventListener(&#x27;deviceready&#x27;, app.init);
</code></pre>

This is virtually the same as before. I've renamed the variable I use to track the 'ready' status and I added `showDialog`. This just uses the `alert` method from the Dialogs pugin.

![Android emulator](https://static.raymondcamden.com/images/2017/12/vc2.jpg)

All in all - nothing special I guess, but simple is good. One big thing to keep in mind is that - normally - you always want to use a Single Page Application (SPA) for your Cordova apps. If your app has any kind of navigation, or view changes, you'll want to use the Vue Router. I wrote up an example of that [here](https://www.raymondcamden.com/2017/11/12/working-with-routes-in-vue/) that you might find useful. If you're using Vue with Cordova, please let me know in a comment below. Also, if you want an early look at Vue and Ionic, check out [this video](https://www.youtube.com/watch?v=yoIoV2fnC6M) by Paul Halliday.