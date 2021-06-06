---
layout: post
title: "Migrating from Node and Express to the Jamstack - Part 2"
date: "2020-08-15"
categories: ["serverless","javascript"]
tags: ["eleventy"]
banner_image: /images/banners/migrate.jpg
permalink: /2020/08/15/migrating-from-node-and-express-to-the-jamstack-part-2
description: A look at how you can migrate from Node to the Jamstack - this edition focused on users
---

Welcome to the second part of my series where I look at migrating an "older" style Node/Express web application to the Jamstack and serverless. If you haven't done so yet, please be sure to read [part one](https://www.raymondcamden.com/2020/08/06/migrating-from-node-and-express-to-the-jamstack-part-1) as it goes into detail the kind of site I'm building and the design decisions I've made. This part was somewhat difficult to get to and I didn't progress as far as I wanted, but there's a lot of stuff swirling around in my head and if I don't get down on paper, well electronic paper, than I'm afraid I'll forget.

The focus of this particular sprint in development was on user authentication. The site I'm building lets anyone view the content, but you have to be logged in to "purchase" films and leave comments. 

My original plan was to use [Auth0](https://auth0.com/) for user authentication and authorization. My former coworker and all-around smart friend [Bobby Johnson](https://iamnotmyself.com/) built me some excellent sample code that demonstrated Auth0 integration in a "simple" Jamstack application. I say "simple" because many demos seem to assume a SPA application and that's not what I'm building. 

However, I decided to take another look at [Netlify Identity](https://docs.netlify.com/visitor-access/identity/). This is a feature that I've been meaning to dig into for a while now. Every time I had taken a look before it had been a bit overwhelming and not something I could pick up a few minutes. That's not a complaint per se, and the fact that security isn't incredibly simple should be obvious. 

I wanted to give Netlify Identity a fair chance because I'm already committed to using Netlify for the site and because of how it integrated automatically into serverless functions as well. I knew that if I needed to build an end point and require a user be logged in, it would be trivial. I also knew it had various client-side libraries to support the login flow. Auth0 does all of this too, but again, the idea of keeping it all "in house" for a Netlify project was compelling.

Ok, so that's a lot of preamble. I did get things working. I struggled with the docs towards the end. But I got it working. I still have questions, but I think I'm headed in the right direction. Let's start by talking about the high level aspects of whats in the site now.

1) Every page needed a way to login, signup, or logout. In the nav obviously.
2) I wanted to support "regular" and social login.
3) I wanted to know who my users were. Why? Well when a comment is posted, it needs to know who posted it, ditto for film purchases.
4) Eventually (and this isn't done yet) - support posting of comments, support getting comments for a film and show who wrote what, and let people buy films (the ecommerce part)

Let me break down I accomplished the first three parts (maybe two and a half to be honest). First, Identity is a feature you have to enable to use first. This is done in your site settings:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/08/nla1.png" alt="UI for enabling Identity" class="lazyload imgborder imgcenter">
</p>

That's the easy part. Next, you need to provide a way to let users login, signup, and logout. The docs suggest either the [Identity widget](https://github.com/netlify/netlify-identity-widget) or a custom solution with [gotrue-js](https://github.com/netlify/gotrue-js). My initial assumption was that the widget would be 'cute' but probably not customizable for my needs. I decided to try it anyway and I'm glad I did as it worked just fine. 

I began by adding two buttons to my site. I'm using Bootstrap so the classes you see come from that:

```html
<button class="btn btn-success" id="loginBtn">Login or Signup</button>
<button class="btn btn-success d-none" id="logoutBtn">Logout</button>
```

The `d-none` there is a way for Bootstrap to hide the button. Basically I'm assuming the user is not logged in on hitting the site. Alright, now lets look at the JavaScript.

First, you initialize the widget:

```js
netlifyIdentity.init({
	container: '#loginBtn' // defaults to document.body,
});
```

The `container` field links back to the login button. To enable the button to fire the UI, I then used this:

```js
loginBtn.addEventListener('click', () => {
	netlifyIdentity.open();
}, false);
```

Clicking the button opens up this dialog:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/08/nla2.png" alt="Login widget" class="lazyload imgborder imgcenter">
</p>

Notice the social login provider there - Google. Unfortunately, this is the only "regular" social login provider that is supported. By regular I mean I'm ignoring developer-centric ones like GitHub. About two weeks ago I [posted](https://community.netlify.com/t/add-additional-social-logon-providers/20125) a request on the Netlify forums asking for more support, specifically Twitter and Facebook. I got a response that said such support would have to come from the [gotrue](https://github.com/netlify/gotrue) project. So I went to the project and discovered that a [pull request](https://github.com/netlify/gotrue/pull/111) from almost two years ago added Facebook support. The PR says that there's a ToDo for Netlify Identity to work with the provider which implies the impetus is on Netlify to add it. Unfortunately I haven't gotten a response yet on the forum thread.

The UI nicely handles logging in and signup, with email confirmation built in. In the code I can respond to login like so:

```js
netlifyIdentity.on('login', user => {
	console.log('login', user);
	loginBtn.classList.add('d-none');
	logoutBtn.classList.remove('d-none');
});
```

Logout works pretty much the same, here's the click event and handler:

```js
logoutBtn.addEventListener('click', () => {
	netlifyIdentity.logout();
}, false);

netlifyIdentity.on('logout', () => {
	console.log('Logged out')
	logoutBtn.classList.add('d-none');
	loginBtn.classList.remove('d-none');
});

```

And that's pretty much it for the login/logout functionality on the client-side. Here's where things got a bit more tricky.

In the original Node/Express application, whenever you login I check to see if you are a 'known' user in my Mongo collection and if not, add you. I started to investigate how that would work here. I mean, the actual code itself to work with Mongo woul be easy, but specifically the "recognize the login on the server" part. 

So - the cool thing I discovered was that Netlify has [serverless events](https://docs.netlify.com/visitor-access/identity/registration-login/#trigger-serverless-functions-on-identity-events) tied to login. Basically "if you name a function X, I'll run it for you" type stuff, like they have for form submissions and deploy events. There's three events:

<blockquote>
<ul>
<li>identity-validate: Triggered when an Identity user tries to sign up via Identity.</li>
<li>identity-signup: Triggered when an Identity user signs up via Netlify Identity. (Note: this fires for only email+password signups, not for signups via external providers e.g. Google/GitHub)</li>
<li>identity-login: Triggered when an Identity user logs in via Netlify Identity.</li>
</ul>
</blockquote>

So there's a few things to chew on here. First, validate versus signup isn't terribly clear. I [posted](https://community.netlify.com/t/questions-about-netlify-identity-serverless-functions/20755/5) on the forum about this and got an incredible amount of help from another community member, [Jon Sullivan](https://jon.fm/). Based on his research, what we figured out is that validate is called when a user signs up, but before they've confirmed via email. Given that signup doesn't work for social login, my thought was to use validate. 

In theory it would mean I'd log a new user before they confirmed, but I was ok with that. However, in my testing, social signups did *not* fire this serverless event. A regular signup would.

In talking with Jon, the best we could gather is that sign the user was already signed up at Google, and already logged in, these events wouldn't fire with Netlify. (To be clear, this is what he figured out via other posts and such. I have not gotten a response from Netlify on the post.) I can see that thinking, but I disagree. Yes, I am a signed up user with Google. But I am *not* a user on the site. In fact, Netlify lets you view users, and it shows my name after I sign up via Google. So *something* on the Netlify recognizes that I just signed up via a social platform. Therefore, the serverless functions *should* fire.

Alright, now for the fun part, and by fun, I mean really frustrating. I was talking about my issues on a Slack group and a Netlify developer, Gerald Onyango, asked: "are you using a named function or a webhook". My response was - um - what webhooks?

Guess what?

If you go to your site settings, Identiy, settings again, and scroll down, you find this section:

<p>
<img data-src="https://static.raymondcamden.com/images/2020/08/nla3.png" alt="Oh yeah, those webhooks" class="lazyload imgborder imgcenter">
</p>

As you can see, there's webhook settings for Identity that correspond to the three events. And here's the fun part. They work for social login. I shared this all on the forum post but it looks like two serious bugs. One, the serverless function isn't working the same as the webhook, and two, the docs don't mention these webhooks anywhere. (Oh, and like every other serverless event the 'shape' of the data isn't documented, and that's known now for a few years. I did discover something interesting there that I'll share at the end of the post.) 

Ok, so at this point, I could go ahead and write my logic of "here is a user, see if she is new, and if so, store her in Mongo". But in talking with Jon more, he pointed out that you can use API calls to work with user data. It's complex so I'd suggest checking out the [post](https://community.netlify.com/t/questions-about-netlify-identity-serverless-functions/20755/5), but basically in my (eventual) serverless function to get comments and get names of each user, I could combine a Mongo call (for the comment data) with calls to the Netlify API to get user information. As discussed in the thread, I could also just store user names and such in my comments and have some duplication of data too. As Jon suggested, I could notice if a name is changed and then update the data then.

That's where I am now. My next sprint will be to add the "addComment" function and I'll decide then if I store just a user foreign key or if I do that *and* contextual data about the user.

You can find the repository for this project here - <https://github.com/cfjedimaster/eleventy-auth0-serverless-mongo>. Note that I should probably consider renaming it since I'm not using Auth0 anymore, but I'm not too concerned about it. You can also demo it live here: <https://hardcore-curie-802f8f.netlify.app/>. Please do and let me know how it works for you.

All in all... this is a damn good feature hindred a bit by docs that could use even just a bit of clarification. I feel confident I made the right decision using this instead of Auth0 and I'm looking forward to the next part.

p.s. Ok, this is technically off topic for the post but it really merits a quick mention. As I mentioned above, the data that gets passed to the serverless functions isn't documented. I have feelings about this but whatever. Randomly I discovered something interesting in the CLI. If you run `ntl functions --help`, you see this gem:

	functions:invoke  Trigger a function while in netlify dev with simulated data, good for testing function calls including Netlify's Event Triggered Functions

Holy smokes! That's awesome. One of the things `ntl dev` can't do is simular those events. I've had to test these in production and it's a bit of a pain. I'll use console.log, have a tab open to my Netlify app's function page, reload, and so forth. This looks like the perfect solution. If you run the help command on this feature, you see a lot of cool stuff. You can specify a function (if you don't, the CLI knows your function list and will prompt you). You can specify a payload of data. Even better, you can simulate sending authentication information. I haven't written my serverless functions yet but this sounds perfect. I tested with the serverless function for login and saw that it sent mock data. Woot! 

Unfortunately, identity is the only feature you can mock. If you try to mock a form submission for example, nothing is sent. If you check out the [source](https://github.com/netlify/cli/blob/908f285fb80f04bf2635da73381c94387b9c8b0d/src/commands/functions/invoke.js) for this feature you can see it written up like so:

```js
body.payload = {
	TODO: 'mock up payload data better',
}
body.site = {
	TODO: 'mock up site data better',
}
```

This is something I'd be happy to file a PR on... as soon as Netlify officially documents the shape of the data however. 

That being said, this is rather cool. And not just for serverless events, but regular serverless functions too. I'll leave one more tip as it confused me. I noticed that when I ran this CLI feature, I only got the result back, not any `console.log` messages. Stupid me - the messages were simply in my other terminal tab where I was running `ntl dev`. 

Anyway, I hope this two thousand plus set of words are helpful!