---
layout: post
title: "Friday Puzzler: Joe's Car Wash and the Cheap Employee Problem"
date: "2011-03-25T10:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/03/25/Friday-Puzzler-Joes-Car-Wash-and-the-Cheap-Employee-Problem
guid: 4171
---

<img src="https://static.raymondcamden.com/images/cfjedi/sleazy_guy.jpg" title="Joe, probably a PHP developer" align="left" style="margin-right:10px;margin-bottom:10px" /> Meet Joe. Joe runs a local car wash and is notorious for having an odd smell and being notoriously cheap. So cheap in fact that he pays his employees the littlest possible and therefore has the laziest employees in existence. This causes many problems for Joe as he has to ensure each and every task he gives them is as simple and as direct as possible. No critical thinking allowed here. You're going to write a program for Joe (in exchange for 2 free car washes, except on days that end in Y) to help Joe with a particular problem: Signage.
<!--more-->
Joe has one of those signs where you can put messages up one letter at a time. Not one of those fancy electronic ones. Of course not - that would cost too much. No - this is one of those signs where you have to use the 30 foot long hook and place up one letter at a time. This makes changing the message a real pain in the rear. Your program is going to help make this problem easier. Here's the basic idea.

Given a message, your code will:

a) Return each unique letter and the number of instances. This will tell the employee how many As they have to bring, how many Bs, etc. 

b) Given a width attribute that represents how many "slots" are available per row. For now, don't worry about the number of rows (it's a tall sign). But assuming that each row is N slots wide, you need to determine which words will fit per row. 

So all in all your API is something like this: getSignInfo(message,width) and returns a structure of two complex values - the results detailed in A and B.

So - I actually have a real prize to offer for this. By writing a Blackberry Playbook app (Hangman, I'm going to sell it for free but get rich on volume), I was awarded a copy of ColdFusion Builder and Flash Builder Pro. I'll be selecting the winner from comments posted to the blog entry by 5PM CST. Please note this contest is 100% arbitrary so unabashed flattery is a bonus. Have fun with it. I'd recommend Pastebin for your code samples.