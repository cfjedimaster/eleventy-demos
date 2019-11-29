---
layout: post
title: "PhoneGap/Cordova File System questions"
date: "2014-06-23T18:06:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/06/23/PhoneGapCordova-File-System-questions
guid: 5252
---

<p>
A <strong>large</strong> majority of the questions I get about PhoneGap and Cordova revolve around the file system API. It has had some pretty significant updates recently but still remains one of the most difficult ones to use. I've been putting off really digging deep into those questions because many times they are incredibly specific to a particular user's application. And - honestly - they typically don't lend themselves to the type of quick questions I can answer during the day.
</p>

<p>
So with that in mind, I thought it might be fruitful to ask my readers about the API and how I can help make things a bit clearer - for both you and me. What I'm thinking is - can we come up with a list of basic questions, a FAQ perhaps, for just this API. It can't be something <i>too</i> precise to one particular application, but something that can apply to multiple users.
</p>

<p>
As an example: How do I download an asset to my application? That's a simple question, but it brings up the question of <i>where</i> you would download the asset and how you would actually use it later. 
</p>

<p>
Of course, the big issue is that this particular API is an evolving one. Anything I do today will be outdated next year. But as most of my blog posts on the API are already over a year old, this would at least be a bit fresher. ;)
</p>

<p>
In order to organize this list, I'm going to start it in the blog entry. Use the comments to make suggestions, and as I see ones that I think make sense, I'll add them to the list. By the way, I know some of these are super trivial, but I figure it doesn't hurt to try to cover as much as possible.
</p>

<h2>File System FAQ</h2>
<ul>
<li>When does it make sense to use the file system (versus LocalStorage or WebSQL)?</li>
<li>How do I download an asset to my application?</li>
<li>How do I use a file stored in the file system (both binary and text-based files)?</li>
<li>How do I check to see if a file exists in a directory?</li>
<li>Are there external tools that can check a device's file system?</li>
<li>How do I check to see if a directory exists?</li>
<li>How do I make a subdirectory where the parent directory may not exist?</li>
<li>Are there any app store restrictions/guidelines for using the file system?</li>
<li>For iOS, where can I store files so that they will be backed up to iCloud?</li>
<li>How can I get metadata (size, updated) about a file?</li>
</ul>