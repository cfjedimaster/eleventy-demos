---
layout: post
title: "Proof of Concept - Updating news items dynamically"
date: "2012-07-02T11:07:00+06:00"
categories: [html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/07/02/Proof-of-Concept-Updating-news-items-dynamically
guid: 4664
---

I apologize in advance if the title of this post isn't terribly clear. For a while now I've wanted to build a proof of concept JavaScript application that demonstrated automatically displaying new content. Think of your Facebook news feed as an example.  In a trivial application, you could simply get your new content and prepend it to the content. However, I wanted to do something a bit more complex.
<!--more-->
First - I wanted to gracefully display the new content via animation. So instead of simply "popping" in, you can see it slide in and push the older content down. 

Secondly - and this is a bit of a pet peeve of mine, I wanted to make the application not shift the content when a) I'm mouseovered the text or when b) I've scrolled down a bit to focus in one one particular news item. Why? Well, for the first item, I can't tell you how many times I've been about to click something in TweetDeck when the app decides to scroll down content when new stuff is loaded. It's very annoying. As for the second item, I'll often find myself reading something when the feed decides to update. Again - annoying. 

So let's start off with a first draft of the application. In this version, I'll run a scheduled process every few seconds or so, get new content (which will just be random), and simply prepend it to my div. Here's this version:

<script src="https://gist.github.com/3033537.js?file=gistfile1.html"></script>

I'm assuming most of this will be pretty basic for my readers. I'm making use of <a href="http://www.handlebarsjs.com">Handlebars</a> for my display. You can see the template generation first in the document ready block. I set an interval of 4 seconds for generating new content. 

My checkData function handles getting the new data. I select a random number of items from 0 to 3. If we have any number over 0, I generate fake news items for each. (If you want to see my random text generators, just view source on support.js when I link to the demo.) Finally - we take each new item item and prepend it to a div. This is as about as simple as it gets. 

<a href="http://www.raymondcamden.com/demos/2012/jul/2/test1.html">First Demo</a>

For my next iteration, I decided to work on the animation. jQuery has a nice animation method called slideDown. Given hidden content, you can use this to slowly reveal the content over a duration. Here is the modified version for the updated display code:

<script src="https://gist.github.com/3033555.js?file=gistfile1.js"></script>

This was pretty simple, but has a small bug in it. In any iteration of checkData, you may have multiple new items added to the stream. With the code above, each one has its own slide effect. When you have 2 items you get a "venetian blinds" type of effect. While this was wrong, I thought it was kinda cool too:

<a href="http://www.raymondcamden.com/demos/2012/jul/2/test2.html">Second Demo</a>

I figured that I could fix this by applying the hide/slideDown to a 'wrapper' for all of the new content in any given run of checkData. I modified the code to create a new div around my N news items and then applied the animation to that:

<script src="https://gist.github.com/3033574.js?file=gistfile1.js"></script>

This worked better: <a href="http://www.raymondcamden.com/demos/2012/jul/2/test3.html">Third Demo</a>

Woot! Ok, so at this point, I thought I had it displaying adequately. Now for the hard part. I wanted to find a way to pause updating when you either mouseovered a news item or scrolled down some. I decided to first worry about the mouse events.

<script src="https://gist.github.com/3033597.js?file=gistfile1.html"></script>

I pasted the entire template since this one has changes in multiple areas. First - note the mouseover/mouseout event handlers. When we mouseover, I update a global variable to indicate we should hide updates. When we mouseout, we flip that and run a new method, addToStream. Note that "html" is now a global variable.

If you scroll down to checkData, you can see now that we check the hiding status before we display anything. Because we have 2 places that need to display html (remember the mouseout event above), I abstracted it out into its own method. addToStream simply renders out the items and clears the global html variable.

To test this, visit the <a href="http://www.raymondcamden.com/demos/2012/jul/2/test4.html">fourth demo</a> with your console open. When a news item appears, mouse over and wait. When you see that items were added (in the console log), mouse out and they should show up.

Ok... still with me? For the final modification, I wanted to make it so that if you had scrolled down (in theory to view a news item), the main stream div would not update. This is rather easy if you listen for scroll event on the window object. However - I also wanted to make this "rule" have less priority then the mouseover rule. Since I only had one global variable (hiding), I needed another flag just for when I had mouseovered content. This code block has the relevant changes.

<script src="https://gist.github.com/3033649.js?file=gistfile1.js"></script>

Looking at the mouse events, you can see the new variable being set, mouseOvered. Below them you can see the new handler for scroll events. I'm not terribly sure how smart this is, but it seems to work ok in my testing: <a href="http://www.raymondcamden.com/demos/2012/jul/2/test5.html">Fifth Demo</a>

So, what do you think?