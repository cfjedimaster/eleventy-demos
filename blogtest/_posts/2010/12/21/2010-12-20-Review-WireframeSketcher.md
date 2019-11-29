---
layout: post
title: "Review: WireframeSketcher"
date: "2010-12-21T09:12:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2010/12/21/Review-WireframeSketcher
guid: 4062
---

This may come as a shock to some people, but when it comes to design, I'm not exactly the most skilled developer. My idea of design is make stuff as ugly as possible so that it comes off as some kind of intentionally retro theme. While I don't expect to be making color choices soon, I have found myself looking for a good way to mock up basic wireframes. Not so much for my ColdFusion development but for my AIR applications. I've tried some solutions in the past but nothing really worked for me. So when Peter Severin contacted me a few days ago and told me to check out his product, <a href="http://wireframesketcher.com/">WireframeSketcher</a>, I warned him that I was probably not going to care for it. But after playing with it for a few days I'm really beginning to dig it.
<!--more-->
WireframeSketcher is an Eclipse plugin for wireframe creation. This means you can use it with ColdFusion Builder, Flash Builder, Aptana, etc. What's especially cool is that the web site has <a href="http://wireframesketcher.com/install_details.html">specific instructions</a> for ColdFusion Builder and Flash Builder. It's nice to see support for Adobe's IDE's there. I followed the directions for both CFB and FB and it worked perfectly.

Once installed, you can create a new screen via the file menu. For my testing I created a folder in my Flash Builder project called mockups and dropped my first screen in there. You are given a large selection of widgets you can add to your screen. This includes all the things you might expect - windows, panels, form items, etc. Also a large library of icons as well. What's nice is that you can create your own widgets and share them with others. In fact, there is a <a href="http://mockupsgallery.com/">gallery</a> available now that includes support for various mobile devices. For my project I'm working on a Blackberry Playbook concept so I simply created a window with the same dimensions as the device. If I get around to it I'll make something a bit more formal and submit it to the gallery.

Editing works - I assume - like most other visual designers. You get nice 'snap to' support and when you line things up you get helpful markers to know when things are in sync. Since my eye for stuff like that is pretty crap I definitely appreciated it. You can group things together and move them as a unit too. 

Here is a snapshot of my FlashBuilder running one of the screens. I've shrunk it down a bit so click for a larger version.

<a href="http://www.raymondcamden.com/images/shot1_large.png"><img src="https://static.raymondcamden.com/images/cfjedi/shot1_small.png" /></a>

Right away one of the things I like is how this tool is integrated into my project. I can go from actual code to screen and back and forth. 

The widgets support wiki text for layout. This means you can create a bold label by typing in *Foo*. You can see the <a href="http://wireframesketcher.com/help/help.html#working_with_screens/editing_text">whole list</a> of supported styles in the docs. It's not just format but basic tokenization as well. 

Now here is where things get real cool I think. While working on a screen you can switch to a presentation mode. This is essentially just a full screen view. But I can imagine this being a great way to show off your work to the pointy haired manager. Or just a great way to see your mockup without anything else around it. But there's more...

All of your widgets can have links. A link is simply a connection to another screen. So I can take one screen, add a button, and say that it links to the next screen. When I view it in a presentation I get a little visual cue that the item is hot and can demonstrate basic interactivity. Screens can be grouped together in a storyboard which is then exportable to PDF. I've attached a PDF to this blog entry so you guys can see the basic process I'm imagining for my next AIR game. (You can also export to images as well.) 

All designs are stored in XML which means you can get nice changelists when committing to your source control repository. 

All in all - I think this is the product that is going to finally make me start using wireframes. The basic price for the product is 75 dollars, but discounts are available for bulk purchases. I've also got to say that his license is very nice. A user can run the plugin on as many machines as he or she wants. So you can buy one license for your desktop and laptop. Heck, he even said you can run them at the same time.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fmain%{% endraw %}2Epdf'>Download attached file.</a></p>