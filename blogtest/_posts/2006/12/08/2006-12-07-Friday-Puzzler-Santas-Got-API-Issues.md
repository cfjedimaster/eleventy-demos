---
layout: post
title: "Friday Puzzler - Santas Got (API) Issues"
date: "2006-12-08T07:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/08/Friday-Puzzler-Santas-Got-API-Issues
guid: 1701
---

In <a href="http://ray.camdenfamily.com/index.cfm/2006/12/1/Friday-Puzzle--Welcome-to-Santas-IT-Department">last weeks puzzler</a> you started your new job as Head IT Geek/Elf of Santa's workshop. Your initial task was simple, but now things are getting complex, and with Christmas fast approaching, you don't have much time to finish the task. (Gee, thank goodness this is just pretend and not like real life.) 

In today's puzzler, you need to help Santa shop for toy parts for the workshop. Santa works with various providers across the world and while they have been on the Net for sometime now - Santa is only just catching up now. 

Your task is to build an interface to 3 toy part producers to check their availability and price. You will need to provide a report to present to Santa so he can make a final call. Each producer has a different API, and guess what - it isn't really published. So you will need to play around a bit with the services to see what they return. Here are your three services:

Alpha Toy Shop's API may be found here: <a href="http://ray.camdenfamily.com/demos/santa/alpha.cfc?wsdl">http://ray.camdenfamily.com/demos/santa/alpha.cfc?wsdl</a>

Beta Toy Shop's API may be found here: <a href="http://ray.camdenfamily.com/demos/santa/beta.cfc?wsdl">http://ray.camdenfamily.com/demos/santa/beta.cfc?wsdl</a>

Charlie Toy Shop's API may be found here: <a href="http://ray.camdenfamily.com/demos/santa/charlie.cfm">http://ray.camdenfamily.com/demos/santa/charlie.cfm</a>

Note that Charlie is not using a web service. To make it easy, each of these services requires a product ID, but it doesn't matter what you send - the result will be the same. 

Here are some things to consider: Your code will need to integrate with three different services to get the data needed for the report. Can you abstract the calls to those services so it is easy to update without changing the code to handle the report? Can you handle a case where a remote API fails? Outside of this puzzle - how do you deal with remote data in general? In particular, remember my <a href="http://ray.camdenfamily.com/index.cfm/2006/12/4/Handling-remote-errors-in-Flex-2">Flex post</a> on the topic as an example.

As always - your time limit is short - 10 minutes or so (I don't want to get anyone fired) and your reward will be great (ok, nothing, but ego counts, right?). Enjoy!