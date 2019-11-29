---
layout: post
title: "Working with Ionic Native - Using Secure Storage"
date: "2016-08-16T15:05:00-07:00"
categories: [javascript,mobile]
tags: [ionic]
banner_image: /images/banners/secure_storage.jpg
permalink: /2016/08/16/working-with-ionic-native-using-secure-storage
---

Today I'm reviewing another Ionic Native feature, the [Secure Storage](http://ionicframework.com/docs/v2/native/secure-storage/) wrapper. As the [plugin docs](https://github.com/Crypho/cordova-plugin-secure-storage) explain, this is a plugin that allows for encrypted storage of sensitive data. It follows an API similar to that of [WebStorage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), with a few differences.

<!--more-->

First, the plugin lets you define a 'bucket' for your data. So your app could have multiple different sets of data that are separated from each other. (The plugin refers to it as 'namespaced storage', but buckets just made more sense to me.) 

Second, you can't get all the keys like you can with WebStorage. That's probably related to the whole 'secure' thing, but in general, I can't imagine needing that functionality in a real application. You could also use a key that represents a list of keys. 

Secure Storage is a key/value storage system, and like WebStorage, you can only store strings, but you can use JSON to get around that. 

With that out of the way - let's build a simple demo. I created a simple two page app to represent a login screen and main page. 

Let's start by looking at the first page, our login screen.

<pre><code class="language-markup">
&lt;ion-header&gt;
	&lt;ion-navbar&gt;
		&lt;ion-title&gt;
			Secure Storage Example
		&lt;&#x2F;ion-title&gt;
	&lt;&#x2F;ion-navbar&gt;
&lt;&#x2F;ion-header&gt;

&lt;ion-content padding&gt;

	&lt;ion-list&gt;

		&lt;ion-item&gt;
			&lt;ion-label fixed&gt;Username&lt;&#x2F;ion-label&gt;
			&lt;ion-input type=&quot;text&quot; [(ngModel)]=&quot;username&quot;&gt;&lt;&#x2F;ion-input&gt;
		&lt;&#x2F;ion-item&gt;

		&lt;ion-item&gt;
			&lt;ion-label fixed&gt;Password&lt;&#x2F;ion-label&gt;
			&lt;ion-input type=&quot;password&quot; [(ngModel)]=&quot;password&quot;&gt;&lt;&#x2F;ion-input&gt;
		&lt;&#x2F;ion-item&gt;

	&lt;&#x2F;ion-list&gt;

	&lt;button primary block (click)=&quot;login()&quot;&gt;Login&lt;&#x2F;button&gt;

&lt;&#x2F;ion-content&gt;
</code></pre>

Now we'll look at the code behind this.

<pre><code class="language-javascript">
import {% raw %}{Component}{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{NavController}{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{LoginProvider}{% endraw %} from &#x27;..&#x2F;..&#x2F;providers&#x2F;login-provider&#x2F;login-provider&#x27;;
import {% raw %}{ Dialogs }{% endraw %} from &#x27;ionic-native&#x27;;
import {% raw %}{MainPage}{% endraw %} from &#x27;..&#x2F;main-page&#x2F;main-page&#x27;;

@Component({
  templateUrl: &#x27;build&#x2F;pages&#x2F;home&#x2F;home.html&#x27;,
  providers:[LoginProvider]
})
export class HomePage {

  public username:string;
  public password:string;
  private loginService:LoginProvider;
  
  constructor(public navCtrl: NavController) {
    this.loginService = new LoginProvider();
  }

  login() {

    console.log(&#x27;login&#x27;,this.username,this.password);
    this.loginService.login(this.username,this.password).subscribe((res) =&gt; {

      console.log(res);

      if(res.success) {
        
        &#x2F;&#x2F;thx mike for hack to remove back btn
        this.navCtrl.setRoot(MainPage, null, {
          animate: true
        });

      } else {
        Dialogs.alert(&quot;Bad login. Use &#x27;password&#x27; for password.&quot;,&quot;Bad Login&quot;);
      }

    });

  }

}
</code></pre>

All we've got here is a login handler that calls a provider to verify the credentials. There's one interesting part - the `setRoot` call you see there is used instead of navCtrl.push as it lets you avoid having a back button on the next view. Finally, let's look at the provider, even though it's just a static system.

<pre><code class="language-javascript">
import {% raw %}{ Injectable }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import &#x27;rxjs&#x2F;add&#x2F;operator&#x2F;map&#x27;;
import {% raw %}{Observable}{% endraw %} from &#x27;rxjs&#x27;;
&#x2F;&#x2F;import &#x27;rxjs&#x2F;Observable&#x2F;from&#x27;;

@Injectable()
export class LoginProvider {

  constructor() {}

  public login(username:string,password:string) {
    let data = {% raw %}{success:1}{% endraw %};

    if(password !== &#x27;password&#x27;) data.success = 0;

    return Observable.from([data]);

  }
}
</code></pre>

Basically - any login with "password" as the password will be a succesful login. That's some high quality security there!

You can view this version of the code here: https://github.com/cfjedimaster/Cordova-Examples/tree/master/securestorage_ionicnative/app_v1

Ok, so let's kick it up a notch. My plan with Secure Storage is to modify the code as such:

* When you login, JSON encode the username and password and store it as one value.
* When the app launches, first create the 'bucket' for the system, which will only actually create it one time.
* See if pre-existing data exists, and if so, get it, decode it, put the values in the form, and automatically submit the form.

Since I'm using a plugin, I know now that my app has to wait for Cordova's deviceReady to fire. I've got a login button in my view that I can disable until that happens. So one small change to the view is to show/hide it based on a value I'll use based on the ready status. Here is the new login button:

<pre><code class="language-markup">
&lt;button primary block (click)=&quot;login()&quot; *ngIf=&quot;readyToLogin&quot;&gt;Login&lt;&#x2F;button&gt;
</code></pre>

Now let's look at the updated script. I'll share the entire update and then I'll point out the updates.

<pre><code class="language-javascript">
import {% raw %}{Component}{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{NavController,Platform}{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{LoginProvider}{% endraw %} from &#x27;..&#x2F;..&#x2F;providers&#x2F;login-provider&#x2F;login-provider&#x27;;
import {% raw %}{ Dialogs }{% endraw %} from &#x27;ionic-native&#x27;;
import {% raw %}{MainPage}{% endraw %} from &#x27;..&#x2F;main-page&#x2F;main-page&#x27;;
import {% raw %}{SecureStorage}{% endraw %} from &#x27;ionic-native&#x27;;

@Component({
  templateUrl: &#x27;build&#x2F;pages&#x2F;home&#x2F;home.html&#x27;,
  providers:[LoginProvider]
})
export class HomePage {

  public username:string;
  public password:string;
  private loginService:LoginProvider;
  public readyToLogin:boolean;
  private secureStorage:SecureStorage;

  constructor(public navCtrl: NavController, platform:Platform ) {
    this.loginService = new LoginProvider();
    this.readyToLogin = false;

    platform.ready().then(() =&gt; {

      this.secureStorage = new SecureStorage();
      this.secureStorage.create(&#x27;demoapp&#x27;).then(
        () =&gt; {
          console.log(&#x27;Storage is ready!&#x27;);

          this.secureStorage.get(&#x27;loginInfo&#x27;)
          .then(
            data =&gt; {
              console.log(&#x27;data was &#x27;+data);
              let {% raw %}{u,p}{% endraw %} = JSON.parse(data);
              this.username = u;
              this.password = p;
              this.login();
            },
            error =&gt; {
              &#x2F;&#x2F; do nothing - it just means it doesn&#x27;t exist
            }
          );

          this.readyToLogin = true;
        },
        error =&gt; console.log(error)
      );

    });

  }

  login() {

    this.loginService.login(this.username,this.password).subscribe((res) =&gt; {

      console.log(res);

      if(res.success) {

        &#x2F;&#x2F;securely store
        this.secureStorage.set(&#x27;loginInfo&#x27;, JSON.stringify({% raw %}{u:this.username, p:this.password}{% endraw %}))
        .then(
        data =&gt; {
          console.log(&#x27;stored info&#x27;);
        },
        error =&gt; console.log(error)
        );

        &#x2F;&#x2F;thx mike for hack to remove back btn
        this.navCtrl.setRoot(MainPage, null, {
          animate: true
        });

      } else {
        Dialogs.alert(&#x27;Bad login. Use \&#x27;password\&#x27; for password.&#x27;,&#x27;Bad Login&#x27;,&#x27;Ok&#x27;);
        this.secureStorage.remove(&#x27;loginInfo&#x27;);
      }

    });

  }

}
</code></pre>

So let's start at the top. Don't forget that your Ionic views can fire *before* the Cordova deviceReady event has fired. I still wish there was a simple little flag I could give to my Ionic code to say "Don't do anything until then", but until then, you can use the `Platform` class and the ready event. 

I create my Secure Storage bucket "demoapp", and in the success handler, I immediately look for the key `loginInfo`. Obviously on the first run it won't exist, but the bucket will be created. On the second (and onward) run, the bucket will already exist, and the data may or may not exist.

If it does - I decode it, set the values, and login. That last operation was optional of course. Maybe your app will just default the values. There's a few different ways of handling this.

Finally, in the login handler I both set the value (after encoding it) and clear it based on the result of the login attempt. Notice that both calls are asynchronous, but I really don't need to wait for them, right? Therefore I treat them both as 'fire and forget' calls. 

They could, of course, error. And there is a very good reason why it could. In the [docs](https://github.com/Crypho/cordova-plugin-secure-storage), they mention that this plugin works just fine on iOS, but on Android it will only work if the user has a secure pin setup. That's unfortunate, but the plugin actually provides an additional API to bring up that setting for Android users, which is pretty cool I think. 

You can find the code for this version here: https://github.com/cfjedimaster/Cordova-Examples/tree/master/securestorage_ionicnative/app

How about a few final thoughts?

* While you *can* store a username and password, and the docs even say this, I still feel a bit wonky about doing so. I'd maybe consider storing a token instead that could be used to automatically login just that user. And it could have an automatic timeout of some sort.
* If you read the blog post, [Ionic Native: Enabling Login with Touch ID for iOS](http://blog.ionic.io/ionic-native-enabling-login-with-touch-id-for-ios/), then this plugin would be a great addition to that example. 
* A bit off topic, but I would normally have added a "loading" indicator on login to let the user know what's going on. And of course, Ionic has [one](http://ionicframework.com/docs/v2/components/#loading). I was lazy though and since my login provider was instantaneous, I didn't feel like it was crucial. 

As always - let me know what you think in the comments below. 

p.s. I'm loving Ionic 2, and Angular 2, and TypeScript, but wow, it is still a struggle. For this demo, I'd say 80% of my time was spent just building the first version. I'm still struggling with Observables, still struggling with Angular 2 syntax. Heck, it took me a few minutes to even just bind the form fields to values. That being said, and I know I've said this before, I still *like* the code in v2 more than my Angular 1 code.