---
layout: post
title: "Building a Web App Powered by Google Forms and Sheets"
date: "2020-11-20"
categories: ["JavaScript"]
tags: ["vuejs"]
banner_image: /images/banners/cat-tongue.jpg
permalink: /2020/11/20/building-a-web-app-powered-by-google-forms-and-sheets
description: How I used Google Forms and Sheets to build a client-side application.
---

This past week I've been working on a project that had an interesting requirement. We needed a way for the public to submit information and then we needed to display that information, once curated, in a web application. This is a fairly typical web application and something I've been doing for nearly twenty years now. But what we were curious about was whether or not this could be done without using any kind of server-side processing. We ended up going a different way for the project, but not before I had built out a fully working process using Google Forms and Sheets. How did it work?

I began by building a [Google Form](https://forms.google.com). I've used their form builder before and I knew it "just worked", but I got to say I was blown away by how incredibly easy it was to use. It's got many different options for how to build your form, but what impressed me the most was how it intelligently parsed your questions. For an example, if you asked a question that seemed like it would need a yes or no answer, Google would default the type to a multiple choice and suggest both Yes and No and answers. If you picked Yes to add it as an option, it would then present No as the next suggestion. Time and time again it would guess right based on my questions which made working with it easy. 

Google lets you direct form answers to a Google Sheet. And here's where things got cool. Your form answers can be put in a sheet that is modified to have additional columns. This is how we did our curation. Since I knew I was going to be driving a web application with the data, I didn't want spammers to attack the form. By adding a simple "Approved" column to the sheet, I was able to write my code such that only approved rows of data would be rendered. It would still be possible for a person to discover the original data and see spam, but only if they went looking for it. 

Let's check out a demo of this in action. First, I built a form:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/11/forma1.jpg" alt="Three question form" class="lazyload imgborder imgcenter">
</p>

My form has three questions, all required. Obviously you can have more, have optional questions, and so forth. You can view this form here: <https://docs.google.com/forms/d/e/1FAIpQLSfYL868eNC-iWLVI50EvsPHtIVwfCIReMrBkbkZGiL_xd81sA/viewform>

I set up the form to save to a Google Sheet (that isn't the default), and then once in the sheet, I added a new column, Approved. I set it to be a checkbox so it was quick to use:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/11/form2.jpg" alt="Spreedsheet" class="lazyload imgborder imgcenter">
</p>

Notice that Google has also added a timestamp. I don't need that but it's handy information. Now for the fun part. My sheet is only editable by me, but the public has the ability to store data in it via the form. But only I can edit the additional columns. 

I then published my sheet to the web. As I said above, this is where spam can come into play, but as I said, it's only going to be visible by curious web developers who look at my code and open up the sheet directly. You can see this yourself here: <https://docs.google.com/spreadsheets/d/e/2PACX-1vQLVvd7h1zohI2GTCI4GPEVNEn_9t9qqtW-YJK4FKgv7p98d1PkLuMyAawF_uoLYulyzcqmJ301BDlF/pubhtml>. 

So how do I get this into a web app? You can modify the URL to output both CSV and JSON. I'm going to use CSV since there is a great library for it, [Papa Pare](https://www.papaparse.com/). To get the CSV output, you change the URL to this: <https://docs.google.com/spreadsheets/d/e/2PACX-1vQLVvd7h1zohI2GTCI4GPEVNEn_9t9qqtW-YJK4FKgv7p98d1PkLuMyAawF_uoLYulyzcqmJ301BDlF/pub?output=csv> If you open that URL your browser should download the raw CSV. 

**Edit:** Note that enabling remote access takes one step. When you publish to the web, it defaults to web. If you switch to CSV, you actually get the link shared above, but it does *not* work for anonymous requests, the user has to sign in. I also needed to get a shareable link, viewer only. The link did not need to be used and the URL itself isn't important. I shared the document that way too, opened it at least once, and then went back to to test my CSV link. At that point it worked. Long story short, you need to do both, and confirm your link works in an incognito browser before you try to use it in JavaScript.

So how do I use it in a web app?

I began by building a simple Vue.js application. I didn't have to use Vue but I had to use Vue, know what I mean? I started off with a simple layout:

```html
<div id="app" v-cloak>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Gender</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
{% raw %}
      <tr v-for="cat in cats">
        <td>{{cat.name}}</td>
        <td>{{cat.gender}}</td>
        <td>{{cat.age}}</td>
      </tr>
{% endraw %}    
	</tbody>
  </table>
  <div v-if="loadingCats">Loading cats - please stand by...</div>
  <div v-else>Add your cat <a :href="formURL" target="_new">here</a></div>
</div>
```

I've got a table to iterate over my awesome cats. Beneath that, I either show a loading message, or provide a link for folks to add their own cats. Now the JavaScript:

```js
Vue.config.productionTip = false;
Vue.config.devtools = false;

const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSfYL868eNC-iWLVI50EvsPHtIVwfCIReMrBkbkZGiL_xd81sA/viewform?usp=sf_link';

const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLVvd7h1zohI2GTCI4GPEVNEn_9t9qqtW-YJK4FKgv7p98d1PkLuMyAawF_uoLYulyzcqmJ301BDlF/pub?output=csv';

const app = new Vue({
  el:'#app',
  data:{
    cats:[],
    loadingCats:true,
	formURL:formURL
  },
  created() {
    
   Papa.parse(sheetURL, {
       download:true,
       header:true,
       skipEmptyLines:'greedy',
       transformHeader: name => {
         switch(name) {
           case 'Approved': { return 'approved'; break; }
           case 'How old is your cat?': { return 'age'; break; }
           case 'What is your cat\'s name?': { return 'name'; break; }
           case 'What is your cat\'s gender?': { return 'gender'; break; }
         }
       },
       complete:res => {
         this.cats = res.data.filter(f => {
           return f.approved === 'TRUE';
         });
         this.loadingCats = false;
       }
   })
  }
})
```

If you don't use Vue.js, don't worry, lets just focus on the `Papa.parse` section. I pass it the following options:

* First, the URL of my Google Sheet.
* Next I use the `download` flag to tell Papa Parse to retrieve the contents.
* The `header` option means to treat the first row as a header.
* When you use `greedy`, Papa Parse tries to remove lines from the sheet that are just empty strings. This actually didn't work for me because my "Approved" column set defaults to False all the way through the entire sheet. I fix that later.
* By default, Papa Parse will create an array of objects for each row of data where the properties of each object are based on the headers. Since my headers are short text sentences, I wanted to remap them to nicer shorter values, that's where `transformHeader` comes in.
* The `complete` handler does two things for me. First it handles filtering out cats I haven't approved yet, and it also handles removing all the empty rows that are empty *except* for the FALSE value in Approved.

And that's it. Now you can load the application and see the table, all driven by user content without any server-side code:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/11/form3.jpg" alt="Table of cats" class="lazyload imgborder imgcenter">
</p>

You can see the complete code below:

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="zYBVWLY" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form + Sheet Demo">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/zYBVWLY">
  Form + Sheet Demo</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Let me know what you think by leaving a comment below, and if you've used something like this before, I'd love to hear how!

<span>Photo by <a href="https://unsplash.com/@crismiron?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Miron Cristina</a> on <a href="https://unsplash.com/s/photos/form-cat?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>