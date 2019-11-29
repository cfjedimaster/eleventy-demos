---
layout: post
title: "Time Tracker AIR Application Updated"
date: "2008-03-25T18:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/03/25/Time-Tracker-AIR-Application-Updated
guid: 2727
---

I spent my lunch time today working more on my Time Tracker application. I added 2 new tabs. The first is an Hour Log tab that lets you see all your hours, not just the ones for today, and you can do filters by client, projects, dates, or descriptions.

The date filter was pretty interesting. SQLite has a julianday function that returns the number of days since some date in the past (I don't have the docs in front of me, let's just say it was a really, really long time ago). So to do a date comparison you can use the julianday function to compare the date in the database with what you want to filter by. 

The next tab I added is a basic Stats tab, which right now uses a Flex Pie Chart to show you the total number of hours spent on projects. One tip - you won't find the docs for charting in the main developer's guide for Flex 3. Instead, go to the <a href="http://www.adobe.com/support/documentation/en/flex/">docs</a> page and download <b>Adobe Flex 3 Data Visualization Developer Guide</b>. The description focuses on advanced stuff, but the guide also covers basic charts. Not sure if there is a difference, but it is the guide to use.

So in general, the charts are super easy to use - however, mx:Legend refuses to work for me. Check out this screen shot:

<img src="https://static.raymondcamden.com/images//ttchart.png">

See the 3 black squares? The legend tag is smart enough to know I had 3 pie items, but refused to actually show the labels. The docs say I need to use nameField in my series (although what I really want is the labelFunction!), but even though I did that it refused to show anything. I know it's partially working because when I change the filters to result in 2 pie wedges, my legend changes as well, but I still just get little unhappy black squares (which will be the next new band to come out of London, mark my words).

Anyway - I think this is it for now. I just want to add one more feature, and that's a CSV download from the Hours Log, but after that the application will be done.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive19%{% endraw %}2Ezip'>Download attached file.</a></p>