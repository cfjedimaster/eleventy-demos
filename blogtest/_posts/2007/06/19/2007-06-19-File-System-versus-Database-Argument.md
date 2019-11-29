---
layout: post
title: "File System versus Database Argument"
date: "2007-06-19T17:06:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2007/06/19/File-System-versus-Database-Argument
guid: 2133
---

So I could have sworn I've had this discussion on the blog before, and I'm sure I have in the comments, but I'd like to open it up for further discussion into an entry by itself. Today I got this from Michael G:

<blockquote>
I was curious if you had some resources or information 
to help in an architectural decision that we are tinkering around with. We are using CF 7, Oracle 10g. The debate is if we should store the documents on the file system or in Oracle. I've always stored on the file system, so I do not
know pros/cons of DB storage. The database/file system are not replicated, and the file system is a separate SANS device. 
</blockquote>

My response was pretty vanilla. I told him that while the DB would be nice if you have multiple web servers, the fact that he is storing it off box anyway negates that. So outside of that - I said I'd use the file system just because I was more used to it.

Which isn't a great answer.

Can anyone share their feelings, or even a good link to another blog/site that discusses the pros and cons? Of course, we all know one answer won't fit all, but I'd love to hear some opinions.