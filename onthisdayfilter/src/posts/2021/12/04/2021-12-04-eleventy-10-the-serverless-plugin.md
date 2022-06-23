---
layout: post
title: "Eleventy 1.0 - The Serverless Plugin"
date: "2021-12-04T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/allthewayto11.jpg
permalink: /2021/12/04/eleventy-10-the-serverless-plugin.html
description: A look at the new Eleventy Serverless plugin
---

As Eleventy moves towards a final 1.0 release, I thought I'd try to (finally) wrap my head around one of the biggest new features, the [Serverless plugin](https://www.11ty.dev/docs/plugins/serverless/). I say finally because this new feature has been out in beta form for a while now and I've *really* struggled with trying to wrap my head around it. This isn't to say that the feature is difficult or the docs are bad, but I just didn't get it. After multiple attempts at trying to figure out how it works, reading blog posts, and building my own demos, I *think* I've got a handle on it.

As with most things I do on this blog, when I struggle with something, I try to write it down and share it with others to help them avoid the troubles I had. I'd take what follows as my "initial impression" of the feature and please know I may not be getting things exactly right. I welcome any feedback about the following so let me know if I've done something wrong or anything isn't quite clear. 

Ok, with that out of the way, let's start by describing a situation where Eleventy Serverless could help out!

<p>
<img data-src="https://static.raymondcamden.com/images/2021/12/readycat.jpg" alt="Cat with I'm Ready text" class="lazyload imgborder imgcenter">
</p>

When it comes to sites that are statically generated, the typical way to add dynamic information is with client-side scripting. The page will load for the user, and sometime soon(ish), hopefully, JavaScript will figure out what it needs to figure out. This may be done entirely by itself, or JavaScript may be used to make a network request to an API. 

All in all this works fine typically, but there may be multiple reasons why you don't want to use client-side JavaScript. Perhaps you want to ensure that lower-end browser clients don't struggle with performance. Maybe you want to avoid the page displaying with empty blocks of content while the data is being loaded. 

Imagine you've built a service to report the current weather for a location. Your initial implementation was a serverless function that took in a location parameter and returned weather information:

```json
{
	"forecast":"Hot, because of course it's hot in December because Louisiana is next door to the sun."
}
```

This imaginary API could live at: `/api/weather`. Your front end code does something like so:

```js
let weather = await (await fetch(`/api/weather/?location=${loc}`)).json();
document.querySelector('#forecast').innerHTML = weather.forecast
```

This works, but as I said above, you may decide to move to a non-client-side JavaScript solution. How would you do that?

Well remember that APIs do not have to return JSON. They can, if you want, return just a plain string, including HTML. Imagine now we've changed that API to return this:

```html
"<p>Hot, because of course it's hot in December because Louisiana is next door to the sun.</p>"
```

Cool! Now you can simply use a regular HTML link to `/api/weather` and the browser will render the HTML with no client-side coding. Except... you've now lost your site's layout! You literally only returned that paragraph of text and nothing more. You can, of course, add more HTML to the result. But then you realize, you're using Eleventy (or another generator) and it handles things like layouts, includes, etc. You don't have a simple HTML file you could copy and paste HTML from. 

This is where Eleventy Serverless comes in. It basically lets you create a mapping to a dynamic resource that when generated, runs Eleventy on the fly. What do I mean? Normaly Eleventy only runs when your site is built. It does all of it's magic of generating pages, incorporating your data files, pagination, and so forth. But once it's done, it's done. That's kind of the point.

Eleventy serverless lets you say, "Hey, on the fly I need you to run a template for me, do all my normaly stuff like layouts and so forth, but just for this request." You can also use Netlify On Demand Builders such that Eleventy will only run once for a particular request, not every time. Which you use depends on your needs.

So how do you do it?

### Step 1: Add the Plugin

First, what follows is mostly from [the docs](https://www.11ty.dev/docs/plugins/serverless/), but simplified a bit. I began by adding the Serverless plugin to my Eleventy site and giving it a name:

```js
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "serverless", 
    functionsDir: "./netlify/functions/"
  });

};
```

There's a lot of options you can specify, but at minimum here I've given a name to my plugin based on my use case. From what I can tell, the name here does *not* need to match your intended use case, but rather the *type* of serverless response your going to use, by that I mean either responding dynamically to each request or using the On Demand run once support. The docs suggest calling it "serverless" if you aren't sure. Basically, even if you have two intended use cases (getting the weather and producing a picture of a cat), you only need one instance of the plugin. That *really* confused me at first. The docs use "possum" as an example which makes you think you should potentially name it after your use (like "weather"), but that's not what you need.

### Step 2: Handle the Generated Files

The previous step will cause Eleventy to generate a serverless function named, well serverless. It's going to put a lot of stuff in there that you should not need to touch. The next step in the docs tells you explicitly to add this to `.gitignore`:

```
netlify/functions/serverless/**
!netlify/functions/serverless/index.js
```

Basically, don't commit it to your repo, except for the index.js file, and let Eleventy manage it.

### Step 3: Add a Template to Handle Requests

Now for the interesting part. We need to add a template, a regular Eleventy template, that will be a serverless template. Let's start simple:

```html
---
layout: main
permalink:
    serverless: /weather/:loc
---
{% raw %}
Test: {{ eleventy.serverless | json }}
{% endraw %}
```

In the front matter, layout will work as expected. It's going to find my template and wrap my result. The crucial bit is `permalink`. By using an object, and not a string, Eleventy maps the serverless plugin to the path `/weather/:loc`, basically `/weather/ANYTHING`. How does it do this? It does it by automatically updating `netlify.toml` for me. I can see it here:

```
[[redirects]]
from = "/weather/:loc"
to = "/.netlify/functions/serverless"
status = 200
force = true
_generated_by_eleventy_serverless = "serverless"
```

To be clear, I didn't have to do this, the CLI handled it for me. When a request comes in for `/weather/something`, Eleventy will execute the generated serverless function which runs Eleventy just for my matching template. It provides data to the template in the `eleventy.serverless` object. This contains two things you may care about: `query` and `path`. 

If I go to `/weather/foo`, I see:

```
Test: {"query":{},"path":{"loc":"foo"}}
```

If I go to `/weather/foo?x=1`, I see:

```
Test: {"query":{"x":"1"},"path":{"loc":"foo"}}
```

If I go to `/weather/`, I see:

```
Test: {"query":{},"path":{"loc":"index.html"}}
```

As you can imagine, that's something I probably want to handle with an error message or some such.

But again - Eleventy is handling pretty much everything for me. I can change my template and this weather page will correctly show the right UI. 

### Step 4: Actually Do the Dynamic Bit

So far we've added support for Eleventy Serverless by adding the plugin. We've created a template that's handled, via redirectd and serverless functions, on the fly for every request. But we haven't actually added the thing we wanted to - getting the weather. 

At first I thought I'd edit the serverless function created by Eleventy, but that's not what you're supposed to do. That serverless function is really just the "for this request, let me run Eleventy to handle the template, layout, etc." 

Instead, you can either do your logic in the template itself, probably via an Eleventy filter. I created one in my `.eleventy.js` that handles the weather logic:

```js
eleventyConfig.addFilter("getWeather", function(input) {
	return "It's hot in  " + input;
})
```

Normally this would call an API or do something else, and don't forget you can put complex logic in it's own files and `require()` them inside your `.eleventy.js`. I then modified my template to make use of it:

```html
---
layout: main
permalink:
    serverless: /weather/:loc
---

{% raw %}Test: {{ eleventy.serverless | json }}

<p/>

{% if eleventy.serverless.path.loc %}

	The weather for {{ eleventy.serverless.path.loc }} : {{ eleventy.serverless.path.loc | getWeather }} 

{% endif %}
{% endraw %}
```

The template uses logic now to see if a path value exists (and should also do something if it doesn't). If it does, I display the path value as well as the result of passing it to the filter. As the [Eleventy Serverless](https://www.11ty.dev/docs/plugins/serverless/) docs mention, if you're going to output user-defined input, you *really** should escape it, but I'm keeping things relatively simple here for the demo. 

The final bit I did was create a home page that links to this:

```html
---
layout: main
---

This is my test. Check out the weather for <a href="/weather/foo">foo</a>
and <a href="/weather/goo">goo</a>.
```

You can demo this here: <https://serverlesstest1.netlify.app/>

### Recap

Let me repeat everything I said above just to summarize:

* Eleventy Serverless is a way to have dynamic pages in production
* It lets you reuse your site's templates, layouts, and more, in response to a specific request
* Eleventy will generate all the back end code for you, you handle making a template
* Eleventy provides query and path information to your template to make use of

There's definitely more than I covered so read the [docs](https://www.11ty.dev/docs/plugins/serverless/) carefully. Also see the other blog posts:

* [Creating a dynamic color converter with 11ty Serverless](https://bryanlrobinson.com/blog/creating-a-dynamic-color-converter-with-11ty-serverless/)
* [Building server-rendered search for static sites with 11ty Serverless, Netlify, and Algolia](https://www.algolia.com/blog/engineering/building-server-rendered-search-for-static-sites-with-11ty-serverless-netlify-and-algolia/)
* [Building A Static-First MadLib Generator With Portable Text And Netlify On-Demand Builder Functions](https://www.smashingmagazine.com/2021/10/static-first-madlib-generator-portable-text-netlify-builder-functions/)

If you want to see my code, you can find it at my repo here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/eleventyServerlessTest1>

I hope to have more, and perhaps more real-world, examples of this soon.