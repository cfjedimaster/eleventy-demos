---
layout: post
title: "Friday Puzzler: Split the Bill"
date: "2012-11-30T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/11/30/Friday-Puzzler-Split-the-Bill
guid: 4793
---

Today's puzzler is more of a simple exercise than a real brain teaser, but the more I thought about it, the more I thought it might be a fun little bit of code to write or something that more experienced developers could pass on to their coworkers. As always, the "rules" are to try to do this within five minutes or so. 

Today's puzzler is simple. You will write a UDF (User-Defined Function) that handles splitting a bill. Your first argument is the total bill. The second argument is the number of people. Simple division, right? Well here's where things get a bit interesting. If you have a bill of one dollar and three people, you can't simply divide 1 by 3 as you'll get a result with a fraction of a cent. Therefore, your solution has to be a bit more elegant. I want you to return an array. The array will have one element per person. Each value in the array represents how much each person will pay in dollars and cents. Values like: 1.25, 9.89, 10, etc. Given that you will most likely have floating-point results, you need to collect the extra money and just give it to one person. 

So given the initial example of one dollar and three people, you would return an array that looks like so: [0.34,0.33,0.33]

Bonus points will be awards for good validation (what happens if you pass in a negative amount) and randomly assigning the pennies as opposed to always giving it to the first person. 

Every solution should take the bill as the first argument. It should be a number value representing the dollars and cents total for the bill. So 1.75 for one dollar and seventy-five cents. The second argument is the number of people.

<img src="https://static.raymondcamden.com/images/restaurant-bill.jpg" />