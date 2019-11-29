---
layout: post
title: "Building Related Selects with Vue.js"
date: "2017-12-05"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2017/12/05/building-related-selects-with-vuejs
---

My buddy [Nic Raboy](https://www.thepolyglotdeveloper.com/blog/) has been posting some great "how to do X" style posts on [Vue.js](https://vuejs.org/) lately and it's inspired me to do the same. With that in mind, I decided to work on what I thought would be a simple demo of "related selects" - this is a common UI interface where one drop down drives the content of another. While working on the demos though I ran into some interesting edge cases that helped me learn, so I hope what follows is useful. As always, remember that I'm learning and there are probably better ways of doing what I'm showing here. (In fact, once again my friend Ted Patrick shared an update to my code that I'll be including in the post.)

For my demo, I decided to try two basic examples. The first example would be static data. The second example would be Ajax driven such that every change of the initial drop down would require a quick Ajax call to load the contents of the second drop down. Let's look at the first example.

I'll begin with the markup:

<pre><code class="language-markup">&lt;div id=&quot;app&quot;&gt;

  &lt;select v-model=&quot;selectedDrink&quot; @change=&quot;selectDrink&quot;&gt;
    &lt;option v-for=&quot;(drink,index) in drinks&quot; :value=&quot;index&quot;&gt;{% raw %}{{ drink.label }}{% endraw %}&lt;/option&gt;
  &lt;/select&gt;

  &lt;select v-model=&quot;selectedOption&quot; v-if=&quot;selectedDrink != -1&quot;&gt;
    &lt;option v-for=&quot;option in drinks[selectedDrink].options&quot;&gt;{% raw %}{{ option }}{% endraw %}&lt;/option&gt;
  &lt;/select&gt;

  &lt;p v-if=&quot;selectedOption&quot;&gt;
    You selected a {% raw %}{{ drinks[selectedDrink].label }}{% endraw %} and specifically {% raw %}{{ selectedOption }}{% endraw %}.
  &lt;/p&gt;
&lt;/div&gt;
</code></pre>

The first drop down is bound to a variable called `selectedDrink` and is driven by a list of data called `drinks`. You'll see all of this in a moment when we switch to the JavaScript. Note that my for loop is getting both the drink value as well as the numeric index. You'll see how that's used soon too. 

The second drop down is looping over what will be a list of options for a specific drink. Note the use of `v-if` to only show up when we've selected a drink. 

Finally - there is a simple paragraph which states what you've selected. It is hidden as well until you've selected a particular value. 

Now let's look at the code.

<pre><code class="language-javascript">const app = new Vue({
  el:'#app',
  data:{
    drinks:[
      {
        label:&quot;Beer&quot;,
        options:[&quot;Sam Adams&quot;,&quot;Anchor Steam&quot;,&quot;St. Arnold&quot;]
      },
      {
        label:&quot;Soda&quot;,
        options:[&quot;Pepsi&quot;,&quot;Coke&quot;,&quot;RC&quot;]
      },
      {
        label:&quot;Coffee&quot;,
        options:[&quot;Starbucks&quot;,&quot;Dunkin Donuts&quot;,&quot;Gross Hotel Room&quot;]
      }
    ],
    
    selectedDrink:-1,
    selectedOption:''
  },
  methods:{
    selectDrink:function() {
      this.selectedOption = '';
    }
  }
});
</code></pre>

As I mentioned, this first example is static, hard coded data. In this case, an array of simple objects where each drink has a label and an array of options for the values. The only real logic in play here is `selectDrink`. I'm resetting `selectedOption` back to blank. I do this to hide that final paragraph. All in all rather trivial. The issues I ran into were in `v-if`. Specifically the fact that when generating a set of options for a drop down, Vue will set the default value to undefined, and my conditionals were tripping up on that. This is expected but it tripped me up. You can play with the first version below:

<p data-height="265" data-theme-id="0" data-slug-hash="OOqaPa" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Related DDs" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/OOqaPa/">Related DDs</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

So I liked this, but I was kinda bugged by the amount of logic I had in the view (HTML) area. It isn't a lot, but it just felt like a bit too much. I worked on a second version to try to correct this. Here is the new HTML:

<pre><code class="language-markup">&lt;div id=&quot;app&quot;&gt;

  &lt;select v-model=&quot;selectedDrink&quot; @change=&quot;selectDrink&quot;&gt;
    &lt;option v-for=&quot;(drink,index) in drinks&quot; :value=&quot;index&quot;&gt;{% raw %}{{ drink.label }}{% endraw %}&lt;/option&gt;
  &lt;/select&gt;

  &lt;select v-model=&quot;selectedOption&quot; v-if=&quot;options.length&quot;&gt;
    &lt;option v-for=&quot;option in options&quot;&gt;{% raw %}{{ option }}{% endraw %}&lt;/option&gt;
  &lt;/select&gt;

  &lt;p v-if=&quot;selectedOption&quot;&gt;
    You selected a {% raw %}{{ selectedDrinkLabel }}{% endraw %} and specifically {% raw %}{{ selectedOption }}{% endraw %}.
  &lt;/p&gt;
&lt;/div&gt;
</code></pre>

The main changes are in the second two blocks of layout and mainly in that I don't assume as much knowledge about the 'form' of drinks. In fact, I'd like to change `options.length` in the second block as well. The JavaScript is just a bit different:

<pre><code class="language-javascript">const app = new Vue({
  el:'#app',
  data:{
    drinks:[
      {
        label:"Beer",
        options:["Sam Adams","Anchor Steam","St. Arnold"]
      },
      {
        label:"Soda",
        options:["Pepsi","Coke","RC"]
      },
      {
        label:"Coffee",
        options:["Starbucks","Dunkin Donuts","Gross Hotel Room"]
      }
    ],
    
    selectedDrink:-1,
    selectedOption:'',
    options:[],
    selectedDrinkLabel:''
  },
  methods:{
    selectDrink:function() {
      this.selectedOption = '';
      this.options = this.drinks[this.selectedDrink].options;
      this.selectedDrinkLabel = this.drinks[this.selectedDrink].label;
    }
  }
});
</code></pre>

Note how the `selectDrink` method now does a bit more work. Again, I like this as I feel like more of the logic should be here versus the layout. You can view this below:

<p data-height="265" data-theme-id="0" data-slug-hash="ZaPVKx" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Related DDs (p2)" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/ZaPVKx/">Related DDs (p2)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Finally, Ted Patrick shared a third version with me. Note that his is missing some of the logic of the second version. But check out the change:

<pre><code class="language-markup">&lt;div id=&quot;app&quot;&gt;

  &lt;select v-model=&quot;selectedDrink&quot;&gt;
    &lt;option v-for=&quot;drink in drinks&quot; :value=&quot;drink&quot;&gt;{% raw %}{{ drink.label }}{% endraw %}&lt;/option&gt;
  &lt;/select&gt;

  &lt;select v-model=&quot;selectedOption&quot; v-if=&quot;selectedDrink != -1&quot;&gt;
    &lt;option v-for=&quot;option in selectedDrink.options&quot;&gt;{% raw %}{{ option }}{% endraw %}&lt;/option&gt;
  &lt;/select&gt;

  &lt;p v-if=&quot;selectedDrink&amp;&amp;selectedOption&quot;&gt;
    You selected a {% raw %}{{ selectedDrink.label }}{% endraw %} and specifically {% raw %}{{ selectedOption }}{% endraw %}.
  &lt;/p&gt;
  
&lt;/div&gt;
</code></pre>

Specifically note that the value of the drop down is the drink object itself. That's cool! I'm basically making a drop down where the value is some random JavaScript object of any shape. I really, really dig that! You can find his complete version below.

<p data-height="265" data-theme-id="0" data-slug-hash="VrRqEY" data-default-tab="html,result" data-user="__ted__" data-embed-version="2" data-pen-title="Related DDs" class="codepen">See the Pen <a href="https://codepen.io/__ted__/pen/VrRqEY/">Related DDs</a> by Ted Patrick (<a href="https://codepen.io/__ted__">@__ted__</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Ok, now for round two! For the second version, I wanted related drop downs where the related content was driven via a web service. In this case, I decided to build something using the [Star Wars API](https://swapi.co/). The Star Wars API has simple GET endpoints for different types of data, like films, people, etc. So I built a related select where the first drop down was the *kind* of data and the second was the actual data. (To keep it simple, I didn't worry about paging.) Here is the markup.

<pre><code class="language-markup">&lt;div id=&quot;app&quot;&gt;

  &lt;h2&gt;SWAPI Data&lt;/h2&gt;
  
  &lt;select v-model=&quot;selectedOption&quot; @change=&quot;loadData&quot;&gt;
    &lt;option v-for=&quot;option in options&quot;&gt;{% raw %}{{ option }}{% endraw %}&lt;/option&gt;
  &lt;/select&gt;

  &lt;div v-if=&quot;selectedOption &amp;&amp; !items.length&quot;&gt;&lt;i&gt;Loading&lt;/i&gt;&lt;/div&gt;
  &lt;select v-if=&quot;items.length&quot;&gt;
    &lt;option v-for=&quot;item in items&quot;&gt;{% raw %}{{ item.label }}{% endraw %}&lt;/option&gt;
  &lt;/select&gt;
  
&lt;/div&gt;
</code></pre>

For the most part this isn't too much different from the initial version, except for the removal of the third paragraph. I added a "loading" widget as well. Now let's look at the JavaScript.

<pre><code class="language-javascript">const app = new Vue({
  el:'#app',
  data:{
    options:[&quot;films&quot;,&quot;people&quot;,&quot;starships&quot;,&quot;vehicles&quot;,&quot;species&quot;,&quot;planets&quot;],
    items:[],
    selectedOption:''
  },
  methods:{
    loadData:function() {
      this.items = [];
      let key = 'name';
      if(this.selectedOption === 'films') key = 'title';
      
      fetch('https://swapi.co/api/'+this.selectedOption)
      .then(res=&gt;res.json())
      .then(res =&gt; {
        // &quot;fix&quot; the data to set a label for all types
        this.items = res.results.map((item) =&gt;{
              item.label = item[key];
              return item;
        });
       
      });
    }
  }
});
</code></pre>

I begin by defining a hard coded list of data types. I initialize `items` to an empty array. This will get populated when you select a type. You can see that logic in `loadData`. I run a fetch call to the end point and that's basically it. I have a little bit of logic to help keep my view simple, in this case creating a `label` property that is based on the best "name" for the data. As you can see, only films is a bit weird, using `title` instead of `name`. That's basically it. Here it is in action:

<p data-height="265" data-theme-id="0" data-slug-hash="mqoaxV" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Related DDs (p3)" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/mqoaxV/">Related DDs (p3)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Note that I really should add a simple caching layer so that I don't refetch data I don't need to. Also, Ted again shared an updated version with some changes:

<blockquote class="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr">I tend to use null as the initial model state as this denotes loading and allows easy hiding of elements with v-if. The other way to do this is with computed properties where you can add filtering to result set. +10 for SWAPI use.<a href="https://t.co/Ykjv7Vsg6C">https://t.co/Ykjv7Vsg6C</a></p>&mdash; Ted Patrick (@__ted__) <a href="https://twitter.com/__ted__/status/938045508643323904?ref_src=twsrc%5Etfw">December 5, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Anyway, let me know what you think. I'm also open to requests for what to cover next. My current plan is to show simple form validation with Vue.