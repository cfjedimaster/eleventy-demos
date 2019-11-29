---
layout: post
title: "Tracking application usage with Flex Mobile"
date: "2011-09-24T17:09:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/09/24/Tracking-application-usage-with-Flex-Mobile
guid: 4373
---

On a web site, with good analytic software, it's possible to get estimates for how long the average user spends on your site. This week I was thinking about how one could do the same with a mobile application. In theory, it should be possible to get a precise figure. You know when your application starts and you know when it ends. Therefore, I just need to write the code to handle those events and persist the data somehow. I worked up a few examples here and I welcome any comments on them. I'd <i>especially</i> like to know if anyone is actually doing something like this with their apps now.
<!--more-->
<p>

For my first iteration, I wrote an application that simply noticed when it began and ended, and on those events would write to a log file. The entire application consists of a few files. First, let's look at the top level ViewNavigatorApplication.

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:ViewNavigatorApplication xmlns:fx="http://ns.adobe.com/mxml/2009" 
							xmlns:s="library://ns.adobe.com/flex/spark" firstView="views.LogTestHomeView" initialize="initApp(event)"&gt;
	&lt;fx:Script&gt;
		&lt;![CDATA[
		import model.dbController;		
		import mx.events.FlexEvent;
		
		protected function initApp(event:FlexEvent):void {
			dbController.instance.addLog("opened");
			NativeApplication.nativeApplication.addEventListener(Event.EXITING, myExiting);
		}

		protected function myExiting(event:Event):void {
			dbController.instance.addLog("closed");
			// Handle exiting event.
		}
		]]&gt;
	&lt;/fx:Script&gt;

&lt;/s:ViewNavigatorApplication&gt;
</code>

<p>

Not much here. You can see one method tied to the initialize event and one to the application exiting event. My dbController is a simple wrapper for database operations. I used a basic singleton approach (cribbed from an <a href="http://cookbooks.adobe.com/post_Singleton_Pattern-262.html">Adobe Cookbook recipe</a>). Here's the file.

<p>

<code>
package model {

	import flash.data.SQLConnection;
	import flash.data.SQLResult;
	import flash.data.SQLStatement;
	import flash.filesystem.File;

	public class dbController {

		private static var _instance:dbController = new dbController();
		
		private var dbFile:File;
		private var dbCon:SQLConnection;
		
		public function dbController() {
			dbFile = File.applicationStorageDirectory.resolvePath("log.db");
			trace(dbFile.nativePath);
			dbCon = new SQLConnection();
			dbCon.open(dbFile);

			//create default table
			var sqlStat:SQLStatement = new SQLStatement();
			sqlStat.text = "CREATE TABLE IF NOT EXISTS log(msg TEXT, timestamp TEXT)";
			sqlStat.sqlConnection = dbCon;
			sqlStat.execute();

			if (_instance != null) {
				throw new Error("dbController can only be accessed through dbController.instance");
			}
		}

		public static function get instance():dbController {
			return _instance;
		}
		
		public function addLog(s:String):void {
			var sqlStat:SQLStatement = new SQLStatement();
			sqlStat.sqlConnection = dbCon;
			sqlStat.text = "insert into log(msg, timestamp) values(:msg,:tst)";
			sqlStat.parameters[":msg"] = s;
			sqlStat.parameters[":tst"] = new Date();
			sqlStat.execute();
			trace("inserted: "+s);		
		}

		public function getLog():SQLResult {
			trace("getting log");
			var sqlStat:SQLStatement = new SQLStatement();
			sqlStat.text = "select * from log";
			sqlStat.sqlConnection = dbCon;
			sqlStat.execute();
			return sqlStat.getResult();
			
		}
	}
}
</code>

<p>

That's kind of a big file, but you can see it basically handles the database setup, the addition of a log message, and getting the log. (I could make this a bit nicer by making getLog simply return the data attribute. That way calling code could not worry about working with SQLResult objects.) So based on this code, you can see now that when my application starts and ends, it's going to log to the database. Now let's look at the view in my mobile app:

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="HomeView" viewActivate="init(event)"&gt;
	&lt;fx:Script&gt;
		&lt;![CDATA[
			import model.dbController;
			
			import spark.events.ViewNavigatorEvent;
			
			protected function init(event:ViewNavigatorEvent):void {
				var res:SQLResult = dbController.instance.getLog();
				for(var i:int=0; i&lt;res.data.length; i++) {
					log.text += res.data[i].msg + ' at ' + res.data[i].timestamp + '\n';
				}
			}
			
		]]&gt;
	&lt;/fx:Script&gt;
	
	&lt;s:Label id="log" /&gt;
		
&lt;/s:View&gt;
</code>

<p>

All we do here is simply get the log and display it. After running it a few times, here is what the app displays. (Note - the case of the messages changes about half way through. This happened when I changed the messages.)

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip188.png" />

<p>

So that was my first draft. I could - in theory - have used this to generate a "Total Time Used" value. I'd have to loop through the records and figure out the differences. That seemed like a lot of hard work so I decided on an easier version. Since I know when the app starts and ends - why not simply create a timestamp in the application itself? When the application ends, I can simply save the difference. Here's my new top level application:

<p>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:ViewNavigatorApplication xmlns:fx="http://ns.adobe.com/mxml/2009" 
							xmlns:s="library://ns.adobe.com/flex/spark" firstView="views.LogTest2HomeView" initialize="initApp(event)"&gt;

	&lt;fx:Script&gt;
		&lt;![CDATA[
			import model.dbController;
			
			import mx.events.FlexEvent;
			
			private var beginTS:Date;
			
			protected function initApp(event:FlexEvent):void {
				beginTS = new Date();
				NativeApplication.nativeApplication.addEventListener(Event.EXITING, myExiting);
			}
			
			protected function myExiting(event:Event):void {
				var now:Date = new Date();
				var duration:Number = (Math.floor(now.valueOf()/1000)) - (Math.floor(beginTS.valueOf()/1000));
				trace("using duration of "+duration);
				dbController.instance.addLog(duration);
				// Handle exiting event.
			}
		]]&gt;
	&lt;/fx:Script&gt;
	
&lt;/s:ViewNavigatorApplication&gt;
</code>

<p>

You can see now I've got a variable, beginTS, that acts as my startup timestamp. When the application ends, I get the difference, do some math, and store it as the number of seconds. Here's the new dbController. Notice I've tweaked the table structure a bit.

<p>

<code>
package model {

	import flash.data.SQLConnection;
	import flash.data.SQLResult;
	import flash.data.SQLStatement;
	import flash.filesystem.File;

	public class dbController {

		private static var _instance:dbController = new dbController();
		
		private var dbFile:File;
		private var dbCon:SQLConnection;
		
		public function dbController() {
			dbFile = File.applicationStorageDirectory.resolvePath("log.db");
			trace(dbFile.nativePath);
			dbCon = new SQLConnection();
			dbCon.open(dbFile);

			//create default table
			var sqlStat:SQLStatement = new SQLStatement();
			sqlStat.text = "CREATE TABLE IF NOT EXISTS log(duration INTEGER,timestamp  TEXT)";
			sqlStat.sqlConnection = dbCon;
			sqlStat.execute();

			if (_instance != null) {
				throw new Error("dbController can only be accessed through dbController.instance");
			}
		}

		public static function get instance():dbController {
			return _instance;
		}
		
		public function addLog(dur:Number):void {
			var sqlStat:SQLStatement = new SQLStatement();
			sqlStat.sqlConnection = dbCon;
			sqlStat.text = "insert into log(duration, timestamp) values(:dur,:tst)";
			sqlStat.parameters[":dur"] = dur;
			sqlStat.parameters[":tst"] = new Date();
			sqlStat.execute();
			trace("inserted: "+dur);		
		}

		public function getLog():SQLResult {
			trace("getting log");
			var sqlStat:SQLStatement = new SQLStatement();
			sqlStat.text = "select * from log";
			sqlStat.sqlConnection = dbCon;
			sqlStat.execute();
			return sqlStat.getResult();
			
		}

		public function getTotalUsage():Number {
			trace("getting duration");
			var sqlStat:SQLStatement = new SQLStatement();
			sqlStat.text = "select sum(duration) as total from log";
			sqlStat.sqlConnection = dbCon;
			sqlStat.execute();
			var res:SQLResult = sqlStat.getResult();
			return res.data[0].total;
		}

	}
}
</code>

<p>

Along with changing the table structure, I've added a method, getTotalUsage, that returns the total number of seconds the application has been used. Now my front end view can display it:

<p>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="HomeView" viewActivate="init(event)"&gt;

	&lt;fx:Script&gt;
		&lt;![CDATA[
			import model.dbController;
			
			import spark.events.ViewNavigatorEvent;
			
			protected function init(event:ViewNavigatorEvent):void {
				var total:Number = dbController.instance.getTotalUsage();
				trace(total);
				log.text = "You've used this application for "+total+" seconds.";
			}
			
		]]&gt;
	&lt;/fx:Script&gt;
	
	&lt;s:Label id="log" /&gt;
&lt;/s:View&gt;
</code>

<p>

Which gives me this:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip189.png" />

<p>

Technically the message should be something like, "In the past, you've used this application for..." but you get the point. So - any thoughts on this? If the application crashes it won't store anything, but that should be a rare event. If you <i>really</i> were concerned about that you could used a timed event to store a duration ever few minutes or so. If you want to play with my code, I've made FXPs from both projects and added them to a zip attached to this blog entry.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fprojects%{% endraw %}2Ezip'>Download attached file.</a></p>