---
layout: post
title: "Working with Flex, AIR, and SQL (2)"
date: "2008-01-09T15:01:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2008/01/09/Working-with-Flex-AIR-and-SQL-2
guid: 2584
---

It's been a little while, but I've gotten around to working more on my Time Tracker AIR application, first discussed <a href="http://www.raymondcamden.com/index.cfm/2007/12/31/Working-with-Flex-AIR-and-SQL">here</a>. As a recap, my intention was to build a simple time tracker that would let me enter hours for projects and clients. The real goal was to learn more about SQLite and the AIR connection to it.

I've made some updates to the application and learned a bit on the way.

The first issue I ran into was my database setup code. My original code made one table, and when the table was done being created (if it needed to be), the application entered it's normal operating mode. This became a problem when I wanted to make two tables. If you remember, I had created an asynchronous database connection. I wasn't able to run both SQL statements in one execution so I had to two executions. How would I know when to start my program? I could use a bunch of flags, but that seemed like a mess.

So what I did was compromise. I kept one database connection in asynchronous mode. This would be my main connector to the database. In my startup code though I created another connection - one that was synchronous. This let me setup my tables and begin the application proper when done.

I also discovered that you want to be sure you think about your table structure. While it is possibly to modify tables, I just simply wrote a temp "drop table" code segment that I keep commented out most of the time.

I ran into this issue again on the new Projects page. This lets me create projects that are tied to clients. On loading the panel though we need to get both clients and projects. The issue was this though - what if projects loaded very quickly, but clients didn't? If you clicked to edit a project, I wouldn't be able to display the client drop down. So for this page I used a flag. I only allow you to edit projects once clients have finished loading. (As a quick release note, the Client filter on this page doesn't work, but the Active filter does.)

I added the Hour Entry page yesterday. It lets you add hours to a project. (Again though, no validation, so be sure to pick everything.) I loved how Flex had a built in numeric stepper control. It was perfect for this. Ditto for the calendar. 

I ran into one more database issue here. I wanted to show the hours you entered today. (The reports page will let you view all hours, when I get to coding it.) But I'm having issues with date comparisons and SQLite. For now it will show everything.

I've include the AIR installer and full source code in the package. Enjoy. Again, assume I wrote horrible Flex code. I'm going to blame the Saints for not making it to the playoffs for my lack of Flex skills.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive16%{% endraw %}2Ezip'>Download attached file.</a></p>