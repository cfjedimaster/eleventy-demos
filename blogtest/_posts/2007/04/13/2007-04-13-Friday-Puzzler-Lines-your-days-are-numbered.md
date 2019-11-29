---
layout: post
title: "Friday Puzzler : Lines, your days are numbered..."
date: "2007-04-13T11:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/13/Friday-Puzzler-Lines-your-days-are-numbered
guid: 1959
---

Ok, that's kind of a dumb title. Todays puzzler could actually be a nice little utility. In fact, the winner will get added to <a href="http://www.cflib.org">CFLib</a>, so this isn't a total waste of a time. A few days ago I discovered the <a href="http://www.opengroup.org/onlinepubs/009695399/utilities/nl.html">nl</a> command. It takes a file and dumps it out to the screen with line numbers. Very handy! Your job is to build a UDF that will:

a) Take a filename or string as input.
b) Return a string that contains the contents of the file with a line number at the beginning of each line.

Bonus points if you format it such that the line #s 1-9 have a space in them if the total number of lines is greater than 10. This isn't as easy as it sounds. There may be 1000, or 10000 lines. This would change the amount of padding needed.