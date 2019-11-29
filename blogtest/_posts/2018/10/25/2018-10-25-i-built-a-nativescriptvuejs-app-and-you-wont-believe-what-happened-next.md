---
layout: post
title: "I Built a NativeScript/Vue.js App and You Won't Believe What Happened Next..."
date: "2018-10-25"
categories: ["development"]
tags: ["nativescript"]
banner_image: /images/banners/shocked-face-2.jpg
permalink: /2018/10/25/i-built-a-nativescriptvuejs-app-and-you-wont-believe-what-happened-next
---

Please forgive the clickbait title. I was struggling with what to actually title this blog post
and just decided to give up and go a bit over the top. With how little I'm blogging lately, I figured this
would at least put a smile on my reader's faces and that's worth something. ;) Speaking of my readers, those of you who have been around here for a while know I've been a fan of [NativeScript](https://www.nativescript.org/) since it's release, but I've also blogged very little about it. It's consistently been on my "Things I'm going to do this year" posts and I never get around to actually working with it. Well, the good news for me is that while I'm between jobs, I've got a client who wants to build a NativeScript app and I've got the time (while on the clock, and yes, I'm very lucky for that) to learn while I build out the project. Even more lucky for me is that there is a [NativeScript Vue](https://nativescript-vue.org/) project that kicks major butt. I thought I'd share my experience playing with it over the past week as well a simple application I built with it.

The first thing I want to address it the development experience. I've been following the work the NativeScript team has done in that regards but I actually got to play with multiple variations of it and I have to say - they have done *incredible* work in this area.

### The CLI

So yes, you have a command line. It's always felt a bit "heavy" to me in terms of installation and speed. That's not very scientific but it feels like the install process is a bit long and has a lot of moving parts. I did my testing in PowerShell as I didn't want to try getting the Android SDK running under WSL. The CLI can actually handle that for you, but in my case I already had Android installed. You can see more about this process at the [CLI installation docs](https://docs.nativescript.org/angular/start/quick-setup) but I guess my point here is to not expect a quick `npm i nativescript` that will finish in a few seconds. I don't think there's anything that can be done about that, just consider this as a heads up. 

Once you do get it installed, the CLI works ok, but in my testing, the first run of an Android project seemed incredibly slow. Much more than I've seen with Cordova. But that's a one time pain. You can run `tns run android --bundle` and it will automatically reload your application as you save files. 

After that initial load the process is - I'll say - "reasonably" fast. For my small-ish project it took maybe 3-4 seconds for each reload as I worked. In general this never bothered me until I started working on design type stuff and it got a bit frustrating when I screwed things up. 

The command line will broad any `console.log` messages but I wish it would differentiate it a bit between it's own output as well. Here's a random example and while I know where my messages are, I'd like to see it called out more. (And yeah, it's way too small to even read. Sorry. But I haven't included a picture yet and it's way past due.)

![Terminal output you cant read](https://static.raymondcamden.com/images/2018/10/nsv1.jpg)

Before I leave this section, a quick note. On multiple occasions I found that if I left the CLI running over night, in the morning it didn't seem to refresh well. I just `CTRL-C` the CLI and ran it again and everything would be fine. I'm assuming something just got lost between the terminal and the Android simulator. If I were a betting man, I'd totally blame Android.

### The GUI app you think you don't need but you should try it anyway

So yes, I know we're all "real" developers and we have to use the CLI for everything, but you may want to check out the [Sidekick](https://www.nativescript.org/nativescript-sidekick) application. This is a desktop GUI that wraps the CLI operations and lets you quickly generate new projects and test them. It also does a great job of rendering information about your project like installed plugins and other settings.

![My sidekick...](https://static.raymondcamden.com/images/2018/10/nsv2.jpg)

Even more impressive, it can handle building to your iOS device... from Windows. In my testing this was a bit flakey. I know (or I'm pretty sure ;) it worked a few times, but I had trouble getting my last project working correctly. I'm going to assume it *will* work consistently though and that's pretty damn impressive.

If you want to learn more, you can watch this nice little video the NativeScript folks whipped up.

<iframe width="560" height="315" src="https://www.youtube.com/embed/tG7c2nZvhTg" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

One oddity about the Sidekick is that while it has a "logs" output panel, you won't find console.log messages there. Instead, you want to ensure you select "Start Debugger":

![The very obvious debugging thing](https://static.raymondcamden.com/images/2018/10/nsv3.jpg)

This pops open a new window and while still "noisy" like the CLI, it is a bit easier to read I think the terminal.

![Sample of the console output](https://static.raymondcamden.com/images/2018/10/nsv4.jpg)

### The Simplest Solution - the Playground

So the third option, and one of the easiest if you want to skip worrying about SDKs, is the [Playground](https://play.nativescript.org/). This is a web-based IDE that lets you play with NativeScript without having to install anything on your machine. It even includes multiple walkthrough tutorials to help you learn. Even better, you can use the QR code feature ("Yes!" all the markerters yell) and a corresponding app on your mobile device to test out the code. Oddly - you need *two* apps on your device and their docs don't tell you this - both the Playground app and the Preview app. 

![Screenshot of my awesome iPhone](https://static.raymondcamden.com/images/2018/10/nsv5.jpg)

In general it felt like the refresh on this worked pretty well, on par with the CLI approach. But it's absolutely the simplest way to get started so I'd check it out if you aren't comfortable or familiar with the SDKs. And heck, even if you, consider using it for the nice tutorials. 

### My App

So after going through a few tutorials and just generally kicking the tires, I decided to build "INeedIt" once again. This is an app I've built in multiple languages, platforms, etc. over the past few years. It's a simple wrapper for the [Google Places API](https://developers.google.com/places/web-service/intro). It's a rather simple app in three discreet pages.

The first page gets your location and then provides a list of service types (bars, restaurants, ATMs, etc). This is based on a hard coded [list](https://developers.google.com/places/web-service/supported_types) that the API supports.

![List of types](https://static.raymondcamden.com/images/2018/10/nsv6.jpg)

When you select a type, it then asks the API to find all the results of that type within a certain range of your location.

![List of results](https://static.raymondcamden.com/images/2018/10/nsv7.jpg)

The final page is just a "details" view.

![Detail view](https://static.raymondcamden.com/images/2018/10/nsv8.jpg)

Before I show the code, some things to take note of.

* This isn't a very pretty application. The UI controls provided by NativeScript work well, but you do have to spend some time with CSS to make this look nice, and customized for your application. I spent a *little* time fiddling with the CSS a bit but decided I wouldn't worry about it too much.
* On that detail view, Google Place's API used to return photos with it's detail result, now it has a separate API for that. I could have added that but decided to not worry about it. I only bring it up because the [last version](https://www.raymondcamden.com/2017/11/16/another-vuejs-demo-ineedit/) I built supported it. 
* That map you see is an example of the [Static Map API](https://developers.google.com/maps/documentation/maps-static/intro), one of my favorite Google services.

Ok, let's check out the code! First, the initial view. As an aside, I removed most of the data from the `serviceTypes` variable to keep the length of the post down. I should really abstract that out into a service.

```markup
<template>
    <Page>
        <ActionBar title="INeedIt"/>

        <GridLayout rows="*, auto, *" columns="*, auto, *">
            <ListView for="service in serviceTypes" @itemTap="loadService" rowHeight="40" :visibility="loading?'hidden':'visible'" rows="0" rowSpan="3" col="0" colSpan="3">
                <v-template>
                    <Label :text="service.label" verticalAlignment="middle" />
                </v-template>
            </ListView>
            <ActivityIndicator :busy="loading" row="1" col="1"/>
        </GridLayout>
    </Page>
</template>

<script>
import * as geolocation from 'nativescript-geolocation';
import { Accuracy } from 'ui/enums';
import TypeList from './TypeList';

export default {
    data() {
        return {
            loading:true,
            location:{},
            serviceTypes:[
                {"id":"accounting","label":"Accounting"},{"id":"airport","label":"Airport"},                {"id":"veterinary_care","label":"Veterinary Care"},{"id":"zoo","label":"Zoo"}
            ]            
        }
    },
    mounted() {
        console.log('lets get your location');
        geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, maximumAge: 1000, timeout: 20000})
        .then(res => {
            let lat = res.latitude;
            let lng = res.longitude;
            this.location.lat = lat;
            this.location.lng = lng;      
            this.loading = false;

        })
        .catch(e => {
            console.log('oh frak, error', e);
        });
    },
    methods:{
        loadService(e) {
            let service = e.item;
            this.$navigateTo(TypeList, {props: {service:service, location:this.location}})
        }
    }
    
}
</script>

<style scoped>
ActionBar {
    background-color: #53ba82;
    color: #ffffff;
}
</style>
```

This is an example of SFC (Single File Components) that you may already be familiar with when working with Vue. I love that every aspect of this is the same except the layout, and frankly that wasn't much of a big deal. The only thing I struggled with was rendering the loading component in the middle of the page over the rest of the content and luckily nice people in the NativeScript Slack group helped me out. I don't want to minimize this. Learning layout stuff for NativeScript will be a process, but for the most part I think it generally just makes sense. 

Now let's look at the next component, TypeList.vue. 

```markup
<template>
	<Page>
		<ActionBar :title="service.label"/>

        <GridLayout rows="*, auto, *" columns="*, auto, *">
            <ListView for="place in places" @itemTap="loadPlace" rowHeight="45" :visibility="loading?'hidden':'visible'" rows="0" rowSpan="3" col="0" colSpan="3">
                <v-template>
					<StackLayout>
						<Label :text="place.name" className="placeName" />
						<Label :text="place.vicinity" className="placeAddress" />
					</StackLayout>
                </v-template>
            </ListView>
			<Label rows="0" rowSpan="3" col="0" colSpan="3" text="Sorry, there were no results." :visibility="noResults?'visible':'hidden'" />
            <ActivityIndicator :busy="loading" row="1" col="1"/>
        </GridLayout>

	</Page>
</template>

<script>
import places from '../api/places';
import Place from './Place';

export default {
	data() {
		return {
			loading:true,
			noResults:false,
			places:[]
		}
	},
	props: ['service', 'location'],
	mounted() {
		places.search(this.location.lat, this.location.lng, this.service.id)
        .then(results => {
			console.log('results', results.data.result);
			this.places = results.data.result;
			if(this.places.length === 0) this.noResults = true;
			this.loading = false;
        });
	},
	methods: {
		loadPlace(event) {
			let place = event.item;
            this.$navigateTo(Place, {props: {place:place}})
		}
	}
}
</script>

<style scoped>
Label.placeName {
	font-size: 20px;
}

Label.placeAddress {
	font-style: italic;
	font-size: 10px;
}
</style>
```

On startup, it uses an API (more on that in a second) to get a list of results for the specific type being viewed. Then it simply renders it out in a ListView. The API I'm importing is here:

```js
import axios from 'axios/dist/axios';

// radius set to 2000
const RADIUS = 2000;

export default {

	detail(id) {
		return axios.get(`https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/googleplaces_detail?placeid=${id}`);

	},

	search(lat, lng, type) {
		return axios.get(`https://wt-c2bde7d7dfc8623f121b0eb5a7102930-0.sandbox.auth0-extend.com/googleplaces_search?lat=${lat}&lng=${lng}&radius=${RADIUS}&type=${type}`);
	}

}
```

I wrote [Webtask.io](https://webtask.io) wrappers for my Google Places API calls to make it a bit easier to share the code. You got to lose that comment about the radius. Epic comment there. 

The final component, Place.vue, handles getting the details and rendering it. I really only show a few values. You could do a lot more here.

```markup
<template>
	<Page>
		<ActionBar :title="place.name" />
		<StackLayout>
			<Label :text="details.formatted_address" />
			<Label :text="details.formatted_phone_number" />
			<Image :src="mapUrl" stretch="aspectFill" width="100%" />
		</StackLayout>

	</Page>
</template>

<script>
import places from '../api/places';

export default {
	data() {
		return {
			loading:true,
			details:{
				formatted_address:''
			},
			mapUrl:''
		}
	},
	props: ['place'],
	mounted() {
		console.log('load place id', this.place.place_id);
		places.detail(this.place.place_id)
		.then(res => {
			console.log('my details are:', res.data.result);
			this.details = res.data.result;
			this.mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${this.details.geometry.location.lat},${this.details.geometry.location.lng}&zoom=14&markers=color:blue|${this.details.geometry.location.lat},${this.details.geometry.location.lng}&size=500x500&key=mykeyhere`;
		});
	},
	methods: {
	}
}
</script>

<style scoped>
</style>
```

You'll notice my use of the Static Maps API includes a hard coded key. You can use the sample key as you do for the Places API. I'd definitely abstract this out usually but as I was at the end of my demo I was getting a bit lazy. ;)

### NativeScript Vue

In conclusion, I'm really impressed with Vue running under NativeScript. I'm going to go ahead and use it for the client's project and I definitely think it's worth your time. If you're already using it, I'd love to hear about your experience so please leave me a comment below.

I normally share my sample code but I don't have this in a repo anywhere. If anyone wants it though just ask and I'd be glad to share it.


<i>Header photo by <a href="https://unsplash.com/photos/iZGS8A1JV5Y?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Patrick Fore</a> on Unsplash</i>
