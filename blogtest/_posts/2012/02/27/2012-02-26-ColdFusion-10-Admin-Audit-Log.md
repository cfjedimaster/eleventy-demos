---
layout: post
title: "ColdFusion 10 - Admin Audit Log"
date: "2012-02-27T10:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/02/27/ColdFusion-10-Admin-Audit-Log
guid: 4539
---

Here's a little gem I just discovered this weekend. ColdFusion 10 now has an administrator audit log. As you can probably guess, this is a log of administrator actions. You can find it the usual log location (and via the CF Admin Logs page). Here's a sample:

<p>

<code>
"Severity","ThreadID","Date","Time","Application","Message"
"Information","catalina-exec-2","02/15/12","15:25:05",,"C:\ColdFusion10\cfusion\logs\audit.log initialized"
"Information","catalina-exec-2","02/15/12","15:25:05",,"User admin enabled using admin password "
"Information","catalina-exec-2","02/15/12","15:25:05","CFADMIN","User admin changed RDS password "
"Information","ajp-bio-8012-exec-2","02/15/12","15:39:36","CFADMIN","User admin changed Server monitor settings. The old values were Monitoring enabled: YES, Memory tracking enabled: NO, Profiling enabled: NO, Monitoring server Enabled: NO, Monitoring server port: 5500. New values are Monitoring enabled: true, Memory tracking enabled: true, Profiling enabled: false, Monitoring server Enabled: YES, Monitoring server port: 5500"
"Information","ajp-bio-8012-exec-2","02/23/12","14:41:19","CFADMIN","User admin added/edited new Active ColdFusion Mappings with logical path as /zeustests and Directory path as C:/Users/Raymond/Dropbox/websites/zeustests/"
"Information","ajp-bio-8012-exec-2","02/27/12","09:27:59",,"User admin deleted datasource mxna."
"Information","ajp-bio-8012-exec-2","02/27/12","09:28:34","CFADMIN","User admin changed Logging settings.Old values were --&gt; Log directory  : C:\ColdFusion10\cfusion\logs, Maximum file size: 5000, Maximum number of archives: 10,  Log slow pages taking longer than: 30.New values are --&gt; Log directory  : C:\ColdFusion10\cfusion\logs, Maximum file size : 5000Maximum number of archives: 10,  Log slow pages taking longer than: 30 "
</code>

<p>

Note that this doesn't cover every little action, but rather focuses on the more important changes. Note though that when possible - changes are recorded so that you can see both what the old value was and the new value. This could be invaluable for knowing who to blame when someone screws up.