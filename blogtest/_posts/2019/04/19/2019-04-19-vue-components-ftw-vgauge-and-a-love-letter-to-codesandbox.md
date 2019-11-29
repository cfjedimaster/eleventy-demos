---
layout: post
title: "Vue Components FTW - VGauge (and a love letter to CodeSandbox)"
date: "2019-04-19"
categories: ["javascript"]
tags: ["vuejs","vue components ftw"]
banner_image: /images/banners/gauge.jpg
permalink: /2019/04/19/vue-components-ftw-vgauge-and-a-love-letter-to-codesandbox
description: A quick look at a neat gauge component for Vue and my new love of CodeSandbox
---

When I [began this series](https://www.raymondcamden.com/2019/02/06/vue-components-ftw-toasted) I had a few things in mind - highlighting Vue components that were cool and easy to use. As part of my arbitrary guideline for "simple" I only wanted to use components that included support for script tag installation. In other words, you didn't have to use a full Vue application but could simply add a script tag to your page. This made it especially easy to use with CodePen which I've been a huge fan of lately. It's not that I'm opposed to components that don't support this or think it's a terrible thing to not support script tag usage, I just want to show my appreciation for a component supporting both use cases.

Today I'm making an exception. While browsing the [Awesome Vue](https://github.com/vuejs/awesome-vue) list to pick my next component to review, I discovered [VGauge](https://github.com/amroessam/vgauge), a super simple component that required npm installation. On a whim, and after [Jen Looper](https://www.jenlooper.com/) recommended it, I took a look at [CodeSandbox](https://codesandbox.io/). 

<img src="https://static.raymondcamden.com/images/2019/04/gauge1.png" class="imgborder imgcenter">

CodeSandbox is (yet another) online editor, but right away I was blown away by how performant it was. It supports templates for numerous different types of projects including numerous different frontend and backend frameworks. I was able to get a full Vue application up and running in less than a second. The online editor works well and the automatic preview is snappy as hell. You can even pop it out into a new tab and it will automatically update as you work. 

<img src="https://static.raymondcamden.com/images/2019/04/gauge2.png" class="imgborder imgcenter">

It's got great npm support, great GitHub integration, and just a shit ton of really freaking good features. I'm planning on using it extensively from now on to give it a good shakedown and I absolutely recommend folks take a look at it as well.

Alright, so with that out of the way, as I said the component I picked today was [VGauge](https://github.com/amroessam/vgauge). This is a Vue wrapped for [gauge.js](http://bernii.github.io/gauge.js/). If you don't know what a gauge is, here's a simple example:

<img src="https://static.raymondcamden.com/images/2019/04/gauge3.png" class="imgborder imgcenter">

The component includes numerous style changes and also has a nice animation style when changing values. That makes it especially useful for a value that may update over time. 

As I said above, this particular component requires npm installation which means you'll be using it for a Vue application only, not a simple script. At your terminal you can simply do `npm i vgauge --save`. In CodeSandbox, this is done via the `Add Dependency` button:

<img src="https://static.raymondcamden.com/images/2019/04/gauge4.png" class="imgborder imgcenter">

It doesn't come across in a screenshot, but when I typed "vgauge" to search the responses were *incredibly* quick. I don't know what the developers did behind the scenes but this is easily one of the snappiest web applications I've ever seen.

Once installed, usage is really simple. Here's an example modified from the project's readme:

```html
<template>
<v-gauge :value="value"/>
</template>

<script>
import VGauge from 'vgauge'

export default {
  components: {
    VGauge
  },
  data() {
    return {
      value: 42
    }
  }
}
</script>
```

As I said, you've got multiple options for the look and feel of the gauge, as well the ability to set what the min and max values are so the needle is properly positioned. I create a quick demo that I thought showed off the animation really well. Here's the code.

```html
<template>
  <div>
    <v-gauge :value="score"/>
  </div>
</template>

<script>
import VGauge from "vgauge";

export default {
  components: {
    VGauge
  },
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      score: 40
    };
  },
  created() {
    setInterval(() => {
      this.score += getRandomInt(-10, 10);
      if (this.score < 0) this.score = 0;
      else if (this.score > 100) this.score = 100;
    }, 2000);
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
</script>
```

I begin with an initial value of 40. I then use a two second interval to move the gauge up or down from one to ten points. Want to see it in action? CodeSandbox has one click deployment to Zeit's Now service and Netlify as well (although support is in beta). I'm testing Netlify deployment while I write this blog post. This is a screen shot of it in progress:

<img src="https://static.raymondcamden.com/images/2019/04/gauge5.png" class="imgborder imgcenter">

The entire process took about 2 minutes and you can see the result here: <https://csb-042l64jx5l.netlify.com/>

And for completeness sake, here's an example of how CodeSandbox does embeds: 

<iframe src="https://codesandbox.io/embed/042l64jx5l?fontsize=14" title="VGuage" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

You can also share a QR code which would be freaking cool at a conference I think. Anyway, as always, let me know what you think by leaving a comment below.

<i>Header photo by <a href="https://unsplash.com/photos/I1C6CrPNyo8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Wassim Chouak</a> on Unsplash</i>