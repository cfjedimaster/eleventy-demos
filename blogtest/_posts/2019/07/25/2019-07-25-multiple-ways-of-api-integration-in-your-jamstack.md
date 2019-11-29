---
layout: post
title: "Multiple Ways of API Integration in your JAMStack"
date: "2019-07-25"
categories: ["development","static sites"]
tags: []
banner_image: /images/banners/maze.jpg
permalink: /2019/07/25/multiple-ways-of-api-integration-in-your-jamstack
description: A look at different options for adding dynamic data to your static site
---

This is something I've been kicking around in my head now for a few weeks and I'm finally
taking the time to write it down. I've actually covered this before, but not in an explicit
manner and I wanted to organize some thoughts I've been having on the matter lately. Before I begin though, a quick note. I was a somewhat late adopter of the ["JAMStack"](https://jamstack.org/) moniker. Frankly, the name bugged me. Why not just call them what they are - static sites? But as static sites have become more powerful (thanks to various generators, APIs, and platforms like [Netlify](https://netlify.com)), the term "static sites" simply doesn't fit anymore. When you say "static", especially to a client who may have a tiny bit of technical knowledge, you imply a whole set of limitations that simply don't apply now. "JAMStack" (JavaScript, APIs, and Markup) doesn't have those connotations and really helps frame what we're talking about a lot better. 

Alright, so with that out of the way, what exactly am I talking about today? When adding interactivity to a JAMStack site, typically you think of APIs, remote services that can be used to get dynamic data which is then rendered on your site with JavaScript. But there's multiple ways of using those APIs, and JavaScript, that may not be apparent to you at first. In this post I'm going to go over these options and discuss when you may want to use one form over the other. I'm going to be using Netlify as my example host, but everything I'm discussing here would apply to (most) other hosts as well. I've not hidden my obvious love of Netlify so I'm somewhat biased, but again, these principles will be applicable elsewhere.

## Option One - Direct Access to a Remote API

The most direct and simplest way to work with an API on your JAMStack site is directly accessing it from your JavaScript. In this form, you simply make a HTTP request to the resource and render it. Here's a quick one pager using Vue.js and the [Star Wars API](https://swapi.co/):

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<script src="https://vuejs.org/js/vue.min.js"></script>
	<title>SWAPI Example</title>
</head>
<body>

<div id="app">
	<h1>Star Wars Films</h1>
	<ul>
		<li v-for="film in films">{{film.title}}</li>
	</ul>
</div>

<script>
const app = new Vue({
	el:'#app',
	data: {
		films:[]
	},
	created() {
		fetch('https://swapi.co/api/films')
		.then(res => res.json())
		.then(res => {
			this.films = res.results;
		});
	}
});

</script>

</body>
</html>
```

You can view this live at <https://jamstackapiapproaches.netlify.com/test1.html>.

Nice and simple, right? However it has a few drawbacks.

* First, it assumes the remote API enables CORS, which allows your domain to directly access its domain. Many APIs allow this, but not all.
* Secondly, it assumes anonymous access. This is actually *not* the norm as typically an API requires some kind of identifier. Sometimes this isn't a big deal. The API has a generous free tier and is not likely to be abused. But as soon as you put an API key into your code, anyone who can view source can then take that key and use it themselves. Some APIs will let you lock down what domains can use that key, and in that case, you're pretty safe. But you absolutely want to keep that in mind.
* Finally, you are tied to working with data from the API in only the form it provides. That may not sound like a big deal, but what if the API returned a *lot* of data you don't need? You're putting that burden on the user which means (potentially) a slower web site and a (again, potentially) frustrating experience. This is where GraphQL really shines as it lets you specify exactly what data you need. 

All in all though this is the simplest and quickest way to add dynamic content to your JAMStack.

## Option Two - An API Proxy

The second option is pretty similar to the first, with the main difference being that your code hits an API running on *your* server. The "server" could be just that, an app server running somewhere in house, but typically will be a serverless platform instead. Basically, instead of your code making an HTTP request to some remote domain, it requests your code which then itself requests data from the remote domain.

Consider this example using the [Weather API](https://developer.here.com/documentation/weather/topics/overview.html) from HERE. (A cool company I'll be blogging about more later.) Their API requires two specific authentication values, an `app_id` and `app_code`. If I put that in my client-side code, anyone could use it, which wouldn't be desirable. I'm going to use a serverless proxy set up with [Netlify Functions](https://www.netlify.com/docs/functions/) to proxy requests to HERE's API from my client side code. 

```js
/* eslint-disable */
const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    let app_id = process.env.HERE_APP_ID;
    let app_code = process.env.HERE_APP_CODE;

    const response = await fetch(`https://weather.api.here.com/weather/1.0/report.json?app_id=${app_id}&app_code=${app_code}&product=forecast_astronomy&name=Lafayette,LA`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    let results = data.astronomy.astronomy.map(r => {
      return {
        moonRise:r.moonrise,
        moonSet:r.moonset,
        moonPhase:r.moonPhase,
        moonPhaseDesc:r.moonPhaseDesc,
        time:r.utcTime
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ data:results })
    };
  } catch (err) {
    console.log(err); 
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) 
    };
  }
};
```

In general this is just some trivial Node code, but I want to point out some specific tweaks I did here. First, HERE's weather API supports returning astronomy data. For my demo I want to know about the moon, so you can see me filtering that out in the `map` call. This will result in less data going to be my client-side code. Also note that the API has slightly different casing going on. So for `moonrise` it's all lowercase, but then they use `moonPhase`. There may be a good reason for that, but to me it wasn't what I expected so I took the opportunity to reformat the data a bit as well. 

Once this was in place, I could then use it with some more Vue.js code. (To be clear, you don't have to use Vue, but I recommend it. ;)

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<script src="https://vuejs.org/js/vue.min.js"></script>
	<title>Moon Data</title>
</head>
<body>

<div id="app">
	<h1>Moon Data for Lafayette, LA</h1>
	<ul>
		<li v-for="result in results">
			On {% raw %}{{result.time | formatDate}}{% endraw %}, the moon will rise at {% raw %}{{result.moonRise}}{% endraw %} and set at {% raw %}{{result.moonSet}}{% endraw %}. 
			It is in {% raw %}{{result.moonPhaseDesc}}{% endraw %}. 
		</li>
	</ul>
</div>

<script>
Vue.filter('formatDate', function(d) {
	if(!window.Intl) return d;
	return new Intl.DateTimeFormat('en-US').format(new Date(d));
}); 

const app = new Vue({
	el:'#app',
	data: {
		results:[]
	},
	created() {
		fetch('/.netlify/functions/get-moon')
		.then(res => res.json())
		.then(res => {
			this.results = res.data;
		});
	}
});

</script>

</body>
</html>
```

You can view this here: <https://jamstackapiapproaches.netlify.com/test2.html>

So, this one is a bit more work, but depending on your app platform, it could be easy. As I said, I used Netlify Functions, and outside of a configuration issue I had (I'll be blogging on this soon), it was trivial. What does this give us?

* We have the ability to hide any required keys.
* We have the ability to shape the result. This could include removing data we don't need, changing data for our needs, or heck, we could even add data too if it would be useful to the client.
* We could even switch providers. If I need to use someone besides HERE for my data, I can change it at the server and the front-end code won't have to know. I'd just ensure the result data matches what I used before. 
* You could also add caching. Some API providers ask that you don't do this, but you could store data locally and only fetch when you need to. 
* The only real "drawback" I can see is that it's definitely a bit more work. To me this was rather easy, but I've got experience writing code on the server and working with serverless platforms. I don't want to minimize the fact that not having these skills would be a bit of a jump if your only JavaScript experience is in client-side code.

## Option Three - Using the Build Process

In the previous two options I described two methods that were - essentially - the same thing for the client: Hit an API (either remote or local) to get data. There's another option to consider as well. Depending on your needs, your data may need to be "dynamic" but not "very dynamic". What do I mean by that? Consider the landing page for the music newsletter I run with [Brian Rinaldi](https://remotesynthesis.com/) - [Coda Breaker](https://codabreaker.rocks/). The web page lists all the previous editions of the newsletter so folks can get an idea of what they're signing up for. We publish about twice a month so while the data is definitely dynamic, it rarely changes. 

Instead of building a serverless proxy to the API used to host the newsletters, we could use a build script on our site's platform. What do I mean by that? Imagine a simple script that hits an API and then saves the data in a flat file. 

```js
const fetch = require('node-fetch');
const fs = require('fs');

fetch('https://swapi.co/api/films')
.then(res => res.json())
.then(res => {
	let films = res.results.map(f => {
		return {
			title:f.title,
			director:f.director,
			releaseDate:f.release_date
		}	
	});

	let generatedHTML = '';
	films.forEach(f => {
		generatedHTML += `<li>${f.title} was released on ${f.releaseDate} and directed by ${f.director}.</li>`;
	});

	let contents = fs.readFileSync('./test3.html','utf8');
	contents = contents.replace('{% raw %}{{ filmData }}{% endraw %}', generatedHTML);

	fs.writeFileSync('./test3.final.html', contents);
	
});
```

This Node script fires off a HTTP request to the Star Wars API. It then turns the result into some HTML. Note that I'm wrapping films in a LI block. Once done, it reads in a source file, looks for a special token and replaces it with the HTML string, and then saves it. I use a different file name, but I could easily overwrite the source file to since this is on the deployed build. Here's `test3.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>SWAPI Example</title>
</head>
<body>

<div id="app">
	<h1>Star Wars Films</h1>
	<ul>
		{% raw %}{{ filmData }}{% endraw %}
	</ul>
</div>

</body>
</html>
```

The last bit is to tell my build server to run this when deploying my JAMStack site. Netlify lets you specify a build command which for my demo site, runs a command in my package.json file, `npm run build`. This is defined here:

```js
  "scripts": {
    "build": "node build && cd functions/get-moon && npm i"
  },
```

Ignore everything after the first `&&`, that's related to the serverless function, but the first part simply runs my little script that updates the flat file. You can see the result here: <https://jamstackapiapproaches.netlify.com/test3.final.html> With no JavaScript, it should work incredibly fast and be pretty darn resilient. My build script could definitely add error checking, fall back content, and more. 

Now whenever my site builds, the content is updated automatically. I could do this manually, or as I did with Coda Breaker, I set up a webhook back to Netlify to trigger a build when a new newsletter was released. So it's static... but dynamic. It's manual... but automated. I love that.

## Conclusion

I hope this really demonstrates the kinds of options you have when going static, sorry, I mean JAMStack. Certainly I didn't cover ever possible iteration of this and a site could make use of many of these. I'd love to hear your comments on what techniques you are using so please drop me a line below! If you want, you can browse the source code repo for my demo site here: <https://github.com/cfjedimaster/jamstack_api_approaches>.

<i>Header photo by <a href="https://unsplash.com/@benjaminjohnelliott?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Benjamin Elliott</a> on Unsplash</i>