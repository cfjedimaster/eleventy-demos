---
layout: post
title: "More on the Ajax changes to Lighthouse Pro"
date: "2008-09-29T14:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/29/More-on-the-Ajax-changes-to-Lighthouse-Pro
guid: 3034
---

Earlier today I released the <a href="http://www.raymondcamden.com/index.cfm/2008/9/28/Lighthouse-Pro-25-Beta">beta for Lighthouse Pro 2.5</a>. I mentioned I'd follow up with some details on the Ajax and ColdSpring changes. First up is more information about the Ajax changes.
<!--more-->
The original Lighthouse Pro did not make use of Ajax at all. Every search and sort resulted in a complete reload of the list of issues. While I don't remember what version switched to Ajax, LHP was modified to use Ajax to load content for pagination, sorting, and filtering. This worked great. I used Spry to handle retrieving and displaying data. 

This worked fine until the number of bugs hit around 100. I first tried to slim the XML a bit (I talk about this a bit <a href="http://www.coldfusionjedi.com/index.cfm/2007/5/12/Lighthouse-Pro-24-Released-ColdFusion-Bugtracker">here</a>). This worked, but was a band aid. Switching to JSON resulted in an even greater reduction in file size. 

Unfortunately this was just another band aid. When the number of bugs got even larger, the initial data load slowed the application down considerably. So while each row of data in the JSON was slim, at 500+ rows, it was too much.

I re-engineered how the project view page (where you view all the issues for a project) loaded it's data. Instead of doing a "Get All" operation, it began by creating an initial filter: Page 1, all issues, sorted by last updated descending. It made this request and returned 10 rows at a time. I then had to work on the JavaScript a bit. Whereas before the filtering was all done with a filter function tied to the Spry dataset, in the new system every change resulted in the need for new data. I wrote a simple function that would examine all the possible filters on the page (a set of drop downs and a keyword search) and generate a URL. This URL was requested via Ajax and the back end would handle returning a proper result. 

What lesson did I learn here? Ajax is <b>not</b> a magic bullet. You need to be aware of the size of data going back and forth, and do proper testing. In my case, this was adding a large set of test data so I could see what some of my users were reporting. To say it another way, you need to have a good understanding of the unit size (how much data per row, or unit of data) and the <i>expected</i> number of units. So for something like a bug tracker, or a blog, I think it is fair to expect there would be quite a few rows of data. If the application was a product lister, you can probably expect much fewer rows of data. 

If you are bored, take a look at the code I attached to the <a href="http://www.coldfusionjedi.com/index.cfm/2008/9/28/Lighthouse-Pro-25-Beta">beta post</a> and compare it to the <a href="http://lighthousepro.riaforge.org">released</a> version.