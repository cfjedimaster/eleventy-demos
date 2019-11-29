---
layout: post
title: "The Future of the Web"
date: "2013-05-22T11:05:00+06:00"
categories: [development,html5]
tags: []
banner_image: 
permalink: /2013/05/22/The-Future-of-the-Web
guid: 4940
---

I know, I know. The title sounds like SEO-link-bait, I apologize. I want to talk about something that I'm fairly excited about, and I hope it excites you as well.
<!--more-->
Last week I had the pleasure of listening to <a href="http://dancallahan.info/">Dan Callahan</a> give the keynote at cfObjective. I didn't get a chance to meet him in person (I basically ran to my presentation and then to the airport), but I greatly enjoyed his talk. His central theme was a simple one - it is time to learn JavaScript. This is a message that I just kind of assume that people already know, but as I still encounter people struggling with client-side development, it is apparent that we (we being the greater web community) still have quite a bit of growing to do.

<img src="https://static.raymondcamden.com/images/keep-calm-and-learn-javascript.png" />

If there was one thing I would have added to Dan's talk it would have been a reminder that web developers are probably also somewhat behind in their HTML knowledge as well. I've been using HTML since 1993 or so. I spent a long time doing just server-side development for a while but even then I was still generating HTML. But at least once a month I'm reminded about some particular tag or attribute that I've forgotten about. Don't get me started about CSS. Every time I remember that you can specify hover stuff in CSS I remember how many times I wrote the same damn code to highlight menu items with JavaScript. 

I've made it my mission over the past few years to focus my energy in this direction. Anyone who reads this blog or listens to me give presentations knows this. Developing for the web can still be pretty darn frustrating, but at least the tools, and the environment, are growing in leaps and bounds. There's some growing pains here, but my God, there's <strong>growth</strong>.

That is why I'm so excited to be hearing more and more about <strong>Web Components</strong>. Web Components refer to a few different technologies (that I'll list in a moment). But in general, they represent an incredible change in the web. To me, they truly are "Web 2.0." For the first time you'll be able to define new building blocks (tags, behavior, design) by following web standards. You'll be able to extend the web. <strong>That is awesome.</strong>

So what are Web Components? In general, they describe the following technologies/specs:

<h2>Templates</h2>

Anyone who has worked with templates in JavaScript know how powerful this can be. Templates allow you to create reusable blocks of content that can be added to the DOM with JavaScript. As a simple example, imagine you are using AJAX to fetch content from the server. As this content comes back as pure data, you need to write this out to the DOM. While you can certainly just create large blocks of HTML in JavaScript strings, this gets unwieldy pretty darn quickly. Hence the rise of multiple JavaScript template frameworks. 

The Template feature will provide native support for this. You will be able to use a template tag within your HTML document. The content in the tag is <strong>not executed</strong> until you actually clone the template and add it to the DOM yourself. So any images or script blocks won't be loaded until necessary. 

To be clear, this isn't the exact same as something like <a href="http://handlebarsjs.com/">Handlebars.js</a>. You don't get token replacement. But it is native to the browser itself which means less additional code.

You can read more about the spec here: <a href="https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/templates/index.html">https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/templates/index.html</a>

<h2>Shadow DOM</h2>

Shadow DOM is - for me - the hardest concept to get my head around. I probably will not do a great job describing it, but in essence, it is a way to create a "black box" style system for content. Let me give you an example. Imagine you are writing some HTML that is meant to be consumed by someone else. Your HTML is just a H1 tag and a paragraph. You want to style this content, but in order to do so, you have to ensure your CSS does not conflict with anything in the parent document. An iFrame can solve this, but iFrames create other challenges as well. With the Shadow DOM, you can essentially say, "This CSS will apply to this block only. Period. Nothing will leak out or in." 

Again - I'm <i>not</i> the best person to speak on this. You can read more about it at the spec (<a href="https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html">https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html</a>)  or check out the excellent <a href="http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/">HTML5 Rocks</a> article on the topic.

<h2>Custom Elements</h2>

The most exciting part of web components, for me anyway, are custom elements. As you can guess, they allow you to create new HTML elements. Right now they are prefixed (x-), but if you have ever wanted to define your own markup, this will allow you to do so. You get full lifecycle support (ie, knowing when your element is loaded, shown, etc) and you can even use this feature to extend existing elements. Of course, you can also tie your own JavaScript events and mix in both templates and the Shadow DOM.

If you have ever used something like <a href="http://jqueryui.com/tabs/">jQuery UI's Tabs</a> to add tabs to your site, web components will allow you to do it all via web standards.

<h2>HTML Imports</h2>

The final piece of the puzzle is HTML imports. Essentially, once you've defined a custom element, applied some layout to it via the Shadow DOM and custom behavior, you can then create a reusable template that can be shared with others. In the same way you import a style sheet, the link tag will allow you to import custom elements. For example, x-tab or x-cowbell. 

You can find the spec for this here: <a href="https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/imports/index.html">https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/imports/index.html</a>

<h2>So What, I Can't Use It Now!</h2>

I bet you're asking, how well is this stuff supported? Right now support is pretty limited. In fact, custom elements aren't supported at all yet. The features that do work now are limited to Chrome and Firefox Nightly. The specs are still in development. Keep in mind though that a majority of our major browsers now are moving to a continuous update cycle. <strong>If you are still of the mindset that you don't need to care or pay attention to web standards then you are failing in your job as a web developer.</strong> 

Want to know more? There is an awesome, and short, video by Eric Bidelman of Google that you can watch on this topic. I've embedded it below. You can also find his slide deck here: <a href="http://www.webcomponentsshift.com/">http://www.webcomponentsshift.com/</a>. Do note though that you are supposed to click the right arrow to start the presentation. The initial gray screen confused me a bit and I assumed something had broken.

<iframe width="600" height="338" src="http://www.youtube.com/embed/fqULJBBEVQE?rel=0" frameborder="0" allowfullscreen></iframe>