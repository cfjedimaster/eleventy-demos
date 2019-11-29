---
layout: post
title: "I wish I had linted before..."
date: "2013-12-02T14:12:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2013/12/02/I-wish-I-had-linted-before
guid: 5090
---

<p>
My development process is probably not the same as most folks. As I do a lot of small POCs (proof of concepts) and demos I don't necessarily get that involved in larger projects or code bases. That's one reason I haven't been a big Grunt user yet. Something else that I've not really gotten into is linting. Linting is the process of checking your code for both existing and <i>potential</i> problems. In my mind though I always thought of linting as a best practices tool and while I want my code to be, well, the best, I don't typically worry about it so much when writing a little 20 line program to demonstrate something for a blog article. Heck, sometimes I'll even go out of my way to <i>not</i> do something that is best practice if I think it will get in the way of what I'm trying to explain in the demo/blog post. (As an example, when I teach jQuery I will avoid chaining 3+ calls together at once so as to keep things a bit simpler.)
</p>
<!--more-->
<p>
But a few months ago I noticed something. Your linting tools are actually pretty darn good for pointing out problems. I know, obvious, right? But I didn't realize how often I'd do crap like renaming a function, telling myself I'd remember to update the references later, and then simply forget to do it. Here is a great example. I've got a call to a function I haven't written yet. The fact that my linter has it flagged as an error makes the tool work like a "live" TODO list. 
</p>

<p> 
<img src="https://static.raymondcamden.com/images/quiz_quizBrackets.jpg" />
</p>

<p>
I'm finding myself making much fewer mistakes now that I've started linting everything I write. Even on my small little demos I'm spending less time running into bugs in the browser and getting stuff working right earlier. 
</p>