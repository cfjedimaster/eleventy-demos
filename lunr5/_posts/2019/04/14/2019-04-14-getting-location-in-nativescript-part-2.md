---
layout: post
title: "Getting Location in NativeScript - Part 2"
date: "2019-04-14"
categories: ["javascript","mobile"]
tags: ["vuejs","nativescript"]
banner_image: /images/banners/location.jpg
permalink: /2019/04/14/getting-location-in-nativescript-part-2
description: A follow up blog post on working with Location data in NativeScript
---

A few days ago I blogged about working with Geolocation in NativeScript (["Getting Location in NativeScript"](https://www.raymondcamden.com/2019/04/10/getting-location-in-nativescript)). That post was a bit short as I was writing during a layover on my way to NativeScript Developer Day (which was pretty damn cool!) in Amsterdam. Now I'm on my way home, stuck in Atlanta due to storms causing chaos, and I thought I'd share a quick update to my previous post.

While I mentioned that the [Geolocation plugin](https://github.com/NativeScript/nativescript-geolocation) worked very similarly to the web standards API, it did have one super useful addition that I wanted to highlight - the ability to return the distance between two points. Sure this is just math you can Google and copy and paste, but having it baked into the plugin is really darn useful. 

To demonstrate this, I modified my previous application to use a service that returns a list of locations, each with a longitude and latitude. It's static now but set up to be used asynchronously.

```js
const api = {

	async getLocations() {

		return new Promise((resolve, reject) => {
			// fake data
			let data = [
				{
					name:'New Orleans', 
					location: { 
						lat:29.95,
						lng:-90.07
					}
				},
				{
					name:'New York City', 
					location: { 
						lat:40.73,
						lng:-73.93
					}
				},
				{
					name:'San Francisco', 
					location: { 
						lat:37.77,
						lng:-122.43
					}
				},
			];

			resolve(data);
		});
	}

}

module.exports = api;
```

I placed this in an `api` folder. Next I updated my Home component to support:

* Getting the list
* Getting your location
* Updating the list with the distance between you and the location

Here's the complete component:

```html
<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" text="Geolocation Demo"></Label>
        </ActionBar>

        <GridLayout rows="40,auto">
            <StackLayout row="0">
                <Label v-if="needLocation" text="Looking up your location..." />
                <Label v-if="locationFailure" text="Sorry, I failed! :(" />
                <Label v-if="location" :text="locationDescription" textWrap="true" />
            </StackLayout>
           <ListView for="loc in locations" row="1" height="100%">
                <v-template>
                    <Label :text="loc.label" />
                </v-template>
            </ListView>
        </GridLayout>

    </Page>
</template>

<script>
import * as Geolocation from 'nativescript-geolocation';
import LocationService from '../api/LocationService';

export default {
    data() {
        return {
            needLocation:true,
            locationFailure:false,
            location:null,
            locations:[]
        }
    },
    computed: {
        locationDescription() {
            return `You are at ${this.location.latitude}, ${this.location.longitude}. Your altitude is ${this.location.altitude}.`;
        }
    },
    async created() {

        let locs = await LocationService.getLocations();

        Geolocation.enableLocationRequest(true)
        .then(() => {
            Geolocation.isEnabled().then(isLocationEnabled => {
                if(!isLocationEnabled) {
                    this.needLocation = false;
                    this.locationFailure = true;
                    // potentially do more then just end here...
                    return;
                }

                // MUST pass empty object!!
                Geolocation.getCurrentLocation({})
                .then(result => {
                    this.needLocation = false;
                    this.location = result;

                    let myLocation = new Geolocation.Location();
                    myLocation.longitude = result.longitude;
                    myLocation.latitude = result.latitude;

                    //Now that we know our location, update distance
                    locs.forEach(l => {
                        let thisLocation = new Geolocation.Location();
                        thisLocation.longitude = l.location.lng;
                        thisLocation.latitude = l.location.lat;
                        let dist = Math.floor(Geolocation.distance(myLocation, thisLocation));
                        l.label = `${l.name} is ${dist} meters away.`;
                    });
                    this.locations = locs;

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

Here's a few things I want to call out. First, inside my `ListView`, I'm outputting the `label` value of my location. That doesn't actually exist, but is instead added to the result in my Vue code. There's multiple other ways of doing this, but this seemed simple enough for now.

Next, notice that my `created` method now has the `async` keyword. This lets me do things like the `await` call inside. I could probably refactor the code that gets your location as well, and I thought about it, but decided to keep my changes more simpler for now. Also, I've been busy the last few days.

In order to work with distances, you created `Location` objects. You assign the longitude and latitude. And then you can get the distance between any two like so: `Geolocation.distance(firstLocation, secondLocation)`

And that's pretty much it. Here's how it renders in the Android simulator.

<img src="https://static.raymondcamden.com/images/2019/04/geo2.png" class="imgborder imgcenter">

Not terribly exciting, but you get the idea. Note that the plugin also supports a `watchLocation` method that will continuously check your device location. You could use that to keep the list updated as the user moved.

That's it! I plan on doing more posts on simple NativeScript examples, so as always, if you have questions, or feedback, just leave me a comment below!
