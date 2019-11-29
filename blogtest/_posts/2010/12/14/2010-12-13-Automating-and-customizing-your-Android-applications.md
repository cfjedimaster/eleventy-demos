---
layout: post
title: "Automating, and customizing, your Android applications"
date: "2010-12-14T09:12:00+06:00"
categories: [coldfusion,flex,mobile]
tags: []
banner_image: 
permalink: /2010/12/14/Automating-and-customizing-your-Android-applications
guid: 4052
---

A few days ago I blogged about the creation of a <a href="http://www.raymondcamden.com/index.cfm/2010/12/8/Simple-RSS-Reader-built-in-AIR-for-Mobile">simple RSS reader</a> for the Android platform. It certainly wasn't complex, but it was good practice to get my feet wet with the Hero SDK and mobile Flex development. I'm a big fan of trying small, simple applications as a way to get experience with a platform. When I built this application though, I have to admit I had something a bit more interesting in mind. Today I'll show you what I built. I think it's pretty cool and it is a testament to the power of the tools Adobe has provided.
<!--more-->
<p/>

Whenever I present on Adobe AIR, I always take pains to mention that the SDK is 100% free. You don't have to buy any tools at all to work with AIR. Certainly Flash Builder is a damn fine tool (if you are doing Flex-based AIR development) and I recommend it, but if you don't have the money, or don't like the editor, you can use your own editor and compile both Flex and your AIR applications by hand. There are a set of command line tools that cover the entire process. To make things even easier, you can automate all of this with ANT. Terry Ryan just did a great blog post on this: <a href="http://www.terrenceryan.com/blog/post.cfm/using-ant-to-package-the-same-air-app-to-multiple-devices">Using ANT to package the same AIR app to Multiple Devices</a>. In his post, Terry describes not only compiling the Flex application but also building the installers for both Android and the Playbook. This works great. But did you know that one of the coolest features in ANT is the ability to do replacements in text files? I didn't know this till I saw the ANT file for Model-Glue. If you combine the fact that we can make replacements in our source code with the ability to build/compile the application via ANT, you can provide a "Create your own RSS Android App" application via the web. Consider the following walkthrough:

<p/>

User hits a form on your site:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen54.png" />

<p/>

They enter a site name, a URL, and a RSS URL and then hit submit. Next they see: 

<p/>


<img src="https://static.raymondcamden.com/images/cfjedi/screen55.png" />

<p/>

At this point, the APK could be emailed to them (on an Android phone you can install applications sent via email), it could be stored on the file system for download later, or any other number of possibilities. The point is - they now have a 100% customized Android application delivered completely dynamically via ColdFusion and the AIR/Flex command line tools.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/device.png" />

<p/>

Here is the code I used for the ColdFusion side. <b>This is a proof of concept. It will fail horribly if run by multiple users. That's fixable, but beyond the scope of this blog entry.</b> 

<p/>

<code>

&lt;cfif structKeyExists(form, "submit")&gt;
    
    &lt;cfset pathToAnt = "C:\apache-ant-1.8.1\bin\ant.bat"&gt;
    &lt;cfset pathToBuild = """C:/Users/Raymond/Documents/My Dropbox/projects/SimpleRSS/build.xml"""&gt;
	
	&lt;cfexecute name="#pathToAnt#" arguments="-buildfile #pathToBuild# -verbose -Dcompany=#form.company# -Durl=#form.companyurl# -Drssurl=#form.rssurl#" variable="result" errorvariable="error" timeout="60" /&gt;

	&lt;cfif not len(error)&gt;
	    &lt;h2&gt;Done!&lt;/h2&gt;
		Your APK has been created.
		&lt;cfabort/&gt;
	&lt;/cfif&gt;
	&lt;!--- no error handling yet - too bad ---&gt;		
&lt;/cfif&gt;


&lt;h2&gt;Make me an Android App&lt;/h2&gt;

&lt;form method="post"&gt;
Enter company name: &lt;input type="text" name="company" value="test"&gt;&lt;br/&gt;
Enter company URL: &lt;input type="text" name="companyurl" value="http://www.androidgator.com"&gt;&lt;br/&gt;
Enter RSS URL: &lt;input type="text" name="rssurl" value="http://feeds.feedburner.com/AndroidgatorcomFeed"&gt;&lt;br/&gt;
&lt;input type="submit" name="submit" value="Make it so..."&gt;
&lt;/form&gt;
</code>

<p/>

And here is a modified form of the build script Terry did. I removed the Playbook support, made it copy to a temp dir, and added replacements in.

<p/>

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;project name="SimpleRSS" default="main" basedir="."&gt;

	&lt;property file="settings.properties"/&gt;

	&lt;!-- path to the flex task libraries. --&gt;
	&lt;path id="flextasks.classpath"&gt;
		&lt;fileset dir="${% raw %}{FLEX_HOME}{% endraw %}/ant/lib"&gt;
			&lt;include name="*.jar"/&gt;
		&lt;/fileset&gt;
	&lt;/path&gt;  

	&lt;typedef resource="flexTasks.tasks" classpathref="flextasks.classpath" /&gt;

	&lt;target name="main" depends="prepPackage, package.android, install.android" /&gt;

	&lt;target name="clean"&gt;
		&lt;echo message="Cleaning Build Space"/&gt;
		&lt;delete dir="${% raw %}{build.dir}{% endraw %}"/&gt;
	&lt;/target&gt;

	&lt;target name="prepPackage" depends="compile,handleDevices" /&gt;

	&lt;target name="compile" depends="clean"&gt; 
		&lt;echo message="Copying to temp dir" /&gt;

		&lt;copy todir="${% raw %}{temp.dir}{% endraw %}"&gt;
			&lt;fileset dir="${% raw %}{dev.dir}{% endraw %}" /&gt;
		&lt;/copy&gt;

		&lt;echo message="Doing replacements... " /&gt;
		&lt;echo message="Replacing company with ${% raw %}{company}{% endraw %}" /&gt;
		&lt;echo message="Replacing url with ${% raw %}{url}{% endraw %}" /&gt;
		&lt;echo message="Replacing rss url with ${% raw %}{rssurl}{% endraw %}" /&gt;

		&lt;replace dir="${% raw %}{temp.dir}{% endraw %}" failOnNoReplacements="true"&gt;
			&lt;include name="**/*.mxml" /&gt;
			&lt;replacefilter token="@@@companyText@@@" value="${% raw %}{company}{% endraw %}" /&gt;
			&lt;replacefilter token="@@@url@@@" value="${% raw %}{url}{% endraw %}" /&gt;
			&lt;replacefilter token="@@@rssurl@@@" value="${% raw %}{rssurl}{% endraw %}" /&gt;
		&lt;/replace&gt;

		&lt;echo message="Compiling swf"/&gt;

		&lt;!-- hack one - had to add full path --&gt;
		&lt;mxmlc file="C:/Users/Raymond/Documents/My Dropbox/projects/SimpleRSS/${% raw %}{projectFile}{% endraw %}" output="${% raw %}{swfFile}{% endraw %}"&gt; 
	        &lt;load-config filename="${% raw %}{FLEX_HOME}{% endraw %}/frameworks/airmobile-config.xml"/&gt; 
	        &lt;source-path path-element="${% raw %}{FLEX_HOME}{% endraw %}/frameworks"/&gt;
			&lt;static-link-runtime-shared-libraries /&gt;

			&lt;compiler.library-path dir="${% raw %}{FLEX_HOME}{% endraw %}/frameworks" append="true"&gt;
                &lt;include name="libs/*" /&gt;
            &lt;/compiler.library-path&gt;

			&lt;compiler.library-path dir="." append="true"&gt;
                &lt;include name="libs/*" /&gt;
            &lt;/compiler.library-path&gt;

		&lt;/mxmlc&gt;

		&lt;delete dir="${% raw %}{temp.dir}{% endraw %}" /&gt;

	&lt;/target&gt;


	&lt;target name="collect.android"&gt;
		&lt;echo message="Creating Device Folder for Android"/&gt;
		&lt;mkdir dir="${% raw %}{build.dir}{% endraw %}/android"/&gt;
		&lt;echo message="Copying SWF for Android"/&gt;
		&lt;copy file="${% raw %}{swfFile}{% endraw %}" todir="${% raw %}{build.dir}{% endraw %}/android"  /&gt;
		&lt;echo message="Copying Application Description File for Android"/&gt;
		&lt;copy file="${% raw %}{dev.dir}{% endraw %}/${% raw %}{app.name}{% endraw %}-app.xml" 
			todir="${% raw %}{build.dir}{% endraw %}/android" preservelastmodified="true" /&gt;
		&lt;echo message="Modifying Application Description File"/&gt;
		&lt;replace file="${% raw %}{build.dir}{% endraw %}/android/${% raw %}{app.name}{% endraw %}-app.xml"&gt;
			&lt;replacefilter token="${% raw %}{contentText}{% endraw %}" value="${% raw %}{app.name}{% endraw %}.swf" /&gt;
		&lt;/replace&gt;
	&lt;/target&gt;

	&lt;target name="handleDevices" depends="collect.android"/&gt;


	&lt;target name="package.android"&gt;
		&lt;echo message="Packaging for Android"/&gt;
		&lt;exec executable="${% raw %}{ADT}{% endraw %}" dir="${% raw %}{build.dir}{% endraw %}/android" failonerror="true"&gt;
			&lt;arg value="-package"/&gt;
			&lt;arg line="-target apk"/&gt;
			&lt;arg line="-storetype pkcs12"/&gt;
			&lt;arg line="-keystore ${% raw %}{cert}{% endraw %}" /&gt;
			&lt;arg line="-storepass ${% raw %}{cert.password}{% endraw %}" /&gt;
			&lt;arg value="${% raw %}{app.name}{% endraw %}"/&gt;
			&lt;arg value="${% raw %}{app.name}{% endraw %}-app.xml"/&gt;
			&lt;arg value="${% raw %}{app.name}{% endraw %}.swf"/&gt;
		&lt;/exec&gt;
	&lt;/target&gt;

	&lt;target name="install.android"&gt;
			&lt;echo message="Installing onto attached Android Device"/&gt;
			&lt;exec executable="${% raw %}{ADB}{% endraw %}"&gt;
				&lt;arg value="install"/&gt;
				&lt;arg value="-r"/&gt;
				&lt;arg value="${% raw %}{build.dir}{% endraw %}/android/${% raw %}{app.name}{% endraw %}.apk"/&gt;
			&lt;/exec&gt;	
		&lt;/target&gt;
&lt;/project&gt;	
</code>

<p/>

Thoughts?