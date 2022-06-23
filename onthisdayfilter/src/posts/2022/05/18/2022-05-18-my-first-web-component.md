---
layout: post
title: "My First Web Component"
date: "2022-05-18T18:00:00"
categories: ["development"]
tags: ["javascript","web components"]
banner_image: /images/banners/legos.jpg
permalink: /2022/05/18/my-first-web-component.html
description: My first time building a (very) simple web component.
---

As a technology, web components have been on my radar for quite some time. From what I can see, the first, or the one of the first mentions of this was way back in 2011, over a decade a ago. In that time, browsers, all of them actually, came around to supporting them (except for one holdout for a *part* of the specification, and you get one guess as to who the holdout is), so over the weekend I took a quick look at the technology to see how hard it would be to build a simple demo. I've got to say I was rather surprised. I've only scratched the surface of the technology, and I've got a good idea for a follow up post, but I thought I'd quickly share the simple example I built and my thoughts on working with the tech in general.

## What exactly is it?

At a high level, a web component lets you define a custom HTML element. So for example, I could do this:

```html
<h1>My Cats</h1>

<pet-cat name="Luna" age="11">
<pet-cat name="Elise" age="12">
<pet-cat name="Pig" age="9">
```

The definition of `pet-cat` comes externally and can consist of any regular HTML blocks. So the *practical* result of the above could be:

```html
<h1>My Cats</h1>

<div>
	<h2>Luna</h2>
	<p>
	This cat is 11 years old.
	</p>
</div>

<div>
	<h2>Elise</h2>
	<p>
	This cat is 12 years old.
	</p>
</div>

<div>
	<h2>Pig</h2>
	<p>
	This cat is 9 years old.
	</p>
</div>
```

These elements act just like regular HTML tags. You can even use JavaScript to create new instances of them and dynamically change their attributes. 

I highly suggest reading the MDN [reference](https://developer.mozilla.org/en-US/docs/Web/Web_Components) for Web Components as it goes into great detail, but the main building blocks consist of:

* The ability to define a custom element (`pet-cat` above) in JavaScript
* The Shadow DOM, which sounds really cool, but is basically a way of saying a document tree that is encapsulated inside itself and away from the rest of your document. I saw a great example of this and can't remember the source, but think of the `<video>` tag and how it has built in controls for working with videos. That's a DOM that's encapsulated within itself.
* And finally, HTML templates that are not rendered but used by the web component for layout. I actually did *not* touch this aspect for the demo I built, so it's not 100% necessary.

Web components come in two main flavors:

* Completely unique ones like the example I gave above.
* Components that modify existing tags, recognized via the `as` syntax: `<ul is="something-else">`. This is where we hit the issue with that one particular browser. Safari does not support this style, and as far as I know, never will. Who knows. To be honest, I find this style less appealing then the previous one so it doesn't bother me too much.

# Ok, but why?

Right away I can see that web components would be a great boon to UI libraries. I checked and while Bootstrap doesn't support it, it's on their radar. Having using [BootstrapVue](https://bootstrap-vue.org/), I can tell you the experience of using Bootstrap with components is *significantly* better than "regular" Bootstrap. As an example, here's a simple tabbed UI:

```html
<ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="#">First</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Second</a>
  </li>
  <li class="nav-item">
    <a class="nav-link disabled">Disabled</a>
  </li>
</ul>
<!-- tab content down here... -->
```

While not difficult, compare it to this:

```html
<b-tabs content-class="mt-3">
	<b-tab title="First" active><p>I'm the first tab</p></b-tab>
	<b-tab title="Second"><p>I'm the second tab</p></b-tab>
	<b-tab title="Disabled" disabled><p>I'm a disabled tab!</p></b-tab>
</b-tabs>
```

I can also see this being really useful inside an organization where consistent UI/UX/etc elements need to be built across a large site. Using web components would certainly make that simpler. 

With what I said above, I don't necessarily think it's going to be something every developer uses on ever little project, but that's ok. We've seen other JavaScript improvements that are more useful to library developers than day to day development. 

How about an example?

## Give me the kitty...

For my first test, I built a quick wrapper for [PlaceKitten](https://placekitten.com). I created a file, `cat.js`, and defined it as such:

```js
class PlaceCat extends HTMLElement {

    constructor() {

        super();

        const shadow = this.attachShadow({
            mode: 'open'
        });
		
        const wrapper = document.createElement('div');

		let width = 500;
		let height = 500;

		if(this.hasAttribute('width')) width = this.getAttribute('width');
		if(this.hasAttribute('height')) height = this.getAttribute('height');

		const img = document.createElement('img');
		img.setAttribute('src', `https://placekitten.com/${width}/${height}`);
		wrapper.appendChild(img);

        shadow.appendChild(wrapper);

	}

}

customElements.define('place-cat', PlaceCat);
```

I've got a class that extends a base `HTMLElement`. It must have a constructor that calls `super`. That `shadow` variable there defines an 'open' interface which means the parent could "reach" into the DOM if necessary. 

Next I have the logic for the component. Define a default width and height and override it if specified by the user. 

My DOM is a div tag with an image inside. When I'm done building it, I add it to my shadow I'm done.

At the end, make note of the `define` call. Web components **must** be kabab-case, ie `somegthing dash something`. 

In an HTML template, I just include it and use it:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title></title>
</head>
<style>
<body>


<place-cat></place-cat>
<place-cat width="200" height="200"></place-cat>


<script src="cat.js"></script>
</body>
</html>
```

Here's the result:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/wc1.jpg" alt="Two cats rendered by web components" class="lazyload imgborder imgcenter">
</p>

Surely the web gods intended components to be used for cats, right? If you open up devtools, you can see them just as any other element:

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/wc2.jpg" alt="Elements via of the web component." class="lazyload imgborder imgcenter">
</p>

If you want, you can view it online here: <https://cfjedimaster.github.io/webdemos/webcomponents/test1.html>

So that initial example was so trivial that it wouldn't work really well in a production environment. Specifically it would fail in one respect. If I used JavaScript to make a new instance of the element and then set the dimensions, it would fail:

```js
let cat = document.createElement('place-cat');
cat.setAttribute('width', 200);
cat.setAttribute('height', 400);

document.querySelector('body').appendChild(cat);
```

Why? Because a web component has to define what attributes it will "listen" to for changes, and has to have custom logic of some sort to implement those changes. Luckily this can be done two methods. First, we define the attributes we want to watch:

```js
static get observedAttributes() { return ['width','height']; }
```

And then we can use `attributeCHangedCallback` to handle those changes. It looks like so:

```js
attributeChangedCallback(name, oldValue, newValue) {
	// name is the attribute changing
	// old and new value represent the previous and new settings
}
```

I updated my cat element to make use of this:

```js
class PlaceCat extends HTMLElement {

	getURL() {
		return `https://placekitten.com/${this.width}/${this.height}`
	}

    constructor() {

        super();

        const shadow = this.attachShadow({
            mode: 'open'
        });
		
        const wrapper = document.createElement('div');

		this.width = 500;
		this.height = 500;

		if(this.hasAttribute('width')) this.width = this.getAttribute('width');
		if(this.hasAttribute('height')) this.height = this.getAttribute('height');

		const img = document.createElement('img');
		img.setAttribute('src', this.getURL());
		wrapper.appendChild(img);

        shadow.appendChild(wrapper);

	}

	static get observedAttributes() { return ['width','height']; }

	attributeChangedCallback(name, oldValue, newValue) {
		this[name] = newValue;
		this.shadowRoot.querySelector('img').src = this.getURL();
	}

}

// Define the new element
customElements.define('place-cat', PlaceCat);
```

Note that I abstracted out the logic to get the image source in a function, `getURL`. I can then use that in the constructor as well the callback for changes. Here's a pretty lame demo that has a button to make cats. I need one of these in real life:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title></title>
</head>
<body>

<button id="makeCat">Make Cat</button>

<script src="cat2.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('#makeCat').addEventListener('click', () => {

		let cat = document.createElement('place-cat');
		cat.setAttribute('width', 200);
		cat.setAttribute('height', 400);

		document.querySelector('body').appendChild(cat);

	}, false);
}, false);
</script>
</body>
</html>
```

Note I switched to `cat2.js` in the script tag so I could keep my initial and 'advanced' cat component around. All I've done here is add a click handler to the button and then add the `place-cat` element to the body. If you want to try this yourself, take a gander here: <https://cfjedimaster.github.io/webdemos/webcomponents/test1a.html>

I wasn't planning on building a CodePen, and I didn't expect it to *not* work, but I went ahead anyway:

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="js,result" data-slug-hash="GRQmRxG" data-user="cfjedimaster" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/GRQmRxG">
  place-cat</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## More to Come

I've only just begun to look at this but I definitely want to dig more. There's multiple projects out there that aim to make working with web components easier (I plan on looking at [Lit](https://lit.dev/) and [Stencil](https://stenciljs.com/)) but as always, I'd love to hear from folks using this in the wild. Let me know if you've implemented them in your work and what you think.

Photo by <a href="https://unsplash.com/@xavi_cabrera?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Xavi Cabrera</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  