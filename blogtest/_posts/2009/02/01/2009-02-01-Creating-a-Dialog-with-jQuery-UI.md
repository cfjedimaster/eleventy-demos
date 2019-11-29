---
layout: post
title: "Creating a Dialog with jQuery UI"
date: "2009-02-01T16:02:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/02/01/Creating-a-Dialog-with-jQuery-UI
guid: 3216
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2009/1/31/Using-jQuery-and-ColdFusion-to-create-an-autolink-for-definition-application">blogged</a> about using jQuery to create automatic hot links around certain words in your page text. While working on that demo, I tried to use the jQuery <a href="http://docs.jquery.com/UI/Dialog">Dialog</a> widget. I ran into some trouble and gave up, but returned to it this morning to see if I could get it working.

Unfortunately things didn't work out too well for me. I ran into more than one issue, but I had some great help from the folks on the jQuery team. I'd like to specifically call out Rey Bengo, Richard Worth, and Scott Jehl for helping me out. Things actually got ridiculously easy after their support, but I figured a blog post may help others as well. So let's get started!
<!--more-->
The first thing you have to know about the jQuery UI stuff is that it is <b>not</b> included in your core jQuery download. You have to download a few additional files before you start using the UI items. You can start at the <a href="http://ui.jquery.com/download">jQuery UI Download</a> page and select either the latest stable release, the preview release, or use the custom downloader. If you are a newbie like me, I strongly urge you to select the <b>preview release</b>. 99% of the trouble I had today went away when I simply switched from the latest stable 1.5.x release to the 1.6 RC. Let me repeat this. <b>Do not download 1.5.</b> Life will come to an end - chaos will reign - and you will pull out what remains of your hair. From what I've been told, 1.6 will be released very shortly (very very shortly apparently), so it's not like your working with a beta copy. 

Once you download the zip, the next thing you will notice is that you don't simply have one simple JS file. Instead you have a complete package of JavaScript, CSS, and HTML files. There are two important folders here. The UI folder is your javascript collection. The themes folder is your skins folder. For my example code I took both folders and copied them to my demo:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 136.png">

Alright, so next we will create a very simple html page. I based my code on the <a href="http://docs.jquery.com/UI/Dialog">dialog documentation page</a> with one big change. Their demo code runs the dialog immediately when the page loads. I think in almost all cases folks will want to show a dialog based on some event. Here is what I came up with:

<code>
&lt;html&gt;
	
&lt;head&gt;
&lt;script src="js/jquery.js"&gt;&lt;/script&gt;
&lt;script src="js/ui/ui.core.js"&gt;&lt;/script&gt;
&lt;script src="js/ui/ui.dialog.js"&gt;&lt;/script&gt;
&lt;script&gt;
function showDialog(){
	$("#example").dialog();
	return false;
}
&lt;/script&gt;

&lt;/head&gt;	

&lt;body&gt;

&lt;p&gt;
&lt;a href="" onclick="return showDialog()"&gt;Show the Dialog&lt;/a&gt;
&lt;/p&gt;

&lt;div id="example" class="flora" title="This is my title"&gt;I'm in a dialog!&lt;/div&gt;
	
&lt;/body&gt;
&lt;/html&gt;
</code>

Going through the file, here are some important things to note. The dialog documentation says that the only <b>required</b> file is ui.core.js. That is not true. You also have to include ui.dialog.js. Maybe that's obvious, but I had assumed that ui.core.js simply contained the code for all the widgets. The one and only function, showDialog, demonstrates how easy it is to create the dialog. You point to an existing div and run dialog(). Yeah, that's really hard. Can I still bill by the hour and use jQuery?

Scrolling down, you can see my simply link to run the function, and lastly the actual div for my dialog. This works, and you can see it in action here:

<a href="http://www.coldfusionjedi.com/demos/jqueryuitest2/test1.html">http://www.coldfusionjedi.com/demos/jqueryuitest2/test1.html</a>

But it has a few problems. First off, the dialog is visible on page load. Secondly, the UI leaves a bit to be desired:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 220.png">

So how do we fix this? First off, to make the dialog hidden on load, we can simply add a bit of CSS to it:

<code>
&lt;div style="display: none;" id="example" title="This is my title"&gt;I'm in a dialog!&lt;/div&gt;
</code>

To load the default skin, we use a CSS from the themes folder we copied over earlier:

<code>
&lt;link rel="stylesheet" href="themes/base/ui.all.css" type="text/css" media="screen"&gt;
</code>

And that's it! Check out the sexy dialog! It is the most sexiest dialog I've seen in my life. (Ok, I may just be a bit happy that I finally got it working.)

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 316.png">

You can see it in action here: <a href="http://www.coldfusionjedi.com/demos/jqueryuitest2/test2.html">http://www.coldfusionjedi.com/demos/jqueryuitest2/test2.html</a> Don't forget you can view source to see the entire page.

None of this worked for when I was using 1.5, so be sure to use the release candidate of 1.6!

Ok, so with things working well now, I decided to go crazy and try to apply a custom theme. I went to <a href="http://ui.jquery.com/themeroller/">ThemeRoller</a> and grabbed one of the presets - Mint Choc. As before, the zip you get is a bit big and may confuse you. (Well, it confused me at first.) After extracting the zip, the folder you want is jquery-ui-themeroller/theme. I renamed theme to mint and put it within my themes folder. I then changed the CSS to 

<code>
&lt;link rel="stylesheet" href="themes/mint/ui.all.css" type="text/css" media="screen"&gt;
</code>

and it just plain worked!

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 46.png">

You can see this in action here: <a href="http://www.coldfusionjedi.com/demos/jqueryuitest2/test3.html">http://www.coldfusionjedi.com/demos/jqueryuitest2/test3.html</a>

All in all, I'm pretty pleased with the UI stuff, once I got past my brain cramps with it. I seem to remember having similar issues with the core jQuery library as well and I'm over that as well, so maybe it's simply something that I have to get used to. 

I'll leave off with one more quick tip from Richard Worth. Remember my trouble with hiding the div on page load? He pointed out that you can also dynamically create dialogs with strings:

<code>
$("&lt;div&gt;I'm in a dialog&lt;/div&gt;").dialog() 
</code>

That's pretty slick. I'm not sure if that is documented though. To be honest, I feel a bit weird putting stuff on the page that isn't visible. I'll probably use this form instead.