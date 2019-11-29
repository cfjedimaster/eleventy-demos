---
layout: post
title: "CFUNITED Keynote Notes"
date: "2007-06-27T09:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/27/CFUNITED-Keynote-Notes
guid: 2153
---

Here are my notes from the keynote. I'll be saving/updating as it goes on, so please reload.

The keynote is being done by Ben Forta and Tim Buntel. According to them - there will be new information released.

The theme is 8 (gee, wonder why).
<!--more-->
Top 8 things you should know about in ColdFusion 8.

Reason 1 - Making applications is even easier: Eclipse plugins and wizard, Server Monitor. Idea is - what can we do to make things easier outside of the language itself. I can +1 the Server Monitor for sure.

Reason 2 - Having confidence in production applications. The server monitor helps out here again. Support for multiple instances of CF. Being stable and backwards compatible. The Server Monitor using the API (I blogged about this last week or so).

Reason 3 - It runs in more places. VMWare, Mac Tel (woohoo!!), 64 Bit Solaris, JBoss

Reason 4 - Your users will be happier: Flex/AJAX updates, reporting, PDF updates, on-demand presentations, images.

Reason 5- Nice and secure: Multiple admin accounts (going to blog on this later), multiple RDS accounts, strong encryption. (FIPS 140 Compliant baked into the product.)

Reason 6 - CFML Evolution: JS operators, argument collections, CFC interfaces, file handling funcitons, array and structure creation, CFC serialization

Reason 7 - Plays well with others: .Net support, Exchange, RSS/ATOM, LiveCycle, Flash Media Server

Reason 8 - It's fast. (Amen.) Here is the new stuff.

Adobe took 2.4 million lines of code from real world applications and analyzed them. All the bottlenecks were logged and identified. From this - hundreds of tweaks and changes were made to CFML tags and functions. 

Structure manipulation. Showing a graph of cf6 to cf8. Requests per second in cf6 and 7, around 100. In 8, they can do 200 per second.

List manipulation - same chart (requests per sec). cf6: 33.6. cf7: 34.4. cf8: 103.4

CFSWITCH/CFCASE: cf6, 66, cf7 88, cf8: 244

cfparam huge - from 9.6 to 350 in cf8

date funcitons: cf7-251, cf8: 1423

regex: cf7 - 392, cf8 - 987

isdefined: cf7, 611, cf8, 1243

cfc creation (this is the big one): cf6 - 9.7, cf7- 3, cf8 - 69.4

blogcfc:  cf6 - 271, cf7, 255, cf8 355

adobe.com store: cf6 - 275, cf7 - 290, cf8 - 435

cf code will run faster in cf8 - period. With no changes. (I can attest to this.)

You can run stuff even faster with cfthread. (Ditto - see my blog post on blogcfc and cfthread.)

Release Date: "Very, very soon" - Quote from Tim Buntel.

Flex Notes: Talking about various sites using Flex (like the Server Monitor). Flex SDK is now open source. 

Flex 3 timelie. LiceCycle DS released a dew weeks ago. Public betas of Flex 3 SDK and Flex 3 Builder/AIR released already. Final release looks to be late this year (I'd bet MAX). 

Major themes of Flex 3: Designers/Developers, Hybrid Desktop-Internet Applications, Working with Data, and Platform Evolution.

Advanced datagrid looks pretty nice (will try to find examples later). Charting improvements also look nice. 

Web Services introspection added to Builder.

Flex apps can now be smaller in size due to caching.

New momory and performance profiling. Find bottlenecks, etc.
Source code refactoring. 

Deep linking support added.