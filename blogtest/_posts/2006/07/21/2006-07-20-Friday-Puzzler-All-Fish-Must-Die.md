---
layout: post
title: "Friday Puzzler: All Fish Must Die!"
date: "2006-07-21T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/21/Friday-Puzzler-All-Fish-Must-Die
guid: 1418
---

Last week's <a href="http://ray.camdenfamily.com/index.cfm/2006/7/14/Return-of-the-Friday-Puzzler">puzzler</a> didn't get a lot of traffic, but hopefully this one will be a bit more fun. I've always been interested in simple population/ecological simulations. I thought it might be interesting to build such a tool in ColdFusion. First, let's contrive a situation.
<!--more-->
You work for MicroBucks, a multi-billion dollar corporation that produces top quality cow bells. Unfortunately, producing cow bells results in a nasty byproduct: Element X. Element X isn't exactly safe for humans (it causes dandruff and leaky bowels), so obviously the solution is to dump it in the local lake. 

<i>However</i>, Element X tends to kill off fish in the pond. As we all know, fish really aren't that important, so we don't mind killing fish, but we don't want to kill <i>all</i> the fish or some local tree hugger may go crazy. 

So here is your problem. You need to write a program that lets MicroBucks determine how much of Element X they can dump every period and get away with it. Your program will take 4 inputs:

<ul>
<li>The first input is the population of fish.
<li>The second input is their reproductive rate per period. This is a percentage from 1 to 100.
<li>The third input is the number of units of Element X to dump in the lake per period.
<li>The fourth input is the lethality of Element X. For ever y N units of Element X, one fish wlll be killed per period. So if you entered 10, it would mean that for every 10 units of Element X you would kill one fish.
<ul>

The program will accept the four inputs and then graph the results. In every period you first kill off the fish based on the lethality. You then let the fish "have fun" and reproduce. Since you are using a percentage you should round down since you can't give birth to half a fish. You can graph the results over 30, 60, or however many periods you think make sense.