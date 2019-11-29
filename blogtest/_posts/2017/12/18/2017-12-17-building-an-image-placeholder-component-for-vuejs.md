---
layout: post
title: "Building an Image Placeholder Component for Vue.js"
date: "2017-12-18"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2017/12/18/building-an-image-placeholder-component-for-vuejs
---

One of the more interesting parts of [Vue.js](https://vuejs.org/) is the ability to build components. Components are a pretty big feature of Vue and I won't try to explain them completely here (the [docs](https://vuejs.org/v2/guide/components.html) do a darn good job, and you should read Sarah Drasner's [article](https://css-tricks.com/intro-to-vue-2-components-props-slots/) on them as well), but at a basic level, they allow you to build a self-contained piece of UI/logic within a larger Vue application. So for example, you may be building an administrator for a product database and find yourself displaying product thumbnails in multiple places. You could componetize that product display into a Vue component to make it easier to reuse the code multiple times.

This is also how (from what I can tell!) most Vue libraries work. They ship as a component you can then simply drop into your code. When I added Bootstrap to my Vue demo (["Last Update, Honest, to My Vue.js INeedIt Demo"](https://www.raymondcamden.com/2017/11/28/last-update-honest-to-my-vuejs-ineedit-demo/)), this is what allowed me to write code like this:

``` html
<div id="app">
  
  <b-tabs>

    <b-tab title="first" active>
      <br>I'm the first tab
    </b-tab>

    <b-tab title="second">
       <br>I'm the second tab
    </b-tab>

    <b-tab title="Infinity War">
      <br>Trailer tomorrow!
    </b-tab>
    
  </b-tabs>
                      
</div>
```

In the snippet above, the `b-tabs` and `b-tab` tags are Vue components. All the logic behind rendering them was handled by the component. So yeah, a cool freaking feature, right? I wanted to build my own little demo of this feature and thought it would be cool to build a component to spit out placeholder images. Now - there's a bazillion of them are so, but the most stable, and serious (and as you know, I'm a serious blogger, remember, I work for IBM) is [Placeholder.com](https://placeholder.com/). Their service lets you create placeholders of any size while providing options for color and text. As an example, this HTML:

``` html
<img src="http://via.placeholder.com/350x150">
```

Produces:

<img src="http://via.placeholder.com/350x150">

This adds text and a custom bgcolor:

``` html
<img src="http://via.placeholder.com/400x100/ee0000?text=Vue+Rocks!!">
```

and here is the result:

<img src="http://via.placeholder.com/400x100/ee0000?text=Vue+Rocks!!">

Not too difficult, right? But I thought - what if I could create a simple Vue component for this. Here's what I came up with.

``` js
Vue.component('placeholder', {
  template:'<img alt="placeholder" :src="url">',
  data() {
    return {
    }
  },
  computed:{
    url:function() {
      let theUrl = 'http://via.placeholder.com/'+this.width+'x'+this.height;
      //technically this ALWAYS runs as we have a default
      if(this.bgcolor) theUrl += '/'+this.bgcolor;
      if(this.textcolor) theUrl += '/'+this.textcolor;
      if(this.text) theUrl += '?text='+encodeURIComponent(this.text);
      return theUrl;
    }
  },
  props:{
    height:{
      default:400,
    },
    width:{
      default:400
    },
    text:{
      type:String,
      required:false
    },
    bgcolor:{
      type:String,
      default:'cccccc',
      required:false
    },
    textcolor:{
      type:String,
      required:false
    }
  }
});
```

Alright, so from the top, the very first argument simply specifies the name of the component. In this case it means I'll be able to do `&lt;placeholder&gt;` in my code. I've got an empty data function there I should probably remove as I didn't end up needing it. Skip down to the props section and you can see the various properties I've defined. This matches (for the most part) exactly with what the service provides. The meat of the component is comprised in the `template` and `computed` areas. The `template` is simple - just an image. But note that the URL value is somewhat complex. Hence the use of `computed` to deal with it. For the most part this began as just "if you use this property, append the value", but I ran into an issue with the text color value. You can't specify text color without specifying a background as well. So my code "fixes" this by simply defaulting the background to what Placeholder.com uses. And that's it. Here's an example usage:

``` html
<placeholder width="200" height="200" text="My name is Ray"></placeholder>
```

And another:

``` html
<placeholder width="200" height="200" bgcolor="00ff00"></placeholder>
```

You can see a demo of this via the embed below:

<p data-height="400" data-theme-id="0" data-slug-hash="mpJWaw" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="vue placeholder component" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/mpJWaw/">vue placeholder component</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Of course, once you've done that, you can easily replace the boring (yet really good, honest!) placeholders with something more fun, like [placebeer](http://placebeer.com/). Placebeer isn't nearly as full featured as Placeholder.com, so the component is quite a bit simpler:

``` js
Vue.component('placeholder', {
  template:'<img alt="" :src="url">',
  data() {
    return {
    }
  },
  computed:{
    url:function() {
      let theUrl = 'http://placebeer.com/'+this.width+'/'+this.height;
      return theUrl;
    }
  },
  props:{
    height:{
      default:400,
    },
    width:{
      default:400
    }
  }
});
```

But the result is awesome:

<p data-height="500" data-theme-id="dark" data-slug-hash="wpaJRm" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="vue placeholder component 2" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/wpaJRm/">vue placeholder component 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Anyway, obviously there are more powerful ways to build Vue components, and better examples, but I hope this is interesting. As I've been blogging about, and learning Vue, I'm hoping my readers will come to me with suggestions and questions about what they would like to see. Just drop me a comment below!