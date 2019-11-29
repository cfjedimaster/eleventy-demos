---
layout: post
title: "Issue with callback URLs and ColdFusion Builder 2 Extensions"
date: "2011-04-24T22:04:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/04/24/Issue-with-callback-URLs-and-ColdFusion-Builder-2-Extensions
guid: 4205
---

One of the interesting new features of ColdFusion Builder 2 (and to me, <b>the</b> critical feature) is the use of a callback system to execute commands. I need to do a full blog entry on it, but for now, just know that the editor sends to extensions a special URL. Your extension can hit this URL with XML to perform commands with the editor. So as a simple example, I can send XML to the callback URL to request a refresh on a folder if I've added some files to it.

So what's the issue? It appears as if ColdFusion Builder 2 checks your network settings on startup and creates the callback url based on your current IP address. This works fine until your IP address changes. That doesn't happen terribly often, but on a laptop that goes from home to office, or hotel room to conference, it could happen quite a bit. 

Unfortunately the only real fix is restart ColdFusion Builder 2. An extension <i>could</i> try to work around this, but it's probably more trouble than it's worth. I've logged a bug for this (<a href="https://bugbase.adobe.com/index.cfm?event=bug&id=2854796">ID 2854796</a>) and would appreciate any votes.