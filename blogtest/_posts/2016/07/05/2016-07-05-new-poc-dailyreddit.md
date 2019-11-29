---
layout: post
title: "New POC - DailyReddit"
date: "2016-07-05T11:31:00-07:00"
categories: [development,javascript]
tags: [nodejs]
banner_image: /images/banners/poc-dr1.jpg
permalink: /2016/07/05/new-poc-dailyreddit
---

For the past few weeks (mainly due to travel) I've been working on a little POC (proof of concept) for an application that most people will probably think doesn't make sense. I'm still somewhat of a new [Reddit](https://www.reddit.com) user. I'm not really an active participant either. I've got some subreddits I check almost daily, some a bit less, and I'll maybe do 3-4 posts per month. Maybe. I found myself doing the same thing whenever I wanted to check the site.

I'll load a subreddit. Click on new. And then scan for interesting titles. Then I go to the next subreddit I care about. Of the 20 or so I've subscribed too, I'll probably 3-4 every day. I found this process to be... annoying. 

First - I don't like the fact that I can't get Reddit to default to "new" versus "hot". Frankly, I don't necessarily care what's hot - I care about what's new. 

Second - I know that the home page would let me view new items all at once, but it also mixes up all my subreddits in one big mess, and I don't like that either. 

And yes - I know I'm being a bit picky here, but it occurred to me - hey - if Reddit has an API, couldn't I build something that does what I want it to? 

![Yes!](https://static.raymondcamden.com/images/2016/07/wecandoitbaby.jpg )

So for my POC, I decided on the following features:

* Social login via Passport. I [blogged](https://www.raymondcamden.com/2016/06/23/some-quick-tips-for-passport/) about my first experiments with Passport a few days ago and it was directly related to this app.

* Once logged in, allow the user to search for subreddits via the Reddit API. Note - I could let the user authenticate with Reddit directly and then get their subscribed subreddits, but as I said above, even though I'm subscribed to a set of subreddits, I only really care about a subset of them. 

* Allow the user to remove a subreddit from their subscription.

* And then every day, we get all the users, get their subscriptions, get the latest content, and then email them a nice report. 

So with that out of the way, let me talk about how I did it. All of this code is in my GitHub repo: [https://github.com/cfjedimaster/dailyreddit](https://github.com/cfjedimaster/dailyreddit)

Persistence
---

Since it's the simplest aspect of the app, I'll cover it first. I decided to go with MongoDB for persistence and [Mongoose](http://mongoosejs.com/) to wrap the calls. I built a User model that consists of an ID, email, and array of subscriptions.

<pre><code class="language-javascript">
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	id:String,
	email:String,
	subscriptions:[String]
});

var User = mongoose.model('User', userSchema);
module.exports = User;
</code></pre>

And that's pretty much. In a bit you'll see where I store the user and how I fetch it, but in general, I'm not doing anything at all fancy with my persistence. 

Login and Authentication
---

I've already mentioned that login was done via [Passport](http://passportjs.org/) and in general, it was pretty easy to do. I decided on supporting Facebook and Twitter so I had to create applications for both and then configure my Node code to make use of them. Facebook was *slightly* more difficult in that I had to specifically ask to get the email field, but it took about sixty more seconds to figure that part out. Here's the code block related to Passport.

<pre><code class="language-javascript">
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

/*
This function is used to create/update a user based on their profile. From
what I can see, both Twitter and FB return the same 'form' so we can abstract it.
*/
function storeUser(profile,cb) {
	//make a user ob based on profile
	//id is provider+id
	var newUser = {
		id:profile.provider + '-' + profile.id
	}
	if(profile.emails && profile.emails.length) {
		newUser.email = profile.emails[0].value;
	}

	User.update(
		{% raw %}{id:newUser.id}{% endraw %},
		newUser, {% raw %}{upsert:true}{% endraw %}, function(err, user) {
		if(err) return cb(err);
		if(user) return cb(null, newUser.id);			
	});
}

passport.use(new TwitterStrategy({
	consumerKey:credentials.twitter.consumerKey,
	consumerSecret:credentials.twitter.consumerSecret,
	callbackURL:'http://localhost:3000/auth/twitter/callback'
},function(token, tokenSecret, profile, done) {
	storeUser(profile,done);
}));

passport.use(new FacebookStrategy({
	clientID:credentials.facebook.clientID,
	clientSecret:credentials.facebook.clientSecret,
	callbackURL:'http://localhost:3000/auth/facebook/callback',
	profileFields:['id','email']
},function(token,refreshToken,profile,done) {
	storeUser(profile,done);
}));

passport.serializeUser(function(id, cb) {
	cb(null, id);
});

passport.deserializeUser(function(id, cb) {
	console.log('deserialize being called', id);
	User.findOne({% raw %}{id:id}{% endraw %}, function(err, user) {
		cb(null,user);
	});
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/dashboard',
                                     failureRedirect: '/' }));

app.get('/auth/facebook', passport.authenticate('facebook', {% raw %}{scope:['email']}{% endraw %}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/dashboard',
                                     failureRedirect: '/' }));
</code></pre>

I don't know if it "just happened" or if Passport goes out of it's way to make it easier, but the profile returned by both Twitter and Facebook followed the same form allowing me to easily handle the login part. Notice that I create a unique ID based on both the ID from the remote social network and the name of the social network as well. Because - who knows - maybe a person could have the same Twitter primary key as your Facebook ID. 

Reddit API
---

To work with the Reddit API, I used the [snoowrap](https://www.npmjs.com/package/snoowrap) library. It was a bit awkward to use at times - just because I had a bit of trouble understanding the docs at times, but when I reached out to the author they responded really darn quickly which was great support. I'm only doing two things with the Reddit API (search subreddits and get the latest posts for a subreddit) so my helper module is pretty small.

<pre><code class="language-javascript">
var credentials = require('./credentials.json');
var snoowrap = require('snoowrap');

var Reddit = function(client_id,client_secret,refresh_token) {
	this.config = {
		client_id:client_id,
		client_secret:client_secret,
		refresh_token:refresh_token
	};

	this.snoowrapper = new snoowrap({
		user_agent:'dailyreddit',
		client_id:client_id,
		client_secret:client_secret,
		refresh_token:refresh_token
	});

	return this;
}

Reddit.prototype.getNew = function(sub) {
	console.log('called new with '+sub);

	return new Promise((resolve,reject) =&gt; {
		this.snoowrapper.get_subreddit(sub).get_new().then(function(res) {
			resolve(res);
		});
	});
}

Reddit.prototype.searchSubreddits = function(str) {
	console.log('called search with '+str);

	return new Promise((resolve,reject) =&gt;  {
		this.snoowrapper.search_subreddit_names({% raw %}{query:str}{% endraw %}).then(function(results) {
			resolve(results);
		});
	});
	
};

module.exports = Reddit;
</code></pre>

That's pretty much it for the Reddit aspect. 

Sending Email
---

For email, I decided on [MailGun](https://mailgun.com/) as it had a free tier that was incredibly generous. I had a lot of trouble actually trying to use it via Node though. [Nodemailer](http://nodemailer.com/) seemed really nice, but I couldn't get it to authenticate with MailGun. I ended up using a package called mailgun-js and it "just worked". Here is an example of it in action.

<pre><code class="language-javascript">
var mailgun = new Mailgun({% raw %}{apiKey: credentials.mailgun.apikey, domain: credentials.mailgun.domain}{% endraw %});

app.render('email', {% raw %}{subs:subs}{% endraw %}, function(err, html) {

	var message = {	
		from: 'postmaster@raymondcamden.mailgun.org',
		to: u.email,
		subject: 'Daily Reddit Email', 
		html: html
	};	

	mailgun.messages().send(message, function (err, body) {
		//If there is an error, render the error page
		if (err) {
			console.log("got an error: ", err);
		}
		else {
			console.log(body);
		}
	});

});
</code></pre>

MailGun supports both HTML and plain text emails, but I decided on just using HTML email for now. Speaking of...

The Email
---

For the email itself, I had some basic requirements:

* For each post, I wanted both the "external" URL and the reddit URL. Not every post has both, but I wanted a clear distinction between them both. This lets me decide if I want to go to the main link or go look at the comments.
* And for each post I wanted to know how many comments there were.
* Where it made sense, I wanted to provide a thumbnail preview. This is great for posts that link to images.
* For posts with text, I wanted to include the text as well.

So with those basic rules in place, I began building a template to handle my report. Since it's HTML email and HTML email is pretty much the HTML you had in 1992, I used a bunch of inline styles and super simple layout:

<pre><code class="language-javascript">
&lt;h1&gt;Daily Reddit Report&lt;/h1&gt;

&lt;p&gt;Here are the most recent updates for your subscribed subreddits:&lt;/p&gt;

{% raw %}{{#each subs}}{% endraw %}
	&lt;h2&gt;{% raw %}{{name}}{% endraw %}&lt;/h2&gt;

	{% raw %}{{#each posts}}{% endraw %}
	&lt;p style=&quot;margin-bottom:30px&quot;&gt;
	{% raw %}{{#if thumbnail}}{% endraw %}
	&lt;img src=&quot;{% raw %}{{thumbnail}}{% endraw %}&quot; align=&quot;left&quot; style=&quot;margin-right:10px&quot;&gt;
	{% raw %}{{/if}}{% endraw %}
	&lt;b&gt;Title:&lt;/b&gt; {% raw %}{{title}}{% endraw %}&lt;br/&gt;
	&lt;b&gt;URL:&lt;/b&gt; &lt;a href=&quot;{% raw %}{{url}}{% endraw %}&quot;&gt;{% raw %}{{url}}{% endraw %}&lt;/a&gt;&lt;br/&gt;
	&lt;b&gt;Reddit URL:&lt;/b&gt; &lt;a href=&quot;https://www.reddit.com{% raw %}{{permalink}}{% endraw %}&quot;&gt;https://www.reddit.com{% raw %}{{permalink}}{% endraw %}&lt;/a&gt; ({% raw %}{{ num_comments}}{% endraw %} comments)&lt;br/&gt;
	&lt;b&gt;Author:&lt;/b&gt; {% raw %}{{ author.name }}{% endraw %}&lt;br/&gt;
	&lt;br clear=&quot;left&quot;&gt;
	{% raw %}{{#if is_self}}{% endraw %}
	{% raw %}{{left selftext}}{% endraw %}
	{% raw %}{{/if}}{% endraw %}
	&lt;/p&gt;	
	{% raw %}{{/each}}{% endraw %}

	&lt;hr/&gt;

{% raw %}{{/each}}{% endraw %}
</code></pre>

And here is it renders. It isn't great, but it gives you an idea of what I'm going for:

<img src="https://static.raymondcamden.com/images/2016/07/dr1.jpg" class="imgborder" alt="Shot">

The code to handle subscriptions is a bit large, but not terribly so. Here it is:

<pre><code class="language-javascript">
function doSubscriptions() {
	console.log('doing subscriptions');

	//get the time 24 hours ago
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	//reddit uses seconds, not ms
	var yesterdayEpoch = yesterday.getTime()/1000;

	var mailgun = new Mailgun({% raw %}{apiKey: credentials.mailgun.apikey, domain: credentials.mailgun.domain}{% endraw %});

	User.find({}, function(err,users) {
		console.log('i have '+users.length+' users');
		users.forEach(function(u) {
			console.log('processing '+u.id+' = '+u.subscriptions);
			var promises = [];
			if(u.subscriptions.length === 0) {
				console.log('skipping users, no subs');
				return;
			}

			u.subscriptions.forEach(function(sub) {
				promises.push(reddit.getNew(sub));
			});
			Promise.all(promises).then(function(results) {
				console.log('all done getting everything ')
				/*
				new global ob to simplify view a bit
				*/
				var subs = [];
				for(var i=0;i&lt;results.length;i++) {
					var posts = results[i].map(function(p) {						
						if(p.thumbnail === 'self' {% raw %}|| p.thumbnail === 'default' |{% endraw %}| p.thumbnail === 'nsfw') delete p.thumbnail;
						return p;
					});

					subs.push({
						name:u.subscriptions[i],
						posts:posts
					});
				}

				app.render('email', {% raw %}{subs:subs}{% endraw %}, function(err, html) {

					var message = {	
						from: 'postmaster@raymondcamden.mailgun.org',
						to: u.email,
						subject: 'Daily Reddit Email', 
						html: html
					};	

					mailgun.messages().send(message, function (err, body) {
						//If there is an error, render the error page
						if (err) {
							console.log("got an error: ", err);
						}
						else {
							console.log(body);
						}
					});

				});

				
			}).catch(function(e) {
				console.log('EEERRRRooooRR',e);
			});
		});
	});
}
</code></pre>

As you can see, I do a bit of massaging on the data returned by the Reddit API and a bit of filtering to ensure that new stuff is really new from the past twenty four hours. Outside of that - I just render the email and send it off. 

The Front End
---

Yeah, so the front end is so minimal I actually forgot to write it up when I first published this blog entry a few minutes ago. I went with Bootstrap for a quick and dirty clean UI. The login is just two buttons:

<img src="https://static.raymondcamden.com/images/2016/07/dr2.jpg" class="imgborder" alt="Shot">

One thing I didn't built but would *definitely* include if I was going live with this would be to include a cookie (or LocalStorage item) that remembers which social network you used the last time you logged in to a site. I don't know *any* site doing that and I wish they would start. I try to use Google auth as much as possible but I'm not terribly consistent with it.

Once you login, I simply show you your current subscriptions and provide a form to search for more. It isn't obvious, but if you mouseover your subscriptions I use a tooltip to tell you that you can click to remove.

<img src="https://static.raymondcamden.com/images/2016/07/dr3.jpg" class="imgborder" alt="Shot">

And here is an example of the search in action - clicking a subreddit will add it to your subscriptions:

<img src="https://static.raymondcamden.com/images/2016/07/dr4.jpg" class="imgborder" alt="Shot">

And that's it. No logout or anything else. I think it would be nice to maybe provide a 'Show me the current new right now' type link.


What's Next?
---

So yeah - where exactly is this? Am I actually using it? I can host it for free up on IBM Bluemix, but while we support MongoDB persistence, I don't have a free account with our service provider. So to actually move it to production I'd need to host someplace and pay money for it, or change to Cloudant or some other system. As my persistence stuff is incredibly simple, this should be easy enough to do, but frankly, I'm happy I built it, I learned some stuff, and I'm fine with it staying on my local machine as a POC.