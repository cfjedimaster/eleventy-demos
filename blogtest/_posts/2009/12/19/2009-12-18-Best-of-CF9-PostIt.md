---
layout: post
title: "Best of CF9: PostIt"
date: "2009-12-19T10:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/19/Best-of-CF9-PostIt
guid: 3656
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" align="left" style="margin-right:5px;margin-bottom:5px"/> Today's Best of ColdFusion 9 entry comes to us from Corey Butler. It was reviewed by <a href="http://www.briankotek.com/blog/">Brian Kotek</a>. I'll be including his notes as well as mine intermingled below. Warning - the download for this entry is rather large. So instead of including it as an enclosure to the entry, I've instead FTPed it to my server. You can download it by clicking the URL below. The file size is a bit over 12 megs. (If folks have issue grabbing the code, let me know and I'll put it up on S3.)

Download URL: <a href="http://www.raymondcamden.com/downloads/postit.zip">http://www.coldfusionjedi.com/downloads/postit.zip</a>

Ok, so with that out of the way, what kind of application is PostIt? Corey was kind enough to provide a real nice installation document (both in Word and PDF). I'll quote from this document here:

<blockquote>
This system, code named PostIt, is a new look on the old form management concept. It was designed as a form administration tool that developers could expand on. To accomplish this, forms are created in the Survey Manager interface and stored as XML templates. Developers leverage these XML templates to display forms in any fashion. These formats could be basic HTML, XML-compliant JavaScript Frameworks, or Flex to name a few.  
</blockquote>

I have some experience with survey builders (see <a href="http://soundings.riaforge.org">Soundings</a>) so I was rather intrigued to see how Corey approached it. I was also happy to see another content entry using an installer. Now, his installer failed pretty badly for both Brian and I (details below), but again - I think the fact the folks are at least <i>thinking</i> about installers is a <b>great</b> thing. 

Following Corey's instructions, if you put the unzipped contents within your local qa folder, you will open your browser to http://localhost/qa/install. The installer asks for a DSN, but it doesn't actually create the DSN. As far as I can tell it simply takes the name and uses it to run an install script. However, there are two bugs here that both Brian and I found.

First, you will most likely get this error after you submit on the installer:

<code>
Argument 2 of function Replace cannot be an empty value. 

The error occurred in C:\Apache\htdocs\qa\install\index.cfm: line 29

27 :     &lt;cffile action="read" file="#expandpath('./demo.template')#" variable="out"/&gt;
28 :     &lt;cfscript&gt;
29 :         pth = replace(replace(CGI.PATH_INFO,listlast(CGI.PATH_INFO,"/"),''),"/install","","ALL");
30 :         str = replace(out,"{% raw %}{@URL}{% endraw %}",CGI.SERVER_NAME&"/"&pth,'ONE');
31 :         str = replace(str,'//','/','ALL');
</code>

I got around this by removing line 29 and simply using: 

<code>
pth = "/Library/WebServer/Documents/qa";
</code>

Obviously that isn't the optimal solution. Secondly - while the application asks for a DSN, it is hard coded to use "postit2". So I suggest simply using that.

The installer asks you for SMTP information. If you open up Application.cfc, you can see it makes good use of the new CF9 ability to set default mail settings:

<code>
this.smtpserversettings = {
server=arguments.smtp.server,
username=arguments.smtp.username,
password=arguments.smtp.password
};
</code>

A small thing - but I'm really happy they added this to ColdFusion 9.

Another thing the installer mentions, but again, it didn't work for me, was the ability to enable a Server CFC specifically for the application. I ended up added a access="remote" to his component and running it manually, but if you wanted to you could point to it in the CF Admin. I'm not sure what his installer was going to do with the checkbox, but maybe that will be enabled in the future. 

After you get past the installer, the first thing you want to do is take a look at the Admin. The first thing you may notice is that you are running a HTML file - not ColdFusion. The admin is an Ext application that wraps calls to ColdFusion. Very slick! I thought it was broken at first when I couldn't get survey data to load. You need to <b>double click</b> on the survey! Once done, you get a pretty darn cool view:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 345.png" />

I freaking love Ext-based applications. I haven't used Ext much, and I don't think it does things as well as jQuery, but for making application UI, it seems to kick some major butt. I also liked how the survey results included maps for respondents:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 419.png" />

And check this out - here is how you edit matrix type questions:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 511.png" />

The grayed out portion below is how the question renders. All in all - the admin is extremely well done and is giving me ideas on how to improve reporting in my own tool. Brian was also impressed by it as well. 

On the negative side, Brian points out that the download size is way huge and could be trimmed quite a bit. While not the most important thing right now, it <i>is</i> something that folks should keep in mind when distributing software. Another issue is that the application will die if debugging is turned on. I see this quite a bit in applications. Don't forget you can always disable debugging by using the cfsetting tag. I try to do this in all my OS applications.

One big issue Brian points out is the use of a full system path when taking a survey. So for example, this is the URL you get when taking the demo survey:

http://localhost/qa/take.cfm?survey=/Library/WebServer/Documents/qa/data/general/demo.xml

That's a very, very bad idea. Even if take.cfm did security checks on the file it loads you should never be passing around full system paths like that. If we assume that all surveys must be under data, then the URL should probably look something like this:

http://localhost/qa/take.cfm?survey=general/demo.xml

Brian also points out that Corey makes use of CFM files to manually return JSON data. This is odd since ColdFusion can make JSON for you. Also, Brian points out (and I agree) that it would be better to hit a CFC and use CF's ability to auto translate results into JSON for Ajax calls. 

Other random notes: It makes use of the VFS - which I swear is turning out to be probably the second coolest feature of CF9 (after ORM). It also makes use of the new caching system. Actually, I think between VFS, the new caching, and ORM, I'd consider those three to be the most important new features in CF9 (imho). 

All in all - both of us think this is a very interesting start. It definitely needs some more work, but I'd love to see the next version of this!