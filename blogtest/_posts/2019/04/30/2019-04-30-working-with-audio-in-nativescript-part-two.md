---
layout: post
title: "Working with Audio in NativeScript - Part Two"
date: "2019-04-30"
categories: ["javascript","mobile"]
tags: ["vuejs","nativescript"]
banner_image: /images/banners/soundboard.jpg
permalink: /2019/04/30/working-with-audio-in-nativescript-part-two
description: A demo application in NativeScript and Vue showing a custom sound board
---

A few days ago I blogged about my experience working with audio and NativeScript ([Working with Audio in NativeScript - Part One](https://www.raymondcamden.com/2019/04/25/working-with-audio-in-nativescript-part-one)). Over the weekend I got a chance to wrap up the demo application I was working on and thought I'd share the result. As always, my work ends up being a mix of stuff I think went well and stuff I think... could be done better. I'll do my best to call out the code I think could be improved and would love any suggestions or comments. 

As a reminder, the end goal of this research was to create a custom sound board application. As a user, you would record a sound to play back later. Sound boards are a dime a dozen on app stores but I always thought it would be fun to have one I could setup myself. Normally I think this when one of my kids say something funny and then they never say it again. Because of course. 

Here's how the application ended up looking. The UI/UX is rather simple and I didn't bother with nice colors or anything. Initially, the application lets you know you don't have any sounds ready:

<img src="https://static.raymondcamden.com/images/2019/04/sb1.png" alt="Initial screen of the application showing no sounds are avilable" class="imgborder imgcenter">

Clicking the "Record New Sounds" (really should be singular) button takes you to the next view:

<img src="https://static.raymondcamden.com/images/2019/04/sb2.png" alt="Page where you record a new sound" class="imgborder imgcenter">

In this view you name and record your sound. The play button lets you test to ensure you got it right.

Once you've recorded a few sounds, they show up in a simple list on the main page:

<img src="https://static.raymondcamden.com/images/2019/04/sb3.png" alt="The list of recorded sounds" class="imgborder imgcenter">

Finally, to delete a sound (and the UI should provide a hint for this), you "long press" on a sound:

<img src="https://static.raymondcamden.com/images/2019/04/sb4.png" alt="Demonstration of the delete dialog" class="imgborder imgcenter">

And that's it. So really the app came down to two core aspects:

First was recording audio to the file system and playing it later. This was really easy and covered in my [last post](https://www.raymondcamden.com/2019/04/25/working-with-audio-in-nativescript-part-one) so I won't go deep into it here. 

The next aspect was remembering your sounds. This one was a bit trickier. I wanted to let you assign names to each sound and hide the actual file names from the user. NativeScript supports some nice client-side storage methods (you can read my [article](https://www.nativescript.org/blog/client-side-storage-in-nativescript-applications) on it!) so the only question was which would I use. In this case, I made a decision I think may not be best. I went with ApplicationSettings. In general my "rule" for picking between a simple key/value system and a "proper" storage system is - will my data grow based on the user's use of the application? What I mean is - a set of "know" values like, "preferred theme" or "last product viewed" is a particular set of data that doesn't grow over time. Data like notes, where the user can write a million a day or so, have no limit. 

In my case, it is possible for the user to create a million sounds (ok, not a million) but I figured reasonably they wouldn't make more than thirty. I was only storing a name and a file path so I figure a JSON array of that size would be "ok".

I reserve the right to call myself stupid for this decision later on. Ok, let's look at the code! You can find the complete repository at <https://github.com/cfjedimaster/ns-soundboard>.

I'll start with the home view, trimmed a bit to remove unnecessary things:

```html
<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" text="Custom Sound Board"></Label>
        </ActionBar>

        <StackLayout>

            <Label v-if="sounds.length === 0" text="You haven't recorded any sounds yet." />

            <ListView for="sound in sounds" @itemTap="playSound">
                <v-template>
                    <Label :text="sound.name" :filename="sound.fileName" @longPress="deleteSound" />
                </v-template>
            </ListView>
            <Button text="Record New Sounds" @tap="goToRecord" />
        </StackLayout>
    </Page>
</template>

<script>
const audio = require('nativescript-audio');
const fileSystemModule = require('tns-core-modules/file-system');

import soundsAPI from '../api/sounds';
import Record from './Record';

export default {
    data() {
        return {
            audioFolder:null,
            sounds:[]
        }
    },
    created() {
        this.sounds = soundsAPI.getSounds();
		this.audioFolder = fileSystemModule.knownFolders.currentApp().getFolder('recordings');
    },
    methods:{
        async deleteSound(event) {
            let filename = event.object.filename;
            let confirmOptions = {
                title: "Delete Sound",
                message: "Do you want to delete this sound?",
                okButtonText: "Yes",
                cancelButtonText: "No"
            };
            confirm(confirmOptions).then(async result => {
                if(result) {
                    // first delete the file
                    let file = this.audioFolder.getFile(filename);
                    await file.remove();
                    soundsAPI.removeSound(filename);
                    this.sounds = soundsAPI.getSounds();
                }
            });
        },
        goToRecord() {
            this.$navigateTo(Record);
        },
        async playSound(event) {
            let player = new audio.TNSPlayer();

            await player.playFromFile({
                audioFile:this.audioFolder.path+'/'+event.item.fileName
            });

        }
    }
};
</script>
```

The UI is pretty minimal so there isn't much to discuss there. I did, however, have some issues with the `longPress` event. It did *not* work well on the `ListView` directive. I had to move to the label. Another issue is that `longPress` also fires `itemTap`, which I think is a bug, but honestly felt ok about this for now. It's something I think I may want to address later. Code wise there's only a few methods and in general the only real complex one is the delete handler. You can see I set up a confirmation dialog. I then manually delete the file and ask my `soundsAPI` library (more on that in a minute) to remove the file. Those two lines feel wrong to me. Mainly the issue is that soundsAPI handles just remembering the data but doesn't handle any file IO. 

As I said - it feels wrong and could do with a refactor, but for an initial release, I'm ok with it. ;) Let's switch gears and look at that sound library. You'll note I named it `soundsAPI` which feels like a bad name, but names are hard.

```js
const appSettings = require("application-settings");

const sounds = {
	getSounds() {
		let json = appSettings.getString('sounds', '');
		if(json === '') return [];
		else return JSON.parse(json);
	},
	removeSound(fileName) {
		let sounds = this.getSounds();
		sounds = sounds.filter(s => {
			return s.fileName != fileName;
		});
		//serialize it
		let json = JSON.stringify(sounds);	
		appSettings.setString('sounds', json);
	},
	saveSound(name, fileName) {
		let sounds = this.getSounds();
		sounds.push({
			name:name,
			fileName:fileName
		});
		//serialize it
		let json = JSON.stringify(sounds);	
		appSettings.setString('sounds', json);
	}
}

module.exports = sounds;
```

In the end, this "API" is just a wrapper for one value in ApplicationSettings. What's nice though is that I can revisit the storage later and keep the API as is. Now let's look at the second view.

```html
<template>
	<Page class="page">
		<ActionBar class="action-bar">
			<Label class="action-bar-title" text="Record"></Label>
		</ActionBar>

		<StackLayout>
			<TextField v-model="name" hint="Name for new sound" />
			<GridLayout columns="*,*" height="70">
				<Button text="Record" col="0" @tap="record" v-if="!recording" /> 
				<Button text="Stop Recording" col="0" @tap="endRecord" v-if="recording" /> 
				<!-- Note, I was not able to use null and falsy values -->
				<Button text="Play" col="1" @tap="play" :isEnabled="playEnabled" /> 
			</GridLayout>
			<Button text="Save" @tap="save" :isEnabled="saveEnabled" />
		</StackLayout>
	</Page>

</template>

<script>
const audio = require('nativescript-audio');
const platform = require('tns-core-modules/platform');
const fileSystemModule = require('tns-core-modules/file-system');

import utils from '../api/utils';
import sounds from '../api/sounds';

import Home from './Home';

function randomName() {
	return `rnd${utils.generateUUIDv4()}.mp4`;
}

export default {
	created() {
		this.audioFolder = fileSystemModule.knownFolders.currentApp().getFolder('recordings');
	},
	computed:{
		playEnabled() {
			return this.lastName != '' && !this.recording;
		},
		saveEnabled() {
			return this.playEnabled && this.name !== '';
		}
	},
	data() {
		return {
			name:"",
			audioFolder:null,
			recorder:null,
			recording:false,
			lastName:''
		}
	},
	methods: {
        async record() {
	
			// possible clean up
			if(this.lastName) {
				let file = this.audioFolder.getFile(this.lastName);
				await file.remove();
			}

            console.log('doRecord Called 1h');
            this.recorder = new audio.TNSRecorder();

			let newName = randomName();

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
				filename:this.audioFolder.path+'/'+newName,
				format:androidFormat,
				encoder:androidEncoder,
				infoCallback:info => {
					//apparently I'm necessary even if blank
				},
				errorCallback:e => {
					console.log('error cb',e);
				}
			};

            await this.recorder.start(options);
			this.recording = true;

			//remember the filename for delete and playback purposes
			this.lastName = newName;

        },
		async endRecord() {
			await this.recorder.stop();
			this.recording = false;
			console.log('finished recording');
		},
		async play() {
			console.log('doPlay called');
            let player = new audio.TNSPlayer();

            await player.playFromFile({
                audioFile:this.audioFolder.path+'/'+this.lastName
            });

        },
		save() {
			sounds.saveSound(this.name, this.lastName);
            this.$navigateTo(Home);
		}

	}
}
</script>
```

Alrighty, this one's a bit more intense. This view lets you record audio and has to use a bit of logic to handle a few cases:

* First, what do we name the file? For that I use a library to generate a UUID (`generateUUIDv4`). 
* If you record a sound - and then record it again - we delete the first one. So we have to remember we made a prior sound and clean it up. Note I do *not* support "clean up" if you use the back button. Oops.
* You are only allowed to save the sound record if you name it and do a recording. So the button logic gets a bit complex. You can see that in the `computed` section. Outside of that though most of the code is related to the first blog entry on the topic.

And that's it! What do you think? Leave me a comment with any suggestions or feel free to submit a pull request to the [repository](https://github.com/cfjedimaster/ns-soundboard).