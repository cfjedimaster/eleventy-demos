---
layout: post
title: "Working with Dynamic Components in Vue.js"
date: "2018-10-31"
categories: ["javascript"]
tags: ["vuejs","javascript"]
banner_image: /images/banners/pumpkins.jpg
permalink: /2018/10/31/working-with-dynamic-components-in-vuejs
---

I'm currently deep into a project using [NativeScript Vue](https://nativescript-vue.org/) and ran into an interesting problem that - thankfully - had an incredibly simple solution in Vue. While I certainly do not believe Vue is perfect, but the deeper I go the more I appreciate how powerful it is. The problem I ran into dealt with dynamic forms.

The application loads a set of data that represents an array of fields. Each field has a particular type, possible options, possible defaults and more. I knew I could build Vue components to represent these fields, but what I wasn't sure about was how to actually use them in my layout. Turns out there is a perfectly simple way to do this - [Dymamic Components](https://vuejs.org/v2/guide/components.html#Dynamic-Components). 

Basically, instead of adding `<my-component>` to a layout, you would add `<component :is="my-component">`. And yeah, that's pretty much it. There's one important aspect though. Now that you know how to create a dynamic component, how would you also dynamically pass data to it?

Turns out, the [bind](https://vuejs.org/v2/api/#v-bind) feature supports passing an object and expanding the key/value pairs out as attributes and values. It's as simple as: `v-bind="object"`. 

So this may make more sense with an example. Let's start off with a Vue application that has some hard coded data representing field data.

```js
const app = new Vue({
  el:'#app',
  data() {
    return {
      fields:[
        {
          'id':1,
          'label':'Name',
          'type':'textField'
        },
        {
          'id':2,
          'label':'Email',
          'type':'textField'
        },
        {
          'id':3,
          'label':'Movies',
          'type':'selectField',
          'answers':[
            { value:1,label:"Aa" },
            { value:2,label:"Bb" },
            { value:3,label:"Cc" }
          ]
        },
        {
          'id':4,
          'label':'Food',
          'type':'radioField',
          'answers':[
            { value:1,label:"Aa" },
            { value:2,label:"Bb" },
            { value:3,label:"Cc" }
          ]
        },
      ]
    }
  }
})
```

In the `data` block, I've got 4 fields defined. Each has a label, a type, and some have answers representing options. To keep things simple I kept out things like defaults. In the real app, I'll not only have defaults, but concepts like, "default to the current time." Now let's look at the layout.

```markup
<div id="app" v-cloak>
  <component 
             v-for="field in fields" 
             :key="field.id"
             :is="field.type"
             v-bind="field">
  </component>
</div>
```

Nice and simple. I'm looping over each field, defining it's component based on the `field.type` value. I then pass in all the data of the field using the `v-bind` trick described above. As for how I implemented the components, I just did some basic HTML. Here are all three:

```js
Vue.component('textField', {
  template:'<div>{{ label }}<input type="text" :id="id"></div>',
  data() {
    return {
    }
  },
  computed:{
  },
  props:["label","id"]
});

Vue.component('selectField', {
  template:
`<div>
{{ label }}
<select :id="id">
  <option v-for="answer in answers" :key="answer.value" :value="answer.value">
    {{answer.label}}
  </option>
</select>
</div>`,
  data() {
    return {
    }
  },
  computed:{
  },
  props:["label","id","answers"]
});

Vue.component('radioField', {
  template:
`<div>
  {{ label }}<br/>
  <div v-for="answer in answers" :key="answer.value">
  {{ answer.label }} <input type="radio" :name="id" :value="answer.value" />
  </div>
</div>`,
  data() {
    return {
    }
  },
  computed:{
  },
  props:["label","id","answers"]
});
```

This is a pretty ugly implementation of the fields but it gets the job done. And of course in my 'real' app I'll be using both Single File Components and NativeScript components, but you get the idea. 

If you want to see a live example of this, check out the CodePen below. Remember this is a super basic implementation for me to test the idea out, nothing more.

<p data-height="400" data-theme-id="0" data-slug-hash="pxXowY" data-default-tab="js,result" data-user="cfjedimaster" data-pen-title="pxXowY" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/pxXowY/">pxXowY</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<i>Header photo by <a href="https://unsplash.com/photos/VQtBAHVRgvc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mark Duffel</a> on Unsplash</i>

