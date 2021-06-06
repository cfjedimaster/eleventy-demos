---
layout: post
title: "Migrating from Node and Express to the Jamstack - Part 3"
date: "2020-08-16"
categories: ["serverless","javascript"]
tags: ["eleventy"]
banner_image: /images/banners/migrate.jpg
permalink: /2020/08/16/migrating-from-node-and-express-to-the-jamstack-part-3
description: 
---

Ok, so I know I just posted [part two](https://www.raymondcamden.com/2020/08/15/migrating-from-node-and-express-to-the-jamstack-part-2) yesterday (and don't forget to check out [part one](https://www.raymondcamden.com/2020/08/06/migrating-from-node-and-express-to-the-jamstack-part-1)) but I was feeling inspired this morning so I made a bit more progress. Also, I forgot something I wanted to cover in yesterday's post and I didn't want more time to pass without me talking about. Let's get started!

### Recognizing Login State

In yesterday's post I described how to add the login and logut functionality to the Jamstack. What I forgot to mention was how I'd recognize your current login state on page load. Inside the same method I wrote that fires on `DOMContentLoaded` and initializes `netlifyIndentity`, I have this block:

```js
user = netlifyIdentity.currentUser();

if(user) {
	loginBtn.classList.add('d-none');
	logoutBtn.classList.remove('d-none');
}
```

Basically, if there's a current user, hide the login button and reveal the logout button. What does `user` look like?

```js
{
	"api": {
		"apiURL": "/.netlify/identity",
		"_sameOrigin": true,
		"defaultHeaders": {
			"X-Use-Cookie": "1"
		}
	},
	"url": "/.netlify/identity",
	"token": {
		"access_token": "long token here",
		"expires_in": "3600",
		"refresh_token": "short token here",
		"token_type": "bearer",
		"expires_at": 1597606688000
	},
	"id": "1f4331df-61e3-4cd8-a1ee-46d57b6d97ca",
	"aud": "",
	"role": "",
	"email": "raymondcamden@gmail.com",
	"confirmed_at": "2020-08-14T14:30:44Z",
	"app_metadata": {
		"provider": "google"
	},
	"user_metadata": {
		"avatar_url": "https://lh3.googleusercontent.com/a-/AOh14GiKTiig0ZyRUyhy6GGRJU5-Q2ubQmOPJWSUSueGiTQ",
		"full_name": "Raymond Camden"
	},
	"created_at": "2020-08-14T14:30:43Z",
	"updated_at": "2020-08-14T14:30:43Z",
	"_fromStorage": true
}
```

Notice the `_fromStorage` bit? You can see this information stored in LocalStorage if you open up your devtools. 

This works really well, but you may notice a "flicker" in the UI of the login button switching to the logout one. I think it would be better to hide both buttons and only enable the proper one. My demo site definitely has some less than optimal design choices but as it's not really my focus for this series, I'm ok with it. Just keep in mind that the fault is mine, not Netlify's. 

### Secured Serverless Functions

The first new feature in this series is the addition of a serverless function to post comments. Netlify does a good job of documenting this here: [Functions and Identity](https://docs.netlify.com/functions/functions-and-identity). I designed a serverless function that would accept two paremeters - the ID of the film being commented on and the comment text. I didn't pass the user information as Netlify provides that for me.

```js
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL;

exports.handler = async (event, context) => {

  const {identity, user} = context.clientContext;

  if(!user) {
    return {
      statusCode: 500,
      body:'Unauthenticated call to function.'
    }
  };

  const comment = JSON.parse(event.body);

  try {

  	const client = new MongoClient(url, { useUnifiedTopology: true });
  	await client.connect();
  	const db = client.db('eleventy_demo');
  	const comments = db.collection('comments');

    let commentOb = {
      text: comment.text, 
      film: comment.film, 
      user: {
        email: user.email, 
        name: user.user_metadata.full_name
      },
      posted: new Date()
    }

    let r = await comments.insertOne(commentOb);
    await client.close();

    return {
      statusCode: 204
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
```

I pretty much just used the sample code they provided and then added the Mongo code to record a new comment. If you remember in the last post I had some concern about how I was going to "connect" users to comments. I took an easy route out. I have access to the email and name of the user and just stored it in the comment. In theory, a user associated with an email address may change their name, but I figure that's unlikely. I could handle that in a "user profile system" if I wanted to build one and handle updating related content then. 

The function to get comments doesn't require security and is much simpler:

```js
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL;


exports.handler = async (event, context) => {
  let film = event.queryStringParameters.film;
  if(!film) {
    return {
      statusCode: 500,
      body:'Missing film id'
    }
  }

  try {

    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db('eleventy_demo');
    const comments = db.collection('comments');

    const query = { "film": film };
    const commentArray = await comments.find(query).sort({posted:1}).toArray();

    await client.close();
    return {
      statusCode: 200,
      body: JSON.stringify(commentArray)
    };


  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
```

This is the back end work - the front end work is mainly a bunch of messy JavaScript. I didn't use Vue.js for this project as I wanted to keep things simple with so many moving parts already. Each film page now renders comments and includes a form for adding a new one.

<p>
<img data-src="https://static.raymondcamden.com/images/2020/08/nla10.png" alt="Film page" class="lazyload imgborder imgcenter">
</p>

Instead of sharing my ugly code, I'll just say that I added a form to the films page and if you are logged in, you can submit it. I've got some UI manipulation I'll skip for now, but here's how I call my serverless function in a secure manner:

```js
let resp = await fetch('/.netlify/functions/postComment', {
	method:'post',
	headers: {
		'Authorization':'Bearer ' + user.token.access_token
	},
	body: JSON.stringify(commentOb)
});
```

Basically I just use an `access_token` value from the user in my header. You can see the complete front end (and all the source code) over on the repo: <https://github.com/cfjedimaster/eleventy-auth0-serverless-mongo>. Again though keep in mind that the JavaScript isn't the most optimized, clean version. 

You can, if you wish, actually test this. I'm probably going to regret it, but it's live up on <https://hardcore-curie-802f8f.netlify.app/>. Hit the site, login, and post a comment. Please don't curse or spam. I can clean them up with my MongoDB client but I'd rather not have to. ;)