---
layout: post
title: "An Experiment with Vue Components"
date: "2020-08-28"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/slides.jpg
permalink: /2020/08/28/an-experiment-with-vue-components
description: A look at nested Vue components and communication between them.
---

I really enjoy [components](https://vuejs.org/v2/guide/components.html) in Vue.js as they feel very nicely done in terms of functionality and usage. Like most of Vue, you can use them simply to abstract away some UI logic or get very complex. Part of why I love Vue is that it feels like it excels at working at multiple levels - from the "I'm just playing around" to "I'm building the Next Big Thing." Recently I started thinking about a particular component use case. Imagine the following:

```html
<slides>
	<slide>
	This is a slide.
	</slide>

	<slide>
	This is another slide.
	</slide>

	<slide>
	This is a <strike>slide</strike>cat! Fooled ya!
	</slide>
</slides>
```

What I've described above is an imaginary slide show. It's built with a parent `<slides>` tag and each individual `<slide>` component represents one particular slide. When displayed in the browser, it should render some basic slide show controls and render one slide at a time. Seems simple enough, right? 

Turns out it's a bit difficult. Let me break down how I solved this (and what I learned). When I'm done, I'll show you how some friends on Twitter did it *much* better than me so be sure to read the entire post.

Alright, so let's start off by focusing on the core feature which is to display one slide at a time. We can start off by simply hiding slides. So `<slide>` could look a bit like so:

```html
<template>
  <div v-if="currentSlide">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Slide",
  props: {
  },
  computed: {
    currentSlide() {
		return false;
    }
  }
};
</script>
```

That immediately hides all the slides. But how will the slide know when it's visible? The parent, `<slides>`, can keep track of a `currentSlide` value which will change whenever a person advances the slide show. But how would the child tag know about the change? Normally a parent can pass a value to a child like so:

```html
<someComponent :value="someVariable"></someComponent>
```

But I wanted to keep my slide show simple. Notice how easy it was to type each slide? I wanted to keep that simplicity if I could. Turns out, child components can *reach out* to parents by using this.$parent. You can read more about that [here](https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-the-Parent-Component-Instance) and be sure to note the warning that basically boils down to "This is usually a bad idea." In my case I was ok with it. It *does* mean my slide show will break if some other component wraps `<slide>`, but I'm ok with that. Here's the updated code:

```html
<template>
  <div v-if="currentSlide">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Slide",
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
    currentSlide() {
      return this.$parent.currentSlide === 1;
    }
  }
};
</script>
```

Notice the updated `currentSlide` computed property. We're still not done yet. Instead of checking for `=== 1`, what I really need is: "If the current active slide number equal to *my* number." What number? The number of the slide based on where it comes in play. This was a tough nut to crack. One "quick fix" would have been to simply hard code it:

```html
<slides>
	<slide num=1>
	This is a slide.
	</slide>

	<slide num=2>
	This is another slide.
	</slide>

	<slide num=3>
	This is a <strike>slide</strike>cat! Fooled ya!
	</slide>
</slides>
```

But again, I was trying to keep things as simple as possible for the person building the slides. Plus, as every experience presenter knows, you often end up moving slides around and those numbers would quickly get hard to maintain. So how would slide N *know* that it is slide N? 

Turns out that along with with `this.$parent`, there's a `this.$children` as well. So in my `<slides>` tag, I added this:

```js
mounted() {
  for(let i=0;i<this.$children.length;i++) {
    //https://stackoverflow.com/a/41121306/52160
    if(this.$children[i].$options.name === 'Slide') this.$children[i].yourIndex = i;
  }
  this.totalSlides = this.$children.length;
},
```

Basically, iterate over the children, ensure they are a Slide, and then manually set data upon them to assign them a `yourIndex` value. Basically slide N will be told it is in position N. I also keep track of the total number of slides so I can use than in navigation later.

Back to `Slide`, I now have this:

```html
<template>
  <div v-if="currentSlide">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Slide",
  props: {
    yourIndex:-1
  },
  data() {
    return {
    }
  },
  computed: {
    currentSlide() {
      return this.$parent.currentSlide === (this.yourIndex+1);
    }
  }
};
</script>
```

I'm using a 1-based index for the currentSlide so I need to add 1 to yourIndex, but hopefully it makes sense. And really that was it. Here's the final `<Slides>` component with navigation tools built in:

```html
<template>
  <div>
    <button @click="previousSlide">Previous</button> / <button @click="nextSlide">Next</button>
    <p/>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Slides",
  data() {
    return {
      currentSlide:1,
      totalSlides:null
    }
  },
  props: {
  },
  mounted() {
    console.log('Slides created');
    for(let i=0;i<this.$children.length;i++) {
      //https://stackoverflow.com/a/41121306/52160
      if(this.$children[i].$options.name === 'Slide') this.$children[i].yourIndex = i;
    }
    this.totalSlides = this.$children.length;
  },
  methods: {
    nextSlide() {
      if(this.currentSlide < this.totalSlides) this.currentSlide++;
    },
    previousSlide() {
      if(this.currentSlide > 1) this.currentSlide--;
    }
  }
};
</script>
```

It could be a lot fancier of course. You can demo this yourself below:

<iframe src="https://codesandbox.io/embed/component-test-gi61v?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="component test"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

All in all... I kinda dig this. It does feel a bit brittle with the $parent and $children connections, but I dig it. Of course, I've got smart friends who did it better. First up is [Alex Riviere](https://alex.party/) who made use of `provide` and `inject`. This is an [advanced component](https://v3.vuejs.org/guide/component-provide-inject.html) feature that aims to make it easier to work with parent/child tags. Specifically, it lets a top level parent "provide" data that any child, no matter how deep it is, can "receive" by using "inject". Sorry for all the quotes - this is still kind of new to me. ;)

In this version, the parent tag *provides* access to values related to what the current slide is as well as a method that lets the child slide "register" itself and gets its position. Here's his `<slides>` component:

```html
<template>
  <div>
    <button @click="previousSlide">Previous</button> /
    <button @click="nextSlide">Next</button>
    <p/>
    <slot></slot>
  </div>
</template>

<script>
let SLIDE_COUNTER = 0;

export default {
  name: "Slides",
  data() {
    return {
      currentSlide: 1,
      slides: []
    };
  },
  props: {},
  methods: {
    register() {
      const ID = SLIDE_COUNTER;
      SLIDE_COUNTER++;
      this.slides.push(ID);
      return ID;
    },
    getIndex(id) {
      return this.slides.indexOf(id);
    },
    unregister(id) {
      const index = this.getIndex(id);
      this.slides.splice(index, 1);
    },
    getCurrentSlide() {
      return this.currentSlide;
    },
    nextSlide() {
      if (this.currentSlide < this.slides.length) this.currentSlide++;
    },
    previousSlide() {
      if (this.currentSlide > 1) this.currentSlide--;
    }
  },
  provide() {
    return {
      register: this.register,
      getIndex: this.getIndex,
      unregister: this.unregister,
      getCurrentSlide: this.getCurrentSlide
    };
  }
};
</script>
```

And then his updated `<slide>`:

```html
<template>
  <div v-if="currentSlide">
    debug: slide, currentSlide, {% raw %}{{currentSlide}}{% endraw %}
    <br>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Slide",
  data() {
    return {
      slideID: -1
    };
  },
  inject: ["register", "getIndex", "unregister", "getCurrentSlide"],
  created() {
    this.slideID = this.register();
  },
  beforeDestroy() {
    this.unregister(this.slideID);
  },
  mounted() {
    console.log("mySlide:", this.currentSlide);
  },
  computed: {
    currentSlide() {
      return this.getCurrentSlide() === this.getIndex(this.slideID) + 1;
    }
  }
};
</script>
```

This feels a bit "safer" compared to my version and definitely would better handle `<slide>` tag that are grandchildren, not children. Here's his version:

<iframe src="https://codesandbox.io/embed/component-test-forked-p1vef?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="component test (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Another person also came in with a solution. [Jonathan Bakebwa](https://www.jbakebwa.dev/) came up with a solution making use vnodes. VNodes, or virtual nodes, are how Vue handle making changes to the DOM in an efficient manner. I've never worked with them (directly) before so this particular solution is *way* beyond my skill level! Check it out below:

<iframe src="https://codesandbox.io/embed/slides-slide-compound-component-qj0ln?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="slides-slide-compound-component"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

All in all, this was pretty fun to dig into and I'm not surprised that Vue allowed what I wanted to work in *multiple* different ways. If you've done this yourself, please share your experience by leaving me a comment below!

<span>Photo by <a href="https://unsplash.com/@matthewhenry?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Matthew Henry</a> on <a href="https://unsplash.com/s/photos/slides?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>