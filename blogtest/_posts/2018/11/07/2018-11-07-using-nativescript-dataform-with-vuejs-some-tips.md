---
layout: post
title: "Using NativeScript DataForm with Vue.js - Some Tips"
date: "2018-11-07"
categories: ["javascript"]
tags: ["vuejs","javascript","nativescript"]
banner_image: /images/banners/forms.jpg
permalink: /2018/11/07/using-nativescript-dataform-with-vuejs-some-tips
---

As I've mentioned recently, I'm currently working on a [NativeScript Vue](https://nativescript-vue.org/) application
for a client and as part of that work, I'm dealing with custom forms. My initial approach made use of [custom components](https://www.raymondcamden.com/2018/10/31/working-with-dynamic-components-in-vuejs), which Vue made pretty trivial, but I've decided to give [NativeScript UI](http://docs.telerik.com/devtools/nativescript-ui/introduction) a try. This is a set of free components covering the following features:

* Calendar
* Chart
* ListView
* DataForm
* SideDrawer
* Gauge
* AutoComplete

Specifically, [DataForm](http://docs.telerik.com/devtools/nativescript-ui/Controls/NativeScript/DataForm/dataform-overview) looked like it could be useful. While it's not too difficult to build forms with NativeScript, DataForm attempts to automate as much as possible of the process. As an example, consider the following data:

```js
{
	"name":"Raymond Camden",
	"yearBorn":1973,
	"cool":true,
	"email":"raymondcamden@gmail.com"
}
```

Now imagine we tie this to a dataform control:

```markup
<RadDataForm ref="dataForm" :source="person" />
```

And if we literally leave it at this - the control will automatically render a nice form for us:

<img src="https://static.raymondcamden.com/images/2018/11/df1.jpg" alt="Screenshot of form" class="imgborder imgcenter">

Notice how the control looked at my data properties and figured out what controls to use as well as how to create labels. `yearBorn` for example becomes `Year Born`. This all happens by default and is freaking cool, but you can control all of this as well if you don't care for their defaults.

All in all a neat little control, but I ran into some issues right away as soon as I started trying some of the more advanced features. Part of this is due to some poor docs (I've already sent reports in!) and I hope this post can help others avoid the issues I ran into.

### Install with Vue Issues

So the docs tell you to install the relevant plugin, but right after that things go a bit awry. 

The ["Getting Started"](http://docs.telerik.com/devtools/nativescript-ui/Controls/Vue/DataForm/getting-started) for the Vue docs and DataForm, which isn't even labelled that (in the nav it's called "Provide the Source" tell you to do this:

"Add this to the main Javascript or Typescript file, usually called main.js or main.ts:"

```js
import RadDataForm from 'nativescript-ui-dataform/vue';

Vue.use(RadListView);
Vue.use(RadDataForm);
```

Ok, I did that. Then it says:

"Before proceeding, make sure that the nativescript-ui-dataform/vue module is required inside your application. This module handles the registration of the custom directives and elements required by nativescript-vue.

After that simply add the RadDataForm tag to the HTML and set its source accordingly:
"

So that first paragraph didn't make sense. I mean, didn't I already do that? To make matters worse, the code sample below doesn't provide any additional help. 

I was only able to get things working by going to the NativeScript Playground, dragging a DataForm control on the page, and looking at what it did. 

Based on that, this is what worked for me:

1. Do *not* add code to main.js/maint.js. From what I can see it wasn't necessary.

2. In your component, do require the dataform like so:

<strong>Edit on 11/7/2018, a mere hour after posting... @bundyo reduced the original 5 lines of code I had to just one:</strong>

```js
import 'nativescript-ui-dataform/vue';
```

Looking at that code, the paragraph I quoted above makes sense now, but I had no idea what code to even use. If the code sample on the page had included this, it would have saved me about two hours - I kid you not.



### Working with Groups

Alright - so the main reason I even looked at the dataform control was to make use of the "groups" feature. This lets you take a large form and create groups that can ben opened and collapsed. It isn't an "accordion" control per se, but it achieves the same purpose. (For folks curious, there *is* a [NativeScript Accordion](https://github.com/triniwiz/nativescript-accordion) control but it has certain restrictions that made it unusable for my case.) Here are two screenshots I stole from the docs - first the Android version:

<img src="https://static.raymondcamden.com/images/2018/11/df2.png" alt="Android example of Groups" class="imgborder imgcenter">

And then iOS:

<img src="https://static.raymondcamden.com/images/2018/11/df2a.png" alt="iOS Groups example" class="imgborder imgcenter">

So, while cool, the docs on this were pretty slim, especially in regards to providing *dynamic* groups, by that I mean groups defined in data and not hard coded as tags on the page. I spent a heck of a lot of time trying to get this to work and finally gave up and asked for help on the NS Slack group. Thankfully [@bundyo](https://github.com/bundyo) came to the rescue. What follows is *his* solution, not mine. My data is still hard coded but you can see where it could be modified to support data loaded from Ajax or some such.

```markup
<template>
    <Page class="page">
        <ActionBar title="Demo" class="action-bar" />
        <ScrollView>
            <RadDataForm  ref="dataForm" :source="album" :metadata="md" :groups="groups">
            </RadDataForm>
        </ScrollView>
    </Page>
</template>

<script>
import { RadDataForm, PropertyGroup } from 'nativescript-ui-dataform';

require("nativescript-vue").registerElement(
    "RadDataForm",
    () => require("nativescript-ui-dataform").RadDataForm
);

export default {
    data() {
        return {
            groups:[],
            album: {
                bandName: "Edwhat Sheeran",
                albumName: "X",
                year: "2017",
                owned: true,
                myRating: 9.5,
            },
            md:{

            }
        };
    },
    created() {

        this.md = {                 
            propertyAnnotations:[
                    {
                        name:"bandName",
                        displayName:"My band name",
                        required:true,
                        groupName:"Group One"
                    },
                    {
                        name:"albumName",
                        displayName:"My album",
                        required:true
                    },
                    {
                        name:"year",
                        required:true,
                        groupName:"Group One"
                    },
                    {
                        name:"owned",
                        required:true,
                        groupName:"Group Two"
                    },
                    {
                        name:"myRating",
                        required:true,
                        groupName:"Group Two"
                    }
                ]
        };

        let pg = new PropertyGroup(); 
        
        pg.name = "Group One"; 
        pg.collapsible = true;
        pg.collapsed = false;
            
        this.groups.push(pg);

        pg = new PropertyGroup(); 
        
        pg.name = "Group Two"; 
        pg.collapsible = true;
        pg.collapsed = true;
            
        this.groups.push(pg);

    }
};
</script>

<style scoped>
</style>
```

Let's break it down. First, look at the dataform:

```markup
<RadDataForm  ref="dataForm" :source="album" :metadata="md" :groups="groups">
</RadDataForm>
```

There's two new attributes here - `metadata` and `groups`. So `metadata` is where you can do overrides on the default behaviors of the control. Don't like the label it selects for your property value? You can tweak it here. Want to use a custom drop down with specific values? You can set it here. We use this feature to specify the groups for each field. (And again, it's hard coded here but it could be dynamic.)

The next part is creating the groups. In this case we use an instance of `PropertyGroup`, one for each group, and ensure that the names match the names used in metadata. 

If you want to see, and play with, a slimmer version, check out the Playground @bundyo made here: <https://play.nativescript.org/?template=play-vue&id=qWbsL5&v=3> It really does a nice job of setting up the groups and fields all in one fell swoop. And because it's on the Playground, you can point the NativeScript Playground app at it and have it running on your device in 10 seconds.

<img src="https://static.raymondcamden.com/images/2018/11/df3.jpg" alt="Groups example running on phone" class="imgborder imgcenter">

Anyway, I hope this helps. As I said, the docs here were a bit painful, but I've sent multiple reports in to the NativeScript folks so hopefully it gets improved soon. If you have any questions, just drop me a line below!