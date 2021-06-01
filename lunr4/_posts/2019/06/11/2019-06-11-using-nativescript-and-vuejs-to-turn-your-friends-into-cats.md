---
layout: post
title: "Using NativeScript and Vue.js to Turn Your Friends into Cats"
date: "2019-06-11"
categories: ["javascript","mobile"]
tags: ["vuejs","nativescript"]
banner_image: /images/banners/kittens.jpg
permalink: /2019/06/11/using-nativescript-and-vuejs-to-turn-your-friends-into-cats
description: How to use the NativeScript Contacts plugin to add pictures to your contacts
---

An incredibly long time ago, OK, way back in 2016, I wrote up an experiment concerning Ionic and the Contacts API wrapper (["Working with Ionic Native - Contact Fixer"](https://www.raymondcamden.com/2016/12/12/working-with-ionic-native-contact-fixer)). The idea was simple. Given that you have a large set of contacts on your device, what if there was a simple way to add pictures to those contacts without one? And if we're going to add pictures to contacts, surely the best picture possible would be of a cat, right?

<figure>
<img src="https://static.raymondcamden.com/images/2019/06/cat1.jpg" alt="This is your new boss, right?" class="imgborder imgcenter">
<figcaption>Wouldn't you love to get a call from this guy?</figcaption>
</figure>

As an excuse to work with NativeScript more, I thought it would be fun to rebuild this and of course, take the opportunity to use [NativeScript Vue](https://nativescript-vue.org/). The end application is incredibly simple so it isn't that exciting, but the end results are kind of neat. There is, of course, a plugin for working with contacts and NativeScript, [NativeScript Contacts](https://www.npmjs.com/package/nativescript-contacts). The plugin worked well for me in general, but there is an [open issue](https://github.com/firescript/nativescript-contacts/issues/30) with updating existing contacts. My code seemed to work despite this issue, but you'll notice a try/catch around the operation. I also made use of [nativescript-permissions](https://www.npmjs.com/package/nativescript-permissions) to handle Android specific permission stuff. This was easy too, but I almost wish it was baked into NativeScript as it feels like something you'll *always* need.

Let's begin by taking a look at the code. It's a "one view" app so I've only got one component to share, and as I said, it's almost stupid simple so I'm not sure how useful it is. I'll start with the layout first.

```html
<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label class="action-bar-title" text="Home"></Label>
        </ActionBar>
		<StackLayout>
			<Label textWrap="true" :text="status" height="40" />

			<Button v-if="readyToFix" text="Fix Contacts!" @tap="fixContacts"></Button>
			<ScrollView orientation="vertical" height="100%">
				<ListView for="contact in contacts">
					<v-template>
						<GridLayout columns="*,40" padding="20">
						<Label row="0" col="0" :text="contact | name"/>
						<Image row="0" col="1" :src="contact.photo" />
						</GridLayout>
					</v-template>
				</ListView>
			</ScrollView>

		</StackLayout>
    </Page>
</template>
```

At the top, you can see a label bound to a `status` value that I'll be using to report on, well, status of the application. Loading contacts on my device took about 4 or so seconds so I needed a message to let the user know what was going on.

Beneath that I've got a button and a list of contacts. The button is what you will use to "fix" your contacts and notice it only shows up when we're ready to update them. The contacts are displayed in a `ListView` using a `GridLayout` to show their names and pictures (which will be blank at first).

Now let's look at the code.

```js
const permissions = require('nativescript-permissions');
const contacts = require('nativescript-contacts');
const imageSource = require('image-source');

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCatURL() {
    let w = getRandomInt(200,500);
    let h = getRandomInt(200,500);
    return `https://placekitten.com/${w}/${h}`;
}

export default {
    data() {
        return {
            status:'',
            contacts:[],
            readyToFix:false
        }
    },
    created() {
        this.status = 'Loading up your contacts to find those missing a picture - please stand by!';

        permissions.requestPermissions([android.Manifest.permission.READ_CONTACTS, android.Manifest.permission.WRITE_CONTACTS], 'I need these permissions to work with your contact.')
            .then(() => {

                var contactFields = ['name','nickname','photo'];
                contacts.getAllContacts(contactFields).then(
                    args => {


                        //get contacts w/o a picture AND with a name
                        let fixableContacts = args.data.filter(c => {
                            if(c.photo) return false;
                            if(!c.nickname && !c.name.family) return false;
                            return true;
                        });
    
                        this.status = `You have ${fixableContacts.length} named contacts without pictures...`;
                        this.contacts = fixableContacts;
                        this.readyToFix = true;

                    },
                    err => {
                        console.log("Error: " + err);
                    }
                );

            })
            .catch(e => {
                console.log('error in perms thing',e);
            });
    },
    methods:{
        fixContacts() {
            let fixes = [];
            for(let i=0; i<this.contacts.length; i++) {
                fixes.push(imageSource.fromUrl(getRandomCatURL()));
            }
            Promise.all(fixes).then(sources => {
                console.log('in the promise all and ive got '+sources.length + ' sources');
                // should be a 1 to 1 map to contacts, but doesn't matter since random :>
                for(let i=0; i<sources.length; i++) {
                    this.contacts[i].photo = sources[i];
                    // wrap in try/catch: https://github.com/firescript/nativescript-contacts/issues/30
                    try {
                        this.contacts[i].save();
                    } catch(e) {
                        // ignore
                    }
                }
            });
        }

    }
};
```

Up top we've got the required libraries being loaded in and beneath that, two helper functions. `getRandomInt` does exactly that, a random number between two values, and `getRandomCatURL` is how I handle generating a new cat photo for contacts. It uses the (newly resurrected) [placekitten.com](https://placekitten.com) image placeholder service. In this case we're simply generating random dimensions between 200 and 500 pixels wide.

Beneath that comes the Vue specific code. My `created` method handles loading all contacts, but note that we filter both by contacts with pictures already and those that don't have a name of some sort. The end result is an array of contacts that could be fixed. They are saved to the `contacts` value and then rendered out in the `ListView`.

Finally, you can see the `fixContacts` method that handles getting those random cat pictures. I make use of `imageSource.fromUrl` to load in an image from a URL. This returns a promise so I use `Promise.all` to then assign those results to my contacts. (In case you're curious, you *can* use Async/Await in NativeScript, Alex Ziskind has an article [here](https://nativescripting.com/posts/async-await-in-nativescript) discussing it, but as it involves a small workaround, I decided to avoid it for today.) 

And that's it. Let's look at the result! First, here are the contacts on my virtual Android device before running the app. Notice the boring icons by their names:

<img src="https://static.raymondcamden.com/images/2019/06/cat2.png" alt="List of contacts without nice pictures" class="imgborder imgcenter">

When I run the app, it will load all of my contacts as none of them have a photo. Notice the bug in the last row:

<img src="https://static.raymondcamden.com/images/2019/06/cat3.png" alt="App running, list of contacts" class="imgborder imgcenter">

This comes from the Vue filter I used to display names. The basic idea was, look for a nickname, and if it isn't there, use first and last name:

```js
// Used to find a good name for a contact
Vue.filter('name', contact => {
    if (contact.nickname) return nickname;
    else if (contact.name.family) return contact.name.given + ' ' + contact.name.family;
    return '';
});
```

Unfortunately, the `Discord` contact didn't have a first name. Discord is just Discord. 

<img src="https://static.raymondcamden.com/images/2019/06/discord.jpg" alt="You don't mess with Discord" class="imgborder imgcenter">

However, I thought "null Discord" sounded like a cool name anyway so I kept the bug in. Or I'm lazy. You pick.

After clicking the button, each contact was assigned a random cat URL which was automatically updated in the `ListView`:

<img src="https://static.raymondcamden.com/images/2019/06/cat4.png" alt="Contacts with cats!" class="imgborder imgcenter">

And what's cool is you see this right away. I went back to my Contacts app on the virtual device and saw great results. First the list of all contacts:

<img src="https://static.raymondcamden.com/images/2019/06/cat5.png" alt="Fixed contacts" class="imgborder imgcenter">

And here's two examples:

<img src="https://static.raymondcamden.com/images/2019/06/cat6.png" alt="First example" class="imgborder imgcenter">
<img src="https://static.raymondcamden.com/images/2019/06/cat7.png" alt="Second example" class="imgborder imgcenter">

And that's it. Stupid fun, but nice to build. If anyone wants the complete source code, just ask!

<i>Header photo by <a href="https://unsplash.com/@mewmewmew?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Q'AILA</a> on Unsplash</i>