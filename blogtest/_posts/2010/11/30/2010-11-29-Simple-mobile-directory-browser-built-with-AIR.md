---
layout: post
title: "Simple mobile directory browser built with AIR"
date: "2010-11-30T09:11:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2010/11/30/Simple-mobile-directory-browser-built-with-AIR
guid: 4031
---

Last night I wanted to take a look at file/directory traversing in a mobile AIR application. I had assumed it would "just work" but I wanted to be sure of that myself and see it in action. I was also curious as to how the various 'helper aliases' work. By that I mean the aliases AIR provides for the user's desktop and documents directory. These are nice, cross platform ways to point to common folders across different operating systems. I wasn't quite sure how they would work on the Android so I figured it was a good time to find out. The application I built is quite short so I'll post the code and then explain how the parts work.
<!--more-->
<p/>
<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="Browse File Demo" viewActivate="init()"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;fx:Script&gt;
	&lt;![CDATA[
	import mx.collections.ArrayCollection;
		
	[Bindable] private var fileList:ArrayCollection;
	private var dir:File;
	private var initialDir:String;
	[Bindable] private var enableUpDir:Boolean;
		
	private function init():void {	
//		dir = File.documentsDirectory;
//		dir = File.desktopDirectory;
		//get root, but always default to first one
		var roots:Array = File.getRootDirectories();
		dir = roots[0];
		initialDir = dir.nativePath;
		enableUpDir = false;
		listFiles();
		trace(dir.nativePath);
	}

	private function listFiles():void {
		trace("Listing "+dir.nativePath);
		currentDirLabel.text = "Browsing: "+dir.nativePath;
		fileList = new ArrayCollection(dir.getDirectoryListing());
		trace("compare "+dir.nativePath+" to "+initialDir);
		if(dir.nativePath != initialDir) enableUpDir = true;
		else enableUpDir = false;
	}
		
	private function changeDir(evt:Event):void {
		var sel:File = fileListing.selectedItem;
		if(sel.isDirectory) {
			dir = sel;
			listFiles();
			fileListing.selectedIndex=-1;
		}
	}
		
	private function goUpDir(evt:Event):void {
		var parent:File = dir.parent;
		dir = parent;
		listFiles();
	}
		
	private function displayFile(selectedFile:File):String {
		if(selectedFile.isDirectory) return selectedFile.name+"/";
		else return selectedFile.name;
	}
	]]&gt;
	&lt;/fx:Script&gt;

	&lt;s:actionContent&gt;
		&lt;s:Button height="100{% raw %}%" label="Go Up" enabled="{enableUpDir}{% endraw %}" click="goUpDir(event)" /&gt;
	&lt;/s:actionContent&gt;

	&lt;s:layout&gt;
		&lt;s:VerticalLayout paddingTop="10" paddingLeft="5" paddingRight="5" /&gt;
	&lt;/s:layout&gt;
	
	&lt;s:Label id="currentDirLabel" width="100%" height="75" /&gt;
	&lt;s:List id="fileListing" dataProvider="{% raw %}{fileList}{% endraw %}" width="100{% raw %}%" height="100%{% endraw %}" click="changeDir(event)" labelFunction="displayFile"&gt;
		
	&lt;/s:List&gt;

&lt;/s:View&gt;
</code>

<p/>

Before getting into the code, let me share a screen shot so you have an idea of what this thing does when run:

<p/>

<img src="https://static.raymondcamden.com/images/screen52.png" />

<p/>

In the screen shot you can see that the application has a directory name printed on top and the contents in a list below. A simple button "Go Up" allows you to return to the higher level directory. Selecting a folder will move you into the folder but selecting a file will currently do nothing. The code begins with the init method. You can see that I started off testing the documents and desktop directory aliases. On the Android, these pointed to /mnt/sdcard - in other words, my SD Card. This seems to make perfect sense and is probably the closest analogy to the desktop or documents directory you are going to get on the phone. For the "real" application though I switched to using the root file system. On Windows this could be multiple drives. To keep it simple I simply grab the first value. I know that Android is Unix based so this would give me / as a root path. I could run this both on my desktop and my phone and it would work the same in either place. 

<p/>

The listFiles function handles getting the directory from the file object and deciding if the "Go Up" button should be enabled. I didn't check to see if any parent existed, but rather if I was at my original starting directory. I imagined a scenario where I'd want to keep my user within a particular area and not allow them to leave that. 

<p/>

Everything else is rather simple as well so I'll skip explaining them unless someone has a specific question. I've attached a zip of the entire project (which includes the APK if you are bored enough to install it) to this blog entry. Nothing too exciting here I guess but hopefully this will be useful to somebody out there.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fbrowsefiles%{% endraw %}2Ezip'>Download attached file.</a></p>