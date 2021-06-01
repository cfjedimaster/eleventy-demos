---
layout: post
title: "Working with Audio in NativeScript - Part One"
date: "2019-04-25"
categories: ["javascript","mobile"]
tags: ["vuejs","nativescript"]
banner_image: /images/banners/soundboard.jpg
permalink: /2019/04/25/working-with-audio-in-nativescript-part-one
description: A look at recording and playing audio in NativeScript
---

This post was originally meant to be more of a demo application, but I decided to "pause" while working on the app I had planned and share some things I've learned about working with audio in NativeScript. The end goal is a recreation of a demo I did a while ago with Ionic and Cordova - a [custom sound board](https://www.raymondcamden.com/2015/07/30/cordovaionic-sample-app-my-sound-board). 

This application was rather simple. You recorded a sound, gave it a name, and could play it back later. If you don't want to read the article about it, here's how it turned out:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot44.png" alt="" class="imgborder imgcenter">

In general it was easy, once I struggled to get [persistent recordings](https://www.raymondcamden.com/2015/07/27/recording-and-saving-audio-in-cordova-applications) saved to the device. File IO with Cordova was *never* really a pleasant experience and as long as I'm sharing old images, I might as well bring this one back:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/onesimply.jpg" alt="" class="imgborder imgcenter">

Ok, so that's Cordova - how difficult was it to record, save, and play audio in NativeScript?

I began by searching for "audio" on the [marketplace](https://market.nativescript.org/) and came across [nativescript-audio](https://github.com/bradmartin/nativescript-audio). It supports recording and playing audio so in theory it has everything I need. Unfortunately the docs were a bit slim on the recording side so I had to guess a bit. The plugin does have a sample app written in Angular and I swear, I can barely grok Angular now. (Mainly it's trying to find out which file actually has the logic. That's not a fault of Angular just an issue with me now being incredibly rusty with it!)

Looking at this plugin also forced me to be exposed to file system access in NativeScript. You could say I approached this with a bit of trepidation. NativeScript has a built-in [File System](https://docs.nativescript.org/ns-framework-modules/file-system) module. Right away I saw this and was happy: "All file system operations have synchronous and asynchronous forms." One of the hardest issues with the FileSystem API in Cordova was managing all the multiple deep async calls. I'm not saying async is bad of course or poorly engineering, I'm just saying I hated to work with it. I also saw a lot of things built in that (I don't believe) existed in the Cordova plugin, like being able to clear the contents of a folder and path normalization.

Also, like Cordova, they make it easy to get to folders you would use more often. So for example, let's say I want to use a folder in my app to store recordings, here's basic pseudo-code to handle this:

```js
const fileSystemModule = require('tns-core-modules/file-system');
const audioFolder = fileSystemModule.knownFolders.currentApp().getFolder('recordings');
```

So `knownFolders` is your shortcut to important folder aliases, `currentApp()` is the app, and `getFolder` will return a Folder object that will also handle creating if it doesn't exist. I love how simple that was!

When actually writing, the folder object has a `.path` property, so I could construct a filename like so: `audioFolder.path+'/recording.mp4'`. 

All I can say is that after being burned so many times trying to work with the file system in Cordova, this actually made me start thinking about other ways I could use it (as opposed to avoiding it). 

So with that knowledge in place, the first version of my demo simply has two buttons. One to record, and one to play. I always record to the same file name (an issue I'll fix in the next blog post) and always plays the same file. Here's the complete code.

```html
<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" text="Home"></Label>
        </ActionBar>

        <StackLayout>
            <Button text="Record" @tap="doRecord" />
            <Button text="Test Play" @tap="doPlay" />
        </StackLayout>
    </Page>
</template>

<script>
const audio = require('nativescript-audio');
const fileSystemModule = require('tns-core-modules/file-system');
const audioFolder = fileSystemModule.knownFolders.currentApp().getFolder('recordings');
const platform = require('tns-core-modules/platform');

export default {
    methods:{
        async doRecord() {
            console.log('doRecord Called 1e');
            let recorder = new audio.TNSRecorder();

            /*
            from the sample app
            */
            let androidFormat;
            let androidEncoder;
            if (platform.isAndroid) {
                // static constants are not available, using raw values here
                // androidFormat = android.media.MediaRecorder.OutputFormat.MPEG_4;
                androidFormat = 2;
                // androidEncoder = android.media.MediaRecorder.AudioEncoder.AAC;
                androidEncoder = 3;
            }

            let options = {
                filename:audioFolder.path+'/recording.mp4',
                format:androidFormat,
                encoder:androidEncoder,
                infoCallback:info => {
                    //apparently I'm necessary even if blank
                },
                errorCallback:e => {
                    console.log('error cb',e);
                }
            };

            await recorder.start(options);
            console.log('in theory recording');
            setTimeout(() => {
                console.log('calling stop');
                recorder.stop()
                .then(() => {
                    console.log('really done');
                })
                .catch(e => {
                    console.log('error stopping', e);
                });
            }, 3000);
        },

        doPlay() {

            let player = new audio.TNSPlayer();
            player.playFromFile({
                audioFile:audioFolder.path+'/recording.mp4'
            })
            .then(() => {
                console.log('in then');
            })
            .catch(e => {
                console.log('in error', e);
            });
        }
    }
};
</script>

<style scoped lang="scss">
</style>
```

Ok, let's talk about this top to bottom! The top portion handles the UI which in this case is just two buttons. Recording is handled in the `doRecord` method. For the most part I just copied and pasted from the official docs. I added an "auto stop" feature with a `setTimeout` so I wouldn't have to add in UI for it. My real app will support that of course. Also I want to apologize for all the `console.log` statements. Normally I clean those up before publication, but as I struggled a bit with this app I kept them as evidence of how I work. :) 

`doPlay` handles actually playing the file. You can get information about the file, like duration, but for my purposes I just wanted to play and not worry about it. In my real app I'm going to need a way to stop the playback if another sound file is played (maybe - it could be fun to play multiple at once).

And that's it. Oh and I kinda skipped this above but I did *add* the plugin as well to get this working. So as always, ask me any questions you have and in the next part I'll (hopefully!) have a fully working custom sound board in NativeScript!

<i>Header photo by <a href="https://unsplash.com/photos/fvLNFnnLPIk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jonas Zürcher</a> on Unsplash</i>