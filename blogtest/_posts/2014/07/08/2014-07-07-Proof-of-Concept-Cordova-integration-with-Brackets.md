---
layout: post
title: "Proof of Concept Cordova integration with Brackets"
date: "2014-07-08T08:07:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2014/07/08/Proof-of-Concept-Cordova-integration-with-Brackets
guid: 5260
---

<p>
The past few days I've been working on a new <a href="http://www.brackets.io">Brackets</a> extension that integrates with the Cordova command line tool. I've got a rough draft of it ready with almost every feature prepared so I thought I'd go ahead and let people know in case they wanted to start hacking on it. As it is <strong>not</strong> complete yet I've not added it to the extension manager, but once I wrap the last feature I'll go ahead and submit it. You can find the code for the extension on GitHub: <a href="https://github.com/cfjedimaster/Cordova-Extension">https://github.com/cfjedimaster/Cordova-Extension</a>.
</p>
<!--more-->
<p>
The extension relies on the Cordova CLI to exist, so keep that in mind, and it assumes you've already set up some mobile SDKs already. This extension doesn't remove the need to go through those steps, it merely serves to help you use those tools from within Brackets. Once loaded, you get a new icon in the right side menu:
</p>

<p>
<img src="https://static.raymondcamden.com/images/13.png" />
</p>

<p>
It is a bit hard to see, but the icon is grayscale. Switching to a Cordova project switches the state to enabled.
</p>

<p>
<img src="https://static.raymondcamden.com/images/23.png" />
</p>

<p>
Clicking the icon opens up a bottom panel with two tabs: Platforms and Plugins. Platforms is just that - a list of currently installed platforms for the project that shows which are enabled.
</p>

<p>
<img src="https://static.raymondcamden.com/images/31.png" />
</p>

<p>
All I'm doing here is wrapping calls to the CLI. To be clear, I don't think the Cordova CLI is hard to use, but I think having a quick visual look at my Cordova settings is pretty useful. Note that there is poor visual feedback currently in the extension. The very first time you use a platform, like Firefox OS, the CLI will fetch the bits remotely. That can take 30-60 seconds. My extension doesn't provide any good visual feedback that it is working. It will correctly update the UI when done, but you don't get a loading indicator. For platforms already installed system-wide though it will be super quick. Also, Run doesn't actually work well now. I emulate more often anyway.
</p>

<p>
The next tab is Plugins. This will allow you to list, remove, and add plugins. Currently only list works.
</p>

<p>
<img src="https://static.raymondcamden.com/images/41.png" />
</p>

<p>
The search field will hit plugins.cordova.io and use autocomplete. I may even "fudge" it a bit since "accelerometer" doesn't match the plugin it uses (device-motion). You won't believe how many times that screws me up.
</p>

<p>
Anyway, I think this plugin could be useful more for the "what am I using" feature than actually firing off builds and modifying platforms. Let me know what you think. I wrote the code somewhat quickly so it has not been linted yet. I plan on doing that before my "official" release for 1.0.
</p>