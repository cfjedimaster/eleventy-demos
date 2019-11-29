---
layout: post
title: "Help a reader decide on SQL Server versus MySQL"
date: "2008-09-15T08:09:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2008/09/15/Help-a-reader-decide-on-SQL-Server-versus-MySQL
guid: 3016
---

Andrew asks:

<blockquote>
<p>
I have inherited a website that runs on CF7 and about 6 MS-Access databases. It is getting more and more traffic and is hanging more and more often, and it seems to be MS-Access
(no surprise there).
</p>

<p>
I have the choice of upgrading them to MySQL or SQL Server (MSSQL) and was wondering what I should consider when making this choice, or if there is a clear cut favorite for ColdFusion.
</p>

<p>
I saw an old post where you posted ways to go from SQL Server to MySQL and was wondering if that's because you prefer MySQL.
</p>
</blockquote>
<!--more-->
So in general, I'm not sure there is a clear cut favorite for ColdFusion. My gut says more people use SQL Server just because I think I've seen it more in the field, but that doesn't make it the favorite. I can also say that the database used for a project has very rarely been something I've had any input on. Typically the database was chosen some time ago and we have to work with whatever it is. 

But what should you pick given a choice? That's a big question and here are some things to consider. The number one thing to remember is that - most likely - ColdFusion will only be one user of this database. You may have to (or should have to) ensure everyone in the organization is part of the decision making process. If the entire organization is just the web site than I guess it really is just you, but you want to check that.

Other factors that may impact this decision are features and operating system support. MySQL definitely supports more operating systems than SQL Server. We use it at <a href="http://www.broadchoice.com">Broadchoice</a> in our Linux production environments and on our Mac development environments. I also use it on Windows for <a href="http://www.riaforge.org">RIAForge</a>. You can't beat the price either, although SQL Server has a free development version now, you still need to shell out some money for production (as far as I know). 

I find the MySQL environment friendlier to work with as well. I've had a long hatred for Enterprise Manager, and while I had hoped the last update would have improved the experience, I was sadly disappointed. I've seen some bad MySQL clients as well, but there is definitely more choices out there so you can probably find one more to your liking. Of course, even if you don't find any visual clients you like, the command line support works <b>really</b> well. 

Feature-wise, I'm probably not the best person to ask which one is better. Like a lot of ColdFusion developers I only scratch the surface of what is available. Again I tend to be able to do more with MySQL, but I actually spent the time to read a <a href="http://www.forta.com/books/0672327120/">good MySQL book</a>. 

So - this morning's coffee talk - all things considered - which platform would folks recommend?