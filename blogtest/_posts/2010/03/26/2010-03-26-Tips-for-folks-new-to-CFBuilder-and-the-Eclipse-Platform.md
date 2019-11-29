---
layout: post
title: "Tips for folks new to CFBuilder and the Eclipse Platform"
date: "2010-03-26T16:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/26/Tips-for-folks-new-to-CFBuilder-and-the-Eclipse-Platform
guid: 3765
---

For some people trying out CFBuilder, this will be their first experience with an Eclipse-based application. Eclipse has been around for a while now and is an excellent platform for IDEs. While it is extremely powerful and is chock full of features, it can be a bit... alien to people who have never used it before. This blog post will share some basic tips/suggestions for working with CFBuilder and Eclipse. It is certainly not meant to be a <i>complete</i> guide to everything Ecplise-wise, but I thought it might be helpful to share a few things that may confuse/frustrate people migrating from non-Eclipse IDEs. These are in no particular order, and I would <b>greatly</b> appreciate other people's tips as well.

<p/>
<!--more-->
<h2>Definitions</h2>

<p/>

First off, some quick definitions. When you use CFBuilder, you are working in a workspace. The workspace is, for all intents and purposes, the entire IDE, your settings, layout, and projects. Many people never work with additional workspaces. (I don't, and will explain why below.) But if you want to have radically different setups for your development, you should look at using multiple workspaces.

<p/>

Next - you will often here people refer to "Views". Views are panels in the IDE and kind of act like mini applications. Some views you will see often are Navigator, Outline, Servers, etc. Views can be dragged and moved around the editor. They can be shrunk and expanded as you see fit. One tip - if you are on a laptop and want to quickly get more room for your code, double click on the tab above your code that contains the filename. This will expand the editor to the maximum size of the IDE. If you here people talk about a view but don't see it, you can add a view by going to going to the Window/Show View menu. 

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/showview.png" title="Show View" />

<p/>

This shows a subset of comment views. You will probably <i>not</i> see the one you want. Just click other. What's cool and not evident (it wasn't to me for many months!) is that you can use the filter box on top. Yes, I know it says "type filter text", but I just never really noticed it, or got the intent. So if you are looking for a particular thing, like Tail View, you can type in a few characters and the list will filter to it. This works in <i>many</i> places within Eclipse.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/showviewfiltered.png" title="Show View (Filtered)" />

<p/>

The next term is Perspective. Like a workspace, this is a group of views, or, a layout. Changing your perspective can greatly change what you see on screen. Unlike workspaces, perspectives work in the same projects though. You will probably encounter a new perspective when you first try out debugging.

<p/>

You can find more definitions here at the CFB Documentation: <a href="http://help.adobe.com/en_US/ColdFusionBuilder/Using/WS0ef8c004658c1089-2cf13501121af8ece2c-7fff.html">About the workbench</a>. I'll also point out the entire section, <a href="http://help.adobe.com/en_US/ColdFusionBuilder/Using/WS0ef8c004658c1089-2cf13501121af8ece2c-8000.html">ColdFusion Builder Workbench Basics</a>, as another excellent resource (that goes more deep than I am here!)

<p/>

<h2>I want to edit a CFM, why can't I?</h2>

<p/>

One of the biggest issues for me when I first started using Eclipse was the fact that it <b>greatly prefers</b> you to use projects. CFBuilder has a "Files" view that allows you to browse the file system and edit any CFM at will. You can also use RDS to edit files. However - in general you really want to start working with and using projects. These are created in the Navigator panel and typically should be set up so that each project relates to one set of files. For me, I've got a project for each of my open source projects and each client. I've also got a project for my generic web root. This is where I dump all my tests and "just playing scripts". Here is a snapshot of my Navigator now.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/navigator.png" title="Navigator" />

<p/>

Notice that I only have three projects. That's because I recently blew away all my settings. As I need to touch each of my existing projects I'll either create a new project or use the import action to bring it in. 

<p/>

So as I said - you <i>can</i> work with ad hoc files. On Windows you can even double click a CFM/CFC to open it in CFBuilder. But in general you want to start using projects. On my Mac, I use TextMate for CFM/CFCs double clicked in the finder. I typically only use this for quick modifications. 

<p/>

<h2>How do I search, and why is search scanning all my code?</h2>

<p/>

To perform a multi-file search (and replace), you can use the Search menu. Obvious, right? What isn't obvious is the <i>scope</i> of the search. By default, Eclipse wants to search your entire workspace. That can be a Huge Ass amount of files (Huge Ass is a technical term, look it up.) There is an option to search only within "Selected Resources", but it may be grayed out. In order to actually use that scope, you must first click on the project, or folder, in Navigator. This frustrates me to no end. I'm typically typing in a file when I feel the need to search. If i forgot to first click in the Navigator I'm not able to filter my results. I go into more detail about this topic <a href="http://www.raymondcamden.com/index.cfm/2009/3/16/Multifile-search-and-replace-in-Eclipse">here</a>.

<p/>

<h2>I tried to open a file, and it opened in another editor!</h2>

<p/>

Eclipse has a set of "recognized" file types and extensions. Obviously CFC and CFM are supported, HTML, CSS, and JS. But what about other files? I've seen some developers use the .inc extension for files they include in their ColdFusion projects. As an example, on my system, Dreamweaver is configured to run inc files. You can tell by the icon used in Navigator.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/badfiletype.png" title="Bad file type. Baaaaad." />

<p/>

So what to do? You have two options. If you just want to get the darn thing open quickly, right click, and select Open With - Text Editor. While that works, you won't have native color coding.

<p/>

The better solution is to tell Eclipse about the file association for inc. Go into your preferences and select General / Editors / File Associations. (As just a reminder, I had no idea where that was, but I used the tip mentioned above to filter the preferences until I found it.) Click Add (next to File Types) and enter the file extension:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/newfiletype.png" title="New File Type" />

<p/>

Hit ok, and then ensure it is selected. You will notice nothing in the Associated editors box. So click Add... there and then select Adobe CFML Editor. 

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/choseadobecfeditor.png" title="Choose the Adobe CFML Editor" />

<p/>

Hit Ok a few times to close out the dialog, close the file (if you had it open), and open it up again. Now here is where you may get tricked. If you open your file and don't see color coding, you may think you made a mistake. You didn't. Eclipse is remembering that you said to open that file with the Text Editor. It recognizes .inc as a CFML file (Navigator will show the right icon), but since you previously told it to use the text editor, it will remember that preference for the file. Just right click, open with, and select Adobe CFML Editor. From now on, and for other .inc files, it should use the right editor.

<p/>

<h2>I added a file to my project, where is it?</h2>

<p/>

Here is one that bites me at least once a week. While a project may be based on your file system, Eclipse does not constantly monitor the file system for changes. If you add a new file, or delete one, via the file system, you want to go into Eclipse, right click on the project, and select refresh. You can refresh at the folder level as well.

<p/>

<h2>Navigating the Navigator</h2>

<p/>

Have a large project? Hate constantly moving up and down to find stuff? There is an option you can use called "Link with Editor"

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/linkeditor.png" title="Forgive my drawing skills" />

<p/>

If enabled, when you select an open file, the Navigator will scroll up to where the file is located. This is darn handy when you are working "high and low" in a big project. I also tend to turn it on and off as it is annoying when I don't want to use it.

<p/>

<h2>Can I hide files?</h2>

<p/>

Yes and no. The Navigator lets you hide files based on a pattern match, but if you don't like their existing patterns you are out of luck. In the upper right side of the Navigator is a downward arrow. Click on it then select Filters. You can then chose to enable/disable filters to your liking. I tend to use .* as it hides .svn stuff.

<p/>

<h2>I've got a lot of projects - is there a way to organize them?</h2>

<p/>

Yes! Remember earlier when I said I don't like using multiple Workspaces? I prefer to use something else - Working Sets. A Working Set is a collection of projects. By default you have no working set. You can start working with them by using the same downward arrow mentioned above. Click it and pick Select Working Set.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/selectws.png" title="Select Working Set" />

<p/>

You can add a new working set and give it a nice name. Now be aware - until you add your projects to the working set, they will not show up in the navigator. I've typically used working sets to handle "Current" and "Archived" projects, so old stuff doesn't get in the way. Some folks use it to differentiate between client and personal projects. The choice is yours.

<p/>

<h2>Copy/Paste works in Navigator</h2>

<p/>

Did you know you can copy and paste files and folders in Navigator? Yep, you can, just as if it were a operating system folder. Just select a file, or folder, right click, Copy, and then find a lace to paste it.