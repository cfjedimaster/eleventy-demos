---
layout: post
title: "I've encrypted my CFML templates and lost the originals, now what?"
date: "2007-12-28T15:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/28/Ive-decrypted-my-CFML-templates-and-lost-the-originals-now-what
guid: 2564
---

Someone just asked in the CF IRC channel what they can do with set of encrypted templates. The developer on their team encrypted a bunch of code, deleted the originals, and left the company.

In the past, you could Google and download a tool to decrypt the files. Technically you were (as far as I know) breaking your license w/ Adobe. But apparently this tool doesn't work with recent servers.

I also heard rumors, and this was <b>way</b> back in the Allaire days, that you could call the company, explain the situation, send the files, and get the decrypted source back.

But what is the answer now? I don't want to promote any illegal hacks, so if someone knows the "official" answer, I'd like to know. 

Of course, the best solution here is prevention. If your code was checked into a source control repository, and the developer didn't have admin rights to that machine, then your code would have been safe.