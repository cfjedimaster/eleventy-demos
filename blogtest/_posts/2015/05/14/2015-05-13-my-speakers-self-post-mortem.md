---
layout: post
title: "My speaker's self post-mortem"
date: "2015-05-14T08:56:45+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2015/05/14/my-speakers-self-post-mortem
guid: 6141
---

I've got a good hour and a half before I board (yes, I'm one of those people who arrive early at the airport still), and while driving to the airport I was thinking about the presentations I gave yesterday. I spend a <i>lot</i> of time thinking about my presentation and trying to see how I can make them better. I thought it might be interesting for me to share some specific thoughts I had about my most recent presentations and demonstrate the kind of thinking that goes behind updating a presentation. Obviously this will be very specific to what I just gave, but I'm hoping the "inside look" may help others who are new to presenting or are just looking to improve their game. (And honestly, I could be completely wrong about what I need to improve, so part of hope behind this post is that other more experienced speakers may help me out as well!)

<!--more-->

<h4>Session One - Ionic</h4>

The first of the presentations I gave yesterday was an introduction to <a href="http://www.ionicframework.com">Ionic</a>. This is a session I've given about five times now. It is one I don't have to prepare too much for as I've got the basic gist of it down pretty well. But Ionic is a fast moving product. This week it released 1.0. A few days before that they released a new feature (the playground). In general, they move quickly. As a speaker, I need to weigh my desire to let the audience know about all the cool crap they do versus being aware of how much stuff I'm throwing at them. 

For example, I currently mention <a href="http://ionicons.com/">http://ionicons.com</a>, which is a nice part of the global Ionic product line, but seems like something I could possibly cut. I also discuss <a href="http://ngcordova.com">ngcordova</a>, which is very cool and useful, but, every time I bring it up in a presentation it feels like a misstep. It feels awkward. So here is something that I think is a good feature, but contextually, it bothers me tone wise and I'm going to remove it from the presentation. I've got five slides in this section. One just bullet points the feature and then I have 2 pairs of before and after slides showing regular Cordova code versus the ngcordova version. The idea being to show how much better (for some) the ngcordova version may be, but it is a lot of code and frankly - if you aren't using promises then it kinda goes right over the head.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/slide1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/slide1.png" alt="slide1" width="800" height="571" class="aligncenter size-full wp-image-6143" /></a>

This leaves me with some space to fill. I had recently taken out a demo I did demonstrating some of the CSS stuff. Why? I feel like most people "get" what CSS frameworks do. Most folks have seen Bootstrap and know that adding class="so and so" makes a pretty bar. Ionic does the same, and me showing this in an editor and browser feels like overkill. I switched to using a slide that shows the code and a screen shot of the result. This kinda minimizes the coolness of it but at the same time, folks <i>expect</i> Ionic to be pretty. When I show them this I don't need to spend a lot of time on it because it is assumed. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/slide.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/slide.png" alt="slide" width="800" height="571" class="aligncenter size-full wp-image-6142" /></a>

In general though I don't spend a lot of time in the code base. I demonstrate pull to refresh, which works well I think, but I'd like to spend a bit more time with a proper, but simple, Ionic demo. At the end of the presentation, I discuss an app I built with Ionic that is tailored for people adopting in China. Now, I'm biased, but I think this works <i>damn</i> well. It's got an emotional tag (my wife and I adopted from China), it has some funny jokes (yes, I plan my jokes ahead of time), and it just "feels" like a great way to show Ionic while discussing a topic I'm passionate about. I don't normally spend a lot of time in the code, but now I'm going to expand that section a bit.

<h4>Session Two - Static Sites</h4>

My second session was a brand new one. I know some folks recommend it, but I don't do a practice session by myself before giving a presentation. I mentally go through the slides <i>many</i> times, but I don't give the talk in front of a mirror or to an empty room. That may work for others, but frankly, I'd feel stupid doing that. So I went into this session not exactly sure how well it was going to work. I felt pretty safe timing wise - I've given enough presentations over the past ten years to have a good gut feeling for how much material is necessary. What I wasn't sure of was how well the content would work.

For me, the goal of this presentation was to introduce people to the idea of why using a static site generator may work well for them. I divided the session into the following sections:

<ul>
<li>Why
<li>How - Generally
<li>How - Specifically
<li>Bringing Dynamic Aspects Back
<li>Hosting options
</ul>

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/slide2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/slide2.png" alt="slide2" width="800" height="571" class="aligncenter size-full wp-image-6144" /></a>

The two "How" sections are where I was most concerned. The first How is basically stating that there are editors (like Dreamweaver) that can help build static sites and then there are generators - the main point of the talk. I then go into how generators work generally. I spent a lot of time in this section because my audience in this case were primarily people doing back end work. Like me, I think they had been used to a mindset of needing an app server to solve most problems. In my experience, when I first used a static site generator it was mind opening. I suddenly saw how I could switch from using app servers and databases and switch to simple files and keep my life easier. In this particular case, in this particular conference, I felt that was important so I really stressed it. However, in another conference, one that was perhaps 100% front-end, I'd probably go a bit quicker in that regard. For folks used to things like Grunt/Gulp/preprocessing in general, this is less of a mind shift for them. So to be clear, it isn't that I did that wrong in my presentation (imo), but I recognize it as something I need to adjust based on my audience.

The second "How" section is me looking at two different products, Harp and Jekyll. I like them both, with a preference for Jekyll. I thought it was useful for the audience to see two examples of generators in action and see how different tools approach the problem. The issue I ran into though was that I think I may have gotten just deep enough to confuse people versus giving them the "taste" I wanted. So now my question is - do I drop one? That may makes things simpler. I think most people understand that different tools will give different ways of doing things so there isn't necessarily value in "proving" that to the audience. I just need to figure out which of the two I'll select. As I said, I prefer Jekyll, but this isn't about me. So I'll probably select Harp and mention, if it makes sense, issues I ran into Harp that are better in Jekyll. As it stands, I think I want to whip up a presentation for Jekyll by itself. Why? I want to learn it more and there is no better way to do that then making myself build a good presentation for it.

Outside of that - I'm pretty darn satisfied with this presentation and I'm hoping to give it online soon to share with folks.

<h4>Wrap Up</h4>

For those of you who don't do presentations, I hope this gives yo an inside look at some of the thinking/preparation/evolution that takes place as part of the process. For those who do present, I'd love to hear your own stories and strategies. Leave a comment below!