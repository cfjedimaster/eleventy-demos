---
layout: post
title: "Vue and Form Fields"
date: "2020-01-27"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/eggs.jpg
permalink: /2020/01/27/vue-and-form-fields
description: A look at form field types and Vue's binding
---

Vue has great support for working with forms. This is heavily documented in the [Form Input Bindings](https://vuejs.org/v2/guide/forms.html) section. I wanted to build my own demo/set of examples based on this as a way of exploring the different types of inputs and how Vue works with them. In order to do this, I built a demo that covered every single type of form field possible. (As far as I know, let me know what I forgot.) For each I tested setting an initial value and outputting the bound value in case it looked different than what the field displayed, `input[type=color]` is a great example of this.

If you don't want to read my long winded text, you can jump right to the CodePen here: <https://codepen.io/cfjedimaster/pen/vYEMgjV?editors=1011>

Ok, let's get started! Please note some of these are boring, i.e. they work as expected with no weirdness.

### input[type=text]

The simplest and easiest of the fields, and what the "fancy" fields (like `type=color`) turn into when run on older browsers. I tested with this markup:

```html
<p>
<label for="text1">text:</label> 
<input v-model="text1" id="text1" type="text">
</p>

<p>
<label for="text2">text (maxlength=5):</label> 
<input v-model="text2" id="text2" type="text" maxlength=5>
</p>
```

And this data:

```js
text1:'Ray',
text2:'Raymond Camden',
```

Notice the second field makes use of `maxlength`. On initial display, both work as expected, but in the second one you can only delete characters, not add them, until the length is less than five.

### input[type=button]

I used this markup:

```html
<p>
<label for="button1">button:</label> 
<input v-model="button1" id="button1" type="button">
</p>
```

and this data:

```js
button1:'button1',
```

And it just renders a button where the label is the model value.

<img src="https://static.raymondcamden.com/images/2020/01/fields1.png" alt="button" class="imgborder imgcenter">

### input[type=checkbox]

Ok, this is a fun one. Checkboxes allow you to specify zero, one, or multiple items. I used this markup to dynamically render the checkboxes:

```html
<p>
checkbox:<br/>
<span v-for="(cbv,idx) in checkbox1Values">
<input v-model="checkbox1" :value="cbv" type="checkbox"
		:id="'checkbox1'+idx"/> <label :for="'checkbox1'+idx">{% raw %}{{ cbv }}{% endraw %}</label><br/>
</span>
</p>
```

Here is the data:

```js
checkbox1: ['red', 'blue'],
checkbox1Values: ['red', 'blue', 'green', 'orange' ], 
```

A few things to note here. I've got N inputs based on the total number of items in the array. Each one has a specific value, but the `v-model` points to the selected value I've defined. Also note when I iterate I include the loop index, this lets me specify a dynamic ID value for each and use a label to make it easier to use.

The default value, if you want to specify it, is an array. 

### input[type=color]

The first one that may not be supported in your browser, it worked just fine in the shiny new Microsoft Edge. Here's the layout:

```html
<p>
<label for="color1">color:</label> 
<input v-model="color1" id="color1" type="color">
</p>
```

and here is the data:

```js
color1:'#cc8800',
```

This is the first control where, by itself, you can't see the real value:

<img src="https://static.raymondcamden.com/images/2020/01/fields2.png" alt="Color example" class="imgborder imgcenter">

When I first tried this, I attempted to set `color1` to a named color, but that isn't supported, it must be an RBG value in hex. This is - of course - [documented](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color) over at MDN.

### The date inputs

To make things a bit easier, let's consider the date related field types: date, datetime-local, month, time, and week. Altogether, their markup:

```html
<p>
<label for="date1">date:</label> 
<input v-model="date1" id="date1" type="date">
</p>

<p>
<label for="datetimelocal1">datetime-local:</label>
<input v-model="datetimelocal1" id="datetimelocal1" type="datetime-local">
</p>

<p>
<label for="month1">month:</label>
<input v-model="month1" id="month1" type="month">
</p>

<p>
<label for="time1">time:</label> 
<input v-model="time1" id="time1" type="time">
</p>

<p>
<label for="week1">week:</label> 
<input v-model="week1" id="week1" type="week">
</p>
```  

All in all, there's nothing special about any of these markup wise, but UI wise they all render somewhat differently across different browsers (and not at all in [Safari](https://caniuse.com/#feat=input-datetime) because of course not).  

<img src="https://static.raymondcamden.com/images/2020/01/fields3.png" alt="Date related one" class="imgborder imgcenter">

Some work as expected, like date opening up a calendar (again, in Microsoft Edge), but then it gets more complex from there. Week, for example, shows this:

<img src="https://static.raymondcamden.com/images/2020/01/fields4.png" alt="Example of week control" class="imgborder imgcenter">

Each of these had slightly different ways of specifying initial values:

```js
date1:'2020-08-20',
datetimelocal1:'2020-01-31T12:38:00.000',
month1:'2020-04',
time1:'13:14:00.000',
week1:'2021-W02',
```

I had to guess at some of these. I'd specify a blank value, set the value, and then check my debug output. (I may have forgot to mention, but at the bottom of my markup I've got a debug region where I output every value.) Week, especially, was surprising. 

### input[type=email]

Absolutely nothing special about this - here's the markup:

```html
<p>
<label for="email1">email:</label>
<input v-model="email1" id="email1" type="email">
</p>
```

and the data:

```js
email1:'raymondcamden@gmail.com',
```

### input[type=file]

Here's a fun one. First note that form fields are readonly, so doing this won't be possible:

```html
<p>
<label for="file11">file:</label>
<input v-model="file1" id="file1" type="file">
</p>
```

And:

```js
file1:'c:\\autoexec.bat',
```

In fact, Vue screams about it in the console:

<img src="https://static.raymondcamden.com/images/2020/01/fields5.png" alt="" class="imgborder imgcenter">

What's cool is that they tell you exactly how to fix it:

```html
<input @change="setFile" id="file1" type="file">
```

This can then be tied to a method:

```js
methods:{
	setFile(e) {
		console.log('selected file(s)', e.target.files);
		// grab the file name and do something with it
	}
}
```

This provides you access to information about the files allowing you to do fancy things, like [figuring the size](https://www.raymondcamden.com/2019/06/13/reading-image-sizes-and-dimensions-with-vuejs) of images or doing [client-side validation](https://www.raymondcamden.com/2019/05/21/reading-client-side-files-for-validation-with-vuejs) of files.

### input[type=hidden]

Works as expected, hidden from the user, nothing to see here, carry on.

```html
<p>
<label for="hidden1">hidden:</label>
<input v-model="hidden1" id="hidden1" type="hidden">
</p>
```

```js
 hidden1:'you can\'t see me...',
```

### input[type=picture]

Also nothing special here. I've never used this one in production before but I guess folks have used it.

```html
<p>
<label for="image1">picture:</label>
<input :src="image1" id="image1" type="image">
</p>
```

My data was a URL path to the image:

```js
image1:'http://placekitten.com/g/200/300',
```

In case you're curious it is acts like a submit button.

### input[type=number]

Again, nothing really special... at first. So consider this markup:

```html
<p>
<label for="number1">number:</label>
<input v-model="number1" id="number1" type="number">
</p>
```

And this data:

```js
number1:6,
```

So if you don't modify the value, what's actually there in the DOM?

6? Nope.

"6" 

Pat yourself on the back if you knew this. I know this. Of course I do. I still manage to forget about 90% of the time. Vue provides a dang nice way to handle this though. Just add a `.number` modifier:

```html
<input v-model.number="number1" id="number1" type="number">
```

### input[type=password]

Again, nothing special. Take this markup:

```html
<p>
<label for="password1">password:</label> 
<input v-model="password1" id="password1" type="password">
</p>
```

And this code:

```js
password1:'kyloren',
```

And you get a password field where the value is hidden. Don't forget though that you or I can go into devtools and change the field type to text to see the value.

### input[type=radio]

Another one with multiple items, but this one only takes one value, not 0 or more.

```html
<p>
radio:<br/> 
<span v-for="(rbv,idx) in radio1Values">
<input v-model="radio1" :value="rbv" type="radio" 
		:id="'radio1'+idx"/> <label :for="'radio1'+idx">{% raw %}{{ rbv }}{% endraw %}</label><br/>
</span>
</p>
```

And here is the data:

```js
radio1: 'beer',
radio1Values: ['pizza', 'donuts', 'beer', 'hamburgers' ],
```

Notice that the selected value is *not* an array but one value. 

### input[type=range]

First the markup:

```html
<p>
<label for="range1">range:</label> 
<input v-model="range1" id="range1" type="range" min="1" max="10">
</p>
```

And the value: 

```js
range1: 6,
```

Remember that the browser will *not* display any numbers with this control:

<img src="https://static.raymondcamden.com/images/2020/01/fields6.png" alt="Range UI" class="imgborder imgcenter">

You could use the `<output>` tag to handle this but it's probably easier to just add `{% raw %}{{ range1 }}{% endraw %}` to the markup.

### input[type=search]

This is mainly the same as a text field with the addition of a little X (or some other UI) to clear the data immediately. Here's the markup:

```html
<p>
<label for="search1">search:</label> 
<input v-model="search1" id="search1" type="search">
</p>
```

and the data:

```js
search1:'search text',
```

Still with me? We're almost done.

### input[type=submit]

Another boring one. This time binding the value just sets the value on the button.

```html
<p>
<label for="submit1">submit:</label> 
<input v-model="submit1" id="submit1" type="submit">
</p>
```

```js
submit1: 'Submit or Die'
```

### input[type=tel]

This one primarily works on mobile. It should fire up a keyboard better suited for entering phone numbers. On desktop it does nothing special.

Markup:

```html
<p>
<label for="tel1">tel:</label> 
<input v-model="tel1" id="tel1" type="tel">
</p>
```

And data:

```js
tel1: '555-555-5555',
```

### input[type=url]

And finally, the URL field. Looks the same but will validate differently.

```html
<p>
<label for="url1">url:</label> 
<input v-model="url1" id="url1" type="url">
</p>
```

And code: 

```js
url1:'https://www.raymondcamden.com',
```

### select

Did I say finally? Nope, not done yet. Here's how select works. First, the markup:

```html
<p>
select:<br/> 
<select v-model="select1">
	<option v-for="sel in select1Values">{% raw %}{{ sel }}{% endraw %}</option>
</select>
</p>
```

And the values:

```js
select1: 'hbo', 
select1Values: ['cinemax', 'showtime', 'hbo', 'cbs' ],
```

A regular select lets you pick one option so the value specified is just a simple string. 

When using the multiple option, things change a tiny bit:

```html
<p>
select multiple:<br/> 
<select v-model="select2" multiple>
	<option v-for="sel in select1Values">{% raw %}{{ sel }}{% endraw %}</option>
</select>
</p>
```

And the values:

```js
select2: ['showtime', 'cbs'], 
select2Values: ['cinemax', 'showtime', 'hbo', 'cbs' ],
```

The big change here is using an array to set (and work with) the selected values.

Almost done - honest!

### textarea

First, the markup:

```html
<p>
<label for="textarea1">textarea</label>
<textarea v-model="textarea1" id="textarea1"></textarea>
</p>
```

And then the value:

```js
textarea1:'This is my text area\nIt is better than yours...'
```

Notice that you do not have to provide a value inside the textarea block. I actually forgot and had this originally: `<textarea v-model="textarea1" id="textarea1">{% raw %}{{textarea1}}{% endraw %}</textarea>`

### Wrap Up

For the most part, there weren't many surprises here, but I know I'm happy to have an example of everything in one place. You can run, and fork, the full example here:

<p class="codepen" data-height="400" data-theme-id="default" data-default-tab="html,result" data-user="cfjedimaster" data-slug-hash="vYEMgjV" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue Form Examples">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/vYEMgjV">
  Vue Form Examples</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<i>Header photo by <a href="https://unsplash.com/@erol?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Erol Ahmed</a> on Unsplash</i>