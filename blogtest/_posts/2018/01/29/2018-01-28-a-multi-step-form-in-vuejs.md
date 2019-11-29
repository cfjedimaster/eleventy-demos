---
layout: post
title: "A Multi-Step Form in Vue.js"
date: "2018-01-29"
categories: [javascript]
tags: [vuejs]
banner_image: 
permalink: /2018/01/29/a-multi-step-form-in-vuejs
---

Last week I wrote up a demo explaining how to [build a simple quiz](https://www.raymondcamden.com/2018/01/22/building-a-quiz-with-vuejs/) using Vue.js. As part of that process, I demonstrated how to render one question of the quiz at a time and navigate through the set of questions. It occurred to me that it may make sense to also demonstrate how to build a simple "multi-step" form in Vue.js as well. Let's begin with a simple example. I'll show the HTML first.

```markup
<div id="app">
  <form>
  <div v-if="step === 1">

    <h1>Step One</h1>
    <p>
    <legend for="name">Your Name:</legend>
    <input id="name" name="name" v-model="registration.name">
    </p>

    <p>
    <legend for="email">Your Email:</legend>
    <input id="email" name="email" type="email" v-model="registration.email">
    </p>

    <button @click.prevent="next()">Next</button>
    
  </div>

  <div v-if="step === 2">
    <h1>Step Two</h1>
    <p>
    <legend for="street">Your Street:</legend>
    <input id="street" name="street" v-model="registration.street">
    </p>

    <p>
    <legend for="city">Your City:</legend>
    <input id="city" name="city" v-model="registration.city">
    </p>

    <p>
    <legend for="state">Your State:</legend>
    <input id="state" name="state" v-model="registration.state">
    </p>

    <button @click.prevent="prev()">Previous</button>
    <button @click.prevent="next()">Next</button>

  </div>

  <div v-if="step === 3">
    <h1>Step Three</h1>
    
    <p>
    <legend for="numtickets">Number of Tickets:</legend>
    <input id="numtickets" name="numtickets" type="number" v-model="registration.numtickets">
    </p>

    <p>
    <legend for="shirtsize">Shirt Size:</legend>
    <select id="shirtsize" name="shirtsize" v-model="registration.shirtsize">
      <option value="S">Small</option>
      <option value="M">Medium</option>
      <option value="L">Large</option>
      <option value="XL">X-Large</option>
    </select>
    </p>

    <button @click.prevent="prev()">Previous</button>
    <button @click.prevent="submit()">Save</button>
    
  </div>
  </form>

  <br/><br/>Debug: {% raw %}{{registration}}{% endraw %}
</div>
```

This is a three step form that kind of mimics a typical conference registration. I've got three steps each set up in a div using `v-if` to control if the particular step is rendered. Note the buttons in each step. I call either `next`, `prev`, or `submit` based on what part of the process I'm in. The last part (where it says Debug) was simply a little, well, "debugger" so I could see data being entered as the process was completed.

Now let's look at the code.

```js
const app = new Vue({
  el:'#app',
  data() {
    return {
      step:1,
      registration:{
        name:null,
        email:null,
        street:null,
        city:null,
        state:null,
        numtickets:0,
        shirtsize:'XL'
      }
    }
  },
  methods:{
    prev() {
      this.step--;
    },
    next() {
      this.step++;
    },
    submit() {
      alert('Submit to blah and show blah and etc.');      
    }
  }
});
```

I've got two interesting things going on here. First, I decided to put all the form data in a key called `registration`. This gave me a nice separation between the "UI stuff" and the actual form data. The `prev` and `next` methods simply change the `step` value. In theory I could add additional logic here to ensure I don't go to an invalid step, but as I'm writing the HTML myself I trusted myself to not screw that up. Finally, the `submit` action would do a simple AJAX post and then either redirect to a thank you page or show a server-side error. (I assumed folks were here for the multi-step form and not the AJAX, but if you want to see that, just ask!) Here is a complete embed of this demo:

<p data-height="400" data-theme-id="dark" data-slug-hash="bLGqqG" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Multi-step Vue form" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/bLGqqG/">Multi-step Vue form</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

You may be curious - what if you didn't want to use AJAX for the form submission. I mean, there's a real form there, right? Well don't forget that `v-if` actually takes things in and out of the DOM. If you tried to submit this version, only the form fields from the last visible step would be posted. Here's a modified version that uses `v-show` instead:

<pre><code class="language-markup">
&lt;div id=&quot;app&quot;&gt;
	&lt;form action=&quot;https:&#x2F;&#x2F;postman-echo.com&#x2F;post&quot; method=&quot;post&quot;&gt;
	
	&lt;div v-show=&quot;step === 1&quot;&gt;

		&lt;h1&gt;Step One&lt;&#x2F;h1&gt;
		&lt;p&gt;
		&lt;legend for=&quot;name&quot;&gt;Your Name:&lt;&#x2F;legend&gt;
		&lt;input id=&quot;name&quot; name=&quot;name&quot; v-model=&quot;registration.name&quot;&gt;
		&lt;&#x2F;p&gt;

		&lt;p&gt;
		&lt;legend for=&quot;email&quot;&gt;Your Email:&lt;&#x2F;legend&gt;
		&lt;input id=&quot;email&quot; name=&quot;email&quot; type=&quot;email&quot; v-model=&quot;registration.email&quot;&gt;
		&lt;&#x2F;p&gt;

		&lt;button @click.prevent=&quot;next()&quot;&gt;Next&lt;&#x2F;button&gt;

	&lt;&#x2F;div&gt;

	&lt;div v-show=&quot;step === 2&quot;&gt;
		&lt;h1&gt;Step Two&lt;&#x2F;h1&gt;
		&lt;p&gt;
		&lt;legend for=&quot;street&quot;&gt;Your Street:&lt;&#x2F;legend&gt;
		&lt;input id=&quot;street&quot; name=&quot;street&quot; v-model=&quot;registration.street&quot;&gt;
		&lt;&#x2F;p&gt;

		&lt;p&gt;
		&lt;legend for=&quot;city&quot;&gt;Your City:&lt;&#x2F;legend&gt;
		&lt;input id=&quot;city&quot; name=&quot;city&quot; v-model=&quot;registration.city&quot;&gt;
		&lt;&#x2F;p&gt;

		&lt;p&gt;
		&lt;legend for=&quot;state&quot;&gt;Your State:&lt;&#x2F;legend&gt;
		&lt;input id=&quot;state&quot; name=&quot;state&quot; v-model=&quot;registration.state&quot;&gt;
		&lt;&#x2F;p&gt;

		&lt;button @click.prevent=&quot;prev()&quot;&gt;Previous&lt;&#x2F;button&gt;
		&lt;button @click.prevent=&quot;next()&quot;&gt;Next&lt;&#x2F;button&gt;

	&lt;&#x2F;div&gt;

	&lt;div v-show=&quot;step === 3&quot;&gt;
	&lt;h1&gt;Step Three&lt;&#x2F;h1&gt;

	&lt;p&gt;
	&lt;legend for=&quot;numtickets&quot;&gt;Number of Tickets:&lt;&#x2F;legend&gt;
	&lt;input id=&quot;numtickets&quot; name=&quot;numtickets&quot; type=&quot;number&quot; v-model=&quot;registration.numtickets&quot;&gt;
	&lt;&#x2F;p&gt;

	&lt;p&gt;
	&lt;legend for=&quot;shirtsize&quot;&gt;Shirt Size:&lt;&#x2F;legend&gt;
	&lt;select id=&quot;shirtsize&quot; name=&quot;shirtsize&quot; v-model=&quot;registration.shirtsize&quot;&gt;
		&lt;option value=&quot;S&quot;&gt;Small&lt;&#x2F;option&gt;
		&lt;option value=&quot;M&quot;&gt;Medium&lt;&#x2F;option&gt;
		&lt;option value=&quot;L&quot;&gt;Large&lt;&#x2F;option&gt;
		&lt;option value=&quot;XL&quot;&gt;X-Large&lt;&#x2F;option&gt;
	&lt;&#x2F;select&gt;
	&lt;&#x2F;p&gt;

	&lt;button @click.prevent=&quot;prev()&quot;&gt;Previous&lt;&#x2F;button&gt;
	&lt;input type=&quot;submit&quot; value=&quot;Save&quot;&gt;

	&lt;&#x2F;div&gt;
	&lt;&#x2F;form&gt;

	&lt;br&#x2F;&gt;&lt;br&#x2F;&gt;Debug: {% raw %}{{registration}}{% endraw %}
&lt;&#x2F;div&gt;
</code></pre>

Note I also added an action and method to the form tag. In this case I'm using the Postman echo service so the result won't be terribly pretty, but you will see all the fields posted. Here's this version:

<p data-height="400" data-theme-id="dark" data-slug-hash="BYaWJa" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Multi-step Vue form (2)" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/BYaWJa/">Multi-step Vue form (2)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Woot. Ok, so for a final version, I thought I'd try a quick [Veutify](https://next.vuetifyjs.com/en/) version. Veutify is a material design UI skin for Vue and it's pretty bad ass. I want to be clear that I whipped this up pretty quickly so it is probably *not* the most ideal version, but it looks pretty cool. 

<p data-height="500" data-theme-id="dark" data-slug-hash="aqbJga" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Multi-step form, Vuetify" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/aqbJga/">Multi-step form, Vuetify</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

In case you're curious, that control is called the [stepper](https://next.vuetifyjs.com/en/components/steppers) and has quite a few options for how to configure it. The default is a horizontal step process, but I noticed the labels in the header went away when the width was constrained. This version seemed to work better in the space I have here.

Anyway - I hope this helps, and as always, remember there's going to be many different ways of doing what I demonstrated here. If you've been working with Vue and have some examples of this, please share below!