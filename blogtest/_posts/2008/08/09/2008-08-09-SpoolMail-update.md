---
layout: post
title: "SpoolMail update"
date: "2008-08-09T21:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/08/09/SpoolMail-update
guid: 2966
---

I don't normally blog about <a href="http://spoolmail.riaforge.org">SpoolMail</a>, but this is a pretty significant update. Mek Logan sent in a set of updates that dramatically improve the speed. I tested with 666 emails (pure chance, I swear) and the difference before and after was dramatic. The main thing he changed was to stop parsing the body of emails when generating the list of emails. The body is now only parsed on view. Which makes perfect sense of course and I wish I had noticed it first. Anyway, grab the 1.4 release from RIAForge:

<a href="http://spoolmail.riaforge.org">http://spoolmail.riaforge.org</a>