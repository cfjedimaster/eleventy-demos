---
layout: post
title: "Working with IonicDB"
date: "2017-01-19T09:03:00-07:00"
categories: [mobile]
tags: [ionic]
banner_image: /images/banners/ionicdb.jpg
permalink: /2017/01/19/working-with-ionicdb
---

<b>Edit on Match 30, 2017: Unfortunately, the Ionic folks decided to <i>not</i> ship the final version of this service. IonicDB is no more.</b>

Today marks the launch of a new Ionic service, [IonicDB](http://docs.ionic.io/services/database/). For those 
who fondly remember Parse (thanks again, Facebook), this will come as welcome news. IonicDB is a simple data storage
system. It lets you store data in the cloud for your mobile apps and skip building a server just to handle simple data CRUD. It also
ties nicely with the [Ionic Auth](http://docs.ionic.io/services/auth/) system and has the ability to listen to changes to your data
in real time.

As always - the [docs](http://docs.ionic.io/services/database/) should be the first place you go, but I've been playing
with this service for a little while now and have some demos that may help get you started. Everything I'm going to show below
may be found in my GitHub repo of Cordova examples so you'll be able to get the full source.

A Simple Example
---

To begin, ensure you've followed the [directions](http://docs.ionic.io/setup.html#installation) for working with Ionic Cloud in general. This is the prereq for using *any* of the fancy
Cloud-based services. This requires a login with Ionic so if it is the first time you've used Ionic Cloud you'll need to set that up one time.

After you've set up Ionic Cloud for your app, the DB instructions tell you this:

<blockquote>
Once you’ve created a database for your app in our dashboard you can start storing and accessing data in your database.
</blockquote>

So to be clear, you need to get out of code for now, and go to the Ionic Apps site (https://apps.ionic.io), find your app, and 
then enable Ionic DB:

![Enable DB](https://static.raymondcamden.com/images/2017/1/db1.png)

Click this nice obvious button and your database will be prepared for your app. This will take you into the
dashboard view:

![DB Dashboard](https://static.raymondcamden.com/images/2017/1/db2.png)

There's a lot of useful info here as well as a look into your stats (which should be pretty boring in a new app), but let
me call out a few things in particular.

Number one - collections are simply database tables. Ok, not tables, it's all NoSQL and shiny, but basically, database
tables. For those who didn't grow up writing SQL for back end apps, then just think of these as buckets for your data.
If your app works with cats and dogs, then you could have two collections. Really this will be up to you and
your app's needs. 

Now look at the toggles. They are all pretty self-explanatory I think. The third one, "Auto Create Collections", is a setting
Parse had as well. Basically, while you work on your app, you may be defining new collections as you build it out. ("Oh, the client
wants to support cats, dogs, and mules? Ok - let's add a new collection for mules.") But most likely, when you've gone
line, you do *not* want new collections created. So you'll toggle this setting off. The first two refer to who can 
use the database and what particular rules apply - and again, this will be based on your app.

So what does the code look like? As I said, I'm not going to repeat every part of the docs - the [quick start](http://docs.ionic.io/services/database/#quick-start) gives you an 
idea of what you need to do. Basically you connect and then go to town. You've got full CRUD for working with data, but as I said
earlier, you also have the ability to listen for new data live, and I really like how easy the service makes this. While the quick start
shows you a code snippet, I've built a full (but simple) app that shows everything working together. Let me show you how
it works, and then I'll share the code.

The one page app consists of a list of Notes, which comes from IonicDB, and a simple text field to add new ones:

![App 1](https://static.raymondcamden.com/images/2017/1/db3.png)

As you can imagine, typing a message and hitting the button adds a new one. Where things get interesting is when you
work with multiple clients. Here's a video showing this in action:

<iframe width="560" height="315" src="https://www.youtube.com/embed/ezSqBXZ_zJw?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>

Ok, so let's look at the code. First, the view, even though it's rather simple.

<pre><code class="language-markup">
&lt;ion-header&gt;
  &lt;ion-navbar&gt;
    &lt;ion-title&gt;
      Ionic DB Example
    &lt;&#x2F;ion-title&gt;
  &lt;&#x2F;ion-navbar&gt;
&lt;&#x2F;ion-header&gt;

&lt;ion-content padding&gt;

  &lt;ion-item&gt;
    &lt;ion-label&gt;Message&lt;&#x2F;ion-label&gt;
    &lt;ion-input type=&quot;text&quot; [(ngModel)]=&quot;message&quot;&gt;&lt;&#x2F;ion-input&gt;
  &lt;&#x2F;ion-item&gt;
  &lt;button ion-button block (click)=&quot;sendMessage()&quot;&gt;Send&lt;&#x2F;button&gt;

  &lt;ion-list&gt;
    &lt;ion-item *ngFor=&quot;let chat of chats&quot;&gt;
      &lt;h2&gt;{% raw %}{{chat.text}}{% endraw %}&lt;&#x2F;h2&gt;
      &lt;p&gt;Posted {% raw %}{{chat.created |{% endraw %} date}} at {% raw %}{{ chat.created |{% endraw %} date:&#x27;shortTime&#x27; }}&lt;&#x2F;p&gt;
    &lt;&#x2F;ion-item&gt;
  &lt;&#x2F;ion-list&gt;

&lt;&#x2F;ion-content&gt;
</code></pre>

Basically just a form field and button for adding data and a simple ion-list for displaying it. The component code is where the fun is:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ NavController }{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{ Database }{% endraw %} from &#x27;@ionic&#x2F;cloud-angular&#x27;;

@Component({
  selector: &#x27;page-home&#x27;,
  templateUrl: &#x27;home.html&#x27;
})
export class HomePage {
  public chats: Array&lt;string&gt;;
  public message:string = &#x27;&#x27;;

  constructor(public navCtrl: NavController, public db:Database) {
    this.db.connect();
    this.db.collection(&#x27;chats&#x27;).order(&#x27;created&#x27;,&#x27;descending&#x27;).watch().subscribe( (chats) =&gt; {
      console.dir(chats);
      this.chats = chats;
    }, (error) =&gt; {
      console.error(error);
    });

  }

  sendMessage() {
    this.db.collection(&#x27;chats&#x27;).store({% raw %}{text:this.message, created:Date.now()}{% endraw %});
  }

}
</code></pre>

The first important bit is the import up top - that's fairly self-explanatory. I've created an array of chats representing the data
that will be displayed in the app. In the constructor, we connect, then open a collection called chats. I order the data 
by the created property, then watch and subscribe to the result. That's it for getting data and knowing when new crap is added.

Adding data is done via store, and being all fancy and NoSQL, I literally just pass an object representing my data and
IonicDB stores it. As with most NoSQL-ish solutions, the 'free form' thing is awesome, but you probably want to 
have a good idea what your data looks like and try to be as consistent as possible. 

And that's it! Nice and simple, right? Let's take a look at the collections for this app in the dashboard.

![List of collections](https://static.raymondcamden.com/images/2017/1/db4.png)

As you can see, Users is in there by default even if we aren't doing anything with security. Now let's look at chats:

![Collection view](https://static.raymondcamden.com/images/2017/1/db5.png )

As you can see, you've got some meta data for the collection as a whole, and the ability to Add/Edit/Delete right from the tool. This is cool
because while most data may be user generated, you may have data that is read only (and yes, the security model supports that). In that case, you 
would be able to use the dashboard to set up your data easily. Notice too you can do ad hoq queries here to search for data. 

An Example with Security
---

So what about security? IonicDB has a pretty deep security model, and to be honest, I find it a bit confusing at time. For my second demo, 
I had the help of Nick Hyatt from the Ionic team. I think it's going to take a few apps before I feel very comfortable with it, but I was able to build a complete demo of at least
one example of it.

Given the previous demo where folks made notes and everyone could see them - how would you modify the code so that notes
where user specific and only visible to the users that created them? 

You begin by making use of the Auth system. (If you've never seen that, see my blog post: [An example of the Ionic Auth service with Ionic 2](https://www.raymondcamden.com/2016/11/04/an-example-of-the-ionic-auth-service-with-ionic-2)). Then, edit
your database settings in the dashboard to require authenticated users. That was the first toggle in dashboard seen above.

Once you've done that, you then need to modify your code a bit. The first change you make is to app.module.ts, in your cloudSettings object:

<pre><code class="language-javascript">
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '1f06a1e5'
  },
  'database': {
    'authType': 'authenticated' 
  }
};

</code></pre>

If you try to connect to the database without being logged in, you'll get an error. But here's a nit - Ionic's Auth system
caches logins. So you need to handle this in two places - the application startup, and your login/register routine. So here's my app.component.ts:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ Platform }{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{ StatusBar, Splashscreen }{% endraw %} from &#x27;ionic-native&#x27;;

import {% raw %}{ HomePage }{% endraw %} from &#x27;..&#x2F;pages&#x2F;home&#x2F;home&#x27;;
import {% raw %}{ LoginPage }{% endraw %} from &#x27;..&#x2F;pages&#x2F;login&#x2F;login&#x27;;
import {% raw %}{ Auth, Database }{% endraw %} from &#x27;@ionic&#x2F;cloud-angular&#x27;;



@Component({
  templateUrl: &#x27;app.html&#x27;
})
export class MyApp {
  rootPage;

  constructor(platform: Platform, public auth:Auth, public db:Database) {
    platform.ready().then(() =&gt; {
      &#x2F;&#x2F; Okay, so the platform is ready and our plugins are available.
      &#x2F;&#x2F; Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      if(this.auth.isAuthenticated()) {
        this.db.connect();
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
      
    });
  }
}

</code></pre>

As you can see, if I detect a cached login, I connect to my database before sending the user to the appropriate page. By the same token, 
the login page has logic for both logging in as an existing user, and registering, and in both of *those* cases, I also need to connect to my database. I won't share the entire file as
it's really a small mod from the Auth blog post I linked above (and again, I'll be sharing links to the full source code), but here is just the part that handles login:

<pre><code class="language-javascript">
doLogin() {
if(this.showLogin) {
	console.log(&#x27;process login&#x27;);

	if(this.email === &#x27;&#x27; || this.password === &#x27;&#x27;) {
	let alert = this.alertCtrl.create({
		title:&#x27;Register Error&#x27;, 
		subTitle:&#x27;All fields are rquired&#x27;,
		buttons:[&#x27;OK&#x27;]
	});
	alert.present();
	return;
	}     

	let loader = this.loadingCtrl.create({
	content: &quot;Logging in...&quot;
	});
	loader.present();
	
	this.auth.login(&#x27;basic&#x27;, {% raw %}{&#x27;email&#x27;:this.email, &#x27;password&#x27;:this.password}{% endraw %}).then(() =&gt; {
	loader.dismissAll();
	&#x2F;&#x2F;this is crucial
	this.db.connect();
	this.navCtrl.setRoot(HomePage);        
	}, (err) =&gt; {
	loader.dismissAll();
	console.log(err.message);

	let errors = &#x27;&#x27;;
	if(err.message === &#x27;UNPROCESSABLE ENTITY&#x27;) errors += &#x27;Email isn\&#x27;t valid.&lt;br&#x2F;&gt;&#x27;;
	if(err.message === &#x27;UNAUTHORIZED&#x27;) errors += &#x27;Password is required.&lt;br&#x2F;&gt;&#x27;;

	let alert = this.alertCtrl.create({
		title:&#x27;Login Error&#x27;, 
		subTitle:errors,
		buttons:[&#x27;OK&#x27;]
	});
	alert.present();
	});
} else {
	this.showLogin = true;
}
}
</code></pre>

You can see the connection in the success handler for logging in.

So far so good. The next change is to where we work with data. In both are "get notes" and "add note" logic, we want to filter by the current user.  Instead of sharing the entire page, here are those mods, first to "get notes"
part:

<pre><code class="language-javascript">
this.db.collection(&#x27;chats&#x27;).findAll({% raw %}{creator:this.user.id}{% endraw %}).order(&#x27;created&#x27;,&#x27;descending&#x27;).watch().subscribe( (chats) =&gt; {
</code></pre>

Pretty simple, right? Basically filter by property creator and use my current login id as the value. Here is the new save routine:

<pre><code class="language-javascript">
this.db.collection(&#x27;chats&#x27;).store({text:this.message, 
      created:Date.now(), creator:this.user.id});
</code></pre>

Now we add a third property, creator, to mark our content. So we're not quite done yet. While we've done the right thing
in the app, we also need to lock down the server as well. That requires permissions, so back in the dashboard, enable that second 
toggle as well. 

At this point, <strong>everything is blocked</strong>. So to be clear, if I try to use my app, I won't be
 allowed to do anything with the data. I can connect, but I can't CRUD a lick of content. I'll begin by 
enabling the user to create content. In my dashboard, under permissions, I'll add a new permission:

![DB](https://static.raymondcamden.com/images/2017/1/db7a.png )

I gave it a name of 'create', told it the collection, and then defined the permission rule. Basically - "when we run
a store call, text and created can be anything, but the creator must be me."

Next I need to allow myself the ability to read my content:

![DB Read](https://static.raymondcamden.com/images/2017/1/db8a.png )

Whew! And that's it. Remember, by enabling permissions, we've automatically closed down every other single operation, so 
we don't have to worry about locking down deletes or anything else. 

As an aside, if you wanted to build a Twitter-like client where everyone's notes were shared, you would simply modify that
read permission like so: <code>findAll({owner: any())</code> (And again, thank you, Nick!)

For the full source code, here are the two app: 

https://github.com/cfjedimaster/Cordova-Examples/tree/master/db1
https://github.com/cfjedimaster/Cordova-Examples/tree/master/db2

Let me know if you have any questions (although be gentle, I'm still learning this myself), and let me know what you think!