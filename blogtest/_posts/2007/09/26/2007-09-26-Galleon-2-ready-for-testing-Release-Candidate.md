---
layout: post
title: "Galleon 2 ready for testing (Release Candidate)"
date: "2007-09-26T17:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/26/Galleon-2-ready-for-testing-Release-Candidate
guid: 2373
---

<img src="https://static.raymondcamden.com/images/cfjedi/glogo.png" align="left">

Ok, I think I'm ready to release this baby, but I need a sanity check before I do so. Before downloading this release, please read the notes below. This is <b>not</b> intended for production, nor is it a good idea to apply this over existing Galleon Forums (I'll explain why in the notes). But if you want to give 2.0 a test drive, now is the time to do so. 

So what does Galleon 2 have?

<ul>
<li>New logo by Murat Kgirgin. Because I have the graphical skills of a drunk one handed mentally handicapped monkey, I made the poor guy do about 10 revs, so thank you Murat for dealing with me.
<li>New table system to handle stats. (See notes below.)
<li>Avatars. You can now upload an image for an avatar, or use your gravatar.
<li>You can now edit your settings in the Admin.
<li>BBML thanks to <a href="http://www.depressedpress.com/">Depressed Press</a>
<li>New security system. You can now make truly private conferences. 
</ul>

So now for the release notes. Read this carefully before downloading.

<ul>
<li>The zip contains updated SQL scripts for MySQL and SQL Server. These are for new installs. The Access DB is not updated. 
<li>There is no way to 'migrate' an old Galleon install, but that is what I'm working on next.
<li>When you set up security for a conference/forum, you want to explicitly set who has permission to edit. Right now it defaults to Everyone.
<li>In terms of Security, "Everyone" means any person, BUT, they must be logged in. So if a forum has Write access Everyone, it doesn't mean non-authenticated users can post. Basically - security begins after you are logged in. (Or should, if not, let me know.)
</ul>

Please post bug reports here - but read the comments first so as to not duplicate.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fgalleon2%{% endraw %}2Ezip'>Download attached file.</a></p>