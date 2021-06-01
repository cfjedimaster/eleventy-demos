---
layout: post
title: "Vue Components FTW - vue-country-flag"
date: "2019-06-21"
categories: ["javascript"]
tags: ["vuejs","vue components ftw"]
banner_image: /images/banners/flags.jpg
permalink: /2019/06/21/vue-components-ftw-vue-country-flag
description: A look at a Vue component that simply renders a country flag
---

Sorry folks - it's been too long since I did one of these "Vue Component" reviews. What can I say, life happens! That being said, I hope these entries are interesting to folks. You can browse the older ones on the [tag](https://www.raymondcamden.com/tags/vue+components+ftw/) page and send me suggestions for ones you would like me to review. Today's example is so simple I almost passed on reviewing it, but I ran into an interesting issue that made me think it was worth my (and your) time.

First off, the component in question in today's entry is [vue-country-flag](https://github.com/P3trur0/vue-country-flag). 

<img src="https://raw.githubusercontent.com/P3trur0/vue-country-flag/master/assets/logo.png" alt="Official component logo" class="imgcenter">

As you can imagine, this component will render the flag for a country. Like so:

```html
<vue-country-flag country="cn" />
```

And that's it. Oh, it does support sizes too, from `small` to `normal` to `big`. But yeah, pretty simple. However, while working on a demo in Code Sandbox I ran into an interesting issue. While the component loaded fine and no errors were reported in the console, the flag icon simply didn't render. 

On a whim, I exported the project. Code Sandbox makes this easy and sends you a zip. Don't forget to run `npm i` after you've extracted the folder. Only an idiot would do that. I did that.  Anyway, as soon as I ran the demo on my local machine, the component worked fine. 

My guess is that it's something wrong with Code Sandbox, but as it may be an issue with the component, I [filed an issue](https://github.com/P3trur0/vue-country-flag/issues/11) just to be safe. 

That being said my take away is ... as cool as Code Sandbox is if you run into an odd issue like this, simply try running it locally to see if it helps.

Ok, so how do the flags look? I started with this demo:

```html
<vue-country-flag country='us' size='small'/>  
<vue-country-flag country='us' size='normal'/>  
<vue-country-flag country='us' size='big'/>  
```

And here's how it rendered:

<img src="https://static.raymondcamden.com/images/2019/06/flags.png" alt="Three American Flags" class="imgborder imgcenter">

Ok, not terribly exciting. In order to make it a bit more real world, I whipped up some JSON data representing a list of cats:

```js
[
  {
    "name": "Frodo",
    "picture": "https://placekitten.com/75/75",
    "country": "US"
  },
  {
    "name": "Galaga",
    "picture": "https://placekitten.com/75/125",
    "country": "FR"
  },
  {
    "name": "Hatchie",
    "picture": "https://placekitten.com/120/120",
    "country": "DE"
  },
  {
    "name": "Lola",
    "picture": "https://placekitten.com/100/100",
    "country": "CN"
  },
  {
    "name": "Jacob",
    "picture": "https://placekitten.com/90/190",
    "country": "KR"
  }
]
```

I hosted this up on [jsonbin.io](https://jsonbin.io), a free service for hosting JSON data. It's a cool service, but note that if you write some code and decide to log in after you've written your first thing, you'll lose that data after logging in. Oops. Anyway, here is an updated component showing hitting the API and rendering the results:

```html
<template>
  <div>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Picture</th>
          <th>Country of Origin</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in cats" :key="cat.picture">
          <td>{{ cat.name }}</td>
          <td><img :src="cat.picture"></td>
          <td>
            <vue-country-flag :country="cat.country" size="big" />
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      cats:[]
    }
  },
  created() {
    fetch('https://api.jsonbin.io/b/5d0cf06ca664f3148ebc78ff/2')
    .then(res => res.json())
    .then(res => {
      this.cats = res;
    });
  }
};
</script>
```

Basically - loop over each cat and render the values, but pass the `country` value to the component. And the result:

<img src="https://static.raymondcamden.com/images/2019/06/flags2.png" alt="Demo results, showing a table of cats with associated flags" class="imgborder imgcenter">

And that's all. Again, let me know if you find these useful, if you have suggestions, or any other feedback!

<i>Header photo by <a href="https://unsplash.com/@liamdesic?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Liam Desic</a> on Unsplash</i>