---
layout: post
title: "Building a Custom Sound Board with Vue and IndexedDB"
date: "2019-11-12"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/soundboard2.jpg
permalink: /2019/11/12/building-a-custom-sound-board-with-vue-and-indexeddb
description: How I added audio and storage to a Vue.js application
---

Pardon the lack of updates around here. I've been writing more for my [work blog](https://developer.here.com/blog) and have started a new (small) book project. Plus, well, holidays and life. I had hoped to keep to a pace of one post per week minimum, but I've fallen a bit behind there. That being said, I think what I've got to share today is really freaking cool and I hope you do too.

A few weeks ago I wrote up how I integrated [Vue.js and IndexedDB](https://www.raymondcamden.com/2019/10/16/using-indexeddb-with-vuejs). That post was actually some prep work for what I'm sharing here. I'm a fan of "sound board" apps, those apps that collect sound files from a particular source and let you play them back. So for example, the official Star Wars app (which is more than a sound board) has this as a feature:

<img src="https://static.raymondcamden.com/images/2019/11/sb1a.jpg" alt="Screenshot of Star Wars app, soundboard" class="imgborder imgcenter">

I like the idea so much, I built my own using Ionic and Cordova about three years ago (["Cordova/Ionic Sample App: My Sound Board"](https://www.raymondcamden.com/2015/07/30/cordovaionic-sample-app-my-sound-board)). The most painful part of that process was handling the file system, but outside of that it wasn't terribly difficult.

I wanted to see if I could rebuild this application 100% web-native. To handle storage I'd use IndexedDB, which has no problem with binary data. Before I get into the code, you can browse the complete source here: <https://github.com/cfjedimaster/vue-demos/tree/master/idb-sound-board>. You can also check it out online at <https://idbsoundboard.raymondcamden.now.sh/>.

## Setup

To begin the application, I used the Vue cli to scaffold a new application and enabled both Vuex and Vue Router. I also added [Vuetify](https://vuetifyjs.com/) for the URL. I'll point out right away that I'm not 100% happy with how the application looks, it could definitely be better. (I'm thinking of switching to cards instead of list items.) 

To support audio recording, I used this excellent open source library: [web-audio-recorder](https://github.com/higuma/web-audio-recorder-js). It worked great, but the docs were a bit hard to grok at times. This article was very helpful: ["Using WebAudioRecorder.js to Record MP3, Vorbis and WAV Audio on Your Website"](https://blog.addpipe.com/using-webaudiorecorder-js-to-record-audio-on-your-website/)

## The App

The first iteration of the application focused on everything *but* audio. I built the UI first. The initial page is a list of sounds with a button to add a new one. Clicking the title would play the sound.

<img src="https://static.raymondcamden.com/images/2019/11/sb2.jpg" alt="List of sounds" class="imgborder imgcenter">

The next page is where you add new sounds. It lets you record, play, and add a title to the sound.

<img src="https://static.raymondcamden.com/images/2019/11/sb3.jpg" alt="Sound saver/editor" class="imgborder imgcenter">

I had initially thought about adding "edit" support, but I decided you could just delete a sound and record it again. Yes, I'm being lazy.

I set up my code to persist sounds, but just the title value at first. Once I had the flow done (adding sounds, listing sounds, and deleting), I then added in the recording functionality. The web-audio-recorder library uses a callback that returns a blob. So I was able to use it like this:

```js
this.recorder.onComplete = (recorder, blob) => {
	this.recordingStatus = 'Record Sound';
	this.blob = blob;
};
```

All I do here is copy out blob into my Vue data so I can store it later:

```js
async save() {
	let sound = {
		title: this.title, 
		blob: this.blob
	};
	await this.$store.dispatch('saveSound', sound);
	this.$router.push('/');	
}
```

My store was simply persisting the sound object as is, so when I went from saving just the title to the title and the audio blob, nothing there had to change. IndexedDB stored the string and binary data perfectly.

To play that blob, I just used this:

```js
play(s) {
	let player = new window.Audio();
	player.src = window.URL.createObjectURL(s.blob);
	player.play();
}
```

A slightly better implementation would handle not letting you play two or more sounds at once, but I kinda like that you can do that if you want. 

## The Best Part

The absolute best part of this whole thing is - I forgot that I had enabled PWA support when I scaffolded the application. When I was done and deployed my build version, I noticed the service worker in play and did a quick test. Using Chrome DevTools, I turned off network support and reloaded. The entire application had been cached locally and it worked perfectly. Since all the sounds are stored in IndexedDB, there's no remote resources to hit. If I wanted to, I could replace the icons spit out by default and provide my own, but I'll probably only bother with that if folks actually like the application.

So that's it. I feel like I didn't share a lot of code here, but most of the code was done in the Vue/IndexedDB example from a few weeks ago. You can check out the full code on the [repo](https://github.com/cfjedimaster/vue-demos/tree/master/idb-sound-board) and try it yourself here: <https://idbsoundboard.raymondcamden.now.sh/>.

<i>Header photo by <a href="https://unsplash.com/@akeenster?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Abigail Keenan</a> on Unsplash</i>
