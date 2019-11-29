---
layout: post
title: "Friday Puzzler - Listing all posibilities of a set"
date: "2007-04-27T08:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/27/Friday-Puzzler-Listing-all-posibilities-of-a-set
guid: 1987
---

Today's puzzle is pretty simple, but I'm curious to see how people solve it. Write a UDF that takes two arguments. The first argument is a set - and by that I mean a list of possible values. So a set could be: A,B,C. The second argument is the length of a string to generate. So given: arrResults = func("A,B,C",2) the result would be an array of every possible string combination. Like so:

<code>
AA
AB
AC
BA
BB
BC
CA
CB
CC
</code>

Good luck!