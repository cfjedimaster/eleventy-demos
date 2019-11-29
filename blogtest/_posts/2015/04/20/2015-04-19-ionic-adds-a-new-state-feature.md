---
layout: post
title: "Ionic adds a new State feature"
date: "2015-04-20T09:31:56+06:00"
categories: [development,javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/04/20/ionic-adds-a-new-state-feature
guid: 6031
---

To be fair, this may not be <i>very</i> new, I've been working with an alpha version of the Ionic CLI while I test push (and other stuff ;) so my version has been a bit out of sync. Today I switched from the alpha to the release version and discovered a cool new feature - State.

<!--more-->

The State feature lets you quickly save and restore plugins and platforms for an Ionic project. By default, when you add a platform or a plugin, Ionic will store this information in the package.json file. Here is an example of adding a platform:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/ionic1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/ionic1.png" alt="ionic1" width="750" height="319" class="alignnone size-full wp-image-6032" /></a>

(And as an aside - did you notice it added icons and splashscreens? Freaking awesome.) And here is adding a new plugin:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/ionic21.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/ionic21.png" alt="ionic2" width="750" height="189" class="alignnone size-full wp-image-6034" /></a>

When done, here is how package.json is updated:

<pre><code class="language-javascript">{
  "name": "apr20-2",
  "version": "1.0.0",
  "description": "apr20-2: An Ionic project",
  "dependencies": {
    "gulp": "^3.5.6",
    "gulp-sass": "^1.3.3",
    "gulp-concat": "^2.2.0",
    "gulp-minify-css": "^0.3.0",
    "gulp-rename": "^1.2.0"
  },
  "devDependencies": {
    "bower": "^1.3.3",
    "gulp-util": "^2.2.14",
    "shelljs": "^0.3.0"
  },
  "cordovaPlugins": [
    "org.apache.cordova.device",
    "org.apache.cordova.console",
    "com.ionic.keyboard",
    "org.apache.cordova.device-motion"
  ],
  "cordovaPlatforms": [
    "ios"
  ]
}</code></pre>

To skip this, you can use --nosave for both platform and plugin modifications. Now comes the cool part. To quickly load in plugins and platforms, you can simply do:

<pre><code>ionic state restore</code></pre>

And Ionic will add in the appropriate plugins and platforms. This will be incredibly useful for folks checking out your Ionic project from a source control repository. 

You can also do:

<pre><code>ionic state save</code></pre>

To store the current platforms and plugins to the package.json. I would imagine you would use this feature if you used the --nosave option to test a plugin you weren't sure you wanted to actually keep around. 

You may want to remove everything. You can do this with:

<pre><code>ionic state clear</code></pre>

But be aware this really, really does remove everything, including the default plugins Ionic always install. Finally, you can do:

<pre><code>ionic state reset</code></pre>

This will remove everything then bring back what you have specified in the package.json file.