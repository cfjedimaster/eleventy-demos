---
layout: post
title: "Book Review: The Cross Browser Handbook"
date: "2012-12-04T10:12:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/12/04/Book-Review-The-Cross-Browser-Handbook
guid: 4798
---

Last night I finished reading <a href="http://crossbrowserbook.com/">The Cross Browser Handbook</a> by Daniel Herken and I thought I'd share some thoughts on it. The book is available in PDF form only and costs 29 dollars. He also offers a more expensive version that includes the code templates and workshops.
<!--more-->
At a high level, the book discusses:

<ul>
<li>Rendering engines, DOCTYPE, and compatibility modes</li>
<li>HTML</li>
<li>CSS</li>
<li>JavaScript</li>
<li>Cross-browser testing</li>
</ul>

I found the beginning of the book to be extremely interesting. I had somewhat of a haphazard understanding of rendering engines and DOCTYPE before, but I think Herken did a great job of explaining the details and demonstrating the differences. He also gives what could be one of the best examples of why stuff like this matters. (I won't ruin it, but if you run an online business than you will find his real life experience in this area quite shocking.) 

The meat of the book, the three sections on HTML, CSS, and JavaScript, are not full explanations of these technologies. As the book is only 120 pages long that wouldn't be enough to cover one of these topics. 

Rather, Herken gives a very brief explanation of features (for example, box-shadow,  geolocation, etc), a description of where browsers are in terms of support for that feature, and finally, a list of possible workarounds. This by itself is not new. For example, I can find support information at <a href="http://www.caniuse.com">CanIUse.com</a>, but the combination of a quick explanation, support, and workaround, I thought was very well done. You can quickly get an idea of what this particular thing does and how well it's going to work in your supported browsers. My only concern here is updates. Before purchasing this book I'd ask the author if updates will be free. (I'd imagine yes, but I'd check...) 

The final section on testing was quite informative. Of the seven tools he described I had heard of a grand total of one of them before. Another section that was particularly informative was the coverage of JavaScript compatibility issues with IE. In some cases I was shocked at how bad IE did things.

All in all, I think the book is worth your money. I did see a few more typos than normal (I don't think I've read a book yet without a typo or two) which may be due to English not being his native language, but it wasn't anything too bad. 

There was one thing he said that I thought was misguided:

<blockquote>
Only if you absolutely have to write your own JavaScript code you should do so!
</blockquote>

But as my readers know, this topic is something I've been sharing recently on this blog and I know I'm in the minority. At the end of the day, I'll use jQuery, but I truly feel like we need to start writing more vanilla JavaScript if we ever hope to improve our skills. 

<img src="https://static.raymondcamden.com/images/medium-book.png" />