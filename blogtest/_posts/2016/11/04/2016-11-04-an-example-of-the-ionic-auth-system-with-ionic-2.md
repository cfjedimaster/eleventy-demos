---
layout: post
title: "An example of the Ionic Auth service with Ionic 2"
date: "2016-11-04T12:59:00-07:00"
categories: [mobile]
tags: [ionic]
banner_image: /images/banners/ionic2auth.jpg
permalink: /2016/11/04/an-example-of-the-ionic-auth-service-with-ionic-2
---

<em>Note that I am writing this when Ionic 2 was in RC2 status. I expect that things may change a bit between now and the final release, but probably not too much.</em>

Earlier this year I wrote a blog post demonstrating the newly released [authentication system](http://docs.ionic.io/services/auth/) for Ionic applications: ["Testing the New Ionic User Service"](https://www.raymondcamden.com/2016/03/28/tesing-the-new-ionic-user-service/). I thought it might be fun to work up a new example using Ionic 2. While this example doesn't do anything the docs don't, it does put them all together in one "complete" application. I thought it might be useful to see the various APIs put together into a demo that shows:

* Checking if the user is logged in on start up
* Moving the user to a login page if not...
* And moving them to a home page if so
* Support logout and send the user back to the login page

The full source code for what I'm about to demonstrate may be found here: https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionicauth2

I began by creating a new Ionic 2 application using the "blank" template. This gave me an app with one page, home. My first task was to add logic to check for existing login and route the user appropriately. I did this within <code>app.component.ts</code>:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ Platform }{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{ StatusBar, Splashscreen }{% endraw %} from &#x27;ionic-native&#x27;;

import {% raw %}{ HomePage }{% endraw %} from &#x27;..&#x2F;pages&#x2F;home&#x2F;home&#x27;;
import {% raw %}{ LoginPage }{% endraw %} from &#x27;..&#x2F;pages&#x2F;login&#x2F;login&#x27;;
import {% raw %}{ Auth }{% endraw %} from &#x27;@ionic&#x2F;cloud-angular&#x27;;

@Component({
  template: `&lt;ion-nav [root]=&quot;rootPage&quot;&gt;&lt;&#x2F;ion-nav&gt;`
})
export class MyApp {
  rootPage;

  constructor(platform: Platform, public auth:Auth) {
    platform.ready().then(() =&gt; {
      &#x2F;&#x2F; Okay, so the platform is ready and our plugins are available.
      &#x2F;&#x2F; Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      if(this.auth.isAuthenticated()) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }

    });
  }
}
</code></pre>

I don't know if I need that <code>rootPage</code> declaration there. I kind of think I don't, but I've left it alone for now. The real important bit is <code>this.auth.isAuthenticated()</code>. The Auth system automatically caches your login for you (and that's something you can disable) so you don't have to worry about adding your own storage for logins. 

In case you're curious about that - the Auth system uses LocalStorage when testing in the browser:

<em>Screenshot removed</em>

<strike>
You'll notice the password is in plain text and they are also storing a third value as well. Outside of the other one, I feel like it's a mistake to use email and password as those are values I could see using myself. (I filed an [issue](https://github.com/driftyco/ionic-cloud-angular/issues/30)). 
</strike>

<em>Sorry folks! I was totally wrong about this. I had written my own code to store auth info in LocalStorage but removed that code when I saw that Ionic was handling for me. However, I forgot that fact when I used devtools to look at my localstorage. Ionic does store a JWT token - but definitely not the password!</em>


For my login, I decided to use a simple UI that defaults to login:

![Login](https://static.raymondcamden.com/images/2016/11/iu2.png )

Clicking register simply hides the initial form and shows the (slightly larger) registration form:

![Register](https://static.raymondcamden.com/images/2016/11/iu3.png)

I'm not entirely sold on that UX, but it gets the job done. Let's take a look at the HTML behind this:

<pre><code class="language-markup">
&lt;!--
  Generated template for the Login page.

  See http:&#x2F;&#x2F;ionicframework.com&#x2F;docs&#x2F;v2&#x2F;components&#x2F;#navigation for more info on
  Ionic pages and navigation.
--&gt;
&lt;ion-header&gt;

  &lt;ion-navbar&gt;
    &lt;ion-title&gt;Login&#x2F;Register&lt;&#x2F;ion-title&gt;
  &lt;&#x2F;ion-navbar&gt;

&lt;&#x2F;ion-header&gt;


&lt;ion-content padding&gt;

  &lt;div *ngIf=&quot;showLogin&quot;&gt;
    &lt;ion-item&gt;
      &lt;ion-input type=&quot;email&quot; placeholder=&quot;Email&quot; [(ngModel)]=&quot;email&quot;&gt;&lt;&#x2F;ion-input&gt;
    &lt;&#x2F;ion-item&gt;

    &lt;ion-item&gt;
      &lt;ion-input type=&quot;password&quot; placeholder=&quot;Password&quot; [(ngModel)]=&quot;password&quot;&gt;&lt;&#x2F;ion-input&gt;
    &lt;&#x2F;ion-item&gt;
  &lt;&#x2F;div&gt;

  &lt;div *ngIf=&quot;!showLogin&quot;&gt;

    &lt;ion-item&gt;
      &lt;ion-input type=&quot;text&quot; placeholder=&quot;Name&quot; [(ngModel)]=&quot;name&quot;&gt;&lt;&#x2F;ion-input&gt;
    &lt;&#x2F;ion-item&gt;

    &lt;ion-item&gt;
      &lt;ion-input type=&quot;email&quot; placeholder=&quot;Email&quot; [(ngModel)]=&quot;email&quot;&gt;&lt;&#x2F;ion-input&gt;
    &lt;&#x2F;ion-item&gt;

    &lt;ion-item&gt;
      &lt;ion-input type=&quot;password&quot; placeholder=&quot;Password&quot; [(ngModel)]=&quot;password&quot;&gt;&lt;&#x2F;ion-input&gt;
    &lt;&#x2F;ion-item&gt;
  &lt;&#x2F;div&gt;

  &lt;button ion-button color=&quot;primary&quot; full (click)=&quot;doLogin()&quot;&gt;Login&lt;&#x2F;button&gt;
  &lt;button ion-button color=&quot;primary&quot; full (click)=&quot;doRegister()&quot;&gt;Register&lt;&#x2F;button&gt;

&lt;&#x2F;ion-content&gt;
</code></pre>

Nothing crazy here except the 2 divs with <code>*ngIf*</code> controlling their visibility. The real fun is the code behind this:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ NavController, AlertController, LoadingController }{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{ Auth, User, UserDetails, IDetailedError }{% endraw %} from &#x27;@ionic&#x2F;cloud-angular&#x27;;
import {% raw %}{ HomePage }{% endraw %} from &#x27;..&#x2F;home&#x2F;home&#x27;;

@Component({
  selector: &#x27;page-login&#x27;,
  templateUrl: &#x27;login.html&#x27;
})
export class LoginPage {

  showLogin:boolean = true;
  email:string = &#x27;&#x27;;
  password:string = &#x27;&#x27;;
  name:string = &#x27;&#x27;;

  constructor(public navCtrl: NavController, public auth:Auth, public user: User, public alertCtrl: AlertController, public loadingCtrl:LoadingController) {}

  ionViewDidLoad() {
    console.log(&#x27;Hello LoginPage Page&#x27;);
  }

  &#x2F;*
  for both of these, if the right form is showing, process the form,
  otherwise show it
  *&#x2F;
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
        console.log(&#x27;ok i guess?&#x27;);
        loader.dismissAll();
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

  doRegister() {
    if(!this.showLogin) {
      console.log(&#x27;process register&#x27;);

      &#x2F;*
      do our own initial validation
      *&#x2F;
      if(this.name === &#x27;&#x27; {% raw %}|| this.email === &#x27;&#x27; |{% endraw %}| this.password === &#x27;&#x27;) {
        let alert = this.alertCtrl.create({
          title:&#x27;Register Error&#x27;, 
          subTitle:&#x27;All fields are rquired&#x27;,
          buttons:[&#x27;OK&#x27;]
        });
        alert.present();
        return;
      }

      let details: UserDetails = {% raw %}{&#x27;email&#x27;:this.email, &#x27;password&#x27;:this.password, &#x27;name&#x27;:this.name}{% endraw %};
      console.log(details);
      
      let loader = this.loadingCtrl.create({
        content: &quot;Registering your account...&quot;
      });
      loader.present();

      this.auth.signup(details).then(() =&gt; {
        console.log(&#x27;ok signup&#x27;);
        this.auth.login(&#x27;basic&#x27;, {% raw %}{&#x27;email&#x27;:details.email, &#x27;password&#x27;:details.password}{% endraw %}).then(() =&gt; {
          loader.dismissAll();
          this.navCtrl.setRoot(HomePage);
        });

      }, (err:IDetailedError&lt;string[]&gt;) =&gt; {
        loader.dismissAll();
        let errors = &#x27;&#x27;;
        for(let e of err.details) {
          console.log(e);
          if(e === &#x27;required_email&#x27;) errors += &#x27;Email is required.&lt;br&#x2F;&gt;&#x27;;
          if(e === &#x27;required_password&#x27;) errors += &#x27;Password is required.&lt;br&#x2F;&gt;&#x27;;
          if(e === &#x27;conflict_email&#x27;) errors += &#x27;A user with this email already exists.&lt;br&#x2F;&gt;&#x27;;
          &#x2F;&#x2F;don&#x27;t need to worry about conflict_username
          if(e === &#x27;invalid_email&#x27;) errors += &#x27;Your email address isn\&#x27;t valid.&#x27;;
        }
        let alert = this.alertCtrl.create({
          title:&#x27;Register Error&#x27;, 
          subTitle:errors,
          buttons:[&#x27;OK&#x27;]
        });
        alert.present();
      });
     
    } else {
      this.showLogin = false;
    }
  }

}
</code></pre>

Let's begin with <code>doRegister</code>. This handles either showing the register form (if hidden) or performing registration. For registration, I do a quick sanity check on the form fields (I know Angular 2 has a fancier way of working with forms, but I don't really know it yet) and if all fields have something in them, I then create a new instance of <code>UserDetails</code> and pass it to the <code>signup</code> method of auth. If it succeeds, awesome. I then log the user in and then send them to the home page.

If it fails, I look at the nice errors and create English versions of them to present to the user. Notice too I'm using the Ionic loading and alert controls as well. Also make note of <code>this.navCtrl.setRoot</code>. I use that instead of <code>push</code> because I do <strong>not</strong> want to provide a link back to the login page. Basically I'm saying, "This is your new home. Love it. Make peace with it. Share a good beer..."

Now take a look at login. For the most part it follows the same idea - check the form, login, then handle the result. But oddly, errors with login throw exceptions and not "pretty" errors with simple codes like registration. I'm sure there is a good reason for that, but I wish the docs had made it more clear. I literally had copied the error handling code from <code>doRegister</code> with the expectation that only the possible results would change and that wasn't so. For example, a bad email address throws UNPROCESSABLE ENTITY, which, ok, I guess means something, but it isn't terribly obvious. A failed login just returns UNAUTHORIZED, which is a bit more sensible perhaps.

The final part of this demo is the home page. All I do is print out the user's name and provide a logout button. 

![Home](https://static.raymondcamden.com/images/2016/11/iu4.png)

Here's the HTML:

<pre><code class="language-markup">
&lt;ion-header&gt;
  &lt;ion-navbar&gt;
    &lt;ion-title&gt;
      Home
    &lt;&#x2F;ion-title&gt;
    &lt;ion-buttons end&gt;
      &lt;button ion-button icon-only (click)=&quot;logout()&quot;&gt;
        &lt;ion-icon name=&quot;exit&quot;&gt;&lt;&#x2F;ion-icon&gt;
      &lt;&#x2F;button&gt;
    &lt;&#x2F;ion-buttons&gt;
  &lt;&#x2F;ion-navbar&gt;
&lt;&#x2F;ion-header&gt;

&lt;ion-content padding&gt;
    &lt;h2&gt;Welcome back, {% raw %}{{ user.details.name }}{% endraw %}&lt;&#x2F;h2&gt;
&lt;&#x2F;ion-content&gt;
</code></pre>

Nothing too special there, although I should point out that the <code>name</code> value of a user is optional. And here is the code behind the view:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;

import {% raw %}{ NavController }{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{ Auth, User }{% endraw %} from &#x27;@ionic&#x2F;cloud-angular&#x27;;
import {% raw %}{ LoginPage }{% endraw %} from &#x27;..&#x2F;login&#x2F;login&#x27;;

@Component({
  selector: &#x27;page-home&#x27;,
  templateUrl: &#x27;home.html&#x27;
})
export class HomePage {

  constructor(public navCtrl: NavController, public user:User, public auth:Auth) {
    console.log(user);
    
  }

  logout() {
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
</code></pre>

Literally the only thing interesting here is <code>logout</code> and frankly, that's not terribly interesting either.

But all in all - I now have a complete Auth demo that actually handles the views and such. I built this just so I could write <em>another</em> blog post but that will be for next week. As always, I hope this helps. I've been kind of avoiding blogging much on Ionic 2 with it changing so much over the year, but with today's release of RC2, it's time to get back on the Ionic Love Train again.

!["Cat Train"](https://static.raymondcamden.com/images/2016/11/cattrain.jpg)
<p style="text-align: center"><em>What I imagine the "Ionic Love Train" would look like...</em></p>