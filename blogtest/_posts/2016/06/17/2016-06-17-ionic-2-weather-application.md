---
layout: post
title: "Ionic 2 Weather Application"
date: "2016-06-17T10:54:00-07:00"
categories: [javascript,mobile]
tags: [ionic,cordova]
banner_image: 
permalink: /2016/06/17/ionic-2-weather-application
---

<strong> Edited on January 16, 2017: I received reports that the app was not working with the
most recent versions of Ionic 2. I've built an updated version that seems to work well, but
I did not test it heavily. You can find that version here: https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionicweatherv3 </strong>

Before I begin, a quick reminder that I am still *way* new to Angular 2 and Ionic 2. I'm trying to learn, but you should treat what follows as the ramblings of a semi-intelligent monkey doing his best to learn something new. So with that disclaimer out of the way, I'd love to share an application I built this week - Ionic Weather.

<!--more-->

Ionic Weather is *heavily* influenced by the excellent [Yahoo Weather](https://itunes.apple.com/us/app/yahoo-weather/id628677149?mt=8) mobile app (available on both iOS and Android, the previous link is just for the iOS version). I was motivated to build this app by the [NativeScript Weather App challenge](https://www.nativescript.org/blog/the-summer-lovin'-nativescript-weather-app-ultimate-challenge), and while obviously this isn't NativeScript, I figured I'd try it first in Ionic 2 and then see if I could build something similar in NativeScript. 

Ionic Weather has a simple interface. When you start up, you are prompted to select your first city.

<img src="https://static.raymondcamden.com/images/2016/06/iw1a.png" class="imgborder">

Clicking Add Location (or the + in the UI) opens up a prompt:

<img src="https://static.raymondcamden.com/images/2016/06/iw2.png" class="imgborder">

Enter a location and then it will be added to your list of cities. I then render a picture based on the weather and report on it in text.

<img src="https://static.raymondcamden.com/images/2016/06/iw3.png" class="imgborder">

The text here was arbitrary. I initially went with a tabular interface, but I thought a descriptive text version would be kind of cool. The storm thing is kind of personal. I love storms, but I've got an incredible phobia of them as well. Not sure if that makes sense, but when I found that the API I was using supported the feature, I had to include it.

When more cities are added, you use a swipe interface to switch between them. I don't yet support a way of deleting cities, but I'll add that sometime in the future. (Maybe. I tend to say stuff like that and never actually get around to doing it.)

Now let's take a look at the code. 

First, the main (and only) view, home.html:

<pre><code class="language-javascript">
&lt;ion-toolbar primary&gt;
	&lt;ion-buttons start&gt;
		&lt;button royal (click)=&quot;doAdd()&quot;&gt;
		&lt;ion-icon name=&quot;add-circle&quot;&gt;&lt;/ion-icon&gt;
		&lt;/button&gt;
	&lt;/ion-buttons&gt;
	&lt;ion-title&gt;Weather&lt;/ion-title&gt;
&lt;/ion-toolbar&gt;

&lt;ion-content *ngIf=&quot;!locations.length&quot; padding&gt;
	&lt;h2&gt;No Locations&lt;/h2&gt;
	&lt;p&gt;
		You currently don't have any locations. Please add one.
	&lt;/p&gt;

	&lt;button full (click)=&quot;doAdd()&quot;&gt;Add Location&lt;/button&gt;

&lt;/ion-content&gt;

&lt;ion-content #weatherContent *ngIf=&quot;locations.length&quot; padding [ngClass]=&quot;curClass&quot;&gt;

	&lt;ion-slides #mySlides (ionDidChange)=&quot;onSlideChanged()&quot;&gt;
		&lt;ion-slide *ngFor=&quot;let location of locations;let i = index&quot;&gt;
			&lt;h2&gt;{% raw %}{{location.name}}{% endraw %}&lt;/h2&gt;

			&lt;div *ngIf=&quot;weatherData[i]&quot;&gt;
				&lt;p&gt;
				{% raw %}{{ weatherData[i].summary }}{% endraw %}
				&lt;/p&gt;
				&lt;p style=&quot;text-align:justify&quot;&gt;
				It is currently {% raw %}{{ weatherData[i].temperature |{% endraw %} number:'2.0-0' }} &amp;deg;F
				and there is {% raw %}{{weatherData[i].precipProbability |{% endraw %} percent}} chance of rain.
				Tomorrow will be {% raw %}{{weatherData[i].tomorrow.summary}}{% endraw %} with the
				low being {% raw %}{{ weatherData[i].tomorrow.temperatureMin |{% endraw %} number:'2.0-0' }} &amp;deg;F
				and a high of {% raw %}{{ weatherData[i].tomorrow.temperatureMax |{% endraw %} number:'2.0-0' }} &amp;deg;F.
				&lt;/p&gt;
				&lt;p style=&quot;text-align:justify&quot;&gt;
				The nearest storm to you is {% raw %}{{weatherData[i].nearestStormDistance}}{% endraw %} miles away.
				&lt;/p&gt;
			&lt;/div&gt;
		&lt;/ion-slide&gt;
	&lt;/ion-slides&gt;


&lt;/ion-content&gt;
</code></pre>

The top portion of the template is the simple header. You can see the button used to add locations as well.

Next, I've got two &lt;ion-content&gt; blocks. This is how I handle that initial view when you have no locations. When there are locations, I loop over them and display weather data for each. You'll notice I'm using a second array, `weatherData`, for probably what will end up being a dumb reason, but let's worry about that later. 

That's the view, now let's discuss the services I use. When you enter an address, I use Google's [Geocoding](https://developers.google.com/maps/documentation/geocoding/intro) API to reverse geocode the address to a longitude and latitude value. Here's that code.

<pre><code class="language-javascript">
import {% raw %}{Injectable}{% endraw %} from '@angular/core';
import {% raw %}{Http}{% endraw %} from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the GeocodeService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeocodeService {
  key:String = 'change';
  
  constructor(public http: Http) {}

  locate(address) {

	// don't have the data yet
	return new Promise(resolve =&gt; {
	  // We're using Angular Http provider to request the data,
	  // then on the response it'll map the JSON data to a parsed JS object.
	  // Next we process the data and resolve the promise with the new data.
	  this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(address)+'&amp;key='+this.key)
		.map(res =&gt; res.json())
		.subscribe(data =&gt; {
			// we've got back the raw data, now generate the core schedule data
			// and save the data for later reference
			if(data.status === &quot;OK&quot;) {
				resolve({name: data.results[0].formatted_address, location:{
					latitude: data.results[0].geometry.location.lat,
					longitude: data.results[0].geometry.location.lng
				}});
			} else {
				console.log(data);
				console.log('need to reject');
			}
		});
	});
  }
}
</code></pre>

All I do is call their API with the address and massage the result a bit to make it simpler for the caller. 

The Weather service is provided by [Forecast.io](http://forecast.io). They have a great API, and I thought the storm info was neat. My only real concern is their support. I'm not a paying customer, but I reached out to them two days ago with a question and never heard back from them. (For folks curious about my question, the storm info they provide includes a distance and a bearing, but not a location. So you know how far away a storm is and the direction it is heading, but not the exact location of the storm. So basically you can't tell if the storm is approaching you.) Here is the code for that service.

<pre><code class="language-javascript">
import {% raw %}{Injectable}{% endraw %} from '@angular/core';
import {% raw %}{Http}{% endraw %} from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the WeatherService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WeatherService {
  key: string = 'change';

  constructor(public http: Http) {
    this.http = http;
  }

  load(latitude:String,longitude:String) {

      return this.http.get('https://api.forecast.io/forecast/'+this.key+'/'+latitude+','+longitude+'?exclude=alerts,minutely,hourly')
        .map(res =&gt; res.json());
        
  }
}
</code></pre>

In this service, I don't change the result at all so it is much simpler. 

So - all that leaves then is the logic for the home page itself. It is... a bit messy. I want to talk about what I did before I just dump a bit page of code down so that it will - hopefully - make a bit more sense.

In general, my logic begins with a check to see if you have locations. I use LocalStorage to store an array of location objects. I kept this code within the home logic and didn't abstract it out to a service itself, but obviously that's something I could do too. When I store a location, it is only *after* the Google Geocode call, so I have a place name and longitude/latitude pair. 

Here comes the fun part. When I render out the location, I do an async call to fetch the weather for the location. I ran into issues when I added new locations and they didn't have their weather yet. This led me to working with 2 different arrays, `locations` and `weatherData`. I keep them in sync so that index N of locations matches index N of weatherData. 

I want to stress that I don't necessarily think this makes sense... but it worked. The last bit I added was the background image. That ended up being a royal pain in the rear because... well... CSS. The Yahoo Weather app does some cool Flickr integration where they'll show a picture relevant to your location. I decided to go much simpler and pick hard coded images based on the weather type. Here is what my CSS is now:

<pre><code class="language-javascript">
.weatherContent-partly-cloudy-day {
	background:linear-gradient(to bottom, rgba(255,255,255,0.7) 0{% raw %}%,rgba(255,255,255,0.8) 100%{% endraw %}), url(https://c2.staticflickr.com/8/7437/12735811404_22571641b1_z.jpg) no-repeat 0 0;
	background-size:cover;
}

.weatherContent-clear-day {
	background:linear-gradient(to bottom, rgba(255,255,255,0.7) 0{% raw %}%,rgba(255,255,255,0.8) 100%{% endraw %}), url(https://c2.staticflickr.com/6/5607/15473807871_0b00c10bb3_z.jpg) no-repeat 0 0;
	background-size:cover;
}
</code></pre>

So my code checks the weather and then applies the appropriate class. I've only done two so far (and Forecast.io doesn't actually give you all the possible condition values) but obviously it wouldn't be hard to add more in.

Alright - with that out of the way - here's the code - messy and all:

<pre><code class="language-javascript">
import {% raw %}{Component,ViewChild}{% endraw %} from '@angular/core';
import {% raw %}{WeatherService}{% endraw %} from '../../providers/weather-service/weather-service';
import {% raw %}{GeocodeService}{% endraw %} from '../../providers/geocode-service/geocode-service';
import {% raw %}{Alert, NavController,Slides,Content}{% endraw %} from 'ionic-angular';

@Component({
	providers: [WeatherService,GeocodeService],
	templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

	public weather:Object = {% raw %}{temperture:''}{% endraw %};
	public locations:Array&lt;Object&gt;;
	@ViewChild('mySlides') slider: Slides;
	@ViewChild('weatherContent') weatherContent:Content

	public curClass:String;

	/*
	I store a related array of weather reports so that when we add a city, we don't lose the existing
	data. Probably a better way of doing this.
	*/
	public weatherData:Array&lt;Object&gt;;

	constructor(public weatherService:WeatherService, public geocodeService:GeocodeService, public nav:NavController) {

		this.locations = this.getLocations();
		this.weatherData = [];

		if(this.locations.length) {
			this.locations.forEach((loc,idx) =&gt; {
				this.weatherService.load(loc.location.latitude, loc.location.longitude).subscribe(weatherRes =&gt; {
					this.weatherData[idx] = this.formatWeather(weatherRes);
					//update the css for slide 0 only
					if(idx === 0) this.curClass = 'weatherContent-'+this.weatherData[idx].icon;
				});
			});
		}

	}

	/*
	A utility func that takes the raw data from the weather service and prepares it for
	use in the view.
	*/
	formatWeather(data) {
		let tempData:any = data.currently;
		tempData.tomorrow = data.daily.data[1];
		//do a bit of manip on tomorrow.summary
		tempData.tomorrow.summary = tempData.tomorrow.summary.toLowerCase().substr(0,tempData.tomorrow.summary.length-1);
		return tempData;
	}

	addLocation(location:Object) {
		let currentLocations = this.getLocations();
		currentLocations.push(location);
		let index = currentLocations.length-1;
		this.weatherService.load(location.location.latitude, location.location.longitude).subscribe(weatherRes =&gt; {
			this.weatherData[index] = this.formatWeather(weatherRes);
			if(index === 0) this.curClass = 'weatherContent-'+this.weatherData[index].icon;
		});

		this.locations = currentLocations;
		localStorage.locations = JSON.stringify(currentLocations);
	}

	getLocations() {
		if(localStorage.locations) return JSON.parse(localStorage.locations);
		return [];
	}

	onSlideChanged() {
		let currentIndex = this.slider.getActiveIndex();
		var weatherClass = 'weatherContent-'+this.weatherData[currentIndex].icon;
		console.log('class is '+weatherClass);
		this.curClass = weatherClass;

	}

	doAdd() {
		let prompt = Alert.create({
			title:'Add Location',
			message:'Enter the new location (name or zip).',
			inputs:[
				{
					name:'location',
					placeholder:'Location'
				}
			],
			buttons:[
				{
					text:'Cancel',
					handler: data =&gt; {
					}
				},
				{
					text:'Add',
					handler:data =&gt; {
						if(data.location == '') return true;
						this.geocodeService.locate(data.location).then(result =&gt; {
							this.addLocation(result);
							this.nav.pop();
						});
						return false;
					}
				}
			]
		});
		this.nav.present(prompt);
	}

}
</code></pre>

Yep - not my best code, but it works. :) You can find the complete source for the application here: 

https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionicWeatherV2

Let me know what you think and I hope this helps!