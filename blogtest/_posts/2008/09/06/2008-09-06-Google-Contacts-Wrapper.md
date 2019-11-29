---
layout: post
title: "Google Contacts Wrapper"
date: "2008-09-06T16:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/06/Google-Contacts-Wrapper
guid: 3002
---

Earlier today a user asked if I knew anything about reading Google contact information. I wasn't aware of an API for this, but turns out, one did exist (<a href="http://code.google.com/apis/contacts/">Contacts Data API</a>). I think I'm finally getting used to the Google way of thinking when it comes to APIs (although see my PS at the bottom), so this one was rather easy to set up. 

I just released the <a href="http://googlecontacts.riaforge.org/">GoogleContacts</a> project at RIAForge. This is a simple CFC that can retrieve both contacts and groups from your account. It doesn't support writing back to the system yet. Nor does it support dynamic data. (Google lets you put arbitrary name/value pairs into a contact, which is kind of nice.) 

p.s. For folks who use my <a href="http://youtubecfc.riaforge.org/">YouTube</a> wrapper, the engineers on the YT team changed something on the back end that broke many people's implementation of the Upload API. A user reported the bug to me this week and I've been working on fixing it, but it's rather low level so it may be a few more days before it is fixed.

From what I know - this change wasn't announced. When I looked on the forums I saw a bunch of messages from folks wondering why various libraries stopped working all of a sudden. If you manage an API, I really think you have to go out of your way to manage changes, even simple changes, to ensure you don't leave your customers hanging. From what I know, their change was to essentially get a bit more strict, so in theory the change should not have broken any client. Still though, perhaps a bit more warning would have been nice!