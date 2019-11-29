---
layout: post
title: "Ask a Jedi: Handling a custom sort order update"
date: "2006-05-05T08:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/05/Ask-a-Jedi-Handling-a-custom-sort-order-update
guid: 1248
---

That title sounds a heck of a lot more complex than what the subject matter is, so don't be scared. Mark asks:

<blockquote>
Had a question regarding reordering records in a database, I am not sure whether it would be suitable for the friday challenge or whether there might be somewhere you could
point me.

A good example would be if you had a list of DVD's, and you wanted them sent out in a particular order, you could click on move up and move down to reorder the list, I understand you would need to have a sort column in the database, but what would be the most efficient way of looping over the records to update the sort.
</blockquote>
<!--more-->
So it sounds like you have a table of information that you are applying a set sort to it. So your DVD table has a sort column which contains a number, and when you fetch your DVDs, you simply "order by sort" in your SQL.

When you update the list, are you using some fancy JavaScript to move stuff up and down, or do you simply have a Move Up/Move Down button that hits the server every time?

If it is the latter, then you don't need to loop over all the records to update. Imagine you had 8 DVDs (my storage problems would be a lot better if I only had 8 DVDs). You select the one ranked 7 and click push down. Your updates than are only to the DVDs with records 6 and 7. 6 becomes 7, and 7 obviously becomes 6. There should be no need to update any other record. 

Of course, you also wants to do bounds checking. If a request for "Move Down" comes for a DVD with sort = 1, you want to ignore, same with a DVD with the highest sort trying to move up. 

I can think of a case where you would need to update multiple records, and that is with an insert or deletion. With either of these, you can fix the sort with one SQL statement. Assume you just added a new DVD with sort=5. Do the insert, and then do:

<code>
&lt;cfquery ...&gt;
update tblDVDs
set sort = sort + 1
where sort &gt;= 5
and ID != #theid of your new dvd#
&lt;/cfquery&gt;
</code>

I hope this helps answer your question!