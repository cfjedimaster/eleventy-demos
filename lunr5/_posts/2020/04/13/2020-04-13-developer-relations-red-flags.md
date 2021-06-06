---
layout: post
title: "What are Red Flags to Me as a Developer?"
date: "2020-04-13"
categories: ["developer"]
tags: []
banner_image: /images/banners/wrong_way.jpg
permalink: /2020/04/13/what-are-red-flags-to-me
description: Some things that make me worry as a developer...
---

This morning I was thinking about developer relations and it occurred to me that there are certain "red flags" I look for when trying out a new product/service. I thought it would be nice to write them up and explain why they are red flags to me. While not specifically related to developer relations, these are things that I tend to think about in my own role and try to exert influence over when I can.

I want to be clear that this is absolutely an opinion piece. I've worked for, and work for, companies that make these mistakes. Some of the things I'll point out as a red flag are things your company may do, and for good reason. That's ok, but I'm still going to consider it a potential issue when I'm considering your service. 

Developers don't care about your good reasons. They care about getting stuff done.

I don't expect everyone to agree and I'd love to see your feedback in the comments below. Alright, with that out of the way, here's my list in no particular order!

## Documentation Behind Signup

Simple - don't make me sign up to read documentation. When I see it I know immediately that someone's got a KPI for developer signups and are trying to artificially boost it a bit. I need to be able to browse your docs to see if your solution makes sense, and asking me to create one more account that could be hacked is a barrier to that. I've got a *lot* more thoughts on documentation that you can read here: [My Thoughts on Documentation](https://www.raymondcamden.com/2019/08/14/my-thoughts-on-documentation)

Knowing what your product does and how it works is not a trade secret - make those docs public!

## Signup Requires a Credit Card

This is - probably - the number one thing that makes me reconsider using your service. And I can honestly see why some companies may use it. You may not want to support "tinkerers" and that's fine. But I'll pretty much never play around with a product if I have to give my credit card. You can tell me all you want about how you won't charge it - I'll just do my best to avoid it at all costs.

Again though - you may *specifically* want to avoid working with random developers. 

## Timed Trial

Another thing I run into quite often are timed trials. I always hesitate when I see this. I look at the trial period - I check my calendar. Will I have time to dig into the product within the time frame? Maybe I'm going to be busy next week. Maybe I'm not busy, so I sign up, and then something crazy happens and I get busy. Basically, I stress over it. You don't want to stress Raymond, do you? 

## Not Using NPM (for the CLI)

This is unfair. I get it. Some platforms don't use Node as their development language. Heck, one of the services I've been *incredibly* happy with lately doesn't use NPM. This is less about NPM and more about onerous installation processes in general. IBM for example, used to have an old school InstallShield installer for their CLI. Even better, it required a restart. About two hours ago I needed to install the CLI again and it was much simpler (even though it wasn't NPM based) so they've definitely improved there. 

## Pricing Obscurity

This covers a number of issues. First, I expect it to be real simple to figure out what your service costs. The best is when there is a nice direct API call to cost table. 1K for free, then X cents after that per Y calls. I've seen a lot of bad examples of this. Most recently, I was digging deep into a certain large company's API. They have a per API rate. Then they have different charges for what data you get back in the API calls. All in all, it's the kind of thing you would need a spreadsheet to figure out what you're bill will be. 

In the same area, don't make me dig to find my bill and what cost me money. Azure was (to me) pretty difficult in this respect, although after using it for a while I figured it out. IBM for a while would send me an email saying I had an invoice. I'd log in. Click a few times. Get the PDF and see I owed nothing. It always boggled my mind that they couldn't improve their process such that the email itself couldn't include the total and save me a few clicks. It's a small thing, but it annoyed me.

And while I'm on a rant a bit, and I *know* there are commercial reasons against ever doing this, but I wish more services would simply support a "Don't Let me Use Money" option. I.e., I set something up, I use the free tier, and if I forget about it and it *would* have incurred costs, the service simply disables itself. It's absolutely in the best interest of the company to *not* do that, but as a developer I sure would appreciate that. If I'm just tinkering and building toys, I can promise you I'd much rather have my toy shut down then to get a 5 dollar bill. I can pay that, I just don't want to!

## Mac/Unix Only Terminal Commands

I get it. Apple makes some darn good machines (I mean, unless you want the keyboard to work, they fixed that, right?) and Unix is a great CLI environment. Windows adding Ubuntu to the OS was one of the biggest reasons I switched back after having been a Mac user for years. But unless I'm mistaken, a huge majority of people are still on Windows. When your documentation assumes a Unix/OSX environment you may be cutting out a significant part of your audience. Normally when I run into this it isn't a huge deal. I can work around it. But it's a red flag to me that you aren't even *thinking* about your audience. 

This is not scientific, but I can look at the Google Analytics stats for this blog and I have over 60% of my readers coming in on a Windows machine. (Note, I'm not using GA anymore and currently Netlify doesn't report on this metric. But I doubt it shifted significantly in the past few months.) 

## Support Black Holes

This is another one that's a bit tricky. If a company has thousands of developers joining every day and aren't actually paying customers, it may be difficult to give them technical support. In general I'm not necessarily concerned about how *quick* I can get support, but just having a clear *direction* for what to do. If you have a Support link in your top nav that goes to a contact form that states it may be 5 days until you respond... well that's something. I'll use the form and move on to something else while I wait. But if I see *no* way to ask for help, no link to a Slack group or StackOverflow tag, then I get worried. 

## What Else?

So, what did I forget? Leave me a comment below and feel free to disagree with my list as well. 

<i>Header photo by <a href="https://unsplash.com/@neonbrand?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">neONBRAND</a> on Unsplash</i>