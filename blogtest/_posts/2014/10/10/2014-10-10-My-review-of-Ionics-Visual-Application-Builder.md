---
layout: post
title: "My review of Ionic's Visual Application Builder"
date: "2014-10-10T15:10:00+06:00"
categories: [design,development,javascript,mobile]
tags: []
banner_image: 
permalink: /2014/10/10/My-review-of-Ionics-Visual-Application-Builder
guid: 5332
---

<p>
Let me begin by saying that - like most developers I think - I have a pretty strong distrust for visual builders for applications. I've been burned by too many tools that create something pretty on screen but generate a horrible mess of code behind the scenes. I think there are definitely tools that do a good job of it now, but once you've been scarred by seeing div tags nested twenty layers deep, you get a bit sensitive. I've recently become a bit more open minded about it. XCode, in general, has a very powerful UI building metaphor to it and I kinda dig how the Android tools handle it in Eclipse as well. Now that you understand how I approach these tools, let me talk to you a bit about the upcoming <strong>Ionic Creator</strong> tool from the folks behind Ionic.
</p>
<!--more-->
<p>
Ionic Creator is currently in private beta. For a while now folks have been able to sign up for testing and the Ionic team is inviting new batches of people at regular intervals. Earlier this week I was invited to the beta and gave it a spin. When you fire up the tool for the first time, you're prompted to create a new project. You can specify a starter page based on a few preset templates. This list is a bit bigger than what the CLI provides but for the most part I think you can figure out what each does.
</p>

<p>
<img src="https://static.raymondcamden.com/images/icreview/1.png" class="bthumb">
</p>

<p>
Once your project is created you're provided with a blank slate for your first page. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/icreview/2.png" class="bthumb">
</p>

<p>
At the time of this review, there was a pretty serious bug where the project would load the page in an invalid state. If you try to do anything at all now, for the most part, it won't work. The clue is the lack of a header on the page. If you see this, hit reload, and notice how it changes:
</p>

<p>
<img src="https://static.raymondcamden.com/images/icreview/3.png" class="bthumb">
</p>

<p>
It is a small thing, but I ran into this whenever I loaded, or changed, projects. Once past this then it is a simple matter to begin dragging and dropping components onto the page. Components include buttons, cards, images, lists, and form elements. You can also drop in an HTML or Markdown component for free form typing. Currently the application will not let you drop a form element onto the page unless you put it inside a form component. That's good, but there isn't any feedback as to <i>why</i> you can't drop the component. I've already filed an issue suggesting they provide some feedback. Here is my attempt to add some basic controls to the page.
</p>

<p>
<img src="https://static.raymondcamden.com/images/icreview/4.png" class="bthumb">
</p>

<p>
Notice that the upper left hand corner is used as a simple tree view. You can select items there to edit properties or select them on the page itself. Each component has different things you can modify. As an example, it is pretty easy to modify the list:
</p>


<p>
<img src="https://static.raymondcamden.com/images/icreview/5.png" class="bthumb">
</p>

<p>
You can also select items on the page and move them up. Creator intelligently handles "collections" so moving the list will also move the list items. Adding new pages is also a simple matter:
</p>

<p>
<img src="https://static.raymondcamden.com/images/icreview/6.png" class="bthumb">
</p>

<p>
Each page has a name and a "routing url". You can then specify that a button, for example, will link to another page. I created a new page called Other and kept the default routing url of /page2. I went back to my first page, selected one of the buttons, and set it to load up the new page:
</p>

<p>
<img src="https://static.raymondcamden.com/images/icreview/7.png" class="bthumb">
</p>

<p>
So for the most part, that's it for the 'drag/drop' aspect. You can setup the components as you see fit and create as many pages as you would like. Once you're done playing around with the widgets, you can easily test it directly in the web page itself:
</p>

<p>
<img src="https://static.raymondcamden.com/images/icreview/8.png" class="bthumb">
</p>

<p>
I haven't tested the preview mode very hard, but basic links do work just fine:
</p>

<p>
<img src="https://static.raymondcamden.com/images/icreview/9.png" class="bthumb">
</p>

<p>
Ok, so, that's not bad. But what about the code? Creator provides three different ways to get to the bits. Clicking Export brings up your choices:
</p>

<p>
<img src="https://static.raymondcamden.com/images/icreview/10.png" class="bthumb">
</p>

<p>
The first one simply provides you with a unique ID to use at the command line. This is probably the one most folks will use. As far as I know this is a one way street. You can't push back changes you made locally to Creator, but honestly there is probably no good way to handle what people would send back in. Obviously the first line, <code>npm install</code> doesn't make sense if you already have the CLI installed. There should probably be a note there warning folks they don't need to reinstall Cordova and the Ionic CLI. Then again, the audience for this is probably more on the newbie side and may include people who haven't ever used the CLI.
</p>

<p>
The Zip File option is just that, a zip of your code. Finally, the Raw HTML is a <i>version</i> of your application. I say version because they combine the HTML and JavaScript into one file to make it easier to cut and paste. I see the logic of that but it still bugs me a bit. ;) I just noticed that the zip version is also one file. Again, I don't like that, but that's just me.
</p>

<p>
<img src="https://static.raymondcamden.com/images/icreview/11.png" class="bthumb">
</p>

<p>
If you source a new project via the code given in the export prompt you get a 'proper' Ionic project that you can immediately begin using. Oddly, some of the application logic is in index.html as opposed to app.js, but that may be a personal preference type thing. Ignoring that though you can go from the visual builder to your simulator in seconds - yep - seconds:
</p>

<p>
<img src="https://static.raymondcamden.com/images/icreview/12.png" class="bthumb">
</p>


<p>
So, final verdict? I'm not sure this is a tool I'd use for my demos, but I'm probably not the target audience. I could definitely see using this as a prototype builder though. Or even asking a semi-technical client to take it for a spin and see what they like. It could save some time in terms of bootstrapping the application and I see some very strong value there. I think if it was tied to a service like PhoneGap Build, it would be a <strong>huge</strong> win for folks. 
</p>