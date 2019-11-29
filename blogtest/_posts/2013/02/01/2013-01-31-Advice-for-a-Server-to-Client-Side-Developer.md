---
layout: post
title: "Advice for a Server to Client Side Developer"
date: "2013-02-01T09:02:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2013/02/01/Advice-for-a-Server-to-Client-Side-Developer
guid: 4843
---

Yesterday I got an email from a reader that meshes perfectly with what I presented on earlier in the week. Here is his email:

<blockquote>
Hi Ray, what would be your advice to CF/PHP developer  - if that matters at all) who wants to get properly into HTML5/Javascript/Jquery arena. I have basically used JS/jQuery and a little bit of HTML5 stuff without understanding fully - just using ready made code but I would like to start writing my own code - does that make sense?

I understand other people's code but I am not able to write my own yet.  I also find overwhelming the amount of new libraries that are born every day and I do not know where I should start.
</blockquote>
<!--more-->
The first thing I noticed here is that you said you're using code without fully understanding it. Welcome to the club. I run into this a lot. My presentation earlier this week was very much based on the experience of people like you. People who use JavaScript without  perhaps understanding what in the heck they are doing. That's "wrong", "bad", etc but it surely happens. Based on the type of questions I get on some of my posts, it actually feels more like the majority. 

While that is unfortunate, it is at least a good thing that you recognize what you're doing. I know I've done this myself many times in the past but I try to at least flag the respective technology/routine/library/etc for follow up as soon as possible. 

<img src="https://static.raymondcamden.com/images/mdn-logo-sm.png" style="float:left;margin-right:10px" />In terms of getting a basic understanding of HTML and JavaScript, there are a boat load of resources out there. For me though none can compare to the <a href="https://developer.mozilla.org/en-US/">Mozilla Developer Network</a>. I ignored this site for <i>years</i> because I assumed it was "Firefox-only", but that couldn't be farther from the truth. Their reference materials and guides are well done and should be easy to understand. 

While they have numerous topic guides, here is a direct link to their HTML5 and JavaScript guides:

<a href="https://developer.mozilla.org/en-US/docs/JavaScript">JavaScript</a><br/>
<a href="https://developer.mozilla.org/en-US/docs/HTML/HTML5">HTML5</a>

I'm spending time next week working with SVG and their <a href="https://developer.mozilla.org/en-US/docs/SVG">guide</a> will be my primary learning resource. 

One more point I'll make here. For me, nothing "sticks" code-wise until I open up an editor and write a quick sample. Hell, I'll even do it for something as simple as document.writeln(new Date()). Just being able to see it run and see the output in my own browser makes it persist a bit better in my brain. I also like having these sample files so that I can experiment with them later and see what happens (i.e. what breaks) when I try new things.

<b>Pro Tip:</b> Before you Google for anything web related, prefix it with "mdn". For example, "mdn array". This will ask Google to focus on MDN resources first. (Which means you will skip the W3Schools site!)

Another resource is <a href="http://www.webplatform.org/">WebPlatform.org</a>, spearheaded by my own company and many others. This is still in the growing stages though so for now I'd probably stick to MDN.

Now let's talk about you being overwhelmed. Again, you are not alone. Want to get really scared? Go visit <a href="http://jster.net/">Javascript Territory</a>, which brags about having an index of 1019 JavaScript libraries. Hope you weren't planning on having a free weekend. ;)

I hear this a lot and I always say the same thing. The most important thing you need to remember is that every single one of these libraries is meant to solve a problem. If you don't have a problem, you don't need 'em. If you find yourself developing something and run into an issue, then try to figure out the general category of your issue, let's say date formatting, and then focus your Googling on that. If you see a random Tweet about Cowbell.js (I have no idea if that exists), click on it, read it, see what it concerns, and move on. Just keep a little nugget in the back of your head that "There is a library out that there solves problem X, when I have it, I'll go look more." 

Speaking of categories, do check out <a href="http://jster.net">Javascript Territory</a> as they do a good job of categorizing those 1000+ libraries. 

As always, I would love to hear the opinions of others, and since I'm in an airplane all day, today is the perfect day to disagree with me violently as I won't be able to respond. ;)