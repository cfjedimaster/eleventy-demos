---
layout: post
title: "Ask a Jedi: Excluding Folders from Verity"
date: "2005-11-01T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/01/Ask-a-Jedi-Excluding-Folders-from-Verity
guid: 886
---

A user asked this question about Verity:

<blockquote>
I've got my verity search set up on my site and its running beautifully but there are a few folders I don't want indexed when I'm creating my verity search such as my test and includes folder. Is there anyway I can specify what folders I don't want indexed?? I've done so much searching I can't figure out how. I've read the docs on CFMX6 and CFMX7 on the tags cfcollection, cfindex, and cfsearch to see where I could specify that info but I dont see anything. Would you know a way around this??
</blockquote>

There are a few ways you could handle this. One way - don't use the recursive nature of Verity and instead specify exactly what files you want to index. This would be easier in CFMX7 since you can now do recursive cfdirectory calls. You would get the files, and then remove the files you don't want indexed.

The other option is to let Verity index the root folder, and then follow it up with a delete operation. This assumes you only have a few files or folders to remove. Of course, on a highly trafficked site, there would be the possibility of someone being able to search, and find, the bad files in the second between each operation. I'd probably say go with the first option.