---
layout: post
title: "An Example of How I Dig Into Your Code"
date: "2017-04-27T07:49:00-07:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2017/04/27/an-example-of-how-i-dig-into-your-code
---

Like most web developers (or some of you I hope), from time to time I'll open up dev tools on a page and take a look at what's going on behind the scenes. This morning I was drinking my coffee, waking my sick butt up (allergies - never really been a problem before, but this year decided to go all epic on me), when I got an email about an update to a bug I had filed for ColdFusion. The detail page it led me to had some interesting issues and I thought it might be interesting to share some of the things I found.

To be clear, I'm not picking on the developer here. In fact, one of things I found is the same mistake I made early on in my career. But I thought it might be interesting to my readers for me to share how I dig into a site and poke around. This isn't a "Full Investigation and Performance Report" type thing. No, this is "Let me poke around for 10 minutes with dev tools and see what I'd find."

Ok, so how did I start? First, this is the link I was sent regarding an update to a bug:

<a href="https://tracker.adobe.com/#/view/CF-4198322" target="_new">https://tracker.adobe.com/#/view/CF-4198322</a>

Go ahead and click that link - it will open in a new tab. 

I remembered the bug, but I couldn't remember if I reported it or had just voted for it - or whatever. I then noticed something odd. Nowhere in the bug report does it say who made the bug. Hmm. Ok, let's open dev tools.

![ACF](https://static.raymondcamden.com/images/2017/4/acf1.png)

Looking at those network requests, I assumed that the POST to /search was returning the bug data. Let's dig into that. Chrome's dev tools do a great job rendering JSON into a nice, easy to browse view. I dug into and found some interesting stuff:

![ACF](https://static.raymondcamden.com/images/2017/4/acf2.png)

So right away - I can see that *maybe* this is my bug. A custom field includes my name, and a unique ID that probably represents my user account. That's probably safe. If it *is* my bug, I have to wonder why they don't show it in the UI, but return it in the JSON. In general (stress - in general) - if you aren't using data, you don't want to return it. Every extra bit of data you don't display just makes your app slower. (Remember that tip, it's going to come back.)

I then noticed the comments field. It mentions a length of two. I glanced back up at the actual view and saw there was no comments. Eh? Let's up that one.

![ACF](https://static.raymondcamden.com/images/2017/4/acf3.png)

So to me, those look like internal comments. We can see a changelist for the fix, even see what Java file was patched. We also see the name of the person who did it. If I had to guess, I'd bet the front end checks that `visibility` field to see if it should be displayed. 

Again, hopefully nothing 'secret' is being returned in comments. But as I said - if you aren't using the data, why return it?

So I looked back in the list of network requests and noticed two things:

https://tracker.adobe.com/api/search/created?id=5FBC41E943BD265C992015D5&email=raymondcamden@gmail.com&name=Raymond%20Camden&startAt=0&orderBy=createdDate&order=DESC

https://tracker.adobe.com/api/search/voted?id=5FBC41E943BD265C992015D5&email=raymondcamden@gmail.com&name=Raymond%20Camden&startAt=0

Looking at the URLs, it looks like this returns bugs I created and voted for. In my case, both of these are kinda big. Together they total around 200k. From what I can tell, nothing in this page uses it. If you click home, a full redirect is *not* done, so this data is not lost, so that's good, but I'd probably delay loading that on the issue view page. There is no guarantee I'm going to click around, and in fact, I'm probably here just to look at the bug report and thats it. 

In both cases, the full issue is loaded, which could be loaded later. Why not return just the IDs, or the IDs and a title for viewing, but wait to load the details till later? 

Again - this is exactly the kind of thing I did when I was learning to work with Ajax apps. I'd be willing to bet when then person who wrote this test, she or he had maybe 10-20 bugs assigned to them so the results were much smaller.

Oh - and the ID used in those values? You can absolutely use other IDs to load other people's reports. How do you find those ids? Either in the creator field (yes, I confirmed I was the creator of that bug), or in the comments. (As an aside, it looks like that creator field is only returned for stuff I made.) I picked an ID from one of the comments (sorry Jay Kirk) and confirmed I saw their data. Votes are public, as are bugs you create, so this isn't necessarily a security issue either. Just another example of the kind of things I try. ;)

Finally - as I'm writing this - Adam Cameron is also digging around and noticed a lot of this info is dumped straight to the console itself - so there's no need to even dig into the network requests. 

I actually went a bit further and played with sending requests via Postman. I was able to trigger a stack trace:

![ACF](https://static.raymondcamden.com/images/2017/4/acf4.png)

An unhandled exception is also a "No No" for production sites, but this looks to be a Jira issue, not code written by the Adobe CF team as far as I can tell. 

Anyway - is this useful?