---
layout: post
title: "Quick Handlebars tip concerning precompilation"
date: "2015-03-14T13:09:54+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2015/03/14/quick-handlebars-tip-concerning-precompilation
guid: 5832
---

So, I'm not sure I can say <i>why</i> I'm playing with <a href="http://www.handlebarsjs.com">Handlebars</a> today (just asked if I could talk about it), but I ran into an interesting issue with it today that I thought I'd share.

<!--more-->

Handlebars supports <a href="http://handlebarsjs.com/precompilation.html">precompilation</a> of templates. This makes your application run a bit quicker by skipping the template compilation phase. It's done via a simple CLI program you can install via npm.

Handlebars <i>also</i> supports partials. These are templates that are meant to be included in other templates. Oddly, the Handlebars site doesn't document this feature. (To be clear, it mentions the API for it, but doesn't describe it as a feature.) If you go to the <a href="https://github.com/wycats/handlebars.js/">Github</a> repo for Handlebars though it is fully documented. 

Ok, so the normal way to compile templates is like so:

<pre><code>handlebars file.handlebars file2.handlebars -f templates.js</code></pre>

This takes two files, file.handlebars and file2.handlebars, and compiles it into one file, templates.js. Once you've done that, and included the file, you can access the template function like so: 

<pre><code class="language-javascript">rendered = Handlebars.templates.file(data here);</code></pre>

The file name, minus the extension, becomes the name of the template function. As an FYI, you should name your files with the .handlebars extension. If you don't, then the full file name becomes the name of the template function. If I had used file.html as my filename, then my template function would be file.html, and who knows what grief that dot would have caused.

Ok, so to handle partials, you have to pass a flag, -p:

<pre><code>handlebars mypartial.handlebars -p -f partials.js</code></pre>

As before, the name of the file dictates how you would use it. If I had used the file name from the code snippet above, I could include a partial like so: {% raw %}{{> mypartial}}{% endraw %}. As before, ensure you use the handlebars file extension. I had used .partial to help keep things organized and ran into the issue with the name being mypartial.partial instead of just mypartial.

Ok, so finally, the tip. As far as I know, there is no way to compile 'regular' templates and partials in one call. So to create my compiled templates and partials and store them in one file, I've ended up doing this:

<pre><code>
handlebars file1.handlebars file2.handlebars file3.handlebars -f templates.js
handelbars file10.handlebars file11.handlers -p -f partials.js
cat templates.js partials.js > templates_all.js
</code></pre>

The handlebars CLI supports globs which means I could have used *.handlebars, but since I had my templates and partials in one folder, that wouldn't have worked. And obviously you could automate this with a simple Grunt script as well.

It is certainly possible that I'm wrong about the need to do this in multiple calls. I <a href="https://github.com/wycats/handlebars.js/issues/982">opened a ticket</a> over on the Handlebars site to request this feature and if I'm missing the obvious, I'll update the blog entry. (And part of me hopes that I'm wrong and this entire blog entry is a waste. :)