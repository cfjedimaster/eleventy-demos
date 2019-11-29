---
layout: post
title: "Yes - you can develop Flash apps for iOS on Windows!"
date: "2011-07-06T19:07:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/07/06/Yes-you-can-develop-Flash-apps-for-iOS-on-Windows
guid: 4297
---

I finally got my hands on an iPad2 (yes, the new job has perks) and today I decided to test out building a Flex Mobile application to the device. Others have described the steps in detail so I won't repeat that here, but I'll share how it went for me.
<!--more-->
First off - I signed up for the iOS Developer Program this morning. Oddly I had to use a whole new login since my last login was tied to my Broadchoice job from a few years back. I saw nothing in the UI about changing your organization. I used it as an opportunity to dump my Google Apps email login and just switch to a new account. I did this around 10 or so this morning and it was done by 2. I had heard 24-48 hours so I was pretty surprised. 

Next - I read Holly's blog post here: <a href="http://devgirl.org/2011/06/20/flexair-for-ios-development-process-explained/">Flex/AIR for iOS Development Process Explained!</a>. She does a darn good job. I still had a bit of confusion in some place but to be honest I skipped all the tutorials on Apple's site and I tend to skim as well. The biggest I issue I had was in creating a p12 file. Flash Builder will actually link you to a page that talks about it but I found that page to not be helpful at all. Instead this article - <a href="http://www.adobe.com/devnet/air/articles/packaging-air-apps-ios.html">Using Flash Builder 4.5 to package applications for Apple iOS devices</a> - helped me get over that hump.

Then I simply exported a release build. This process takes a few minutes on Windows, but once done you have an IPA file. Drag that into iTunes and voila - it works.

Here is my app on the iPad2 desktop (I didn't specify a custom icon)

<img src="https://static.raymondcamden.com/images/IMAG0235.jpg" />

And here is the app actually running (and no - my app doesn't actually do anything)

<img src="https://static.raymondcamden.com/images/cfjedi/IMAG02361.jpg" />

Sorry for the awful pictures, but I mainly wanted to prove that it does indeed work. All in all the process took me about an hour. Next time will be significantly shorter now that I know what I'm doing.