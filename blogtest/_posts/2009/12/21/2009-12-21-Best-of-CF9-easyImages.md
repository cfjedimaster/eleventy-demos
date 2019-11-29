---
layout: post
title: "Best of CF9: easyImages"
date: "2009-12-21T18:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/21/Best-of-CF9-easyImages
guid: 3660
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" align="left" style="margin-right:5px;margin-bottom:5px"/> Today's Best of ColdFusion 9 contest entry is easyImages by Simon Romanski. It was judged by Francisco Paulino-Tofinha. This entry also has a rather large download. Therefore I recommend folks use the URL set up by Simon: <a href="http://www.simonit.com/easyImages">http://www.simonit.com/easyImages</a>

I have to admit - I was a bit confused by this application. It didn't seem real clear to me what it actually was supposed to do. There is a README file, and videos, but even with them I was confused at first. After playing around a bit though it finally began to dawn on me what Simon had created. While the application is rather simple, and was buggy for me (I'll explain what I had to tweak), I think he has the start of something really freaking cool here. Let me explain.
<!--more-->
easyImages, from what I can tell, covers three main areas:

a) It gives you a way to ask clients/customers/etc for images.<br/>
b) It gives those clients/customers/etc a quick form (secured with a key) to upload images.<br/>
c) It provides a service by which you can not only request images, but also dynamically ask for different versions as well. 

So for example, if I need my client to provide images, I use a simple form to make the request:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-12-21 at 5.41.29 PM.png" />

If you select the email option (as I did above), the client will be sent an email containing the link. This leads them to a very simple page where they can upload images. I'm assuming this is something you would normally skin for your site.

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-12-21 at 5.42.33 PM.png" />

Note the use of the multi-file uploader. It would be nice if you could include more information on this page. Mainly because I can see clients forgetting what they are supposed to be uploading. 

So far so good. The images will copied to the folders you specified and the data will be added to the database. Simon gets a big ding here for not using cfqueryparam in the database call. 

Now this is the part that gets weird. The easyImages application has a ... tool... builder... not sure what to call it. But it basically allows you to write SQL and CFML code to generate image output. You are provided with a list of the columns (using cfdbinfo, which isn't new to ColdFusion 9, but I'm happy to see a practical use for it). You can use this tool to play with the layout/output/SQL to get something you like, and then copy it to your CFM.

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-12-21 at 5.45.34 PM.png" />

But this is what I think is very cool. The URLs all make use of URL rewriting. So for example:

http://localhost/easyimages/img/original/astro%20pancake.jpg

This gets rewritten (be sure to see my notes below) to a call to getImage.cfm file. Want a thumbnail?

http://localhost/easyimages/img/scale/100/astro%20pancake.jpg

Want a bigger thumbnail?

http://localhost/easyimages/img/scale/250/astro%20pancake.jpg

You can also use three predefined labels:

img-small<br/>
img-medium<br/>
img-large<br/>

This all goes through one central CFM to handle serving up the images. It uses the VFS to cache the results of any resize operation. 

All in all I think this is darn slick! I did have issues though. First, the URL rewrite rules he used did not support spaces in file names. Add "\ " (no quotes) to the regex and you should be fine. Also, his code either assumed a root install, or an install to "easyimage", whereas I had installed to "easyimages". It is possible for CFM code to detect the folder it is in, so his code should really do that. 

Francisco made the point that the application can definitely go further. Since everything is routed through a central CFM there is an opportunity to add deep reporting. Francisco also commented on the organization, which I'd agree could use some cleaning up.

But all in all - I really like this, especially the virtual image serving aspect.