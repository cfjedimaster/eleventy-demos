---
layout: post
title: "Using Azure Functions and the Marvel API to Visualize Character History"
date: "2018-11-04"
categories: ["serverless","javascript"]
tags: ["azure","vuejs"]
banner_image: /images/banners/comicbooks2018.jpg
permalink: /2018/11/04/using-azure-functions-and-the-marvel-api-to-visualize-character-history
---

I've been playing with the [Marvel API](https://developer.marvel.com/) for quite some time now (["All My Friends are Superheroes"](https://www.raymondcamden.com/2017/01/18/all-my-friends-are-superheroes), ["Building a Twitter bot to display random comic book covers"](https://www.raymondcamden.com/2016/02/22/building-a-twitter-bot-to-display-random-comic-book-covers), ["Using the Marvel API with IBM Watson"](https://www.raymondcamden.com/2015/05/26/using-the-marvel-api-with-ibm-watson), and ["Exampled of the Marvel API"](https://www.raymondcamden.com/2014/02/02/Examples-of-the-Marvel-API)) and I find myself coming back to it from time to time to just see what cool stuff I can find in their database. Unfortunately it looks like Marvel isn't really doing anything new with their API lately, but at least it still works and I guess that's something. A few weeks ago I thought it would be an interesting experiment to see if you could automate visualizing the changes of a character over time. So what do I mean?

Consider this first image of Spider-Man from way back in 1962...

<img src="https://static.raymondcamden.com/images/2018/11/mv1.jpg" class="imgcenter imgborder" alt="Spider-Man comic cover from 1962">

And now compare it to this awesome shot from 1988:

<img src="https://static.raymondcamden.com/images/2018/11/mv2.jpg" class="imgcenter imgborder" alt="Spier-Man comic cover from 1988">

And finally to a cover from this year:

<img src="https://static.raymondcamden.com/images/2018/11/mv3.jpg" class="imgcenter imgborder" alt="Spider-Man comic cover from 2018">

I just love seeing the progression of style over the decades especially with such an iconic character. I decided to try to figure out a way to automate this and display it to the user. Now, before I go any further, let me state that I'm not going to run this demo "live". Why? First - I'm still not 100% sure how to stay "safe" in the free tier with Azure Functions. Last month I got a bill for 40 dollars because I made a wrong selection in a project and while that's my fault, I still feel a bit burned by it. Secondly, Marvel themselves have a limit on their API usage. It's a fair limit of course, but it's also something I just don't want to worry about. If either Microsoft or Marvel want to help me out here, just drop me a line! I won't hold my breath. ;) That being said, all of the code I'm about to show can be found at my GitHub repo here: <https://github.com/cfjedimaster/marvelcharacterovertime>

## The Back End

My back end is built using Azure Functions. This was the first time I made use of [Visual Studio Code integration](https://code.visualstudio.com/tutorials/functions-extension/getting-started) and damn did it work well. I think it took maybe twenty minutes of setup or so but once done, it was one quick command to deploy to Azure when I had updates. It was also easy to run the code locally. From my limited experience so far, this is the best way to work with Azure Functions (obviously if you are a Code user) and it's what I plan on using in the future. 

My application required only two specific features - the ability to search for characters and then the ability to find related covers over time. Let's start with the character search endpoint:

```js
const rp = require('request-promise');
const API_PUB_KEY = process.env.API_PUB_KEY;
const API_PRI_KEY = process.env.API_PRI_KEY;

const crypto = require('crypto');

module.exports = async function (context, req) {

    if (req.query.name) {

        let name = req.query.name;
        let baseUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${encodeURIComponent(name)}&apikey=${API_PUB_KEY}`;

        let ts = new Date().getTime();
		let hash = crypto.createHash('md5').update(ts + API_PRI_KEY + API_PUB_KEY).digest('hex');
		baseUrl += "&ts="+ts+"&hash="+hash;

        //console.log('baseUrl', baseUrl);

        return rp({
            url:baseUrl,
            json:true
        }).then(res => {
            //console.log(res.data);
            let results = [];

            if(res.data.total > 0) {
                results = res.data.results.map(r => {
                    return { id:r.id, name: r.name, thumbnail: r.thumbnail.path + '.' + r.thumbnail.extension };
                });
            } 

            context.res = {
                // status: 200, /* Defaults to 200 */
                body: results,
                headers: { 
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            };

        });
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string"
        };
    }
};
```

This one is the easiest as all it needs to do is use the [characters](https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0) endpoint with the `nameStartsWith` argument. This will let you enter a value, like 'spider', and get results. The stuff with the time and hash is simply part of Marvel's API security which frankly feels like overkill but there it is. I get the results and then map it down a bit to remove a lot of data I don't need. This makes the communication between Azure Functions and my web app a lot zippier as I'm not returning unnecessary data.

Cool! So far so good, I'm sure the next endpoint will be just as easy, right? Hah! 

Marvel doesn't have an API that returns covers with certain characters, but you can search comics for a character and I figured that would be close enough. In order to get my data, I thought I'd search for a year's worth of data for results including a character. Unfortunately, the character API doesn't return when a character was first seen. So in order to estimate that, I did a search with a date range from 1950 to 2090. Please feel free to come find me in 2090 and complain.

I sort those results by the sale date and then use the *first* result as indicative of when the character's first appearance was. I didn't test this heavily but it seemed to work well with Spider-Man.

Once you have that - you can then ask for comics from every year from the initial year till the current year. And that's basically it. Here's the code:

```js
const rp = require('request-promise');
const API_PUB_KEY = process.env.API_PUB_KEY;
const API_PRI_KEY = process.env.API_PRI_KEY;

const  crypto = require('crypto');

module.exports = async function (context, req) {

    /*
    First idea:
    first we do a comic search with a date range of 1950-2090 in an attempt to find the first comic
    this gives us X. We then get 10 comics from X to THIS_YEAR

    Second idea:
    go from THIS_YEAR to THIS_YEAR-- until we get nothing back. 
    however, it's possible for a character to 'go away' for a few years. so maybe we would allow for '3 strikes'
    of no results and only stop when we've hit that limit
    */

    if (req.query.id) {
        let id = req.query.id;

        return new Promise((resolve, reject) => {

            // ok - try to get first issue
            let baseUrl = `https://gateway.marvel.com:443/v1/public/comics?dateRange=1950-01-01%2C2090-01-01&characters=${id}&orderBy=onsaleDate&apikey=${API_PUB_KEY}`;

            let ts = new Date().getTime();
            let hash = crypto.createHash('md5').update(ts + API_PRI_KEY + API_PUB_KEY).digest('hex');
            baseUrl += "&ts="+ts+"&hash="+hash;

            //console.log('baseUrl', baseUrl);

            rp({
                url:baseUrl,
                json:true
            }).then(res => {
                
                let firstDate = '';

                if(res.data && res.data.results && res.data.results.length > 0) {
                    let firstResult = res.data.results[0];
                    // from what I know the type is always onsaleDate
                    firstDate = new Date(firstResult.dates[0].date).getFullYear();
                }

                // no firstDate?
                if(firstDate === '') {
                    context.res = {
                        body: {result:[]},
                        headers: { 'Content-Type':'application/json' }
                    };
                    resolve();
                    //not sure I need this
                    return;
                }

                //temp hack:
                //firstDate = 2015;

                //get this year
                let thisYear = new Date().getFullYear();

                console.log('going to go from '+firstDate+ ' to '+thisYear);
                let coverCalls = [];
                for(let x = firstDate; x <= thisYear; x++) {
                    let dateStr = x + '-01-01%2C'+ x + '-12-31';
                    let thisUrl = `https://gateway.marvel.com:443/v1/public/comics?dateRange=${dateStr}&characters=${id}&orderBy=onsaleDate&limit=10&apikey=${API_PUB_KEY}`;

                    let ts = new Date().getTime();
                    let hash = crypto.createHash('md5').update(ts + API_PRI_KEY + API_PUB_KEY).digest('hex');
                    thisUrl += "&ts="+ts+"&hash="+hash;

                    console.log(thisUrl);

                    coverCalls.push(rp({
                        url:thisUrl,
                        json:true
                    }));

                }

                Promise.all(coverCalls).then((data) => {
                    console.log('in the all for calling covers');

                    let results = [];

                    //each index of data is year X, we will return the: year,  [title, cover]
                    for(var x=0;x<data.length;x++) {
                        let item = {};
                        item.year = x + firstDate;
                        item.comics = [];
                        for(var y=0;y<data[x].data.results.length;y++) {
                            let comic = {};
                            comic.title = data[x].data.results[y].title;
                            comic.cover = data[x].data.results[y].thumbnail.path + '.' + data[x].data.results[y].thumbnail.extension;
                            item.comics.push(comic);
                        }
                        results.push(item);
                    }

                    context.res = {
                        body: {result:results},
                        headers: { 
                            'Content-Type':'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    };
                    resolve();

                }).catch(e => {
                    console.log('error', e);
                });


            });

        
        });
       
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass an id (for the character) on the query string"
        };
    }
};
```

You'll notice I'm using an array of Promises so I can quickly fire off a bunch of requests at once and wait for them all to complete. Marvel doesn't have a "throttle" limit so this may not always work well for other APIs. Finally, note I'm once again mapping the results back to limit the data being sent to the front end.

### The Front End

The front end was a simple affair - prompt for the character, show results, then render comic covers over time. I built it using Vue.js and had quite a bit of design help from my buddy [Garth](https://garthdb.com/). I really wish I could run this live for yall but as I said above, I just can't do it that for free and within the API limits. 

Let's start with the character search result screen:

<img src="https://static.raymondcamden.com/images/2018/11/mv4.jpg" class="imgcenter imgborder" alt="Example of app comic character result screen">

After you select a character, I then hit the back end, which frankly worked really freaking fast, especially considering how much data someone like Spider-Man has. Here are four screen shots from a heck of a long set of results:

<img src="https://static.raymondcamden.com/images/2018/11/mv5.jpg" class="imgcenter imgborder" alt="Comic results">

<img src="https://static.raymondcamden.com/images/2018/11/mv6.jpg" class="imgcenter imgborder" alt="Comic results">

<img src="https://static.raymondcamden.com/images/2018/11/mv7.jpg" class="imgcenter imgborder" alt="Comic results">

<img src="https://static.raymondcamden.com/images/2018/11/mv8.jpg" class="imgcenter imgborder" alt="Comic results">

The code is pretty simple. Here's the layout:

```markup
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title></title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width">
  <style> [v-cloak] {display: none};
		</style>
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400" rel="stylesheet">
  <link rel="stylesheet" href="app.css">
</head>

<body>
  <div id="app" v-cloak>
    <!-- block used to have you search for a char -->
    <div v-if="needCharacter">
      <form class="searchForm" @submit="search($event)">
        <fieldset class="searchForm__fieldset" :disabled="characterSearching">
          <label class="searchForm__label">Enter a character name: <input class="searchForm__input" v-model="character" type="search"></label>
          <button class="searchForm__input searchForm__submit" @click="search($event)">Search</button>
          <button class="searchForm__input searchForm__reset" @click="reset()">Reset</button>
        </fieldset>
      </form>
      <p v-if="noCharacters">I'm sorry but I couldn't find any matches for that search.</p>
      <div v-if="characters">
        <ul class="charactersList">
          <li class="characterCard" v-for="character in characters" @click.prevent="loadChar(character)">
            <div class="characterCard__thumb" v-bind:style="{ backgroundImage: `url(${character.thumbnail})` }"></div>
            <div class="characterCard__name">{{character.name}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- you have a char, we're getting covers now -->
    <div v-if="loadingCharacter">
      <div class="loadingCovers" v-if="loadingCovers">
        <i>Loading covers...</i>
      </div>
      <div class="coversView" v-if="covers">
        <div class="breadcrumbs">
          <h1><a href="./">Search</a> &gt; {{currentCharacter.name}}</h1>
        </div>
        <div v-for="coverData in covers">
          <h2 class="covers__year">{{coverData.year}}</h2>
          <ul class="coversList">
            <li class="coverCard" v-for="comic in coverData.comics">
              <img :src="comic.cover" class="coverCard__image" :title="comic.title">
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <script src="https://unpkg.com/vue"></script>
  <script src="app.js"></script>
</body>

</html>
```

And here's the corresponding Vue code:

```js
//const searchAPI = 'http://localhost:7071/api/searchCharacters?name=';
//const coverAPI = 'http://localhost:7071/api/getCharacterCovers?id=';
const searchAPI = 'https://marvelcomicchar.azurewebsites.net/api/searchCharacters?name=';
const coverAPI = 'https://marvelcomicchar.azurewebsites.net/api/getCharacterCovers?id=';

const app = new Vue({
  el: '#app',
  data: {
    needCharacter: true,
    character: '',
    currentCharacter: '',
    characterSearching: false,
    noCharacters: false,
    characters: [],
    loadingCharacter: false,
    loadingCovers: true,
    covers: [],
    noCovers: false
  },
  methods: {
    search: function(event) {
      if (event) event.preventDefault()
      if (this.character === '') return;
      console.log('search for ' + this.character);
      this.noCharacters = false;
      this.characterSearching = true;
      fetch(searchAPI + encodeURIComponent(this.character))
        .then(res => res.json())
        .then(res => {
          this.characterSearching = false;
          if (res.length === 0) this.noCharacters = true;
          console.log(res);
          this.characters = res;
        });
    },
    loadChar: function(c) {
      console.log('load', c.id, c.name);
      this.currentCharacter = c;
      this.needCharacter = false;
      this.loadingCharacter = true;
      fetch(coverAPI + encodeURIComponent(c.id))
        .then(res => res.json())
        .then(res => {
          this.loadingCovers = false;
          if (res.length === 0) this.noCovers = true;
          //console.log(res);
          // todo, remove http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg
          this.covers = res.result;
        });
    },
    reset: function() {
      console.log('reset here')
    }
  }
});
```

There really isn't much more here than some Ajax calls. There's definitely more I could do (as the comments themselves say) but it gets the job done.

If you want to see the *full* set of results, I can say that the "print to pdf" version is 150 pages. That's partially because there's some oddities in PDF form that make it take up more vertical space, but it's truly kind of impressive to look at almost sixty years of Spider-Man over time. 

So I felt bad and did a quick hack. I used devtools to copy all the image URLs, I then whipped up a quick CodePen that just rendered them all - nearly 500 of them. You can view it here: <https://codepen.io/cfjedimaster/full/QJwyOB/>