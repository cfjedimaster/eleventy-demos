---
layout: post
title: "Building Three Common Form Interfaces in Vue.js"
date: "2018-04-02"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/forms.jpg
permalink: /2018/04/02/building-three-common-form-interfaces-in-vuejs
---

Today I wanted to share three simple (mostly simple) Vue.js samples that demonstrate some common form UX patterns. In each case, I fully expect that there are probably existing Vue components I could have used instead, but as always, I'm a firm believer in building stuff yourself as a way to practice what you learn. So with that in mind, let's get started!

Duplicating Fields
===

For the first demo, I'll show an example of a form that lets you "duplicate" a set of fields to enter additional data. That may not make much sense, so let's start with the demo first so you can see what I mean:

<p data-height="400" data-theme-id="0" data-slug-hash="EEEdja" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Form - Duplicate Row" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/EEEdja/">Form - Duplicate Row</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

The form consists of two parts. On top is a set of basic, static fields. On bottom is a place where you can enter information about your friends. Since we don't know how many friends you may have, a field is used to add additional rows. Let's look at the markup for this.

<pre><code class="language-markup">&lt;form id=&quot;app&quot;&gt;

  &lt;fieldset&gt;
    &lt;legend&gt;Basic Info&lt;&#x2F;legend&gt;
    &lt;p&gt;
      &lt;label for=&quot;name&quot;&gt;Name&lt;&#x2F;label&gt;
      &lt;input id=&quot;name&quot; v-model=&quot;name&quot;&gt;
    &lt;&#x2F;p&gt;

    &lt;p&gt;
      &lt;label for=&quot;age&quot;&gt;Age&lt;&#x2F;label&gt;
      &lt;input id=&quot;age&quot; v-model=&quot;age&quot; type=&quot;number&quot;&gt;
    &lt;&#x2F;p&gt;
  &lt;&#x2F;fieldset&gt;

  &lt;fieldset&gt;
    &lt;legend&gt;Friends&lt;&#x2F;legend&gt;

    &lt;div v-for=&quot;(f,n) in friends&quot;&gt;
      &lt;label :for=&quot;&#x27;friend&#x27;+n&quot;&gt;Friend {% raw %}{{n+1}{% endraw %}}&lt;&#x2F;label&gt;
      &lt;input :id=&quot;&#x27;friend&#x27;+n&quot; v-model=&quot;friends[n].name&quot;&gt;
      &lt;label :for=&quot;&#x27;friendage&#x27;+n&quot;&gt;Friend {% raw %}{{n+1}{% endraw %}} Age&lt;&#x2F;label&gt;
      &lt;input :id=&quot;&#x27;friendage&#x27;+n&quot; v-model=&quot;friends[n].age&quot; type=&quot;number&quot;&gt;
    &lt;&#x2F;div&gt;
    
    &lt;p&gt;
      &lt;button @click.prevent=&quot;newFriend&quot;&gt;Add Friend&lt;&#x2F;button&gt;
    &lt;&#x2F;p&gt;
  &lt;&#x2F;fieldset&gt;
  
  &lt;p&gt;Debug: {% raw %}{{friends}}{% endraw %}&lt;&#x2F;p&gt;
&lt;&#x2F;form&gt;
</code></pre>

The top portion is vanilla Vue binding. The bottom part is where the interesting bits are. First, I iterate over a list of friends. This is what "grows" when the button is clicked. Note the use of `(f,n)`. This gives me access to each friend as well as a counter. It's a zero based number so when I render it, I add one to it. Also note how I properly use my label with a dynamic ID value: `:id="'friend'+n"`. That was a bit weird to write at first, but it works well.

The JavaScript is pretty simple:

```js
const app = new Vue({
  el:'#app',
  data:{
    name:null,
    age:null,
    friends:[{% raw %}{name:'',age:''}{% endraw %}]
  },
  methods:{
    newFriend() {
      //New friends are awesome!
      this.friends.push({% raw %}{name:'', age:''}{% endraw %});
    }
  }
})
```

The only real interesting part here is defaulting friends with the first set of values so I get at least `Friend 1` in the UI.

Shipping Same as Billing
===

The next UX I wanted to build was something you typically see in order checkouts, "Shipping Same as Billing" (or vice-versa). Basically, letting the user skip entering the same address twice. Here is the finished demo:

<p data-height="400" data-theme-id="0" data-slug-hash="zWWWzP" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Shipping same as Billing in Vue.js" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/zWWWzP/">Shipping same as Billing in Vue.js</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

I thought this would be simple, and I suppose it was, but I wasn't necessarily sure how it should react once the checkbox was checked. What I mean is, if you say shipping is the same, should we always update? By that I mean, if you change the billing street, do we update the shipping street again? But what if you modified the shipping street? Should we disable shipping if you use the checkbox? But what if you wanted to use this feature to set most of the fields and then tweak one? Yeah, it gets messy. I decided to KISS and just do a copy (if you are checking it) and then don't worry about it. I'm sure there's an argument to be made that I'm totally wrong. Here's the markup:

<pre><code class="language-markup">&lt;form id=&quot;app&quot;&gt;
  &lt;fieldset&gt;
    &lt;legend&gt;Billing Address&lt;&#x2F;legend&gt;
    
    &lt;p&gt;
      &lt;label for=&quot;bstreet&quot;&gt;Street&lt;&#x2F;label&gt;
      &lt;input id=&quot;bstreet&quot; v-model=&quot;billing_address.street&quot;&gt;
    &lt;&#x2F;p&gt;
    
    &lt;p&gt;
      &lt;label for=&quot;bcity&quot;&gt;City&lt;&#x2F;label&gt;
      &lt;input id=&quot;bcity&quot; v-model=&quot;billing_address.city&quot;&gt;
    &lt;&#x2F;p&gt;
    
    &lt;p&gt;
      &lt;label for=&quot;bstate&quot;&gt;State&lt;&#x2F;label&gt;
      &lt;select id=&quot;bstate&quot; v-model=&quot;billing_address.state&quot;&gt;
        &lt;option value=&quot;ca&quot;&gt;California&lt;&#x2F;option&gt;
        &lt;option value=&quot;la&quot;&gt;Louisiana&lt;&#x2F;option&gt;
        &lt;option value=&quot;va&quot;&gt;Virginia&lt;&#x2F;option&gt;
      &lt;&#x2F;select&gt;
    &lt;&#x2F;p&gt;
 
    &lt;p&gt;
      &lt;label for=&quot;bzip&quot;&gt;Zip&lt;&#x2F;label&gt;
      &lt;input id=&quot;bzip&quot; v-model=&quot;billing_address.zip&quot;&gt;
    &lt;&#x2F;p&gt;

  &lt;&#x2F;fieldset&gt;

  &lt;fieldset&gt;
    &lt;legend&gt;Shipping Address&lt;&#x2F;legend&gt;
    
    &lt;input type=&quot;checkbox&quot; @change=&quot;copyBilling&quot; id=&quot;sSame&quot; v-model=&quot;sSame&quot;&gt; &lt;label for=&quot;sSame&quot; class=&quot;sSame&quot;&gt;Shipping Same as Billing&lt;&#x2F;label&gt;&lt;br&#x2F;&gt;
    
    &lt;p&gt;
      &lt;label for=&quot;sstreet&quot;&gt;Street&lt;&#x2F;label&gt;
      &lt;input id=&quot;sstreet&quot; v-model=&quot;shipping_address.street&quot;&gt;
    &lt;&#x2F;p&gt;
    
    &lt;p&gt;
      &lt;label for=&quot;scity&quot;&gt;City&lt;&#x2F;label&gt;
      &lt;input id=&quot;scity&quot; v-model=&quot;shipping_address.city&quot;&gt;
    &lt;&#x2F;p&gt;
    
    &lt;p&gt;
      &lt;label for=&quot;sstate&quot;&gt;State&lt;&#x2F;label&gt;
      &lt;select id=&quot;sstate&quot; v-model=&quot;shipping_address.state&quot;&gt;
        &lt;option value=&quot;ca&quot;&gt;California&lt;&#x2F;option&gt;
        &lt;option value=&quot;la&quot;&gt;Louisiana&lt;&#x2F;option&gt;
        &lt;option value=&quot;va&quot;&gt;Virginia&lt;&#x2F;option&gt;
      &lt;&#x2F;select&gt;
    &lt;&#x2F;p&gt;
 
    &lt;p&gt;
      &lt;label for=&quot;szip&quot;&gt;Zip&lt;&#x2F;label&gt;
      &lt;input id=&quot;szip&quot; v-model=&quot;shipping_address.zip&quot;&gt;
    &lt;&#x2F;p&gt;

  &lt;&#x2F;fieldset&gt;

  &lt;!-- debug --&gt;
  &lt;p&gt;
    sSame {% raw %}{{sSame}}{% endraw %}&lt;br&#x2F;&gt;
    Billing {% raw %}{{billing_address}}{% endraw %}&lt;br&#x2F;&gt;
    Shipping {% raw %}{{shipping_address}}{% endraw %}
  &lt;&#x2F;p&gt;
  
&lt;&#x2F;form&gt;
</code></pre>

And here's the JavaScript:

```js
const app = new Vue({
  el:'#app',
  data:{
    sSame:false,
    billing_address:{
      street:null,
      city:null,
      state:null,
      zip:null
    },
    shipping_address:{
      street:null,
      city:null,
      state:null,
      zip:null
    }
    
  },
  methods:{
    copyBilling() {
      if(this.sSame) {
        for(let key in this.billing_address) {
          this.shipping_address[key] = this.billing_address[key];
        }
      }
    }
  }
})
```

The interesting bit is in `copyBilling`. I apologize for the `sSame` name - it kind of sucks.

Move Left to Right
===

For the final demo, I built a "thing" where you have items on the left and items on the right and you click to move them back and forth. There's probably a better name for this and if you have it, leave a comment below. Here is the demo.

<p data-height="400" data-theme-id="0" data-slug-hash="mxxxXZ" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Move Left to Right" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/mxxxXZ/">Move Left to Right</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

What was tricky about this one is that the select fields used to store data only require you to select items when you want to move them. So I needed to keep track of all the items in each box, as well as when you selected. Here's the markup.

<pre><code class="language-markup">&lt;form id=&quot;app&quot;&gt;

  &lt;div class=&quot;grid&quot;&gt;
    &lt;div class=&quot;left&quot;&gt;
      &lt;select v-model=&quot;left&quot; multiple size=10&gt;
        &lt;option v-for=&quot;item in leftItems&quot; :key=&quot;item.id&quot; 
                :value=&quot;item&quot;&gt;{% raw %}{{item.name}}{% endraw %}&lt;&#x2F;option&gt;
      &lt;&#x2F;select&gt;
    &lt;&#x2F;div&gt;
    
    &lt;div class=&quot;middle&quot;&gt;
      &lt;button @click.prevent=&quot;moveLeft&quot;&gt;&amp;lt;-&lt;&#x2F;button&gt;
      &lt;button @click.prevent=&quot;moveRight&quot;&gt;-&amp;gt;&lt;&#x2F;button&gt;
    &lt;&#x2F;div&gt;
    
    &lt;div class=&quot;right&quot;&gt;
      &lt;select v-model=&quot;right&quot; multiple size=10&gt;
         &lt;option v-for=&quot;item in rightItems&quot; :key=&quot;item.id&quot; 
                :value=&quot;item&quot;&gt;{% raw %}{{item.name}}{% endraw %}&lt;&#x2F;option&gt;       
      &lt;&#x2F;select&gt;
    &lt;&#x2F;div&gt;
  &lt;&#x2F;div&gt;

  &lt;!-- debug --&gt;
  &lt;p&gt;
    leftItems: {% raw %}{{ leftItems}}{% endraw %}&lt;br&#x2F;&gt;
    left: {% raw %}{{ left}}{% endraw %}&lt;br&#x2F;&gt;
    rightItems: {% raw %}{{ rightItems }}{% endraw %}&lt;br&#x2F;&gt;
    right: {% raw %}{{ right }}{% endraw %}
  &lt;&#x2F;p&gt;
  
&lt;&#x2F;form&gt;
</code></pre>

And here's the JavaScript. This time it's a bit more complex.

```js
const app = new Vue({
  el:'#app',
  data:{
    left:[],
    right:[],
    leftItems:[],
    rightItems:[],
    items:[
      {% raw %}{id:1,name:"Fred"}{% endraw %},
      {% raw %}{id:2,name:"Ginger"}{% endraw %},
      {% raw %}{id:3,name:"Zeus"}{% endraw %},
      {% raw %}{id:4,name:"Thunder"}{% endraw %},
      {% raw %}{id:5,name:"Midnight"}{% endraw %}
    ]
    
  },
  created() {
    this.leftItems = this.items;
  },
  methods:{
    moveRight() {
      if(this.left.length === 0) return;
      console.log('move right');
      //copy all of this.left to this.rightItems
      //then set this.left to []
      for(let x=this.leftItems.length-1;x>=0;x--) {
        let exists = this.left.findIndex(ob => {
          return (ob.id === this.leftItems[x].id);
        });
        if(exists >= 0) {
          this.rightItems.push(this.leftItems[x]);
          this.leftItems.splice(x,1);
        }
      }
    },
    moveLeft() {
      if(this.right.length === 0) return;
      console.log('move left');
      for(let x=this.rightItems.length-1;x>=0;x--) {
        let exists = this.right.findIndex(ob => {
          return (ob.id === this.rightItems[x].id);
        });
        if(exists >= 0) {
          this.leftItems.push(this.rightItems[x]);
          this.rightItems.splice(x,1);
        }
      }
    }
    
  }
})
```

Basically on button click, I look at all the items, and for each, see if it exists in the list of selected items, and if so, it gets shifted eithe rleft or right. I feel like this could be a bit slimmer (I will remind folks once again that I'm a proud failed Google interviewee) but it worked. Remember you can fork my CodePens so I'd love to see a slicker version of this.

So - what do you think? Leave me a comment below with your suggestions, modifications, or bug fixes!

<i>Header photo by <a href="https://unsplash.com/photos/ZVwRLu6cVVw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">rawpixel.com</a> on Unsplash</i>