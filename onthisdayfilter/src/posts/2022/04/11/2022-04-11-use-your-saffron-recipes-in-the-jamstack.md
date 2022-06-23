---
layout: post
title: "Use Your Saffron Recipes in the Jamstack"
date: "2022-04-11T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/baking.jpg
permalink: /2022/04/11/use-your-saffron-recipes-in-the-jamstack.html
description: How to use your Saffron recipes in a jamstack site.
---

Like a lot of people, I took up baking during the pandemic. This was particularly difficult for me as I have a lot of anxiety when it comes to new things. I tend to stress over ensuring I get everything perfect and my worry about cooking is that if I do one thing wrong, I'll ruin it. While I'm not over that particular anxiety, I have had the chance to try making many things and while I'm not that good at it, I enjoy it, and can make some delicious items at times. 

To help keep track of what I like to make, I initially used Evernote, but then discovered [Saffron](https://www.mysaffronapp.com). Saffron is a web/mobile app utility for importing and organizing recipes. When it comes to importing, Saffron is near magical. You can point it at the typical recipe online full of useless junk and backstory and it will masterfully parse it down to the essentials. While I don't want to oversell it as perfect, I think I've had to do manual edits maybe one in ten times. You can manually enter your own recipes too of course and it's just an overall great service. It has a free tier that stores 25 recipes and while I'm not quite at that max yet, I plan on subscribing later today to the paid plan. It's that dang good and I want to support it. 

While thinking about an entirely different blog post I want to do about the Jamstack and recipes, I decided to take a quick peak to see if Saffron would let me export my data. Not surprisingly, it did, and made it painless. Upon exporting your data, you get a zip of text files, one per recipe. An example looks like so:

```txt
Title: Cinnamon Raisin Bread
Description: 
Source: 
Original URL: 
Yield: 
Cookbook: Breads
Section: Main
Image: 
Ingredients: 
	3 cups of flour
	1.25 tsp yeast
	2 tsp salt
	1.5 cups of hot water, not boiling.
	2 cup of raisins
	1/2 cup of cinnamon
Instructions: 
	Soak the raisins in hot water for a minute or two and then drain.
	Add flour, yeast, raisins, cinnamon, and salt to a bowl. Stirred it a bit. Add the water. Keep stirring. It will begin to harden and get sticky, stringy. 
	Cover the bowl in plastic wrap. Leave on counter for three hours.It will be bubbly on top. Put it on a well floured surface. Transfer it onto the surface. Add some more flour on top. Use a plastic plate like a scraper to play it into a ball. 
	Put parchment paper in a bowl, and the dough then goes on top. Put a towel on top. This needs to wait for 30 minutes. 
	Put dutch oven in oven. Preheat oven to 450. 
	Lift up the parchment paper and put whole thing in dutch oven. Put the lid back on. Put it all back in the oven.
	Bake for 30 mins. 
	Take out of oven, take bread with parchment paper by itself and put it in the oven for 15 minutes.
	When you take it out, cover it with butter and sea salt.
```

As you can see, it's using a format where each part of the recipe begins with a field name, followed by a colon, and then the value. Multiline values are tabbed over. 

Now, if I were going to stop using Saffron, I'd write a Node script to parse these files and rewrite them into a Markdown file with YAML front matter. But I don't have any plans on quitting Saffron so I decided to take a stab at a solution that would work with the files as is. Here's how I did it. As usual, my solution is using [Eleventy](https://www.11ty.dev), but you can adapt this to any static site generator.

## Step One - Support .txt Files

Eleventy doesn't support `.txt` files out of the box, but it's relatively easy to add it by using the [custom template](https://www.11ty.dev/docs/languages/custom/) feature. In my `.eleventy.js` I did it like so:

```js
eleventyConfig.addTemplateFormats('txt');

eleventyConfig.addExtension('txt', {
	compile: async (input) => {
		return async (data) => {
			return input;
		}
	}
});
```

The first function, `addTemplateFormats`, tells Eleventy to start processing `.txt`, and the `addExtension` block configures how it will be support. The `compile` function is passed the file input and will need to parse it and reformat it, but for now, all I do is return it as is. 

This is enough to get Eleventy to start using the recipe files, but I also added a JSON file in the directory to specify a layout and tag:

```json
{
	"layout":"recipe",
	"tags":"recipes"
}
```

Once this is done, you can see the files being parsed into HTML:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/saff1.jpg" alt="File tree of compiled recipes" class="lazyload imgborder imgcenter">
</p>

Of course, the result isn't pretty, it's just a block of text. To really start displaying the recipes correctly, we need to parse those files

## Step Two - Parse the Recipe

Before I started the next part, I opened up the [RunJS](https://runjs.app/) app. RunJS is a great way to quickly write code for testing things out, and as far as Eleventy is, I knew working in RunJS would be much better. While probably not the best function in the world, here's how I parsed my recipe text files:

```js
function parseRecipe(txt) {
	let result = {};
	let lastKey = '';

	lines = txt.split('\n');

	for(let i=0;i<lines.length;i++) {
		//if the line starts with a tab, its a continutation
		if(lines[i].indexOf('\t') === 0) {		
			result[lastKey] += lines[i].replace('\t', '') + '\n';
		} else {
			let key = lines[i].split(':')[0];
			let rest = lines[i].replace(`${key}: `,'');
			result[key] = rest;
			lastKey = key;
		}
	}
	return result;
}
```

This returns an object of keys and values, and correctly handles the multiline values for ingredients and instructions. 

With this done, I then used another feature of Eleventy's custom template support, the ability to set data. This is done by adding a `getData` key inside the `addExtension` call:

```js
getData: async function(inputPath) {
	let recipe = parseRecipe(fs.readFileSync(inputPath, 'utf8'));
	// lowercase keys and remove spaces
	for(let key of Object.keys(recipe)) recipe[key.toLowerCase().replace(/ /g,'')] = recipe[key];
	return recipe;
}
```

For the most part this just chains to the utility function I wrote, but I do a bit of manipulation of the keys to make them more 'code friendly', namely lowercasing them and removing spaces. And believe it or not, that was basically it! My recipes were using a `recipe.liquid` layout, so I went there next:

```html
{% raw %}---
layout: main
---

<h3>{{ title }}</h3> 

{% if description %}
<p class="recipeDescription">
{{ description }}
</p>
{% endif %}

{% if source %}
	<p class="recipeSource">
	<strong>Source:</strong> 
	{% if originalurl %}
	<a href="{{ originalurl }}">{{ source }}</a>
	{% else %}
	{{ source }}
	{% endif %}
	</p>
{% endif %}

<p class="recipeIngredients">
<strong>Ingredients:</strong><br/>
{{ ingredients | recipeText }}
</p>

<p class="recipeInstructions">
<strong>Instructions:</strong><br/>
{{ instructions | recipeText }}
</p>{% endraw %}
```

I basically go through the various keys of my recipe and output them in an order that makes sense, well, to me anyway. I also wrote a quick filter to handle the multiline values:

```js
eleventyConfig.addFilter("recipeText", (content) => {
	return content.replace(/\n/g, '<p/>');
});
```

That isn't the most elegant solution, but it works. Note that my template does *not* make use of all the data from the Saffron export, but that could be done later. Also note I never make use of the actual contents. *In theory*, I could parse the recipe in `compile` and return the instructions as my content, but I was fine ignoring the contents. I reserve the right to rethink that later, but for now, it's working:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/04/saff2.jpg" alt="Example Recipe" class="lazyload imgborder imgcenter">
</p>

And that's it! Honestly I was *incredibly* impressed by how Eleventy supported custom template formats, especially with the `getData` feature as it made it so easy to use my content in my templates. Also, the whole reason for this post is that I've got another idea related to the cooking and the Jamstack and I needed some sample content to play with. You can find the complete source code for this demo here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/saffron>

Photo by <a href="https://unsplash.com/@themephotos?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Theme Photos</a> on <a href="https://unsplash.com/s/photos/baking?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  