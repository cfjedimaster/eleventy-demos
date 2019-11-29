---
layout: post
title: "Update to CFPDF/Password Issue (no unicorns this time)"
date: "2009-01-27T12:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/27/Update-to-CFPDFPassword-Issue-no-unicorns-this-time
guid: 3212
---

A few days ago I blogged (<a href="http://www.raymondcamden.com/index.cfm/2009/1/23/How-to-remove-a-password-from-a-PDF-using-ColdFusion">How to remove a password from a PDF using ColdFusion</a>) about the difficulty in using CFPDF to remove a password from a protected PDF. It turned out that if you only supplied a userpassword setting and not an ownerpassword setting, the only solution was to use DDX. Myself, Jochem van Dieten, and others, discussed this in depth with Adobe on another listserv to see what was going on here. There were a few open questions. Is a PDF with just a userpassword valid? If not, does that mean cfdocument is broken? If it is valid, is something wrong with CFPDF (ignoring DDX) in that it would not let me remove the password?

We got official word from Adobe. It is indeed a bug with the CFPDF tag. If only a userpassword is supplied, it should be treated as the ownerpassword as well. The bug is known to Adobe and on the plate to be fixed in the next version of ColdFusion. (I got permission to blog this, but being intentionally vague due to NDA, Ninja Death Squads, and Bad Karma.)

I think I may still update my pdfUtils CFC for folks who need this feature, but probably not before the weekend.