---
layout: post
title: "A Tip for Zipped Actions and Packages in OpenWhisk"
date: "2017-04-13T12:51:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/04/13/a-tip-for-zipped-actions-and-packages-in-openwhisk
---

Just a quick tip to share today. I talked about [zipped actions](https://www.raymondcamden.com/2017/01/10/creating-packaged-actions-in-openwhisk) a few months ago. It's how you handle adding non-supported npm modules with OpenWhisk. While OpenWhisk supports a good set of common/popular npm modules out of the box, if you want to use one that isn't on that list, you:

* Make a zip of the action code, the package.json file, and the node_modules. 
* Update your action and point to the zip instead of just the .js file. 
* Plus add a bit of metadata (explained in my blog post linked to above)

All in all this works well, especially once you make a simple shell script to do all of the actions at once.

Today though I ran into an interesting issue. I've got a simple ElasticSearch package I'm slowly building for OpenWhisk. Right now it has 2 actions: Create, Search. I've got both of these in the same folder, with a folder structure that looks like so:

* node_modules
* create.js
* package.json
* search.js
* upd.bat (my shell script)

The shell script simply handles updating Create and Search:

<pre><code class="language-javascript">del search.zip
7z a -r search.zip search.js package.json node_modules/*
wsk action update elasticsearch/search --kind nodejs:6 .\search.zip

del create.zip
7z a -r create.zip create.js package.json node_modules/*
wsk action update elasticsearch/create --kind nodejs:6 .\create.zip
</code></pre>

If you're curious, `7z` is just a Windows-based zip CLI. Ok, so today I did some updates, and while search worked fine, create gave me:

	Error: Cannot find module '/nodejsAction/G3hUBA5k`

I was pretty confused by this - but then I saw the problem. My package.json looked like so:

<pre><code class="language-javascript">{
  "name": "openwhisk_es",
  "version": "1.0.0",
  "description": "",
  "main": "search.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "elasticsearch": "^12.1.3"
  }
}
</code></pre>

See it? The issue is `main` pointing to `search.js`. When I ran the create action it couldn't find search. So the solution? I could have used 2 completely separate subdirectories. Instead, I made two new files: package.create.json and package.search.json. The only difference in both is the `main` value. My shell script then changes to:

<pre><code class="language-javascript">del search.zip
copy package.search.json package.json
7z a -r search.zip search.js package.json node_modules/*
wsk action update elasticsearch/search --kind nodejs:6 .\search.zip

del create.zip
copy package.create.json package.json
7z a -r create.zip create.js package.json node_modules/*
wsk action update elasticsearch/create --kind nodejs:6 .\create.zip
</code></pre>

Not exactly rocket science, but you get the idea. 

p.s. Now that my desktop and laptop both have a decent Bash shell, I'm pretty much done with the Windows shell. It works fine and all, but I'm really digging Bash on Windows, especially after the Creators Update. I really haven't run into anything I can't do yet.