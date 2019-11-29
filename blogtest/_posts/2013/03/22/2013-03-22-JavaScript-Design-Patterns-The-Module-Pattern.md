---
layout: post
title: "JavaScript Design Patterns - The Module Pattern"
date: "2013-03-22T13:03:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2013/03/22/JavaScript-Design-Patterns-The-Module-Pattern
guid: 4888
---

(Edit: I see that the Gists/code samples are displaying extra lines on top/bottom. Please ignore. Will try to fix after lunch.) As I <a href="http://www.raymondcamden.com/index.cfm/2013/3/19/JavaScript-Design-Patterns--My-Crazy-Plan">mentioned</a> a few days ago, I'm currently in the process of reading Addy Osmani's <a href="http://addyosmani.com/resources/essentialjsdesignpatterns/book">JavaScript Design Patterns</a> book. (Note - in my earlier blog entry I linked to the physical copy at Amazon. The link here is to the free online version. I think his book is worth buying personally, but you can try before you buy!) The first pattern described in the book, and the one I'm going to talk about today, is the Module pattern.
<!--more-->
Before I begin, I want to be clear. I'm writing this as a means to help me cement my understanding. I am not an expert. I'm learning. I expect to make mistakes, and I expect my readers to call me out on it. If in the end we all learn something together, then I think this process is worth while!

Addy describes the Module pattern like so:

<blockquote cite="http://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript">
The Module pattern was originally defined as a way to provide both private and public encapsulation for classes in conventional software engineering.

In JavaScript, the Module pattern is used to further emulate the concept of classes in such a way that we're able to include both public/private methods and variables inside a single object, thus shielding particular parts from the global scope. What this results in is a reduction in the likelihood of our function names conflicting with other functions defined in additional scripts on the page.
</blockquote>

I think this makes sense by itself, but it may help to back up a bit and consider why encapsulation may be good in general. If you are new to JavaScript, you have probably built web pages that look a bit like this.

<script src="https://gist.github.com/cfjedimaster/5222728.js"></script>

You may begin adding interactivity to your page by adding a simple JavaScript function:

<script src="https://gist.github.com/cfjedimaster/5222739.js"></script>

And then progressively adding more and more...

<script src="https://gist.github.com/cfjedimaster/5222749.js"></script>

Eventually, the amount of JavaScript code you have may get to a point where you realize you probably should be storing it in its own file. But moving all of that code into a separate file doesn't necessarily help. After a while you begin finding yourself having difficulty finding the right functions. You may have code related to feature X next to feature Y followed by something else related to feature X. Maybe then you create multiple JavaScript files. One for X, one for Y. But as Addy alludes to above, you run the risk of function names overwriting each other. 

Consider a web application that interfaces with both Facebook and Twitter. You write a function for Twitter called getLatest that fetches the latest Tweets about Paris Hilton. (And why wouldn't you do that?) You then write code to get the latest status updates from your friends on Facebook. What should we call that? Oh yeah - getLatest!

This isn't something you couldn't handle, of course, but the point is, design patterns were built for the sole purpose of helping you solve problems. In this case, the module pattern is one example of a solution that helps you organize your code. Let's look at a full example of this.

I've created a simple web application that lets users keep a diary. For now the functionality is simple - you can see your past entries, write new ones, and view a particular entry. This web application is going to make use of WebSQL, which does <b>not</b> work in Firefox or IE! This is intentional and I plan to address this in a later blog entry. You can demo this (again, please use Chrome, and again, keep in mind there is a reason why I'm not handling multiple browsers) by going here:

<a href="http://www.raymondcamden.com/demos/2013/mar/22/v1/">http://www.raymondcamden.com/demos/2013/mar/22/v1/</a>

While you can view source yourself, I thought it might be beneficial to share the main JavaScript file here. Warning, this is a big code block. That's kind of the point. Do <b><i>not</i></b> read every line here.

<script src="https://gist.github.com/cfjedimaster/5222821.js"></script>

What you see is how I typically code. My application begins by waiting for the DOM to load. It then needs to set up a database. Next, it needs to list out entries. And so on. If you read "down" the JavaScript file, you can see functions related to DOM manipulation, functions handling my "single page architecture", and functions doing database crap. When I was working on page one, I focused on lists. When I worked on the add form, I worked on data writing support. Basically, as I moved into the application I just plopped down functions one after another.

This works. But - my gut is telling me that this file is messy. When I see something wrong, I'm not sure where to look since everything is mixed up together. In the paragraph above I described most of my functionality as falling into three main areas. I've decided that I'd like to take database stuff and abstract it into a module.

The basic structure of code using the Module pattern can be defined like so:

<script src="https://gist.github.com/cfjedimaster/5222861.js"></script>

Raise your hand if you find that syntax confusing. I know I did. Now it makes sense to me. But for a long time it just felt... weird. I had a mental block accepting the form of this code for a <i>long</i> time. I'm not ashamed to admit it.

For me, it helped if I backed up a bit and looked at it like so:

<script src="https://gist.github.com/cfjedimaster/5222881.js"></script>

Ok, that makes sense. I'm basically saying the variable someModule is equal to whatever in the heck gets done inside my parentheses. Ok, so what in the heck is happening there...

<script src="https://gist.github.com/cfjedimaster/5222895.js"></script>

Ok, so we're creating a function <b>and</b> running it. Immediately. Ok, so whatever the function returns - that's what will be passed to someModule. Here is where things get interesting. Let's put some code in this module.

<script src="https://gist.github.com/cfjedimaster/5222907.js"></script>

The code for this module comes from Addy's example. The variable, counter, is a private variable. Why? Because it isn't actually returned from the function. Instead, we return an object literal that contains two functions. <b>These</b> functions have access to the variable counter, because, at creation, they were in the same scope. (Note: This last sentence may not be precisely describing the situation.) The result of this function is that object literal. My module contains two functions and a private data variable. 

What's nice is - I no longer have to worry about function collision. I can name my functions whatever I darn well please. I can also create private functions as well and hide them away from the implementation. There may be utility functions that make sense for my module but don't make sense anywhere else. I can stuff them in there and hide them away!

So, as I said, I wanted to take out the database aspects of my code. I created a new file, diary.js, and created this module.

<script src="https://gist.github.com/cfjedimaster/5222944.js"></script>

Now I've got a "package" that my main JavaScript file can use. Let's look at that.

<script src="https://gist.github.com/cfjedimaster/5222957.js"></script>

You can see that all of the database functions are now gone. I now access them via diaryModule.whatever. I believe I cut out about 60 or so lines of code, around a third, but what is left is more focused. (I could also take out the functions used to support my single page architecture.)

You can run this version here: <a href="http://www.raymondcamden.com/demos/2013/mar/22/v2">http://www.raymondcamden.com/demos/2013/mar/22/v2</a>

So, questions? Opinions? Rants? :)