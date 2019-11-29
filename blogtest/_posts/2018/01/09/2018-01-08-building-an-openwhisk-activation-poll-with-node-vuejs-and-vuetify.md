---
layout: post
title: "Building an OpenWhisk Activation Poll with Node, Vue.js and Vuetify"
date: "2018-01-09"
categories: [development,serverless]
tags: [javascript,vuejs,openwhisk,nodejs]
banner_image: 
permalink: /2018/01/09/building-an-openwhisk-activation-poll-with-node-vuejs-and-vuetify
---

I've had fun building my own tools to provide additional [OpenWhisk](http://openwhisk.apache.org/) reporting utilities and today I'm releasing another one. If you find it helpful, let me know in the comments below. Even if no one else uses it, it gave me a chance to play with Vue (and Vuetify) so I had fun writing it. 

The goal of this particular project was to provide a web based interface for `wsk activation poll`. If you aren't familiar with this utility, it lets you run a constant poll in your terminal to watch for new activations. Remember that every time you execute an OpenWhisk resource, an activation is created. This activation contains information about the execution, including how fast it ran and the result. This is how it looks in terminal:

![wsk activation poll output](https://static.raymondcamden.com/images/2018/1/ap1.jpg)

Not bad, but I decided to whip up something with Vue to see if I could build something nicer. I decided to give the [Vuetify](https://vuetifyjs.com/) library a try as well. This is a library that provides Material Design components for Vue. I had a bit of trouble at first, mainly due to me doing a shoddy job of reading the docs, but once I got into it, it worked really well. I also spent some time in their Discord chat server for support, and I was *incredibly* impressed by the help I got there. This is definitely an active project with lots of support behind it. I think I'll be using it again in the future. Let me share a few screen shots of the final result, and then I'll dig into the code. 

The application lists activations on the left hand side. This list is updated in (near) real time.

![List of activations](https://static.raymondcamden.com/images/2018/1/ap2.jpg)

Clicking on an individual activation loads the detail on the right:

![Activation detail](https://static.raymondcamden.com/images/2018/1/ap3.jpg )

I'm using Vuetify's expansion panels to compress some of the details down so they don't take as much space. Each panel can be opened and inspected. At the end of the post I'll be sharing a quick video so you can see it in action as well.

Alright, let's look at the code. First, the Node.js server.

```js
const express = require('express');
const app = express();
const openwhisk = require('openwhisk');

app.use(express.static('public'));

const NodeCache = require('node-cache');
const activationCache = new NodeCache();

let ow = openwhisk();

app.set('port', process.env.PORT || 3000);

app.get('/activations', function(req, res) {
    console.log('ts',req.query.ts);
    let options = {
        docs:true,
        limit:50
    };
    if(req.query.ts) options.since = req.query.ts;
    ow.activations.list(options).then(result => {
        let response = result.map(r => {
            activationCache.set(r.activationId, r);
            return {
                id:r.activationId,
                name:r.name,
                success:r.response.success,
                ts:r.start,
                duration:r.duration
            }
        });
        console.log('i got '+result.length+ ' activations');
        if(result.length) {
            timestamp = result[0].start+1;
        } else {
            if(req.query.ts) timestamp = req.query.ts;
            else timestamp = 0;
        }
        res.send({% raw %}{activations:response,ts:timestamp}{% endraw %});
    });
});

app.get('/activation/:id', function(req, res) {
    console.log('load activation '+req.params.id);
    let activation = activationCache.get(req.params.id);
    console.log(activation);
    if(activation) res.send(activation);
});

app.listen(app.get('port'), function() {
    console.log('Express running on http://localhost:' + app.get('port'));
});
```

The server makes use of Express and [Node-Cache](https://github.com/mpneuried/nodecache) for simple RAM-based storage. I've got two end points. `/activations` is used to fetch activations and takes an optional argument to ask for activations after a certain timestamp. It stores the results in the cache and returns an abbreviated list of records including the name, duration, timesramp, and result of the activation.

I'm using the [OpenWhisk Node](https://github.com/apache/incubator-openwhisk-client-js) package to interact with OpenWhisk. In order for this code to work on your own system, you need to ensure you've set two environment variables - `__OW_API_HOST` and `__OW_API_KEY`. If you don't remember how to get them, simply run `wsk property get`. The key is the `whisk auth` value in the output. 

Finally, the other end point is `/activation/:id`. This simply returns the cached activation. I've got no handler for cases where an invalid id is passed so... yeah don't do that.

Ok, so now let's get to the front end. As I said, I'm using Vue and Vuetify. Let's look at the markup first.

```html
<div id="app" v-cloak>
	<v-app dark>
		<v-toolbar>
			<v-toolbar-title>OpenWhisk Activation Poll</v-toolbar-title>
		</v-toolbar>

		<v-content>

			<v-container grid-list-md>
				<v-layout row wrap>

					<v-flex xs4>
						<h2>Activations</h2>
						<v-alert v-for="activation in activations" :key="activation.id"
						:color="activation.success?'success':'error'" value="true" transition="fade-transition" @click="loadActivation(activation)">
						{% raw %}{{activation.name}}{% endraw %} ran at {% raw %}{{ activation.ts |{% endraw %} formatDate }} in
						{% raw %}{{activation.duration}}{% endraw %} ms
						</v-alert>
					</v-flex>

					<v-flex xs8>
						<h2>Activation</h2>
						<div v-if="activation">

							<h3>{% raw %}{{activation.name}}{% endraw %} ({% raw %}{{activation.duration}}{% endraw %}ms)</h3>

							<v-expansion-panel expand>
								<!-- THANK YOU @zaken in the vuetify discord -->
								<v-expansion-panel-content style="overflow-x: auto" lazy>
								<div slot="header">Response</div>
								<v-card>
									<v-card-text>
										<pre>{% raw %}{{activation.response}}{% endraw %}</pre>
									</v-card-text>
								</v-card>
								</v-expansion-panel-content>
								<v-expansion-panel-content style="overflow-x: auto" lazy>
								<div slot="header">Logs</div>
								<v-card>
									<v-card-text>
										<pre>{% raw %}{{activation.logs}}{% endraw %}</pre>
									</v-card-text>
								</v-card>
								</v-expansion-panel-content>
								<v-expansion-panel-content style="overflow-x: auto" lazy>
								<div slot="header">Annotations</div>
								<v-card>
									<v-card-text>
										<pre>{% raw %}{{activation.annotations}}{% endraw %}</pre>
									</v-card-text>
								</v-card>
								</v-expansion-panel-content>
							</v-expansion-panel>

						</div>
					</v-flex>

				</v-layout>
			
			</v-container>

		</v-content>
	</v-app>
</div>
```

You can see the Vuetify components in use. For the most part I assume this is pretty readable as is. The `v-flex` tags are how I'm doing the two column layouts. I'm using "alert" components for the list and expansion panels for the detail. Vuetify supports a heck of a lot more so be sure to check the [docs](https://vuetifyjs.com/vuetify/quick-start). Now let's look at the JavaScript.

```js
// https://forum.vuejs.org/t/how-to-format-date-for-display/3586/5
Vue.filter('formatDate', function(value) {
  if (value) {
      return moment(value).format('MM/DD/YYYY [at] h:mma');
  }
});

const app = new Vue({
	el:'#app',
	data() {
		return {
			activations:[],
			last:0,
			activation:null
		}
	},
	created() {
		console.log('Start up, mofo!');
		this.getActivations();
	},
	methods:{
		getActivations() {
			console.log('getActivations?ts='+this.last);
			fetch('/activations?ts='+this.last)
			.then(res => res.json())
			.then(res => {
				//this.activations = res.activations;
				console.log('num activations='+res.activations.length);
				this.activations.unshift.apply(this.activations, res.activations);
				this.last = res.ts;
				// now call again
				setTimeout(() => {
					this.getActivations();
				}, 2000);
			});

		},
		loadActivation(act) {
			console.log('load '+act.id);
			this.activation = null;
			fetch('/activation/'+act.id)
			.then(res => res.json())
			.then(res => {
				console.log(res);
				this.activation = res;
			});
		}
	}
});
```

Again, this is pretty simple. I've got little data and just a few methods. The only thing I'll call out here is my use of `unshift` to add to the array of activations. The idea, of course, is to add new items to the top of the array. (I think I might be doing that in the wrong order though - anyone care to comment?) In theory this could cause the memory usage of this page to skyrocket. I should add something that caps the list to 200 or so. 

The complete source code for the application may be found here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/activationpoll. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ti8lYuXyJ4Y?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>