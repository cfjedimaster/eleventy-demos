---
layout: post
title: "How NOT To Do Directory Security"
date: "2005-07-22T12:07:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2005/07/22/How-NOT-To-Do-Directory-Security
guid: 641
---

Recently a coworker noticed a web site where the owners had forgotten to secure their administration folder. (He was able to get to the folder by guessing.) He immidiately emailed them to let them know about the problem.

The site promptly closed up the directory.... but only if you requested http://theirurl/thefolder. If you went to http://theirurl/thefolder/default.aspx, you could still get right in.

Something you may want to check on your own sites!