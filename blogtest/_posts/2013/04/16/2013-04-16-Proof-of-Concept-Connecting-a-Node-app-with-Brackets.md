---
layout: post
title: "Proof of Concept - Connecting a Node app with Brackets"
date: "2013-04-16T16:04:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2013/04/16/Proof-of-Concept-Connecting-a-Node-app-with-Brackets
guid: 4910
---

In one of the more recent <a href="http://brackets.io">Brackets</a> sprints, Node.js was added to the core of Brackets. If you read my blog you know I've been playing a bit with Node.js lately. I've yet to deploy any "real" web site/app using Node, but I've built a few applications and demos as a way to help learn the platform. In a recent Twitter conversation the idea of using Node.js within an extension came up and I had a good idea I thought I'd try out.
<!--more-->
A few months back I <a href="http://www.raymondcamden.com/index.cfm/2012/12/13/Another-proof-of-concept--MockData">blogged</a> about a Node.js project I created called MockData. The idea was to provide a fake datasource of JSON data for client-side testing. So if you needed to prototype an app that would generate a list of people, you would fire up the server and access the resource by passing in query parameters that 'shape' the result data. So for example: 

http://localhost:3000/?num=rnd:10&author=name&age=age&gender=oneof:male:female&salary=num:150000

This returns:

<img src="https://static.raymondcamden.com/images/screenshot48.png">

I built the project, released it up on GitHub (<a href="https://github.com/cfjedimaster/mockdata">https://github.com/cfjedimaster/mockdata</a>) and didn't really think about it again until last week. The app I built is easy to use... if you know Node. But I bet that I could make it even easier by integrating it into Brackets itself. 

There are a couple of useful links for this. The first being on the Bracket's wiki: <a href="https://github.com/adobe/brackets/wiki/Brackets-Node-Process:-Overview-for-Developers">Brackets Node Process: Overview for Developers</a>. The second is a sample GitHub project: <a href="https://github.com/joelrbrandt/brackets-simple-node">https://github.com/joelrbrandt/brackets-simple-node</a>

I won't repeat the docs, but will encourage you to read them <i>carefully</i>. I'll be honest and say I don't think I grok them 100% quite yet, but I was able to get things working. The warning about abandoned Node processes is a serious one.  In my testing I had to force quit Brackets a few times. That's probably something stupid I did. I'll also point out that you don't want to forget about restarting Node on every change to your Node.js code. As you go back and forth between extension code and pure Node.js code, you can forget this. Two things that hit me that are not in the guides were:

<ol>
<li>For some reason, if I forgot to var scope a variable, I'd get errors. Typically this isn't a critical error. But for my Node.js stuff <i>under Brackets</i>, it was. So I had one non-var-scoped variable in my original Node.js demo that ran just fine as is, but not in Node.js under Brackets.
<li>If you console.dir from Node.js in Brackets, you just get an object Object string. Skip that and use console.log(JSON.stringify(foo)) instead.
</ol>

So did it work? Heck yes! Here's the menu item I added...

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-16 at 2.47.37 PM.png" />

Which then fires off the request and presents a nice dialog to the user:

<img src="https://static.raymondcamden.com/images/Screen Shot 2013-04-16 at 2.48.40 PM.png" />

At which point you can start playing with it in your JavaScript code. I'm considering adding a nice little icon so that you can click and copy the URL to your clipboard in case you forget. There's also the issue of documentation. I know how to massage the server to get what I want, but I should provide a quick reference guide. 

Anyway... what do you think? You can download the bits below. If <i>one</i> person says this is cool I'll add it to GitHub.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fbrackets%{% endraw %}2Dmockserver1%2Ezip'>Download attached file.</a></p>