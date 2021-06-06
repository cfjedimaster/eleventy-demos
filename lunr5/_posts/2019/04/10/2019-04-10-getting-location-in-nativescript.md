---
layout: post
title: "Getting Location in NativeScript"
date: "2019-04-10"
categories: ["javascript","mobile"]
tags: ["vuejs","nativescript"]
banner_image: /images/banners/location.jpg
permalink: /2019/04/10/getting-location-in-nativescript
---

As I prepare to get on an 8+ hour flight to Amsterdam for [NativeScript Developer Day](https://nativescriptdevday.org/), I thought it would be nice to work on a quick little NativeScript demo. It occurred to me a few days ago that one of the things I did while learning Cordova and Ionic was to build a crap ton of simple demos that used various plugins as a way to learn the ecosystem. I've decided to try my best to repeat that process with NativeScript. What follows is the first of two articles I'm going to write on using geolocation with NativeScript. This is just a simple introduction while the next one will be a slightly more complex example. 

First, I want to start off with a little warning. When I Googled for geolocation and NativeScript, I ended up here: [Location](https://docs.nativescript.org/angular/ng-hardware-access/location). The docs here have a few issues and in my opinion, you should avoid them. (I plan on filing a bug report on the issues when I get a chance from this trip!) Instead, I'd check the core docs for the plugin at <https://github.com/NativeScript/nativescript-geolocation>.

Assuming you've got a NativeScript project created, you'll want to begin by adding the plugin:

	tns plugin add nativescript-geolocation

Ok, so that's easy. Using the plugin is *mostly* easy, but you do have to handle permissions as well as handling errors from retrieving the data. In my opinion, the main readme doesn't do a great job of showing this in a complete example (although more on that in a bit), so I had to guess a bit to figure it out, but here's what I came up with as a general "flow":

```js
Geolocation.enableLocationRequest(true)
.then(() => {
	Geolocation.isEnabled().then(isLocationEnabled => {
		if(!isLocationEnabled) {
			// potentially do more then just end here...
			return;
		}

		// MUST pass empty object!!
		Geolocation.getCurrentLocation({})
		.then(result => {
		})
		.catch(e => {
			console.log('loc error', e);
		});
	});
});
}
```

The code begins by enabling location access in general. On my Android this resulted in a prompt the first time but not again. Then `isEnabled` call will return true or false and how your application handles that is up to, well, your application. 

Next, you'll actually get the location. <strong>It is very important that even if you are fine with the defaults, you must pass an empty object!</strong> If you pass nothing than the request is never made. That seems like a small bug to me, but it's easy enough to work around.

Once done, your result variable includes latitude and longitude, altitude, and more. The docs do cover this very well. 

So how about a complete, if simple, demo of this? I'm using [NativeScript-Vue](https://nativescript-vue.org/) but obviously similar code would work in Angular, it just wouldn't be as cool. I built everything within one component:

```html
<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" text="Geolocation Demo"></Label>
        </ActionBar>

        <StackLayout>
            <Label v-if="needLocation" text="Looking up your location..." />
            <Label v-if="locationFailure" text="Sorry, I failed! :(" />
            <Label v-if="location" :text="locationDescription" textWrap="true" />
        </StackLayout>

    </Page>
</template>

<script>
import * as Geolocation from 'nativescript-geolocation';

export default {
    data() {
        return {
            needLocation:true,
            locationFailure:false,
            location:null
        }
    },
    computed: {
        locationDescription() {
            return `You are at ${this.location.latitude}, ${this.location.longitude}. Your altitude is ${this.location.altitude}.`;
        }
    },
    created() {

        Geolocation.enableLocationRequest(true)
        .then(() => {
            Geolocation.isEnabled().then(isLocationEnabled => {
                console.log('result is '+isLocationEnabled);
                if(!isLocationEnabled) {
                    this.needLocation = false;
                    this.locationFailure = true;
                    // potentially do more then just end here...
                    return;
                }

                // MUST pass empty object!!
                Geolocation.getCurrentLocation({})
                .then(result => {
                    console.log('loc result', result);
                    this.needLocation = false;
                    this.location = result;
                })
                .catch(e => {
                    console.log('loc error', e);
                });
            });
        });
    }
};
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables
</style>
```

My application UI consists of three labels, each used to represent different states of the application. The initial label acts as a "loading" message of sorts and will go away once the location has been retrieved or an error has been thrown. The second label handles displaying an error and the the final label points to a computed property that will display our results. 

In my `created` event, I've got code based on the outline above. Ask for permissions, ensure I've got it, and then request my location. Once I get it I can simply store it and my Vue computed property will nicely render the result. Here's an example.

<img src="https://static.raymondcamden.com/images/2019/04/geo1.png" class="imgborder imgcenter">

And that's it. In my next post I'm going to dig a bit deeper. The plugin has some useful methods you may be familiar with already from the web API, but it also has more including a super useful distance API built in. As always, let me know if you have any questions by leaving a comment below!

<i>Header photo by <a href="https://unsplash.com/photos/D2K1UZr4vxk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"> Sylwia Bartyzel</a> on Unsplash</i>