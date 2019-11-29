---
layout: post
title: "Integrating HTML Templating with OpenWhisk Web Actions"
date: "2017-04-21T10:37:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/04/21/integrating-html-templating-with-openwhisk-web-actions
---

As always, when I blog about stuff like this, I want to remind folks I'm both new to serverless and new to OpenWhisk, so while what follows *works*, I'm not necessarily saying it is the best way to do things, or even a good idea. But let's be honest, that's never stopped me before, right?

So the question I had this morning was - given an OpenWhisk action built for [Web Action](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_webactions.html#openwhisk_webactions) support, how would you make use of a templating engine to help return an HTML-based response?

My preference for templating engines is [Handlebars](http://handlebarsjs.com/) (although you can read about more options in my [book](https://www.amazon.com/gp/product/1491935111/ref=as_li_tl?ie=UTF8&tag=raymondcamd06-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=1491935111&linkId=239944c4f3cbf1e35ce47f4eb857b2a7)), so I looked at that first. Here is the sample action I came up with.

<pre><code class="language-javascript">const Handlebars = require('handlebars');
const fs = require('fs');

let template = '';

function main(args) {

	if(template === '') {
		template = Handlebars.compile(fs.readFileSync(__dirname+'/templates/cats.html', 'utf-8'));
		console.log('loaded template from fs');
	}

	let data = {
		title:"A list of cats",
		cats:[
			"Lilith",
			"Sinatra",
			"Luna",
			"Pig",
			"Cracker"
		]
	}

	let html = template(data);

	return {% raw %}{ body:html }{% endraw %};
}

exports.main = main;
</code></pre>

So, the basic idea is this:

* See if we have a template variable setup, and if not, do a file read of our template and create the Handlebars function for it. You may be wondering how that works considering the action is run in an atomic fashion with no real persistence. While that is true, a "warmed up" action will be kept alive. This makes simple caching like this ok. (I talked about this more here: [Serverless and Persistence](https://www.raymondcamden.com/2017/02/09/serverless-and-persistence)).
* I then get my data, which in this case is hard coded. Obviously I could use arguments passed to the action, make data on the fly, etc, but a simple hard coded object was enough.
* I then generate the HTML using the Handler's compiled function, template. (Not a terribly descriptive name. I apologize.) 
* Finally, I return the generated HTML.

The template is rather simple:

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;{% raw %}{{title}}{% endraw %}&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;h2&gt;{% raw %}{{title}}{% endraw %}&lt;&#x2F;h2&gt;
		
		&lt;p&gt;
			I&#x27;d like to thank the following cats for making everything possible:
		&lt;&#x2F;p&gt;

		&lt;ul&gt;
			{% raw %}{{#each cats}}{% endraw %}
			&lt;li&gt;{% raw %}{{.}{% endraw %}}&lt;&#x2F;li&gt;
			{% raw %}{{&#x2F;each}}{% endraw %}
		&lt;&#x2F;ul&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

The final bit is to simply create the action. I'm using a custom npm module so I had to zip it up, but I just used a shell script again:

<pre><code class="language-markup">#!/bin/bash
zip -rq temp.zip test1.js package.json node_modules templates
wsk action update templatetest/test --kind nodejs:6 temp.zip --web true
rm temp.zip
</code></pre>

Note the `--web true` at the `wsk` call. This lets OpenWhisk know this is a Web Action. Finally, you can see the result here:

https://openwhisk.ng.bluemix.net/api/v1/web/rcamden@us.ibm.com_My%20Space/templatetest/test.http

Some thoughts:

* If I was really going to use one template, I'd probably consider just using a template string in the action code. I feel like that would be a bit messy though, and I'd not get my nice HTML syntax coloring/autocomplete in my editor. But I'd consider it for sure.
* And of course, don't forget that [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) support variable substitutions, like a "lite" version of a template engine like Handlebars. But you don't get stuff like conditionals and loops though.
* Handlebars supports compiling template strings into functions and saving them as well. So a better approach would be to do that, require them into the action, and deploy that. You could use your shell/bat script to do all of this at once.

Any comments, or concerns, about this approach?