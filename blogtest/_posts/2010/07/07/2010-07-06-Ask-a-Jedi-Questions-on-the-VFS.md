---
layout: post
title: "Ask a Jedi: Questions on the VFS"
date: "2010-07-07T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/07/Ask-a-Jedi-Questions-on-the-VFS
guid: 3870
---

Daniel emailed me last night with some questions about ColdFusion 9's Virtual File System (VFS). I thought it would be worthwhile to discuss them with the class (you guys ;) and see what people thought.
<!--more-->
<blockquote>
I have read some of your blog posting about the virtual file system, but I still have a question. So, in our system, the users do a lot of uploading files, many files are quite large, such as Arch. Drawings. I figure some of the uploading time is because of the network, however, I was wondering if the VFS could help speed up our doc upload times, or is that not what this concept is for?
</blockquote>

<p>

In this case, the VFS won't help you. When you upload a file, the time it takes to get from the client to the server will be entirely dependent on the size of the file being uploaded and the connection between the two parties. The VFS can't help out here at all. Once the file is uploaded, however, the VFS is an excellent place to store the file and can be used with the cffile/action=upload tag. You get the performance benefit of having the file in RAM and being able to work with it there along with not having to worry about security issues. Do know though that the default size of the VFS is 100 megs. You mention files that are "quite large" and involve drawings. I can easily see one detailed image being larger than 100 megs. Don't forget you can check the size of the VFS and determine how much free space you have in it.

<blockquote>
I thought maybe the users, when the doc is uploaded, would go directly into RAM since the documentation makes it sound like that would be quicker...maybe I read its purpose wrong...
Then, when the user actually navigates away from the page, CF moves the document from RAM to its actual storage place.
</blockquote>

Again, with the file in RAM, some things should be quicker. So for example, using imageGetInfo, might be trivially faster since there isn't the need to go to disk. I say "trivially" because I've not done any speed tests myself. But if you do a few operations on the image (get info, resize, etc) then your benefits may stack up. Now to the second part of your question above "when the user .. navigates away" - that's a whole other question: "Can we do something when the user leaves the page?" I assume you don't really mean that - but if you do, let's follow that up with another blog post. I assume you meant that you could move the file to physical storage when you are done "messing" with it, and that is absolutely true.

<blockquote>
Is this one use of VFS, or am I totally missing its function? I was not to clear on why you would use VFS to store cfm pages, or cfc page, or images...
</blockquote>

One reason to use VFS for CFM pages would be to allow for dynamic CFML to execute. While not typically recommended, you could store CFML in your database, and then use the VFS to write it out as a temporary file and execute it with a cfinclude. Again, <b>this is not typically recommended</b>, but it's something you can do if you choose. I built a simple ORM based CMS when ColdFusion 9 came out. I used this technique to allow for dynamic headers and footers with CFML within them. 

As for other uses - so far my only production use of the VFS is for file uploads at <a href="http://groups.adobe.com">Adobe Groups</a>. All file uploads are put in VFS and "checked" there (for images, for size, etc). Once I'm happy with them I move them to the Amazon S3. (Which will be a heck of a lot easier in ColdFusion 901.)