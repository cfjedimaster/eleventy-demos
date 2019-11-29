---
layout: post
title: "Undocumented change to GetHTTPRequestData in ColdFusion 8"
date: "2007-07-01T11:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/01/Undocumented-change-to-GetHTTPRequestData-in-ColdFusion-8
guid: 2163
---

Daniel Budde pointed out to me a <a href="http://www.adobe.com/cfusion/webforums/forum/messageview.cfm?catid=648&threadid=1280872">thread</a>  over at the Adobe forums that discusses an undocumented (as far as I know) change to GetHTTPRequestData. In the past, if you uploaded a file, the content key of the result of GetHTTPRequestData would contain the binary data of the file uploaded. Adobe made the decision to remove this support as it had a negative impact on server performance when a large file was uploaded. Again, see the <a href="http://www.adobe.com/cfusion/webforums/forum/messageview.cfm?catid=648&threadid=1280872">thread</a> for more details. Personally it seems like a smart choice by Adobe.