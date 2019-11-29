---
layout: post
title: "Ask a Jedi: Configuring Multiple BlogCFC Installs"
date: "2005-12-12T08:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/12/Ask-a-Jedi-Configuring-Multiple-BlogCFC-Installs
guid: 966
---

Dave asks: 

<blockquote>
Ray - could you give a quick example of configuring multiple blogs with a single install of BlogCFC?
</blockquote>

First - as a quick reminder - do not forget that I have a <a href="http://ray.camdenfamily.com/forums/forums.cfm?conferenceid=CBD210FD-AB88-8875-EBDE545BF7B67269">forum</a> setup just for BlogCFC. You can ask questions, make suggestions, or report bugs there. Not that I mind you asking here of course (grin), but I thought I'd share in case you didn't realize!

So - here is the basic, high-level look at how to set up 2 blogs using BlogCFC. These instructions assume you are starting from scratch. 

Begin by expanding the blog.zip file into a temporary folder. Next, decide what database you are going to use. For simplicity's sake, let's assume SQL Server. 

BlogCFC supports multiple blogs in one database. However - I'd probably recommend you use one database per blog. If you can make your own DSNs, this is the route I'd take. Nothing works better or worse in this instance, but I like to keep my blogs separated. So - create your databases and DSNs. 

Next you need to create the web root for the blogs. I'm going to assume you have two blogs under your site root, blogA and blogB. Under your web root, make a folder called blogA and a folder called blogB. Copy the files from the "client" folder (from the zip) into both folders. 

Next copy the "org" folder (from the zip) into an org folder under your web root. 

Now your web root should have 3 folders: blogA, blogB, and org. To ensure both blogs use the same core CFC code, create a mapping called org and point it to your org folder.

Still with me? Good, because we are almost done. The blog.ini file can be found at: org/camden/blog/blog.ini. In it you will see something like this:

<code>
[default]
dsn=blogdev
owneremail=your@addressgoeshere.com
blogURL=http://blogdev.camdenfamily.com/client/index.cfm
unsubscribeURL=http://blogdev.camdenfamily.com/client/unsubscribe.cfm
blogTitle=BlogDev
blogDescription=The Dev Blog
blogItemURLPrefix=mode=entry&entry=
blogDBType=MSSQL
locale=en_US
users=
commentsFrom=
mailserver=
mailusername=
mailpassword=
pingurls=
offset=0
allowtrackbacks=1
trackbackspamlist=phentermine,searchterra,bolobomb.com,date.inter.by,cialis,propecia,viagra,tramadol,searchear.biz,pills and tablets,abrevaonline,flomax,glucophag,best links for home,best earning,soma,spam.com,zyban,amoxil,best tablets,hoodia,prozac,testanchor,4allfree.com,lipitor,actonel,acidophilus,accuzyme,abelcet,accupepinfo,acitretin,acetatablets,shemale,ultram,levitra,salbutamol,music in laguna beach season 2,radar music,vicarious visions,indocin,adatosil,myster-shopper,game.blog57.com,chibroxin,pop music hit,rio mp3,sonic heroes stage 7,mpe songs,convert mp3 wav,theme song mp3,busta rhymes mp3,mefenamic,fioricet,xenical,amifostine,adsorbocarpine,diamond jewelry,My new review,-mp3,poker,instantcredit,zayablo.com
blogkeywords=
</code>

This is the default set of properties for your blog. You want to begin by renaming [default] to [blogA]. Then copy the entire block so that you have two sets of properties. Change [blogA] to [blogB] in the second section.

Next - go through each propety in each blog and set the right values. Each blog should have it's own name and it's own properties. 

Last but not least - go into blogA and blogB's folders, and open up the Application.cfm file. Find this line:

<code>
&lt;!--- Edit this line if you are not using a default blog ---&gt;
&lt;cfset blogname = "Default"&gt;
</code>

It should be right near the top. You want to change "Default" to "blogA" and "blogB" in each folder. 

That's it! To add more blogs, simply copy the client folder into a new folder, and edit the blog.ini file. 

One quick note - many people get tripped up by the fact that the properties in blog.ini are cached. (Even though I <i>did</i> document it!) If you change these values, you must hit your blog with ?reinit=1 in the URL. This forces a reload of all the settings.