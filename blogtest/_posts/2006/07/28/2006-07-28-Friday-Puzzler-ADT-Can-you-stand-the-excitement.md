---
layout: post
title: "Friday Puzzler: ADT - Can you stand the excitement?"
date: "2006-07-28T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/28/Friday-Puzzler-ADT-Can-you-stand-the-excitement
guid: 1437
---

After <a href="http://ray.camdenfamily.com/index.cfm/2006/7/21/Friday-Puzzler-All-Fish-Must-Die">last week's Fish Killing</a> puzzle, I thought it was time to take it down a notch and try something a bit less exciting (and harmful). Today's puzzle will have you build an Abstract Data Type, basically, some code that will act like a built in data type (think struct, array, etc), but with distinctive behavior. 

Build a simple CFC that handles an array of data. The CFC will have these methods:

Push - This adds a new item to the array.<br>
Pull - This gets (and removes) an item from the array.<br>
Length - Can you guess?<br>
IsEmpty - Can you guess?<br>

Here is the catch: The Pull method has to follow a special rule when getting the data. Your CFC should have an Init() method that takes one argument. The argument is a string that determines the Pull behavior. You can pass in FIFO, FILO, or RANDOM. 

If you set the CFC to FIFO mode, the Pull method will return the item that was first entered in the array. Your code should remove the item from the array so that the next Pull also gets the first item.

FILO mode will return the last item entered in the array.

And lastly, RANDOM will return a random item. 

Nice and simple and not terribly useless. You may actually have a need to store data and determine at runtime if FIFO or FILO should be used. What is cool is that your code outside the CFC need not know. It just pushes and pulls.

Enjoy!