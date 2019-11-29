---
layout: post
title: "Generating Speech with ColdFusion and Java"
date: "2009-05-29T02:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/29/Generating-Speech-with-ColdFusion-and-Java
guid: 3375
---

A few days ago a user made a comment on my ColdFusion 8/CAPTCHA blog post. He reminded us (and it is a good reminder) that CAPTCHA has some serious accessibility issues. This got me thinking about converting the CAPTCHA image into spoken letters. I've seen a few sites that do this and, frankly, whether it helped with CAPTCHA or not I thought it would be cool to see if ColdFusion could generate speech. I did some digging and the primary library that folks seem to use in the Java world is <a href="http://freetts.sourceforge.net/docs/index.php">FreeTTS</a> (TTS is short for text to speech). There are probably many other alternatives out there, but that's the one I went with.

I began by downloading the compiled code for FreeTTS and confirmed the example application ran from the command line. I then began to dig into the docs a bit. I then began to cry a little bit as I realized that "documentation" was probably too strong of a word for what I found at the project. The API is fully documented. Examples do exist. But I couldn't find anything close to what I'd consider to be good documentation. (Full disclosure time. I will admit to not always providing great docs with my own projects!) Specifically it wasn't difficult to get code that would say something. I had that running with 15 minutes. What took forever was getting the audio saved to a file. The code that follows works, but please note that the code could probably be done better. 

Once you've downloaded the FreeTTS code, extract it to your file system. All you really need are the JAR files from the lib folder. I loaded all the JARs using the wonderful, super-awesome, <a href="http://javaloader.riaforge.org/">JavaLoader</a> from Mark Mandel. I <i>really</i> hope dynamic class loading comes to ColdFusion 9 because it's so darn useful. Here is how I used it to suck in all the JARs from the lib folder:

<code>
&lt;cfset jardir = expandPath("./freetts-1.2.2-bin/freetts-1.2/lib")&gt;
&lt;cfset jars = []&gt;
&lt;cfdirectory name="jarList" directory="#jardir#"&gt;
&lt;cfloop query="jarList"&gt;
	&lt;cfset arrayAppend(jars, jardir & "/" & name)&gt;
&lt;/cfloop&gt;

&lt;cfset loader = createObject("component", "javaloader.JavaLoader").init(jars)&gt;
</code>

Now for the fun part. FreeTTS works by creating a voice and having the voice speak. So at a basic level, this code alone will work to create the speech. 

<code>
&lt;cfset voiceManager = loader.create("com.sun.speech.freetts.VoiceManager")&gt;
&lt;cfset vm = voiceManager.getInstance()&gt;
&lt;cfset voice = vm.getVoice("kevin16")&gt;

&lt;cfset voice.allocate()&gt;
&lt;cfset voice.speak("Hello World. This is a test of text to speech. It was a real pain in the ass. Really.")&gt;
</code>

On my system this resulted in the words being spoken out of my laptop speakers. Did this surprise me. Heck yes. Did I scream like a little girl? I'm not telling. So as I said, this was relatively simple. Getting it to save to the file system though was a royal pain in the rear. Sure the code isn't that much different, it just took me forever to figure it out. The basic idea is to tell FreeTTS to use another audio player. FreeTTS has a 'player' called SingleFileAudionPlayer. As you can guess, this essentially turns a file into an audio player. In this version of the code, I set up the player and pass it to the voice. When run, it generates this wav file:

<a href="http://www.raymondcamden.com/images/test1.wav">http://www.coldfusionjedi.com/images/test1.wav</a>

I then switched the text to be something close to a CAPTHA. The result was a bit too quick to understand. Looking at the API, I saw that there was a WPM (words per minute) setting. You would think this would simply slow down the amount of words spoken per minute. Instead it simply slowed down the speech. So instead of hearing: "Something ..... something ....". It was more like "Sooooommmmmeeeething." I played with it a bit and got to be a bit slower, but, it's not perfect. Here is the final template I ended up with:

<code>
&lt;cfset jardir = expandPath("./freetts-1.2.2-bin/freetts-1.2/lib")&gt;
&lt;cfset jars = []&gt;
&lt;cfdirectory name="jarList" directory="#jardir#"&gt;
&lt;cfloop query="jarList"&gt;
	&lt;cfset arrayAppend(jars, jardir & "/" & name)&gt;
&lt;/cfloop&gt;

&lt;cfset loader = createObject("component", "javaloader.JavaLoader").init(jars)&gt;


&lt;cfset audioFileFormatType = createObject("java", "javax.sound.sampled.AudioFileFormat$Type").init("WAVE","wav")&gt;
&lt;cfset sfAudio = loader.create("com.sun.speech.freetts.audio.SingleFileAudioPlayer").init("/Library/WebServer/Documents/tts/test",audioFileFormatType)&gt;


&lt;cfset voiceManager = loader.create("com.sun.speech.freetts.VoiceManager")&gt;
&lt;cfset vm = voiceManager.getInstance()&gt;
&lt;cfset voice = vm.getVoice("kevin16")&gt;

&lt;cfset lex = loader.create("com.sun.speech.freetts.en.us.CMULexicon").init()&gt;
&lt;cfset voice.setLexicon(lex)&gt;
&lt;cfset voice.setRate(110)&gt;
&lt;cfset voice.setAudioPlayer(sfAudio)&gt;
&lt;cfset voice.allocate()&gt;
&lt;cfset voice.speak("A 9 ## 2 L K 8 0")&gt;
&lt;cfset sfAudio.close()&gt;

&lt;p&gt;
done
&lt;/p&gt;
</code>

FreeTTS comes with more voices, and if I spent more time on it I could make it a bit nicer probably, but for now I'll stop and let folks comments. In the next blog entry, I'll show this in use with CAPTCHA.

As a reminder, in order for the template to work, you will need both JavaLoader and FreeTTS copied to your file system.