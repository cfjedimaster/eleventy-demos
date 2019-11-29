---
layout: post
title: "An Example of Form Validation with Vue.js"
date: "2017-12-07"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2017/12/07/an-example-of-form-validation-with-vuejs
---

I was a bit torn about today's blog post. When it comes to form validation, I'm a huge fan of validating via HTML attributes. In fact, I just ran across a great post today on the subject by Dave Rupert, ["Happier HTML5 Form Validation"](https://daverupert.com/2017/11/happier-html5-forms/?utm_source=frontendfocus&utm_medium=email). However, I know folks have issues with HTML validation, and it doesn't cover every use case, and finally, I thought it would just be plain good practice for me to write up a few quick examples. With that in mind, let's get started.

First Example - Super Simple Form
---

For my first example, I wanted something as simple as possible. Given a form of three fields, make two required. I began with the HTML:

<pre><code class="language-markup">&lt;form id=&quot;app&quot; @submit=&quot;checkForm&quot; action=&quot;/something&quot; method=&quot;post&quot;&gt;
  
  &lt;p v-if=&quot;errors.length&quot;&gt;
    &lt;b&gt;Please correct the following error(s):&lt;/b&gt;
    &lt;ul&gt;
      &lt;li v-for=&quot;error in errors&quot;&gt;{% raw %}{{ error }}{% endraw %}&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/p&gt;
  
  &lt;p&gt;
  &lt;label for=&quot;name&quot;&gt;Name&lt;label&gt;
  &lt;input type=&quot;text&quot; name=&quot;name&quot; id=&quot;name&quot; v-model=&quot;name&quot;&gt;
  &lt;/p&gt;

  &lt;p&gt;
  &lt;label for=&quot;age&quot;&gt;Age&lt;label&gt;
  &lt;input type=&quot;number&quot; name=&quot;age&quot; id=&quot;age&quot; v-model=&quot;age&quot;&gt;
  &lt;/p&gt;

  &lt;p&gt;
  &lt;label for=&quot;movie&quot;&gt;Favorite Movie&lt;label&gt;
  &lt;select name=&quot;movie&quot; id=&quot;movie&quot; v-model=&quot;movie&quot;&gt;
    &lt;option&gt;Star Wars&lt;/option&gt;
    &lt;option&gt;Vanilla Sky&lt;/option&gt;
    &lt;option&gt;Atomic Blonde&lt;/option&gt;
  &lt;/select&gt;
  &lt;/p&gt;

  &lt;p&gt;
  &lt;input type=&quot;submit&quot; value=&quot;Submit&quot;&gt;  
  &lt;/p&gt;

&lt;/form&gt;
</code></pre>

Let's cover it from the top. The form tag has an ID that I'll be using for my Vue component. I've got a submit handler that you'll see in a bit, and my action is a fake URL that would point to something real on a server someplace (where you have backup server-side validation of course). 

Beneath that I've got a paragraph that shows or hides itself based on an error state. This is a personal preference of mine when building forms. I like a nice simple list of errors on top of the form. You may like error handling by the fields themselves. Use what works. Also note I'm going to fire my validation on submit rather than as every field is modified. Again, this is a personal preference. 

The final thing to note is that each of the three fields has a corresponding v-model to connect them to values we will work with in the JavaScript. Now let's look at that!

<pre><code class="language-javascript">const app = new Vue({
  el:'#app',
  data:{
    errors:[],
    name:null,
    age:null,
    movie:null
  },
  methods:{
    checkForm:function(e) {
      if(this.name &amp;&amp; this.age) return true;
      this.errors = [];
      if(!this.name) this.errors.push(&quot;Name required.&quot;);
      if(!this.age) this.errors.push(&quot;Age required.&quot;);
      e.preventDefault();
    }
  }
})
</code></pre>

Fairly short and simple. I default an array to hold my errors and set null values for my three form fields. My `checkForm` logic (which is run on submit remember) checks for name and age only as movie is optional. If they are empty I check each and set a specific error for each. And that's really it. You can run the demo below. Don't forget that on a successful submission it's going to POST to a non-existent URL.

<p data-height="265" data-theme-id="0" data-slug-hash="GObpZM" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 1" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/GObpZM/">form validation 1</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Second Example - Custom Validation
---

For the second example, I switched the second text field (age) to email and decided to add custom validation. My code is taken from the StackOverflow question, [How to validate email address in JavaScript?](https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript). This is an awesome question because it makes your most intense Facebook political/religious argument look like a slight disagreement over who makes the best beer. Seriously - it's insane. Here is the HTML, even though it's really close to the first example.

<pre><code class="language-markup">&lt;form id=&quot;app&quot; @submit=&quot;checkForm&quot; action=&quot;/something&quot; method=&quot;post&quot; novalidate=&quot;true&quot;&gt;
  
  &lt;p v-if=&quot;errors.length&quot;&gt;
    &lt;b&gt;Please correct the following error(s):&lt;/b&gt;
    &lt;ul&gt;
      &lt;li v-for=&quot;error in errors&quot;&gt;{% raw %}{{ error }}{% endraw %}&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/p&gt;
  
  &lt;p&gt;
  &lt;label for=&quot;name&quot;&gt;Name&lt;label&gt;
  &lt;input type=&quot;text&quot; name=&quot;name&quot; id=&quot;name&quot; v-model=&quot;name&quot;&gt;
  &lt;/p&gt;

  &lt;p&gt;
  &lt;label for=&quot;email&quot;&gt;Email&lt;label&gt;
  &lt;input type=&quot;email&quot; name=&quot;email&quot; id=&quot;email&quot; v-model=&quot;email&quot;&gt;
  &lt;/p&gt;

  &lt;p&gt;
  &lt;label for=&quot;movie&quot;&gt;Favorite Movie&lt;label&gt;
  &lt;select name=&quot;movie&quot; id=&quot;movie&quot; v-model=&quot;movie&quot;&gt;
    &lt;option&gt;Star Wars&lt;/option&gt;
    &lt;option&gt;Vanilla Sky&lt;/option&gt;
    &lt;option&gt;Atomic Blonde&lt;/option&gt;
  &lt;/select&gt;
  &lt;/p&gt;

  &lt;p&gt;
  &lt;input type=&quot;submit&quot; value=&quot;Submit&quot;&gt;  
  &lt;/p&gt;

&lt;/form&gt;
</code></pre>

While the change here is small, note the `novalidate="true"` on top. This is important because the browser will attempt to validate the email address in the field when `type="email"`. Frankly I'd be tempted to trust the browser in this case, but as I wanted an example with custom validation, I'm disabling it. Here's the updated JavaScript.

<pre><code class="language-javascript">const app = new Vue({
  el:'#app',
  data:{
    errors:[],
    name:null,
    email:null,
    movie:null
  },
  methods:{
    checkForm:function(e) {
      this.errors = [];
      if(!this.name) this.errors.push(&quot;Name required.&quot;);
      if(!this.email) {
        this.errors.push(&quot;Email required.&quot;);
      } else if(!this.validEmail(this.email)) {
        this.errors.push(&quot;Valid email required.&quot;);        
      }
      if(!this.errors.length) return true;
      e.preventDefault();
    },
    validEmail:function(email) {
      var re = /^(([^&lt;&gt;()\[\]\\.,;:\s@&quot;]+(\.[^&lt;&gt;()\[\]\\.,;:\s@&quot;]+)*){% raw %}|(&quot;.+&quot;))@((\[[0-9]{1,3}{% endraw %}\.[0-9]{% raw %}{1,3}{% endraw %}\.[0-9]{% raw %}{1,3}{% endraw %}\.[0-9]{% raw %}{1,3}{% endraw %}\]){% raw %}|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}{% endraw %}))$/;
    return re.test(email);
    }
  }
})
</code></pre>

As you can see, I've added `validEmail` as a new method and I simply call it from `checkForm`. Nothing too crazy, but a good example I think. You can play with this example here:

<p data-height="265" data-theme-id="0" data-slug-hash="vWqNXZ" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 2" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/vWqNXZ/">form validation 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

(And yes - before someone comments, I'm aware of the issues of validating emails and even a valid email format doesn't necessarily mean it is an email address that points to a person. Let's just chill, shall we?)

Example Three - Another Custom Validation
---

For the third example, I built something you've probably seen in survey apps. I'm asking the user to spend a "budget" for a set of features for a new Star Destroyer model. The total must equal 100. First, the HTML.

<pre><code class="language-markup">&lt;form id=&quot;app&quot; @submit=&quot;checkForm&quot; action=&quot;/something&quot; method=&quot;post&quot; novalidate=&quot;true&quot;&gt;
  
  &lt;p v-if=&quot;errors.length&quot;&gt;
    &lt;b&gt;Please correct the following error(s):&lt;/b&gt;
    &lt;ul&gt;
      &lt;li v-for=&quot;error in errors&quot;&gt;{% raw %}{{ error }}{% endraw %}&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/p&gt;

  &lt;p&gt;
    Given a budget of 100 dollars, indicate how much
    you would spend on the following features for the
    next generation Star Destroyer:
  &lt;/p&gt;

  &lt;p&gt;
    &lt;input type=&quot;number&quot; name=&quot;weapons&quot; v-model.number=&quot;weapons&quot;&gt; Weapons &lt;br/&gt;
    &lt;input type=&quot;number&quot; name=&quot;shields&quot; v-model.number=&quot;shields&quot;&gt; Shields &lt;br/&gt;
    &lt;input type=&quot;number&quot; name=&quot;coffee&quot; v-model.number=&quot;coffee&quot;&gt; Coffee &lt;br/&gt;
    &lt;input type=&quot;number&quot; name=&quot;ac&quot; v-model.number=&quot;ac&quot;&gt; Air Conditioning &lt;br/&gt;
    &lt;input type=&quot;number&quot; name=&quot;mousedroids&quot; v-model.number=&quot;mousedroids&quot;&gt; Mouse Droids &lt;br/&gt;
  &lt;/p&gt;

  &lt;p&gt;
    Current Total: {% raw %}{{total}}{% endraw %}
  &lt;/p&gt;

  &lt;p&gt;
  &lt;input type=&quot;submit&quot; value=&quot;Submit&quot;&gt;  
  &lt;/p&gt;

&lt;/form&gt;
</code></pre>

Note the set of inputs covering the five different features. Note the addition of `.number` to the `v-model` attibute. This tells Vue to cast the value to a number when you use it. *However*, there is a bug (imo) with this feature such that when the value is blank, it turns back into a string. You'll see my workaround below. To make it a bit easier for the user, I also added a current total right below so they can see, in real time, what their total is. Now let's look at the JavaScript.

<pre><code class="language-javascript">const app = new Vue({
  el:'#app',
  data:{
    errors:[],
    weapons:0,
    shields:0,
    coffee:0,
    ac:0,
    mousedroids:0
  },
  computed:{
     total:function() {
       //must parse cuz Vue turns empty value to string
       return Number(this.weapons)+
         Number(this.shields)+
         Number(this.coffee)+
         Number(this.ac+this.mousedroids);
     }
  },
  methods:{
    checkForm:function(e) {
      this.errors = [];
      if(this.total != 100) this.errors.push(&quot;Total must be 100!&quot;);
      if(!this.errors.length) return true;
      e.preventDefault();
    }
  }
})
</code></pre>

I set up the `total` value as a computed value, and outside of that bug I ran into, it was simple enough to setup. My `checkForm` method now just needs to see if the total is 100 and that's it. You can play with this here:

<p data-height="265" data-theme-id="0" data-slug-hash="vWqGoy" data-default-tab="html,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 3" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/vWqGoy/">form validation 3</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Fourth Example - Server-side validation
---

In my final examlpe, I built something that made use of Ajax to validate at the server. My form will ask you to name a new product and I want to ensure that the name is unique. I wrote a quick OpenWhisk serverless action to do the validation. While it isn't terribly important, here is the logic:

<pre><code class="language-javascript">function main(args) {

    return new Promise((resolve, reject) => {

        // bad product names: vista,empire,mbp
        let badNames = ['vista','empire','mbp'];
        if(badNames.includes(args.name)) reject({% raw %}{error:'Existing product'}{% endraw %});
        resolve({% raw %}{status:'ok'}{% endraw %});

    });

}
</code></pre>

Basically any name but "vista", "empire", and "mbp" are acceptable. Ok, so let's look at the form.

<pre><code class="language-markup">&lt;form id=&quot;app&quot; @submit=&quot;checkForm&quot; method=&quot;post&quot;&gt;
  
  &lt;p v-if=&quot;errors.length&quot;&gt;
    &lt;b&gt;Please correct the following error(s):&lt;/b&gt;
    &lt;ul&gt;
      &lt;li v-for=&quot;error in errors&quot;&gt;{% raw %}{{ error }}{% endraw %}&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/p&gt;

  &lt;p&gt;
  &lt;label for=&quot;name&quot;&gt;New Product Name: &lt;/label&gt;
  &lt;input type=&quot;text&quot; name=&quot;name&quot; id=&quot;name&quot; v-model=&quot;name&quot;&gt;
  &lt;/p&gt;

  &lt;p&gt;
  &lt;input type=&quot;submit&quot; value=&quot;Submit&quot;&gt;  
  &lt;/p&gt;

&lt;/form&gt;
</code></pre>

There isn't anything special here. So let's go on to the JavaScript.

<pre><code class="language-javascript">const apiUrl = 'https://openwhisk.ng.bluemix.net/api/v1/web/rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space/safeToDelete/productName.json?name=';

const app = new Vue({
  el:'#app',
  data:{
    errors:[],
    name:''
  },
  methods:{
    checkForm:function(e) {
      e.preventDefault();
      this.errors = [];
      if(this.name === '') {
        this.errors.push(&quot;Product name is required.&quot;);
      } else {
        fetch(apiUrl+encodeURIComponent(this.name))
        .then(res =&gt; res.json())
        .then(res =&gt; {
          if(res.error) {
            this.errors.push(res.error);
          } else {
            // redirect to a new url, or do something on success
            alert('ok!');
          }
        });
      }
    }
  }
})
</code></pre>

I start off with a variable representing the URL of the API I have running on OpenWhisk. Now look at `checkForm`. In this version, I *always* prevent the form from submitting (which, by the way, I just remembered I could do in the HTML with Vue as well). You can see a basic check on `this.name` being empty, and then I hit the API. If it's bad, I add an error as before. If it's good, right now I do nothing (just an alert), but you could navigate the user to a new page with the product name in the URL, or do other actions as well. You can run this demo below:

<p data-height="265" data-theme-id="0" data-slug-hash="BmgzeM" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="form validation 4" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/BmgzeM/">form validation 4</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Wrap Up
---

As always, remmeber I'm still learning, and I'm sure there are a multitude of different ways of doing what I've shown above. I'm sure there are whole libraries of Vue components you can import and go to town with. But I hope these examples are interesting and if you're still considering whether or not you want to learn Vue, they may help.