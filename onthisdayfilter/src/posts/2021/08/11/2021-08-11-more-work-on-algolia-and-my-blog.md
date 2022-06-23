---
layout: post
title: "More Work on Algolia and My Blog"
date: "2021-08-11T18:00:00"
categories: ["jamstack"]
tags: ["eleventy"]
banner_image: /images/banners/construction-bw.jpg
permalink: /2021/08/11/more-work-on-algolia-and-my-blog.html
description: An update to my fight to get search working right on my blog
---

Over a year ago I wrote up my experience on adding [Algolia](https://www.algolia.com) to my blog (["Adding Algolia Search to Eleventy and Netlify - Part Two"](https://www.raymondcamden.com/2020/07/01/adding-algolia-search-to-eleventy-and-netlify-part-two). This process was different then my initial post on the topic (["Adding Algolia Search to Eleventy and Netlify"](https://www.raymondcamden.com/2020/06/24/adding-algolia-search-to-eleventy-and-netlify)) as I had to set up things a bit differently to handle the large size of my site. 

Well, things worked ok for a while, but I later discovered a bug in my implementation (I updated the post to share those issues). I thought I had things fixed, but I kept having issues with my Algolia index being blanked out. Heck, it got so annoying I wrote up a [Pipedream workflow](https://www.raymondcamden.com/2021/06/16/quick-tip-using-pipedream-to-monitor-my-algolia-index) just to help me monitor it. While the workflow worked great as a warning, I still wasn't exactly sure what was wrong. On top of that, Netlify's function logs seem to not be working properly for me when trying to debug issues in my deploy-succeeded function. (I've [raised](https://answers.netlify.com/t/now-available-function-logs-text-filter-time-selection/36774/2?u=cfjedimaster) this on their forums if you want to track.) 

This week I decided to see if I could finally come up with a solution. What I had running before (and described in that first blog post linked to above) was this process:

* When Netlify does a build...
* Clear my entire Algolia index...
* Download a JSON copy of my blog (6000+ blog entries)
* Do a batch update

Why do I nuke the entire thing? In case I delete a blog post. Why do I upload every blog post? In case I edit.

All of that makes sense, but the size and time to run of the process was ultimately causing the issues I believe. I realized that I've probably deleted one or two blog entries in the 18 years I've run this blog. I *do* make edits to blog posts, but on average, 5 or so per year. 

Therefore I decided to change my process. Now what I do is:

* When Netlify does a build...
* Download a JSON copy of the last 5 blog entries
* Do a batch update of the 3 most recent entries

All in all, this is a much quicker operation. First off, while my code could quickly download the large JSON packet of six thousand plus blog entries, the parsing took quite some time (thank you [Node.js timeLoad](https://nodejs.org/api/console.html#console_console_timelog_label_data) and I wish I knew you existed years ago). And obviously, doing a batch update of three blog entries is much quicker than multiple thousands. 

You're probably wondering - why 5 and 3? Honestly, I don't have a good logical reason for that. I guess I just wanted "a couple" of recent entries and not just the most recent because... I don't know. I just felt it was a bit safer. I'll probably edit both operations to only work with one item. At the same time, I want to wait a bit and see how these changes go.

Also, I *will* need a script to handle blog edits, but I can just take the code I had before, drop it into a Node script, and run it locally when I need to do that.

I'm not sharing this to imply Netlify or Algolia have done anything wrong here. But I do think there's a whole side to the Jamstack that impacts large sites that I'd love to see more discussion around. (I think I even CFPed on the topic before but it wasn't picked up.) As it stands, I hope this helps others who may be dealing with large static sites, and as a reminder, you can always dig into how I've built this site at the GitHub repo: <https://github.com/cfjedimaster/raymondcamden2020>

Photo by <a href="https://unsplash.com/@ballonandon?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ben Allan</a> on <a href="https://unsplash.com/s/photos/construction?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  

