---
layout: post
title: "Using Social Login with Passport and Node"
date: "2017-02-08T11:29:00-07:00"
categories: [javascript]
tags: [nodejs]
banner_image: /images/banners/node_passport_social.jpg
permalink: /2017/02/08/using-social-login-with-passport-and-node
---

I've blogged before about Passport (["Some Quick Tips for Passport"](https://www.raymondcamden.com/2016/06/23/some-quick-tips-for-passport)) as well
as an example of social login with Passport (["New POC - Daily Reddit"](https://www.raymondcamden.com/2016/07/05/new-poc-dailyreddit)), but I thought it would be
nice to share an example focused *just* on using social login with [Passport](http://passportjs.org/). As I discovered when
I first worked with Passport, it makes things really easy, but it can be *incredibly* difficult sometimes to find the right part
of the docs to figure out particular usage needs. 

For me, the biggest thing that helped me was realizing I could *not* rely on the documentation at the main Passport site. To be clear, it
isn't bad. It's just incomplete. Going to the repository for the strategies I was using it was helped me get my code working
and I strongly recommend developers do the same. In case you don't know, when you click on "Strategies" on the Passport site, each
strategy listed links to the appropriate repository for more information. 

In this blog post, I'll try my best to document *everything* in the hopes that folks reading this later can bypass the issues I ran into. I'm also going
to share screenshots from the social providers I'm using. Please remember that the UI for these services may change after I've published. I ran into
that problem when using [social login with Ionic](https://www.raymondcamden.com/2016/11/17/a-social-example-of-ionic-auth) a few months back.

Alright, so with that out of the way, let me begin by clearly documenting what I'm building here:

* I've got a Node app where a person can login via Facebook or Twitter.
* When they login, I want to grab their email address.
* I want to store a user record locally, using Mongo, that matches that email address.

Pretty simple, right? Let's begin by looking at the basic shell of the app, without any login support. As I said, I'm using Mongo for my persistence, and I've decided to use [Mongoose](http://mongoosejs.com/) as well.

<pre><code class="language-javascript">
var express = require(&#x27;express&#x27;);
var exphbs = require(&#x27;express-handlebars&#x27;);

var user = require(&#x27;.&#x2F;models&#x2F;user&#x27;);

var credentials = require(&#x27;.&#x2F;credentials.json&#x27;);


var app = express();
app.use(require(&#x27;cookie-parser&#x27;)(credentials.cookieSecret));
app.use(require(&#x27;express-session&#x27;)({
	resave:false,
	saveUninitialized:false,
	secret:credentials.cookieSecret
}));


app.engine(&#x27;handlebars&#x27;, exphbs({
	defaultLayout:&#x27;main&#x27;
}));
app.set(&#x27;view engine&#x27;, &#x27;handlebars&#x27;);

var mongoose = require(&#x27;mongoose&#x27;);
var opts = {
	server: {
		socketOptions: {% raw %}{ keepAlive: 1 }{% endraw %}
	}
};

switch(app.get(&#x27;env&#x27;)) {
	case &#x27;development&#x27;:
		mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	case &#x27;production&#x27;:
		mongoose.connect(credentials.mongo.production.connectionString, opts);
		break;
	default:
		throw new error(&#x27;Unknown execution environment: &#x27;, app.get(&#x27;env&#x27;));
}

app.set(&#x27;port&#x27;, process.env.PORT || 3000);
app.use(express.static(__dirname + &#x27;&#x2F;public&#x27;));

function isLoggedIn(req, res, next) {
	req.loggedIn = !!req.user;
	next();
}

app.get(&#x27;&#x2F;&#x27;, isLoggedIn, function(req, res) {
	res.render(&#x27;index&#x27;, {
		title:&#x27;Welcome to X&#x27;,
		loggedIn:req.loggedIn
	});
});

app.get(&#x27;&#x2F;login&#x27;, isLoggedIn, function(req, res) {
	if(req.loggedIn) res.redirect(&#x27;&#x2F;&#x27;);
	console.log(req.loggedIn);
	res.render(&#x27;login&#x27;, {
		title:&#x27;Login&#x2F;Registration&#x27;
	});
});

&#x2F;&#x2F; 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render(&#x27;error&#x27;);
});

app.listen(app.get(&#x27;port&#x27;), function() {
	console.log(&#x27;Express running on http:&#x2F;&#x2F;localhost:&#x27; + app.get(&#x27;port&#x27;));
});
</code></pre>

Nothing too interesting here. You can see me loading up my credentials and connecting to Mongo. I'm also using Handlebars for my templating engine. I'm using sessions to recognize when you're logged in. I built two pages - a home page and a login page. The login page simply provides links to begin authentication with Twitter or Facebook. (In a real app, I'd probably just include that in the header or some such.)

Let's begin by adding support for Facebook. 

Facebook Login
---

Before I do any code, I need to create a Facebook app linked to my project. This will give me the credentials I need and let my application authenticate with them.

Assuming you have a Facebook account, head over to https://developers.facebook.com/. In the upper right hand corner will be a "My Apps" button - click it to add a new app.

![Facebook New App](https://static.raymondcamden.com/images/2017/2/np1a.png)

You'll be prompted for a name and a category. If testing, enter whatever you want. If building something for production, actually enter something that makes sense.

After entering a Captcha, on the next page, click Add Product. Right on top is the product you want - Facebook Login.

![Facebook Login](https://static.raymondcamden.com/images/2017/2/np2.png)

For platform, select WWW:

![Platform](https://static.raymondcamden.com/images/2017/2/np3.png)

You'll then be prompted to enter information about your site. You do *not* have to have a site in production yet. You can absolutely use localhost for your values. For the first prompt, I used http://localhost:3000 as thats what my Express app used. I skipped the rest of the panels, and when done, I clicked the new "Settings" link under the Facebook Login group in the left hand menu.

![Settings](https://static.raymondcamden.com/images/2017/2/np4.png)

On the settings page, there's one important setting here, "Valid OAuth redirect URIs". You need to tell Facebook where a user is allowed to be redirected back to after authorization. Again, you can use localhost for this. I used http://localhost:3000/auth/facebook/callback. Why? That's what I saw in the Passport examples. It's arbitrary. Just remember you'll need to add a production URL later.

![Callback URL](https://static.raymondcamden.com/images/2017/2/np5.png)

Make sure you click Save! Then go to the main Settings link in the left hand nav (towards the top) and you'll see an App ID and App Secret field. Copy these locally. For me, I'm using a JSON file. Here is the file (with Twitter stuff already in, just ignore for now ;)

<pre><code class="language-javascript">
{
	"cookieSecret":"dfkjdlsfjljklsdfj",
	"facebook":{
		"app_id":"theidofallids",
		"app_secret":"astringishere",
		"callback":"http://localhost:3000/auth/facebook/callback"
	},
	"twitter":{
		"consumer_key":"akeyishere",
		"consumer_secret":"mysecretisbetterthanyoursecret",
		"callback":"http://localhost:3000/auth/twitter/callback"
	},
	"mongo":{
		"development":{
			"connectionString":"mongodb://localhost/foo"
		},
		"production":{}
	}
}
</code></pre>

Whew. Ok, so at this point, you've done what's required on the Facebook side. Now let's turn back to the code. You need to install Passport (<code>npm install --save passport</code>) and then the Facebook strategy (<code>npm install --save passport-facebook</code>).

Alright - now let's walk through the code. As an FYI, I'll share the entire app.js when the blog post is done so don't worry if you get a bit lost. First, require in the packages:

<pre><code class="language-javascript">
var passport = require('passport'), 
	FacebookStrategy = require('passport-facebook').Strategy;
</code></pre>

Next, we configure the Facebook strategy. This involves some really important bits, so pay careful attention:

<pre><code class="language-javascript">
passport.use(new FacebookStrategy({
	clientID: credentials.facebook.app_id,
	clientSecret: credentials.facebook.app_secret,
	callbackURL: credentials.facebook.callback,
	profileFields:['id','displayName','emails']
	}, function(accessToken, refreshToken, profile, done) {
		console.log(profile);
		var me = new user({
			email:profile.emails[0].value,
			name:profile.displayName
		});

		/* save if new */
		user.findOne({% raw %}{email:me.email}{% endraw %}, function(err, u) {
			if(!u) {
				me.save(function(err, me) {
					if(err) return done(err);
					done(null,me);
				});
			} else {
				console.log(u);
				done(null, u);
			}
		});
  }
));
</code></pre>

From the top:

First, I provide my various credentials. 

Next, I pass an optional (and not well documented) setting called <code>profileFields</code>. By default, you don't get much of the profile back when logging in. I believe `id` and `displayName` are default, but I definitely needed 
to add `emails`. Remember, my plan is to use email as a primary key for my users.

The profile object is [provided by Passport](http://passportjs.org/docs/profile) and attempts to coalesce profiles from various providers into one set of values. I take values from that profile to create a new user object. I mentioned earlier I was using Mongoose to work with Mongo and it lets you create model objects to help you more easily CRUD your Mongo data. If you're curious, here is that model:

<pre><code class="language-javascript">

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	id:String,
	email:String,
	name:String
});

var User = mongoose.model('User', userSchema);
module.exports = User;
</code></pre>

So we create a new user object and attempt to find a matching user. If we don't have one, we save it. In either case, we call the `done` callback that Passport gave us and pass along the user object.

Just to recap, the code block handles:

* Configuring how Facebook is accessed
* Handling the result

Actually logging in is handled via routes:

<pre><code class="language-javascript">
app.get('/auth/facebook', passport.authenticate('facebook', {% raw %}{scope:"email"}{% endraw %}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', 
{% raw %}{ successRedirect: '/', failureRedirect: '/login' }{% endraw %}));
</code></pre>

These I took right from the docs, and certainly you could modify them. The big crucial part here is `scope` in the authenticate method. Even though I configuring Facebook/Passport to want the email, I have to ask for it specifically when logging in. You must do both!

We're not done. The last part is to handle serializing/deserializing the user object. Basically, we write custom code to tell Passport how to remember our user object and then how to load it back in too. This will depend on your persistence system. Again, the docs don't really make it clear. They use Mongo-like code without  actually telling the reader that they are demonstrating one example of how it would work!

<pre><code class="language-javascript">
passport.serializeUser(function(user, done) {
	console.log(user);
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	user.findById(id, function(err, user) {
		done(err, user);
	});
});
</code></pre>

This code isn't Facebook specific, it's Mongo/Mongoose specific.

And just to be complete, you also need this code to boot up Passport and have it use sessions:

<pre><code class="language-javascript">
app.use(passport.initialize());
app.use(passport.session());
</code></pre>

Hopefully you aren't lost! 

Twitter Login
---

Ok, let's talk Twitter. To begin, go to https://apps.twitter.com and click "Create New App" on the upper right.

![Twitter](https://static.raymondcamden.com/images/2017/2/np6.png)

As before, you don't have to use "real" values here when testing, but Twitter is a bit picky. Description has to be more than 10 characters. The Website field must *not* be localhost, but you can use anything here, even CNN. My callback URL was: http://localhost:3000/auth/twitter/callback. Click the Create button.

Now click the "Settings" tab. You'll see two new URLs here that didn't exist before, "Privacy Policy URL" and "Terms of Service URL". In a moment, we're going to tell Twitter we want to get people's email address when they authenticate. In order to do that, you have to provide URLs here. As before, you can enter test URLs, or heck, CNN again. It doesn't matter.

![Alt text](https://static.raymondcamden.com/images/2017/2/np7a.png)

Be sure to hit the "Update Settings" button. Now click "Keys and Access Tokens" in the tabs and then copy the consumer key and secret. 

![Twitter](https://static.raymondcamden.com/images/2017/2/np7.png)

We're almost done. Twitter, by default, will not let you get the user's email address. Click Permissions and you'll see a checkbox for requesting the user's email address. (And note, while here, you probably want to change Access to "Read only" if you have no plans on writing to the user's followers.)

![Twitter](https://static.raymondcamden.com/images/2017/2/np8.png)

As I said before, don't forget to hit that "Update Settings" button.

And... now we're done. On the Twitter side. Let's go to the code, Batman! First, we add the strategy: `npm install --save passport-twitter`.  Now in our main app file, let's add and configure Twitter:

<pre><code class="language-javascript">
passport.use(new TwitterStrategy({
    consumerKey: credentials.twitter.consumer_key,
    consumerSecret: credentials.twitter.consumer_secret,
    callbackURL: credentials.twitter.callback,
	includeEmail:true
  },
  function(token, tokenSecret, profile, done) {

		var me = new user({
			email:profile.emails[0].value,
			name:profile.displayName
		});

		/* save if new */
		user.findOne({% raw %}{email:me.email}{% endraw %}, function(err, u) {
			if(!u) {
				me.save(function(err, me) {
					if(err) return done(err);
					done(null,me);
				});
			} else {
				console.log(u);
				done(null, u);
			}
		});

  }
));
</code></pre>

You'll notice it is virtually the same. In fact, my callback is 100% the same. I should optimize that by creating a function that I can call from both strategies. To be honest, when I started working with this, I didn't know Passport would do such a good job with the profile. The crucial bit here is `includeEmail:true`. I have no idea where this is documented - I found this in a bug report, but it was one-half the job of letting Twitter know I needed email. Now let's look at the routes:

<pre><code class="language-javascript">
app.get('/auth/twitter', passport.authenticate('twitter', {% raw %}{scope:['include_email=true']}{% endraw %}));
app.get('/auth/twitter/callback', passport.authenticate('twitter', 
  {% raw %}{ successRedirect: '/', failureRedirect: '/login' }{% endraw %}));
</code></pre>

And here you can see the second part - the scope value. Again - maybe this *is* documented, but I was only able to get things running by searching for bugs. A real pain the you know what.

But finally - that's it. I can now login from either network, create a user based on my email, and go to town. Here is the complete app.js for my project.

<pre><code class="language-javascript">
var express = require(&#x27;express&#x27;);
var exphbs = require(&#x27;express-handlebars&#x27;);

var user = require(&#x27;.&#x2F;models&#x2F;user&#x27;);

var credentials = require(&#x27;.&#x2F;credentials.json&#x27;);

var passport = require(&#x27;passport&#x27;), 
	TwitterStrategy = require(&#x27;passport-twitter&#x27;).Strategy,
	FacebookStrategy = require(&#x27;passport-facebook&#x27;).Strategy;

passport.use(new FacebookStrategy({
	clientID: credentials.facebook.app_id,
	clientSecret: credentials.facebook.app_secret,
	callbackURL: credentials.facebook.callback,
	profileFields:[&#x27;id&#x27;,&#x27;displayName&#x27;,&#x27;emails&#x27;]
	}, function(accessToken, refreshToken, profile, done) {
		console.log(profile);
		var me = new user({
			email:profile.emails[0].value,
			name:profile.displayName
		});

		&#x2F;* save if new *&#x2F;
		user.findOne({% raw %}{email:me.email}{% endraw %}, function(err, u) {
			if(!u) {
				me.save(function(err, me) {
					if(err) return done(err);
					done(null,me);
				});
			} else {
				console.log(u);
				done(null, u);
			}
		});
  }
));

passport.use(new TwitterStrategy({
    consumerKey: credentials.twitter.consumer_key,
    consumerSecret: credentials.twitter.consumer_secret,
    callbackURL: credentials.twitter.callback,
	includeEmail:true
  },
  function(token, tokenSecret, profile, done) {

		var me = new user({
			email:profile.emails[0].value,
			name:profile.displayName
		});

		&#x2F;* save if new *&#x2F;
		user.findOne({% raw %}{email:me.email}{% endraw %}, function(err, u) {
			if(!u) {
				me.save(function(err, me) {
					if(err) return done(err);
					done(null,me);
				});
			} else {
				console.log(u);
				done(null, u);
			}
		});

  }
));

passport.serializeUser(function(user, done) {
	console.log(user);
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	user.findById(id, function(err, user) {
		done(err, user);
	});
});

var app = express();
app.use(require(&#x27;cookie-parser&#x27;)(credentials.cookieSecret));
app.use(require(&#x27;express-session&#x27;)({
	resave:false,
	saveUninitialized:false,
	secret:credentials.cookieSecret
}));

app.use(passport.initialize());
app.use(passport.session());

app.engine(&#x27;handlebars&#x27;, exphbs({
	defaultLayout:&#x27;main&#x27;
}));
app.set(&#x27;view engine&#x27;, &#x27;handlebars&#x27;);

var mongoose = require(&#x27;mongoose&#x27;);
var opts = {
	server: {
		socketOptions: {% raw %}{ keepAlive: 1 }{% endraw %}
	}
};

switch(app.get(&#x27;env&#x27;)) {
	case &#x27;development&#x27;:
		mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	case &#x27;production&#x27;:
		mongoose.connect(credentials.mongo.production.connectionString, opts);
		break;
	default:
		throw new error(&#x27;Unknown execution environment: &#x27;, app.get(&#x27;env&#x27;));
}

app.set(&#x27;port&#x27;, process.env.PORT || 3000);
app.use(express.static(__dirname + &#x27;&#x2F;public&#x27;));

function isLoggedIn(req, res, next) {
	req.loggedIn = !!req.user;
	next();
}

app.get(&#x27;&#x2F;&#x27;, isLoggedIn, function(req, res) {
	res.render(&#x27;index&#x27;, {
		title:&#x27;Welcome to Fool&#x27;,
		loggedIn:req.loggedIn
	});
});

app.get(&#x27;&#x2F;auth&#x2F;facebook&#x27;, passport.authenticate(&#x27;facebook&#x27;, {% raw %}{scope:&quot;email&quot;}{% endraw %}));
app.get(&#x27;&#x2F;auth&#x2F;facebook&#x2F;callback&#x27;, passport.authenticate(&#x27;facebook&#x27;, 
{% raw %}{ successRedirect: &#x27;&#x2F;&#x27;, failureRedirect: &#x27;&#x2F;login&#x27; }{% endraw %}));

app.get(&#x27;&#x2F;auth&#x2F;twitter&#x27;, passport.authenticate(&#x27;twitter&#x27;, {% raw %}{scope:[&#x27;include_email=true&#x27;]}{% endraw %}));
app.get(&#x27;&#x2F;auth&#x2F;twitter&#x2F;callback&#x27;, passport.authenticate(&#x27;twitter&#x27;, 
  {% raw %}{ successRedirect: &#x27;&#x2F;&#x27;, failureRedirect: &#x27;&#x2F;login&#x27; }{% endraw %}));

app.get(&#x27;&#x2F;login&#x27;, isLoggedIn, function(req, res) {
	if(req.loggedIn) res.redirect(&#x27;&#x2F;&#x27;);
	console.log(req.loggedIn);
	res.render(&#x27;login&#x27;, {
		title:&#x27;Login&#x2F;Registration&#x27;
	});
});

&#x2F;&#x2F; 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render(&#x27;error&#x27;);
});

app.listen(app.get(&#x27;port&#x27;), function() {
	console.log(&#x27;Express running on http:&#x2F;&#x2F;localhost:&#x27; + app.get(&#x27;port&#x27;));
});
</code></pre>