---
layout: post
title: "Data-driven Edge Animate projects"
date: "2012-11-07T08:11:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/11/07/datadriven-edge-animate-projects
guid: 4777
---

This week I demonstrated <a href="http://html.adobe.com/edge/animate/">Edge Animate</a> to two cities in Texas as part of the Create the Web tour. Animations are not something I typically spend a lot of time thinking about, but I was grateful for an opportunity to show off what I think is a pretty cool program. At my first presentation, an attendee asked if Edge Animate supported data-driven animations. Hear is what I told him, and a look at a simple proof of concept.
<!--more-->
First - I told him that - in my mind - Edge Animate would be fine for data-driven projects, but only those that involved at least <i>some</i> timeline based animation. That distinction may not make sense if you've never used Edge Animate before. (I encourage you to download it via the link I shared above.) Edge Animate has a timeline that allows you to create animations over time. So for example my animation may do one thing from time 0 to time 1, and something else from time 1 to time 4. Integrating data with that should not be a problem. Imagine a simple weather animation. You may have parts to a thermometer fly in and come together like a puzzle. At the end, you display the current temperature.

The other example though would be an animation that is entirely data driven with no concept of "time". An  example of this could be a simple pie chart that updates with live data, using animation to smoothly modify the pie slices. 

Obviously there's a gray area here and each project is different. Edge Animate also makes it easy to add interactivity to your projects so assuming that only projects with crap flying around makes sense isn't exactly fair either. Hopefully you get my drift here. 

With all that aside, let's look at a real demo. This won't be the most exciting Edge Animation you will see but it will hopefully illustrate the concept. For my demo I want to build an animation of a box that comes onto the screen and then just displays some text. The data-driven part will come from the fact that the text we display will need to come from a server-side file. You could imagine this being a ColdFusion, PHP, or some other script. For now though I just made it simple text.

I began by creating the animation and using static text. I used two seconds for the 'rectangle fly in' animation and a second for the text to fade in.

<img src="https://static.raymondcamden.com/images/screenshot37.png" />

You can see this in action here: <a href="http://www.raymondcamden.com/demos/2012/nov/7/v1/Untitled-2.html">http://www.raymondcamden.com/demos/2012/nov/7/v1/Untitled-2.html</a>. Note that I didn't bother setting up any preloader or providing accessible support. I'm trying to keep this as simple as possible.

So now we have a basic animation done. We could tweak it to make it prettier. Modify the flow of the movement. Etc. But let's focus on making this data driven. In order to do that I need to first stop the animation from running automatically. My Ajax call may be slow so I don't want anything to run until I've gotten my data back. Turning off the autostart is as simple as clicking on the Stage in Edge Animate and disabling it in properties.

<img src="https://static.raymondcamden.com/images/screenshot38.png" />

That was easy. The next part was a bit more difficult. In a normal application, I'd listen for a DOM ready type event before doing whatever I need to do. But I know that Edge Animate also has its own events. I assumed - but wasn't sure - that there was an event I could listen in for and trigger my own custom logic. With the Stage still selected, I clicked the Actions icon:

<img src="https://static.raymondcamden.com/images/screenshot39.png" />

I noticed the creationComplete event and assumed that was a safe bet. Going with the assumption that all my logic would go in here, I used the helpful menu of actions to guide how I'd write the code. I first selected "Set Element Text" and Animate added the following block:

<script src="https://gist.github.com/4033453.js?file=gistfile1.txt"></script>

My text symbol was already named Text so I left the code as is. The portion that read "NewText" would be changed to the result of my Ajax call, but for now, I just wanted to ensure this worked. 

Next, I knew that I'd want to start the animation itself. This too was easy. I selected the "Play from" action and specified a value of 0.

<script src="https://gist.github.com/4033487.js?file=gistfile1.txt"></script>

At this point, I noticed something odd. When I tested my animation, the text in the rectangle did not update. Something told me though that it may be the event I used. I don't have proof of this (but I'll find out), but I was willing to bet that the when Edge Animate ran the animation in the tool itself, it never fired a creationComplete event. I saved my work instead, ran it in the browser, and saw everything worked as expected.

You can view this version here: <a href="http://www.raymondcamden.com/demos/2012/nov/7/v2/Untitled-2.html">http://www.raymondcamden.com/demos/2012/nov/7/v2/Untitled-2.html</a>. You should now see it run the animation and use the new text as opposed to the word "STATIC". 

Woot! So now my work was almost done. I made a copy of my work and opened it in another editor. The file Untitled-2_edgeActions.js contained the event handler and custom logic I had created. Here it is as Edge Animate exported it.

<script src="https://gist.github.com/4033520.js?file=gistfile1.js"></script>

And here it is after I modified it to do an Ajax call.

<script src="https://gist.github.com/4033535.js?file=gistfile1.js"></script>

Pretty simple, right? You can run the final version here: <a href="http://www.raymondcamden.com/demos/2012/nov/7/V3/Untitled-2.html">http://www.raymondcamden.com/demos/2012/nov/7/V3/Untitled-2.html</a>