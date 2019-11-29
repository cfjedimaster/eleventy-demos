---
layout: post
title: "Friday Challenge - Reorder a CFC File"
date: "2007-08-24T15:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/24/Friday-Challenge-Reorder-a-CFC-File
guid: 2303
---

So a friend of mine dared to say I had a bit of OCD. Personally I don't think so. I'm just... organized. Why did he say I had OCD? I tend to get really ticked off by CFCs that don't alphabetize their methods. All of my CFCs use alphabetical methods, except for the init method which is always first (if the CFC needs one). 

So here is your challenge. Write a UDF/custom tag/snippet that will take as an argument the path to a CFC. Your code will read in the file and:

<ul>
<li>Organize all methods in alphabetical order
<li>Keep a method named "init" as the first method
<li>And for bonus points - ensure that any "constructor code" (lines outside of any method) are grouped above the init method.
</ul>

Being that it is not only Friday but Friday afternoon, bonus points if you've been.... "celebrating" the weekend a bit early. (But then again we have to be able to actually read your code!)