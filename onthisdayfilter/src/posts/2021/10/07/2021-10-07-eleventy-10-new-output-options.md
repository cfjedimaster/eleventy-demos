---
layout: post
title: "Eleventy 1.0 - New Output Options"
date: "2021-10-07T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/allthewayto11.jpg
permalink: /2021/10/07/eleventy-10-new-output-options.html
description: A look at a new way to save the output of Eleventy
---

Ok, today's Eleventy 1.0 post (remember, it's still in beta and this may change before release) is a short one. I was looking over the [post](https://www.11ty.dev/blog/eleventy-v1-beta/) on 1.0 features and wanted to learn more about this:

<blockquote>
Support for CLI arguments to do JSON and NDJSON output (instead of writing to the file system). Use `--to=json` and `--to=ndjson`.
</blockquote>

When I read this, my assumption was that it meant the output of the CLI itself, specifically, the messages about what it did. So for example, here's the output of a typical Eleventy operation on a small site:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/10/toj1.jpg" alt="Output from Eleventy CLI showing each file processed, input and output." class="lazyload imgborder imgcenter">
</p>

Given that, my expectation was that by using the `to` argument, I could ask for a JSON version of the results instead of plain text. I've encountered other CLIs that will do this as well. This can then be useful when executing a CLI from within another Node script as it gives you programatic access to the result of the call.

But I was wrong - this new argument literally means the output of the site itself! Here's an example on a very small site:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/10/tpj2.jpg" alt="Example showing JSON about the pages created" class="lazyload imgborder imgcenter">
</p>

So to be clear, when runnig `eleventy --to=json`, nothing is written to `_site`. (You may miss this as I did since I don't normally remove the previous output.) Instead, the JSON is the complete output of the build. You get an array of files that *would* have been written, their input and output, the URL for it, and the content itself. In the screen shot above, the content comes from a Liquid page that included the current date and time.

If your curious, the output also includes files that *aren't* written. So given this input:

```html
---
permalink: false
---

i wont save
```

You get this result:

<p>
<img data-src="https://static.raymondcamden.com/images/2021/10/toj3.jpg" alt="The JSON array includes a file not saved, it shows false for outputPath" class="lazyload imgborder imgcenter">
</p>

By the way, if you're curious, "ndjson" refers to [newline delimited JSON](http://ndjson.org/) which is a JSON format more appropriate for streaming a record at a time. In my testing, the array of objects was instead output as just a list of objects - but I did not have a newline delimiter between each object. I filed a [bug](https://github.com/11ty/eleventy/issues/2006) on it but I could be misreading the output. 

Another thing to watch out for is in saving the output. I did this on my blog's project folder:

```
eleventy --to=json > result.json
```

And while it correctly piped to the file, any console.log message was in there as well. That makes sense, but I kinda wish there was a way to pipe *just* the JSON output. I filed an [enhancement request](https://github.com/11ty/eleventy/issues/2005) for the idea of being able to pass `filename.json` instead of `json` and have the result be automatically written to that file instead of the terminal.

All in all, this seems like a pretty cool new feature. Being able to access the output programatically could be useful for QA and testing in general, or more. I'd love to hear more about how folks plan on making use of this.
