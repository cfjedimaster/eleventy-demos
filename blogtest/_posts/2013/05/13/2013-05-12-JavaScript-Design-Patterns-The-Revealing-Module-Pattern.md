---
layout: post
title: "JavaScript Design Patterns - The Revealing Module Pattern"
date: "2013-05-13T08:05:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/05/13/JavaScript-Design-Patterns-The-Revealing-Module-Pattern
guid: 4931
---

It has been a few weeks (ok, a few months) since my last blog post on JavaScript design patterns. I'd apologize, but frankly, it will probably be a few more weeks until I blog on this subject again, so hopefully people aren't expecting a <i>fast</i> series here (grin). As a reminder, the idea behind this series is to create real, <strong>practical</strong> examples of various JavaScript design patterns based on the book, "Learning JavaScript Design Patterns" by Addy Osmani. (See my review <a href="http://www.raymondcamden.com/index.cfm/2013/4/14/Review-Learning-JavaScript-Design-Patterns">here</a>.) In this blog entry I'll be discussing the Revealing Module pattern.
<!--more-->
Addy Osmani describes the Revealing Module pattern as:

<blockquote>
The Revealing Module pattern came about as [Christian] Heilmann was frustrated with the fact
that he had to repeat the name of the main object when he wanted to call one public
method from another or access public variables. He also disliked the Module pattern's
requirement of having to switch to object literal notation for the things he wished to
make public.
</blockquote>

There's two main issues here. First, the concept of "repeat the name of the main object when he wanted to call one public method from another..." If your only experience with the Module pattern is based on my <a href="http://www.raymondcamden.com/index.cfm/2013/3/22/JavaScript-Design-Patterns--The-Module-Pattern">previous blog post</a>, then this may not make sense. Let's consider a simple example.

<script src="https://gist.github.com/cfjedimaster/5567875.js"></script>

I've got a simple module here called revealModuleTest. (And yes, this isn't a "real world example", but I wanted to demonstrate the issue with a simple block first.) My module has one private method, and three public methods. The first one, doPriv, simply wraps a call to the private method. The second public method, pub1, just returns the number 2. Finally, testpub, just makes use of pub1 and multiplies it by two.

Note the three tests at the bottom. As the comments suggest, the final method will fail: <strong>Uncaught ReferenceError: pub1 is not defined </strong>

Why? When the result of the module (everything in that return) is returned back to the caller the scope has changed such that pub1, by itself, is no longer addressable from testpub. You won't have this issue if a private method calls another one, but you will definitely run into this with the public methods returned by your module.  (I don't think I did a great job explaining this - I may come back and flesh this out.)

The fix is rather trivial - simply use the same API you would in your own code calling the module:

<script src="https://gist.github.com/cfjedimaster/5567903.js"></script>

The second thing Heilmann talks about is the switch to using object notation for defining methods. Everything in the return block is using object notation. Personally, this doesn't seem like a big deal, but all things being considered, I would prefer to write more code in function x() syntax versus x:function(). 

If it sounds like the Revealing Module is just a cosmetic change, that would be fair I think. But don't simply dismiss it. Anything that makes you quicker, more efficient, etc in your development is probably a good thing. I'd also argue that the issue with "public calling public" is something you could easily accidentally trip into. If the Revealing Module pattern makes that easier to avoid, then it is yet another reason to consider it.

Let's look at an example of this - again - using my kinda stupid example.

<script src="https://gist.github.com/cfjedimaster/5568608.js"></script>

As you can see, this isn't a radically changed version. It has the same smell, but is just structured a bit differently. Note that all of the real logic is in private functions. The return block is now far simpler - it just provides the public API. 

Ok, so how about a real example? In my previous blog post I created a diary application that allowed you to create and read diary entries stored in WebSQL. I defined my Diary as a module. You can view that source <a href="https://gist.github.com/cfjedimaster/5222944/raw/fabc9a6080632f8623fc088ab42568eb417a8764/gistfile1.js">here</a>.

To modify this to match the Revealing Module pattern, I moved everything into private methods and created a much simpler return block.

<script src="https://gist.github.com/cfjedimaster/5568660.js"></script>

So what do you think? I have to be honest. When I first read about this pattern, I really didn't think much about it. As I said, it seemed just cosmetic. But after seeing the change to my Diary module, it just... feels better. 

I didn't put this up as a 'live' demo since the functionality is the exact same as before. (And as a reminder, it only works in WebKit browsers, which is bad, and will be addressed later.) If you really want to try this, you can download the code from the last entry and drop in the new diary. Since it is has the exact same API, everything will just plain work!