---
layout: post
title: "Some quick tips for Passport"
date: "2016-06-23T08:18:00-07:00"
categories: [development,javascript]
tags: [nodejs]
banner_image: 
permalink: /2016/06/23/some-quick-tips-for-passport
---

Yesterday I decided to take a look at [Passport](http://passportjs.org/), an open source library for Node.js focused on authentication. LoopBack supports Passport too, but when I first looked at it, I realized that I knew nothing about Passport itself and it would make sense to try it by itself before I try wrapping it with LoopBack.

<!--more-->

At a high level, Passport lets you abstract away some of the details of authentication in your application. It has plugins which allow you to easily add in support for Twitter, Facebook, or Google authentication. (Passport calls these "Strategies", and there are over three hundred of them!) 

When I began trying to test Passport, my first question was whether they had some form of simple authentication not tied to an external provider. They did - which is cool - but I really struggled with trying to figure out how to use it. To be fair, everything that confused me *was* documented. I just couldn't figure it out as is. So what follows are simply a few notes on things that didn't make sense to me. 

Local Authentication
---
As I said - I assumed (hoped!) that Passport would have a 'simple' authentication that I could use while prototyping my app. That way I could build stuff and then drop in Twitter/Facebook/etc later. Turns out I was right - they did support this, and they call it the LocalStrategy. However, the code example was confusing to me. The [docs](http://passportjs.org/docs/configure) show it as such:

<pre><code class="language-javascript">
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({% raw %}{ username: username }{% endraw %}, function (err, user) {
      if (err) {% raw %}{ return done(err); }{% endraw %}
      if (!user) {
        return done(null, false, {% raw %}{ message: 'Incorrect username.' }{% endraw %});
      }
      if (!user.validPassword(password)) {
        return done(null, false, {% raw %}{ message: 'Incorrect password.' }{% endraw %});
      }
      return done(null, user);
    });
  }
));
</code></pre>

Looking at this, I thought, "Hmm, that looks like Mongo a bit, but they never mentioned using Mongo, so does Passport support a User object?" And I kid you not - I was stuck here for a good hour or so. Turns out, it *is* Mongo code, and maybe they assume all Node users know Mongo and are familiar with the API, but I wish they had actually said that in the example. Even the `validPassword` code is weird to me. All in all, it feels like a "real" code sample, and I appreciate that, but without more context it also feels unnecessarily complex. As a blogger, I definitely understand the problem you face when writing docs. You want something useful, something real world, but you also want something the reader can properly grok. 

Another thing not spelled out well (or not to me anyway) was the fact that the object you return in the callback can be, as far as I know, *anything* that represents the user. Basically, you decide what represents the "User object". 

Here is how I got my 'fake' login working:

<pre><code class="language-javascript">
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
	function(username, password, done) {

		//any username, password=admin
		if(password === 'admin') {
			return done(null, {% raw %}{id:1,name:username}{% endraw %});
		} else {
			return done(null, false);
		}
	}
));
</code></pre>

I'm not necessarily saying my code is any better, I just wanted to get it working, but hopefully you get the idea. I can no login with any username and a password of admin. Note the "object" I return is completely arbitrary. 

Session storage
---

Passport also supports storing the user information in the session if your app supports it. This is done by a custom serializer/deserializer. Here is what I used:

<pre><code class="language-javascript">
passport.serializeUser(function(user, cb) {
	cb(null, JSON.stringify(user));
});

passport.deserializeUser(function(packet, cb) {
	cb(null,JSON.parse(packet));
});
</code></pre> 

In this case, the Mongo code (which again, isn't called out as Mongo) is a bit more clearer:

<pre><code class="language-javascript">
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
</code></pre>

In this case, they store just the ID and then load it from the database when deserializing. As far as I can tell, this will run on every request when you've logged in.

Am I Logged In?
---

This too is documented but wasn't clear to me at first. Given a route with a req/res pair of arguments, req.user will exists if the current user is logged in. So here is a simple example where I wrote some middleware to see if logged in and then push to the login page otherwise.

<pre><code class="language-javascript">
app.get('/', function(req, res) {
	console.log(req.user);
	res.render('index',{% raw %}{message:req.flash('error')}{% endraw %});
});

app.post('/login', passport.authenticate('local', 
	{
		failureRedirect:'/',
		failureFlash:'Login failed'
	}), function(req, res) {
	console.log('user',req.user);
	res.redirect('/dashboard');
});

function requireLogin(req,res,next) {
	if(!req.user) return res.redirect('/');
	next();
}

app.get('/dashboard', requireLogin, function(req, res) {
	res.render('dashboard',{% raw %}{user:req.user}{% endraw %});
});
</code></pre>

Flash messages
---

Ok, I know most people know that "Flash messages" are simply temporary messages stored in a session, but I always think of Adobe Flash first. Anyway, Passport supports using Flash messages as a way of passing along a message to the user that their authentication passed or failed. This is documented, but I ran into an issue. Flash messages are stored via a key, but the docs don't tell you the name of the key to use to fetch the message. All it says is:

"Setting the `failureFlash` option to `true` instructs Passport to flash an `error` message using the message option set by the verify callback above."

Notice how `error` is in a different font? That's the clue - you fetch the message by using `req.flash('error')`. Again - I guess it may be obvious, but this took me a while to get right as well.

More to come
---

I hope this helps folks. Again, check the [docs](http://passportjs.org/docs/overview) for more info, and as I play with this more I'll share anything else that trips me up!