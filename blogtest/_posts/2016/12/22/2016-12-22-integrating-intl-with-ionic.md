---
layout: post
title: "Integrating Intl with Ionic"
date: "2016-12-22T08:45:00-07:00"
categories: [mobile]
tags: [ionic,cordova]
banner_image: 
permalink: /2016/12/22/integrating-intl-with-ionic
---

<div style="background:yellow;padding:5px"><strong>
Before you continue, a quick warning. This article discusses how to localize numbers and formats for
an Ionic 2 app using the Intl spec. Based on my reading, this should actually be baked into Angular 2
itself. In my testing, this was not the case. I could be wrong. I could be right and the feature is just bugged. Just know that what follows may not be technically necessary. I'm sharing it anyway as it was fun to write and gave me the opportunity to play with pipes.
</strong></div>

Over two years ago I first wrote about the [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) spec: [Working with Intl](https://code.tutsplus.com/tutorials/working-with-intl--cms-21082). This is an incredibly cool, and actually fairly simple, way to localize dates and numbers for your web applications. Because it was incredibly useful, of course Apple dragged their heels in supporting it, but as of iOS 10, it is finally baked in:

![Intl support](https://static.raymondcamden.com/images/2016/12/intl1.png)

With support at nearly 80%, and with it being easy to fall back when not supported, I thought I'd take a look at adding it to a simple Ionic 2 application. 

I started off building a 2-page master detail application. The first page is a list of cats. For each cat, I want to output the time of their last rating.

![Demo](https://static.raymondcamden.com/images/2016/12/intl1a.png)

Clicking on a cat loads a detail.

![Demo](https://static.raymondcamden.com/images/2016/12/intl1b.png)

In both of the above screen shots, you can see dates and numbers printed as is - with no special formatting. While the code isn't that complex, let's take a look at it as a baseline. (Note, in the repo URL I'll share at the end of this post, you can find the original code in the src_v1 folder.)

First, here is the cat data provider. This one isn't going to change as we progress through the various versions:

<pre><code class="language-javascript">
import {% raw %}{ Injectable }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ Observable }{% endraw %} from &#x27;rxjs&#x27;;
import &#x27;rxjs&#x2F;add&#x2F;operator&#x2F;map&#x27;;

@Injectable()
export class CatProvider {

 public cats:Array&lt;Object&gt; = [
   {% raw %}{name:&#x27;Luna&#x27;, lastRating:new Date(2016, 12, 2 ,9, 30), numRatings:338324, avgRating:3.142}{% endraw %},
   {% raw %}{name:&#x27;Pig&#x27;, lastRating:new Date(2016, 12, 12, 16,57), numRatings:9128271, avgRating:4.842}{% endraw %},
   {% raw %}{name:&#x27;Cracker&#x27;, lastRating:new Date(2016, 11, 29, 13, 1), numRatings:190129, avgRating:2.734}{% endraw %},
   {% raw %}{name:&#x27;Robin&#x27;, lastRating:new Date(2016, 12, 19, 5, 42), numRatings:642850, avgRating:4.1}{% endraw %},
   {% raw %}{name:&#x27;Simba&#x27;, lastRating:new Date(2016, 12, 18, 18, 18), numRatings:80213, avgRating:1.9999}{% endraw %}
   ];


  constructor() {
    console.log(&#x27;Hello CatProvider Provider&#x27;);
  }

  load() {
    console.log(&#x27;called load&#x27;);
    return Observable.from(this.cats);
  }
}
</code></pre>

Now let's look at the view for the home page:

<pre><code class="language-markup">
&lt;ion-header&gt;
  &lt;ion-navbar&gt;
    &lt;ion-title&gt;
      Intl Demo
    &lt;&#x2F;ion-title&gt;
  &lt;&#x2F;ion-navbar&gt;
&lt;&#x2F;ion-header&gt;

&lt;ion-content padding&gt;

  &lt;ion-list inset&gt;
    &lt;ion-item *ngFor=&quot;let cat of cats&quot; (click)=&quot;loadCat(cat)&quot; detail-push&gt;
      {% raw %}{{cat.name}}{% endraw %} 
      &lt;ion-note item-right&gt;Last rated: {% raw %}{{cat.lastRating}}{% endraw %}&lt;&#x2F;ion-note&gt;
    &lt;&#x2F;ion-item&gt;
  &lt;&#x2F;ion-list&gt;

&lt;&#x2F;ion-content&gt;
</code></pre>

And the code behind it:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ CatProvider }{% endraw %} from &#x27;..&#x2F;..&#x2F;providers&#x2F;cat-provider&#x27;;
import {% raw %}{ NavController }{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{ DetailPage }{% endraw %} from &#x27;..&#x2F;detail&#x2F;detail&#x27;;

@Component({
  selector: &#x27;page-home&#x27;,
  templateUrl: &#x27;home.html&#x27;,
  providers:[CatProvider]
})
export class HomePage {

 public cats:Array&lt;Object&gt; = [];

  constructor(public navCtrl: NavController, public catProvider:CatProvider) {
    catProvider.load().subscribe((catData) =&gt; {      
      this.cats.push(catData);
    });
  }

  loadCat(cat) {
    this.navCtrl.push(DetailPage, {% raw %}{selectedCat:cat}{% endraw %});
  }

}
</code></pre>

Next up is the detail view:

<pre><code class="language-markup">
&lt;ion-header&gt;

  &lt;ion-navbar&gt;
    &lt;ion-title&gt;{% raw %}{{cat.name}}{% endraw %}&lt;&#x2F;ion-title&gt;
  &lt;&#x2F;ion-navbar&gt;

&lt;&#x2F;ion-header&gt;


&lt;ion-content padding&gt;

  &lt;ion-card&gt;
    &lt;ion-card-header&gt;
      Details
    &lt;&#x2F;ion-card-header&gt;

    &lt;ion-card-content&gt;
      The cat {% raw %}{{cat.name}}{% endraw %} has gotten {% raw %}{{cat.numRatings}}{% endraw %} ratings with an 
      average of {% raw %}{{cat.avgRating}}{% endraw %}.
    &lt;&#x2F;ion-card-content&gt;

  &lt;&#x2F;ion-card&gt;
&lt;&#x2F;ion-content&gt;
</code></pre>

And its code:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ NavController, NavParams }{% endraw %} from &#x27;ionic-angular&#x27;;

&#x2F;*
  Generated class for the DetailPage page.

  See http:&#x2F;&#x2F;ionicframework.com&#x2F;docs&#x2F;v2&#x2F;components&#x2F;#navigation for more info on
  Ionic pages and navigation.
*&#x2F;
@Component({
  selector: &#x27;page-detail&#x27;,
  templateUrl: &#x27;detail.html&#x27;
})
export class DetailPage {

  public cat:Object;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams);
    this.cat = navParams.data.selectedCat;
  }

  ionViewDidLoad() {
    console.log(&#x27;ionViewDidLoad DetailPage&#x27;);
  }

}
</code></pre>

Round One
---

The first change (found in src_v2) I did was to employ Angular's built in pipes for date and number formatting. In the home view, I used this:

<pre><code class="language-markup">
&lt;ion-note item-right&gt;Last rated: {% raw %}{{cat.lastRating | date:&#x27;shortDate&#x27;}}{% endraw %}&lt;&#x2F;ion-note&gt;
</code></pre>

And in the detail I used this:

<pre><code class="language-markup">
&lt;ion-card-content&gt;
	The cat {% raw %}{{cat.name}}{% endraw %} has gotten {% raw %}{{cat.numRatings | number}}{% endraw %} ratings with an 
	average of {% raw %}{{cat.avgRating | number:&#x27;1.0-2&#x27;}}{% endraw %}.
&lt;&#x2F;ion-card-content&gt;
</code></pre>

Nice and simple and we're done, right? Well as I said above, this worked for me, but only in the English locale. Switching to French did nothing to change the output. To be clear, maybe I was doing it wrong. But again, this simply didn't do it for me. On to round two!

Round Two
---

So I gave up on the pipes (and removed them from the view!) and switched to using Intl (this may be found in src_v3). I began by adding code to modify the result from the provider in `home.ts`. To be clear, this felt wrong, but was my first draft with adding Intl:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ CatProvider }{% endraw %} from &#x27;..&#x2F;..&#x2F;providers&#x2F;cat-provider&#x27;;
import {% raw %}{ NavController }{% endraw %} from &#x27;ionic-angular&#x27;;
import {% raw %}{ DetailPage }{% endraw %} from &#x27;..&#x2F;detail&#x2F;detail&#x27;;

@Component({
  selector: &#x27;page-home&#x27;,
  templateUrl: &#x27;home.html&#x27;,
  providers:[CatProvider]
})
export class HomePage {

 public cats:Array&lt;Object&gt; = [];

  dtFormat(d) {
    if(Intl) {
      return new Intl.DateTimeFormat().format(d) + &#x27; &#x27; + new Intl.DateTimeFormat(navigator.language, {% raw %}{hour:&#x27;numeric&#x27;,minute:&#x27;2-digit&#x27;}{% endraw %}).format(d);
    } else {
      return d;
    }
  }

  constructor(public navCtrl: NavController, public catProvider:CatProvider) {
    catProvider.load().subscribe((catData:any) =&gt; {

      catData.lastRating = this.dtFormat(catData[&quot;lastRating&quot;]);
      this.cats.push(catData);

    });
  }

  loadCat(cat) {
    this.navCtrl.push(DetailPage, {% raw %}{selectedCat:cat}{% endraw %});
  }

}
</code></pre>

My function dtFormat sniffs for Intl. If it exists, I format both a date and time string. Notice that in order to do this, I format twice with options. The second call is more complex because I have to pass in a value for locale if I want to pass options (a mistake in the API imo). 

I do something similar for the numbers:

<pre><code class="language-javascript">
import {% raw %}{ Component }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ NavController, NavParams }{% endraw %} from &#x27;ionic-angular&#x27;;

&#x2F;*
  Generated class for the DetailPage page.

  See http:&#x2F;&#x2F;ionicframework.com&#x2F;docs&#x2F;v2&#x2F;components&#x2F;#navigation for more info on
  Ionic pages and navigation.
*&#x2F;
@Component({
  selector: &#x27;page-detail&#x27;,
  templateUrl: &#x27;detail.html&#x27;
})
export class DetailPage {

  public cat:Object;

  numberFormat(d) {
    if(Intl) {
      return new Intl.NumberFormat().format(d);
    } else {
      return d;
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    navParams.data.selectedCat.numRatings = this.numberFormat(navParams.data.selectedCat.numRatings);
    navParams.data.selectedCat.avgRating = this.numberFormat(navParams.data.selectedCat.avgRating);
    this.cat = navParams.data.selectedCat;
  }

  ionViewDidLoad() {
    console.log(&#x27;ionViewDidLoad DetailPage&#x27;);
  }

}
</code></pre>

And this worked! But I didn't like modifying the data like that. I knew I could write my own pipes, so I did so in the next version.

Round Three
---

I began by adding a pipes folder to my src (this version of the app is in the src and src_v4 folders). Here is my date pipe:

<pre><code class="language-javascript">
import {% raw %}{ Pipe, PipeTransform }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;

@Pipe({% raw %}{name: &#x27;dtFormat&#x27;}{% endraw %})
export class dtFormatPipe implements PipeTransform {
  transform(value: Date): string {

    if(Intl) {
      return new Intl.DateTimeFormat().format(value) + &#x27; &#x27; + new Intl.DateTimeFormat(navigator.language, {% raw %}{hour:&#x27;numeric&#x27;,minute:&#x27;2-digit&#x27;}{% endraw %}).format(value);
    } else {
      return value.toString();
    }

  }
}
</code></pre>

And here is my number pipe:

<pre><code class="language-javascript">
import {% raw %}{ Pipe, PipeTransform }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;

@Pipe({% raw %}{name: &#x27;numberFormat&#x27;}{% endraw %})
export class numberFormatPipe implements PipeTransform {
  transform(value: string): string {

    if(Intl) {
	  return new Intl.NumberFormat(navigator.language, {% raw %}{maximumFractionDigits:2}{% endraw %}).format(Number(value));
    } else {
	  return value;
    }

  }
}
</code></pre>

Notice the addition of `maximumFractionDigits`. This will cut off decimals to 2 places. In theory I could build my pipe so that was an argument passed in by the view, but I kept it simple. I removed my code from the page controllers, and then simply added my new pipes in to the views. (Note - you also have to add in your pipes to `app.module.ts`. I forget this in nearly every Ionic 2 app I build.)

First the home page:

<pre><code class="language-markup">
&lt;ion-note item-right&gt;Last rated: {% raw %}{{cat.lastRating | dtFormat}}{% endraw %}&lt;&#x2F;ion-note&gt;
</code></pre>

Then the detail:

<pre><code class="language-markup">
&lt;ion-card-content&gt;
	The cat {% raw %}{{cat.name}}{% endraw %} has gotten {% raw %}{{cat.numRatings | numberFormat }}{% endraw %} ratings with an 
	average of {% raw %}{{cat.avgRating | numberFormat}}{% endraw %}.
&lt;&#x2F;ion-card-content&gt;
</code></pre>

Here is the result with French set as my language:

![Demo](https://static.raymondcamden.com/images/2016/12/intl4.png)

![Demo](https://static.raymondcamden.com/images/2016/12/intl5.png)

For comparison, here is the home page with English set as my language:

![Demo](https://static.raymondcamden.com/images/2016/12/intl2.png)

You can find the full source here: https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionic_intl