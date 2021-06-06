---
layout: post
title: "Adding Another Template Language to Eleventy"
date: "2020-02-19"
categories: ["static sites","javascript"]
tags: ["eleventy"]
banner_image: /images/banners/foreign_books.jpg
permalink: /2020/02/19/adding-another-template-language-to-eleventy
description: 
---

While at a conference last week, an attendee was asking me about [Eleventy](https://www.11ty.dev/) and specifically, how to add support for another template language. He mentioned that he was a user of [MJML](https://github.com/mjmlio/mjml), a format I had never heard of, but apparently it's big for people who build responsive email templates. Doing HTML for email seems to be the "last place" where web dev is painful so this probably makes things quite a bit easier. I did some digging and this is what I turned up.

### Official Support

So first off, there is no official support, yet, in Eleventy for doing this. There's an issue for it: [Custom File Extension Handlers](https://github.com/11ty/eleventy/issues/117) It's closed but that's because the repo uses lodash style issue management. (I've got feelings about that, but whatever. ;) Note that this is different from the ability to provide a newer version of the *supported* template engines. I [blogged](https://www.raymondcamden.com/2020/02/07/checking-and-upgrading-template-engines-in-eleventy) about that earlier this month. 

### Attempt One

Ok, so given that you can't do it (yet), I went through a couple of iterations to get this working. My first one is not what I'd recommend, but I'm sharing it as just a cool example of the flexibility of Eleventy in general.

First, I created a folder for my testing (and I'll be sharing a link to the repository at the end of this post) called `mjml_first`. In that folder I put a file named `test1.html`. The extension is important. If I named it `test1.mjml`, Eleventy would *not* do any processing on the content, which is what we want. Unfortunately it means you lose syntax helpers and color coding in your editor, but remember that Visual Studio Code lets you overwrite the document type. (Or just wait to "Attempt Two" later in this post. ;)

In that post I copied in the sample MJML I had found:

```html
<mjml>
<mj-body>
	<mj-section>
		<mj-column>
			<mj-text>
				Hello World!
			</mj-text>
		</mj-column>
	</mj-section>
</mj-body>
</mjml>
```

Now I want to tell Eleventy to use a layout for all the files in this folder. Eleventy lets you specify [data files](https://www.11ty.dev/docs/data-template-dir/) at the template and directory level. To do so, I added `mjml_first.json` to my folder:

```js
{
	"layout":"mjml"
}
```

Next I built the layout file. Typically a layout file uses Liquid or some other template language and just includes the content somewhere in the middle. But again, Eleventy is *incredible* flexible. You can use JavaScript for your layouts as well. At the command line I installed MJML node support and then named my layout file `mjml.11ty.js`. The `11ty` part is important. Here's what the file did:

```js
const mjml = require('mjml');

module.exports = function(data) {
	let s = '';
	s = mjml(data.content);
	return s.html;
};
```

Honestly that could be even shorter, but you can see I'm just passing in my content to the mjml engine and returning the output. 

And that's it. When I run my build, I get HTML out which I won't share here as it's *crazy* long to work correctly in email clients. 

I liked this approach, but as I said, it required using .html files which kind of bugged me a bit.

### Attempt Two

For my second attempt, I focused on getting proper support for the mjml extension in my project. I created a folder named `mjml` and put two sample files in there. I also installed the [Visual Studio Code MJML extension](https://github.com/attilabuti/vscode-mjml) because *of course* there's an extension for that. 

Since mjml is an extension that Eleventy doesn't support, it's going to be ignored. Of course you can add `addPassthroughCopy` to copy it to the `_site` folder, but it would be copied as is with no parsing.

So instead I did two things. First, I added a data file named `mjml.js` which the following code:

```js

const mjml = require('mjml');
const globby = require('globby');
const fs = require('fs');

module.exports = async function(data) {
	let result = [];

	let files = await globby('mjml/*.*');

	for(let i=0; i < files.length; i++) {
		let content = fs.readFileSync(files[i], 'utf8');
		let path = files[i].replace(/\.mjml/,'');
		result.push({
			path:path,
			originalContent:content,
			parsedContent:mjml(content).html
		});
	}

	return result;
};
```

This loads in all the mjml files and iterates over each. For each item it changes the path value to remove `.mjml`. We'll add back in a proper extension later. Then I add the mjml parsed version to an array and return it. 

The end result is that Eleventy has access to data that contains a list of parsed MJML files. 

I then used my [favorite Eleventy](https://www.11ty.dev/docs/pages-from-data/) feature to define a "pagination" output of the data with a size of 1. Basically, make one file per record in the array of data. I named this `mjmldocs.liquid`.

```html
{% raw %}---
pagination: 
  data: mjml
  size: 1
  alias: doc
permalink: "{{ doc.path }}/"
---

{{ doc.parsedContent }}{% endraw %}
```

Now when I create my build, I get a mjml folder with subdirectories per input file and an index.html file with the parsed content.

<img src="https://static.raymondcamden.com/images/2020/02/mjml.png" alt="Output of parsed mjml files" class="imgborder imgcenter">

I was done. Except that I noticed when I edited mjml files, Eleventy didn't notice. I thought perhaps that would just have been a small paint point, but of course not, Eleventy is awesome. I added one line to my `.eleventy.js` file:

```js
eleventyConfig.addWatchTarget('./mjml/');
```

That's all it took! 

So hopefully this is helpful to others. You can find the code I used to test here: <https://github.com/cfjedimaster/eleventy-demos/tree/master/customext>

<i>Header photo by <a href="https://unsplash.com/@belart84?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Artem Beliaikin</a> on Unsplash</i>