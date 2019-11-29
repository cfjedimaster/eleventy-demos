---
layout: post
title: "MySQL administration via ColdFusion"
date: "2006-12-07T09:12:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2006/12/07/MySQL-administration-via-ColdFusion
guid: 1699
---

A user asked me if it was possible to backup and restore a MySQL database from ColdFusion. There are multiple ways of doing this, but the basic answer is that you can do this very easily. MySQL ships with a set of utilities that ColdFusion can run via CFEXECUTE to perform various tasks.
<!--more-->
So for example, to backup a database you can use the MySQL dump command:

<code>
mysqldump --user=USER --password=PASSWORD dbname &gt; filename
</code>

From ColdFusion this would look look like so (username, passwords, and database names changed to protect the innocent):

<code>
&lt;cfexecute name="c:\program files\mysql\mysql server 4.1\bin\mysqldump" arguments="--user=xxx --password=yyy dharma" outputfile="#expandPath("./ao.sql")#" timeout="30"/&gt;
</code>

This creates a nice file that contains not only the SQL needed to create your database but all the data as well. You could then use a <a href="http://www.cflib.org/udf.cfm?ID=744">zip</a> utility and move/mail/do whatever with the file.

Restoring is a bit trickier. You have to do different things based on if your database exists or not. If your database does exist, then the restore will overwrite the existing tables, but not remove tables that don't exist in the backup file. If this doesn't concern you, you can do it with this command:

<code>
mysql --user=USER --password=PASSWORD dbname &lt; filename
</code>

Now I had a lot of trouble getting this to run from CFEXECUTE. I believe because of the &lt;. So I used a bat file instead that looked like so:

<code>
"c:\program files\mysql\mysql server 4.1\bin\mysql.exe" --user=xxx --password=yyy somebackup &lt; "c:\apache2\htdocs\testingzone\ao.sql"
</code>

I then ran the bat file from ColdFusion:

<code>
&lt;cfexecute name="#expandPath("./restore.bat")#" timeout="30" variable="result"/&gt;
</code>

Obviously you could make the bat file a bit more dynamic instead of hard coding everything. 

For more information, check the <a href="http://dev.mysql.com/doc/refman/5.0/en/disaster-prevention.html">MySQL 5 doc</a> on backup and restoring databases. 

Would folks be interested in a MySQL CFC wrapper? You know - in my spare time.