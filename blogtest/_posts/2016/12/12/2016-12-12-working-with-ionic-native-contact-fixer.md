---
layout: post
title: "Working with Ionic Native - Contact Fixer"
date: "2016-12-12T10:26:00-07:00"
categories: [javascript,mobile]
tags: [ionic]
banner_image: /images/banners/contactfixer.jpg
permalink: /2016/12/12/working-with-ionic-native-contact-fixer
---

I've blogged a few times now about [Ionic Native](https://ionicframework.com/docs/v2/native/), but if you're new to it, you can think of "Angular2/Ionic2 Friendly Wrappers" for many different Cordova plugins. Today I'm sharing what may be my coolest demo yet. No, wait, seriously, it is, honest! This demo does something I think every phone should have built in, and if I can get off my lazy butt, I'll be submitting this to the App Store this week. So what did I build?

I noticed recently that both both iOS and Android will provide a contact picture even when you haven't selected a unique one for them. I believe, in both cases, it won't use the default picture when you get a call from them, but in the contacts app it will display it. So that's cool. I know it isn't new, but I like the fact that I can see someone's face when I get a phone call or text message from them.

However - I don't always have time to snap pictures of people when I'm adding them to my contacts. This made me curious. Given that we have a Contacts plugin and a [Contacts Ionic Native](https://ionicframework.com/docs/v2/native/contacts/) wrapper, could I actually *set* a picture for contacts that didn't have them?

Turns out that yes, you can! And of course, that means only one thing. I could build an app to "fix" those contacts and give them better pictures. Here's how 3 of the default iOS simulator contacts are displayed:

<img title="Before" src="https://static.raymondcamden.com/images/2016/12/ja1a.png" style="float:left">
<img title="Before" src="https://static.raymondcamden.com/images/2016/12/kb1a.png" style="float:left">
<img title="Before" src="https://static.raymondcamden.com/images/2016/12/ah1a.png" style="float:left">

<br clear="left" style="margin-bottom:10px">

And here are the fixed versions:

<img title="After" src="https://static.raymondcamden.com/images/2016/12/ja2.png" style="float:left">
<img title="After" src="https://static.raymondcamden.com/images/2016/12/kb2.png" style="float:left">
<img title="After" src="https://static.raymondcamden.com/images/2016/12/ah2.png" style="float:left">
<br clear="left" style="margin-bottom:10px">

In case it is a bit too small, here is a closeup on the awesomeness:

<img title="After Bigger" src="https://static.raymondcamden.com/images/2016/12/ahbig.png">

I'm going to be *so* rich when I put this in the App Store. Ok, let's take a look at the app itself. First, the UI, which is incredibly simple since the app does one thing and one thing only.

On startup, we display some text explaining what we're about to do:

![App start](https://static.raymondcamden.com/images/2016/12/cf1.png )

You then click the button, it presents a 'working' message, and when done, shows you a result:

![App done](https://static.raymondcamden.com/images/2016/12/cf2.png )

And that's it. I could maybe actually show all the contacts and their new pictures, but honestly, this felt like it was enough. Let's look at the code. First, the view.

<pre><code class="language-markup">
&lt;ion-header&gt;
  &lt;ion-navbar&gt;
    &lt;ion-title&gt;
      Contact Fixer
    &lt;&#x2F;ion-title&gt;
  &lt;&#x2F;ion-navbar&gt;
&lt;&#x2F;ion-header&gt;

&lt;ion-content padding&gt;
  
  &lt;p&gt;
  This application will scan your contacts and find ones without a contact picture. For each one it finds, it will fix that problem by selecting a random cat picture. This is a &lt;strong&gt;one way&lt;&#x2F;strong&gt; operation
  that cannot be undone - use with caution!
  &lt;&#x2F;p&gt;

  &lt;button ion-button color=&quot;danger&quot; (click)=&quot;fixContacts()&quot; full round&gt;Make It So!&lt;&#x2F;button&gt;

&lt;&#x2F;ion-content&gt;
</code></pre>

And now the real meat of the app, the code behind this view.

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ NavController, AlertController, LoadingController }{% endraw %} from &#x27;ionic-angular&#x27;;

import {% raw %}{ Contact, Contacts, ContactField }{% endraw %} from &#x27;ionic-native&#x27;;

@Component({
  selector: &#x27;page-home&#x27;,
  templateUrl: &#x27;home.html&#x27;
})
export class HomePage {

  constructor(public navCtrl: NavController, public alertCtrl:AlertController, public loadingCtrl:LoadingController) {
    
  }

  getRandomInt (min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  randomCat() {
    let w = this.getRandomInt(200,500);
    let h = this.getRandomInt(200,500);
    return `https:&#x2F;&#x2F;placekitten.com&#x2F;${% raw %}{w}{% endraw %}&#x2F;${% raw %}{h}{% endraw %}`;
  }

  &#x2F;&#x2F;Credit: http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;20285053&#x2F;52160
  toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = &#x27;blob&#x27;;
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
      callback(reader.result);
    }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open(&#x27;GET&#x27;, url);
    xhr.send();
  }

  fixContacts() {

    let loader = this.loadingCtrl.create({
      content: &quot;Doing important work...&quot;,
    });
    loader.present();


    let fixed = 0;
    let proms = [];

    Contacts.find([&quot;name&quot;]).then((res) =&gt; {

      res.forEach( (contact:Contact) =&gt; {

        if(!contact.photos) {
          console.log(&#x27;FIXING &#x27;+contact.name.formatted);
          &#x2F;&#x2F;console.log(contact);

          proms.push(new Promise( (resolve, reject) =&gt; {

            
            this.toDataUrl(this.randomCat(), function(s) {

              var f = new ContactField(&#x27;base64&#x27;,s,true);

              contact.photos = [];
              contact.photos.push(f);
              console.log(&#x27;FIXED &#x27;+contact.name.formatted);
              contact.save();
              fixed++;
              resolve();
              
            });
            
          }));
        }

      });

      Promise.all(proms).then( (res) =&gt; {
        
        loader.dismissAll();

        console.log(&#x27;all done, fixed is  &#x27;+fixed);
        let subTitle, button;

        if(fixed === 0) {
          subTitle = &quot;Sorry, but every single one of your contacts had a picture. I did nothing.&quot;;
          button = &quot;Sad Face&quot;;
        } else {
          subTitle = `I&#x27;ve updated ${% raw %}{fixed}{% endraw %} contact(s). Enjoy!`;
          button = &quot;Awesome&quot;;      
        }

        this.alertCtrl.create({
            title:&#x27;Contacts Updated&#x27;,
            subTitle:subTitle,
            buttons:[button]
        }).present();

      });

    });
  
  }

}
</code></pre>

Things get kicked off when the button is clicked on the view and `fixContacts()` is fired. I turn on a [loading component](https://ionicframework.com/docs/v2/components/#loading) to present something to the user to let them know the app is doing something. 

Next, I ask the Contacts API to return every contact. I have to pass a 'search field', even though I'm not actually passing a search value. That's a bit wonky, but that's how the plugin works, it isn't a bug in Ionic Native's implementation. 

I then iterate over every contact. The photos property is empty when no pictures exist for the contact. When I find that, I kick off a process to make a new picture using the [Placekitten](http://placekitten.com) service. I simply generate a random size and that will give me a random cat. I conver that to a base64 string and then store it in the contact. 

Because this process is asynchronous, I use an array of promises I can then call `then()` on to know when they are all done. 

Finally, I report what I did to the user using the [Alert component](https://ionicframework.com/docs/v2/components/#alert). And that's that. Here's output from my real device. First, Max, who already had a picture.

![Max](https://static.raymondcamden.com/images/2016/12/max.png)

And here is Alex, who did not have a picture, but who now does, and is much improved:

![Alex](https://static.raymondcamden.com/images/2016/12/alex.png)

You can find the complete source code here: https://github.com/cfjedimaster/Cordova-Examples/tree/master/fixcontacts

So - who would pay 99 cents for this?