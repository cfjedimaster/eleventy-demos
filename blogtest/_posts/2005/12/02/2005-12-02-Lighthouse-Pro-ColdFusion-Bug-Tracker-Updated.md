---
layout: post
title: "Lighthouse Pro (ColdFusion Bug Tracker) Updated"
date: "2005-12-02T17:12:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2005/12/02/Lighthouse-Pro-ColdFusion-Bug-Tracker-Updated
guid: 950
---

This is a very, very small update to <a href="http://ray.camdenfamily.com/projects/lhp">Lighthouse Pro</a>. The updates are:

<ul>
<li>A bug existed when editing an existing entry that had a related URL value.
<li>David Livingston wrote a Postgres SQL script for LHP. This is in the Unsupported folder, and as the folder name makes clear, I am <b>not</b> supporting Postgres. But... if you want to use his script, it is there. 
<li>Not fixed - but a red flag. A user reported an oddity when running LHP on a Unix server. Now - of course - I did tell him that Unix was illegal now that Bill Gates is the Grand Emperor, but he chose to ignore those warnings. The issue involves <i>all</i> of the Flash Form fields coming back as undefined. I suggested changed the column names to upper case in the Flash Form AS code - which worked... but shouldn't. It certainly doesn't work on my proper Windows box. That being said - I didn't time to properly debug this, and I wanted to release the two items above.
</ul>

As always, you can download LHP from the <a href="http://ray.camdenfamily.com/projects/lhp">project page</a>.