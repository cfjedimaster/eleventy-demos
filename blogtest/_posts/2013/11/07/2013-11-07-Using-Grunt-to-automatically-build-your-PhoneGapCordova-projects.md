---
layout: post
title: "Using Grunt to automatically build your PhoneGap/Cordova projects"
date: "2013-11-07T21:11:00+06:00"
categories: [development,html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2013/11/07/Using-Grunt-to-automatically-build-your-PhoneGapCordova-projects
guid: 5081
---

<p>
Earlier this week I <a href="http://www.raymondcamden.com/index.cfm/2013/11/5/Ripple-is-Reborn">blogged</a> about the relaunch of Ripple, a great tool for building your mobile applications with Chrome. One of the issues with the new version of Ripple is that when you edit your code, you have to run "cordova prepare" to copy the assets into your platform before you can view it in the browser.
</p>
<!--more-->
<p>
You can get around this by just directly editing the code in your platform directory, but by doing so you run the risk of accidentally blowing it away the next time you do a build with Cordova. So the only safe method is to edit in your main www folder and run "cordova prepare" <i>after every single save</i>, which kinda sucks, even if you just use !! to run the last command or up arrow/enter (which should work on both Windows and OS X I believe). 
</p>

<p>
I was thinking about this today and I thought that this could be a good use of <a href="http://gruntjs.com/">Grunt</a>. Grunt is a JavaScript task runner (it reminds me of Ant, but using JavaScript) with a large set of plugins for a variety of tasks. I've been interested in it, but haven't really had an opportunity to make use of it yet. (Check out this article on it over at Smashing Magazine: <a href="http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/">Get Up and Running with Grunt</a>.) 
</p>

<p>
I knew Grunt supported two different types of plugins I'd need. First is the ability to watch files for changes. The second is the ability to run ad hoc shell scripts. I whipped up the following example. <strong>Please note this is my very first Grunt script and I probably did it completely wrong.</strong>
</p>

<pre><code class="language-javascript">module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        exec:{
        	prepare:{
        		command:"cordova prepare",
        		stdout:true,
        		stderror:true
        	}
        },
        watch:{
        	files:['www/**/*.*'],
        	tasks:['exec:prepare']
        }
    });

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['watch']);

};</code></pre>

<p>
Even if you've never seen Grunt before you can probably follow the flow. I've basically told Grunt to run the watch task by default, monitor the www folder (remember, this is where Cordova keeps the web assets it will copy into each platform) and when a change is noticed, run cordova prepare. This copies the assets into the right folder.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_11_7_13__8_44_PM.jpg" />
</p>

<p>
Now I can edit my HTML and see the change as soon as I reload my browser, just like the older Ripple. As I said, there is probably an easier way to do this with Grunt, but I enjoyed finally getting a chance to play with it.
</p>