---
layout: post
title: "Canvas 2 Beta"
date: "2006-12-29T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/29/Canvas-2-Beta
guid: 1741
---

I'm <b>very</b> happy to announce the beta for Canvas 2. Before I say anything at all about this release, I want to give thanks to Mark Mazelin. 100% of Canvas 2 is his work. It has been ready for a while now but I've just been too busy to release it yet. I'm releasing his work as a beta not because I don't trust his work - but mainly that it is so big a change that I need additional eyes to look at it. Plus, there are two changes I want to add in before the final release is done. So what exactly is in Canvas 2?
<!--more-->
<ul>
<li>implemented "What links here" for a page
<li>implemented delete page functionality
<li>implemented move (rename) page functionality
<li>implemented "Orphaned pages" for a site
<li>implemented mediawiki-like code section detection (lines that start with a space)
<li>reworked the paragraphing a bit to make it more mediawiki like
<li>added automatic table of contents (based on all the hx tags on the page)
<li>Per page category(ies) using mediawiki-type URL naming
[[Category:MyCategoryName]]
<li>Categories page listing all available categories
<li>Individual Category pages for each category used listing all pages
that use that category
<li>Recent Updates page
<li>"Stub" variable component
<li>Search will automatically redirect to a page if the page title (path)
exactly matches the search criteria
<li>Ability to use spaces in document names (e.g. Use [[My Page Name]] in
the wiki code)
<li>Modified Page History logic to show most recent at top instead of
bottom, since most people are interested in the most recent revisions,
rather than the oldest
<li>Authentication (login/logout/unique id stored as page author)
<li>Authorization: global authZ required for view/edit; page-level authZ
for view; page-level authZ for edit
<li>AuthZ-based navigation inclusion
<li>Ability for a page to automatically redirect to another page:
#REDIRECT [[RedirectPage]]
<li>Mediawiki-like headers (series of equals signs)
<li>Mediawiki-like bold (3 single quotes)
<li>Mediawiki-like italics (2 single quotes)
<li>Embedded lists (e.g. 2 asterisks embeds an unordered list within a
list, complete with indentation), up to 3 levels deep
<li>Delete a page
<li>Printable (HTML or PDF)
<li>Diff engine
</ul>

What is left to do? There will be a design change. I'll be keeping the design simple as it is now - but I want something a bit less top heavy and a design that can use the new logo. Secondly, to add to the new security methods I want to add LylaCaptcha.

So - download the zip and send me the bug reports. Please note I was too lazy to delete the SVN files and folders so pretend they don't exist.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcanvas2%{% endraw %}2Ezip'>Download attached file.</a></p>