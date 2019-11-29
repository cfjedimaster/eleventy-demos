---
layout: post
title: "A simple Cordova task runner for Visual Studio Code"
date: "2015-05-17T10:32:35+06:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/05/17/a-simple-cordova-task-runner-for-visual-studio-code
guid: 6149
---

I've been <i>really</i> liking <a href="https://code.visualstudio.com">Visual Studio Code</a> lately, so much so that it is now my primary editor. It is still definitely a pre-1.0 release, but it performs really well and I just dig its coding style. I had to step away from Brackets a few weeks ago due to a bug (<a href="https://github.com/adobe/brackets/issues/10718">details</a>) that impacts AngularJS/Ionic apps. Since that's what I work with most of the time, Brackets simply became too frustrating to use. One of the cool features of Visual Studio Code is the ability to define <a href="https://code.visualstudio.com/Docs/tasks">Tasks</a> for a project. You can support one or more different tasks for a project simply by adding a tasks.json file to the .settings subdirectory. VSC will even create a good default with lots of examples for you to modify. Even nicer, since VSC supports intellisense for <a href="https://code.visualstudio.com/Docs/languages#_json">JSON schemas</a>, you get code hints while building the file. This morning I thought I'd write up a quick example of adding support for emulating Cordova app.

<!--more-->

I began by following the suggestion in the <a href="https://code.visualstudio.com/Docs/tasks">Tasks</a> doc, I typed Shift+Command+P and then <code>Configure Task Runner</code>, which is slightly different than what the docs say. This created the JSON file with an initial default task that I immediately commented out.

While you can do a lot with the Cordova CLI, I really spend most of my time doing <code>cordova emulate</code>. VSC supports multiple tasks, but you can specify just one and doing so let's you treat it as a build command. That means you can simply type Shift+Command+B to execute it. Here's my first draft:

<pre><code class="language-javascript">{
	"version": "0.0.1",
	"command": "cordova",
	"isShellCommand": true,
	"showOutput": "never",
	"args":["emulate"]
}</code></pre>

Notice I'm not passing a platform. If you have multiple platforms defined than all will be sent to the emulator. This will be a problem that I'll cover in a second.

Also note the showOutput command. You can specify three different values here:

<ul>
<li>never - means what you think it does
<li>silent - will show output if you don't configure problem matchers - you can see an explanation of that here: <a href="https://code.visualstudio.com/Docs/tasks#_defining-a-problem-matcher">Defining a Problem Matcher</a>
<li>always - means what you think it does 
</ul>

However, in my testing, showOutput:never didn't actually work. I just made the output window a bit smaller and later today I'll file a bug report on it. On a larger screen (i.e. not this laptop) I wouldn't even care. Here it is in action.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/shot12.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/shot12.png" alt="shot1" width="800" height="461" class="aligncenter size-full wp-image-6150" /></a>

So what if you want to specify the platform to emulate? You can define multiple tasks like so:

<pre><code class="language-javascript">{
	"version": "0.0.1",
	"command": "cordova",
	"isShellCommand": true,
	"args":["emulate"
	],
	"tasks": [
		{
			"taskName": "ios",
			// Make this the default build command.
			"isBuildCommand": true,
			// Show the output window only if unrecognized errors occur.
			"showOutput": "silent"
		},
				{
			"taskName": "android",
			// Make this the default build command.
			"isBuildCommand": false,
			// Show the output window only if unrecognized errors occur.
			"showOutput": "silent"
		}

	]
}</code></pre>

In this case, I've defined an ios and android task to pass to the emulate command. Note that I've still set ios to be the build command so I can use it as a default. One thing I don't like about this is that I can't provide a 'label' for the tasks. So when I do Shift+Command+P, Run Tasks, I see it like so:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/shot21.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/shot21.png" alt="shot2" width="800" height="137" class="aligncenter size-full wp-image-6151" /></a>

That's not the end of the world, but I'd like to have a label so I could see "Emulate iOS" and "Emulate Android (please wait 2-3 hours for the emulator to start)".

This <i>works</i>, but has a problem. When emulating Android, the CLI hangs while the emulator is running. If I run Android via VSC, it works (after the emulator finally loads up), but VSC will not let me run another tasks until this one ends. I have to kill the emulator to continue.

Ok, so I worked on this a bit more. I don't actually emulate Android as it is way too slow, what I do normally is use <a href="https://www.genymotion.com/">Genymotion</a> and use the run command instead. Yes, this is still emulating, but the command line call is tweaked. I just tried this and it worked!

<pre><code class="language-javascript">{
	"version": "0.0.1",
	"command": "cordova",
	"isShellCommand": true,
	"args":[
	],
	"tasks": [
		{
			"taskName": "ios",
			// Make this the default build command.
			"isBuildCommand": true,
			// Show the output window only if unrecognized errors occur.
			"showOutput": "silent",
			"args": [
				"emulate"
			]
		},
				{
			"taskName": "android",
			// Make this the default build command.
			"isBuildCommand": false,
			// Show the output window only if unrecognized errors occur.
			"showOutput": "silent",
			"args": [
				"run"
			]
		}

	]
}</code></pre>

So I can now Shift+Command+B to send to iOS as my default, or do Shift+Command+P, Run Task, to select android if I need to.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/shot3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/shot3.png" alt="shot3" width="800" height="458" class="aligncenter size-full wp-image-6152" /></a>

Hope this helps, and I'm going to keep an eye out for other ways to help VSC work with Cordova.