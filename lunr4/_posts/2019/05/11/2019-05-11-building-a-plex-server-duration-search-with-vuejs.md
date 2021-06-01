---
layout: post
title: "Building a Plex Server Duration Search with Vue.js"
date: "2019-05-14"
categories: ["javascript"]
tags: ["vuejs"]
banner_image: /images/banners/movies.jpg
permalink: /2019/05/14/building-a-plex-server-duration-search-with-vuejs
description: Using the Plex API and a Vue.js front-end to search movies by duration
published: true
---

A few days ago a good friend asked me a question about [Plex](https://www.plex.tv/). If you've never heard of it, Plex is an _awesome_ media server that creates an easy to use UI for media (videos, music files, pictures, etc.). It's very popular and you can use it via the web, mobile devices, and smart TVs. It's relatively easy to use and you can share your (legally acquired of course) content with friends. My friend mentioned that it would be cool if Plex had a way to find a movie of a particular length. In this case, dinner was in an hour or so and it would be neat to find something of that particular length. Plex lets you sort by duration but you can't filter to a particular length (or range of lengths).

So of course I took this simple request and spent numerous hours building a demo that was _way_ overengineered but fun to build. It also gave me an opportunity to play with a "proper" Vue.js application. If you've read this blog you'll note that 99% of what I build with Vue.js is on the simpler side, just a script tag and some basic code. I rarely actually play with full Vue.js apps and I really wanted the chance to. I also wanted to use [CodeSandbox](https://codesandbox.io/) more, and that worked _incredibly_ well for this project. When I finished, I clicked a button, and my site was published to [Netlify](https://www.netlify.com/) in about two minutes.

Let me begin by showing the final result. I don't plan on sharing the URL, but you can view the repository here: <https://github.com/cfjedimaster/plex-movie-duration-search/>

The application begins with a simple signin form:

<img src="https://static.raymondcamden.com/images/2019/05/plex1.png" class="imgborder imgcenter" alt="Login screen for application">

After a successful login, you then enter your server address.

<img src="https://static.raymondcamden.com/images/2019/05/plex2.png" class="imgborder imgcenter" alt="Entering server information.">

At this point, the application will hit your server, load information on _all_ your movies, and present them with a UI control on top to allow filtering to a range of movies.

<img src="https://static.raymondcamden.com/images/2019/05/plex3.png" class="imgborder imgcenter" alt="Initial list of movies">

It isn't terribly obvious because the movie posters are big, but that's a scrollable list of all the movies available on the server. If you filter, the list automatically updates.

<img src="https://static.raymondcamden.com/images/2019/05/plex4.png" class="imgborder imgcenter" alt="Movies shown are now filtered to a specific duration.">

Alright, so let's talk about how I built this.

### The Plex "API"

So this was a bit interesting. Plex does have an API documented here: [Plex Media Server URL Commands](https://support.plex.tv/articles/201638786-plex-media-server-url-commands/). Notice they call this "URL Commands" and not an API. It begins by documenting how to get an authentication token. This is a simple POST hit to the main Plex server that returns a large set of user data where the only thing you'll need to care about is the `authentication_token`.

After that, the remaining API calls go against your own server. API calls allow for getting your libraries, listing library content, and getting specifics for an item. You can also request Plex to scan and refresh a library.

But wait - there's more. You can find a [wiki page](https://github.com/Arcanemagus/plex-api/wiki) documenting even more api "stuff" you can do, including asking for JSON data, that doesn't seem to have ever been officially documented by the Plex folks. For me all I cared about was getting JSON, but you'll want to check that link as well for more information.

My needs ended up boiling down to two needs:

* Login
* Get all libraries, and filter by those that are movie related.
* For each movie library, ask for all the movies.

This isn't too difficult honestly. Let's look at the API wrapper I built for my Plex calls. Note that Plex does *not* support CORS. I could have built a serverless proxy for it, but decided to just use <http://cors-anywhere.herokuapp.com/>. This is *not* something I'd recommend in production but it worked for the demo. In the code below, you'll notice two methods hit URLs prefixed with the wrapper.

```js
const plex = {
  async login(username, password) {
    console.log("try to login with " + username + " " + password);
    let form = new FormData();
    form.append("user[login]", username);
    form.append("user[password]", password);
    return fetch("https://plex.tv/users/sign_in.json", {
      method: "post",
      headers: {
        "X-Plex-Client-Identifier": "PlexWrapper",
        "X-Plex-Product": "PlxWrapper",
        "X-Plex-Version": 1
      },
      body: form
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        return res;
      });
  },

  async getMovies(user, server) {
    let movies = [];
    console.log(
      "try to get movies for " + server + " " + user.authentication_token
    );
    return new Promise(async (resolve, reject) => {
      let response = await fetch(
        `https://cors-anywhere.herokuapp.com/http://${server}:32400/library/sections?X-Plex-Token=${user.authentication_token}`,
        {
          headers: {
            Accept: "application/json",
            "x-requested-with": "javascript"
          }
        }
      );

      let librariesRaw = await response.json();
      let libraries = librariesRaw.MediaContainer.Directory;
      //console.log(libraries);
      let movieLibs = libraries.filter(l => {
        return l.type === "movie";
      });

      //iterate over all movieLibs
      movieLibs.forEach(async m => {
        let movieRequest = `https://cors-anywhere.herokuapp.com/http://${server}:32400/library/sections/${m.key}/all?X-Plex-Token=${user.authentication_token}`;
        
        let response = await fetch(movieRequest, {
          headers: {
            Accept: "application/json",
            "x-requested-with": "javascript"
            }
          }
        );
        
        
        let movieRaw = await response.json();
        movieRaw.MediaContainer.Metadata.forEach(m => {
          m.poster = `http://${server}:32400${m.thumb}?X-Plex-Token=${user.authentication_token}`;
          m.duration = m.Media[0].duration;
        });
        movies.push(...movieRaw.MediaContainer.Metadata)
        
      });
      resolve(movies);
    });
  }
};

export default plex;
```

The `login` call isn't too complex, just a post, but do note that they are strict on the header requirements. They don't seem to care what you pass, but you must pass something there.

For `getMovies`, I first ask for all the libraries. I filter them by `type` being equal to `movie`. Once I have that, I can then make a request to each library for the assets and copy them all to an array. Note that in the loop I set two values to make things easier in the rest of my Vue code, `poster` and `duration`. This is just a shortcut for - as I said - simplification.

I'm still "guessing" my way through `async` and `await` but my God do I love them.

### The Vue.js Application

I've already shared screenshots above, but how does the Vue application break down into parts? I've got:

* A login screen
* A "set server" screen
* And a "show an filter movies" screen.

Let's tackle these one by one. Note that I'm making use of [Vuetify](https://vuetifyjs.com/en/) for my UI layer. I like it, but sometimes the "layout" parts confuse me. UI widgets for the most part are easy to understand, but the grid/layout system still boggles me a bit. Anyway, the login screen:

```html
<template>
  <div>
    <v-flex>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Login Form (Use Plex credentials)</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              prepend-icon="person"
              name="login"
              label="Login"
              type="text"
              v-model="username"
            ></v-text-field>
            <v-text-field
              prepend-icon="lock"
              name="password"
              label="Password"
              id="password"
              type="password"
              v-model="password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="login">Login</v-btn>
        </v-card-actions>
      </v-card>

      <v-alert :value="loginError" type="error">Invalid login credentials.</v-alert>
    </v-flex>
  </div>
</template>

<script>
import plex from "../api/plex";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      loginError: false
    };
  },
  methods: {
    async login() {
      this.loginError = false;
      let result = await plex.login(this.username, this.password);
      if (result.error) {
        this.loginError = true;
      } else {
        // store the user
        this.$store.commit("setUser", result.user);
        // now move on
        this.$router.replace("/selectserver");
      }
    }
  }
};
</script>
```

The layout consists of a login form with an alert dialog that shows up on error. The one method, `login`, does exactly that. Note I'm using an incredibly simple Vuex store to remember values. Now let's move on the set server screen:

```html
<template>
  <div>
    <h1>Select Server</h1>
    <p>
      Enter the IP address of your server:
    </p>
    <v-text-field v-model="server"
            label="ip address"
            required
    ></v-text-field>
    <v-btn color="info" @click="setServer">Set Server</v-btn>

    <v-alert :value="serverError" type="error">
      Please specify a server.
    </v-alert>

  </div>
</template>

<script>
export default {
  name: "SelectServer",
  data() {
    return {
      server: "",
      serverError: false
    };
  },
  methods: {
    setServer() {
      this.serverError = false;
      if (this.server === "") {
        this.serverError = true;
      } else {
        this.$store.commit("setServer", this.server);
        this.$router.replace("/main");
      }
    }
  }
};
</script>
```

This is virtually a repeat of the previous screen except this time I'm just asking for one prompt, the server. There isn't any validation on this, just a commit to the store. Finally, here's the movie display.

```html
<template>
  <div>
    <h1>Movies</h1>

    <v-subheader>Min and max duration in minutes:</v-subheader>
    <v-layout row>
      <v-flex shrink style="width: 60px">
        <v-text-field v-model="duration[0]" class="mt-0" hide-details single-line type="number"></v-text-field>
      </v-flex>

      <v-flex class="px-3">
        <v-range-slider v-model="duration" :max="500" :min="30" :step="10"></v-range-slider>
      </v-flex>

      <v-flex shrink style="width: 60px">
        <v-text-field v-model="duration[1]" class="mt-0" hide-details single-line type="number"></v-text-field>
      </v-flex>
    </v-layout>

    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs4 d-flex v-for="movie in filteredMovies" :key="movie.key">
          <v-card>
            <v-img :src="movie.poster"/>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{movie.title}}</h3>
                <div>{{movie.tagline}}</div>
                <div>{{movie.duration | durationDisplay }}</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import plex from "../api/plex";

export default {
  name: "Main",
  data() {
    return {
      duration: [30, 500],
      movies: []
    };
  },
  computed: {
    filteredMovies() {
      return this.movies.filter(m => {
        let minS = this.duration[0] * 60 * 1000;
        let maxS = this.duration[1] * 60 * 1000;
        return m.duration > minS && m.duration < maxS;
      });
    }
  },
  async mounted() {
    let user = this.$store.state.user;
    let server = this.$store.state.server;
    this.movies = await plex.getMovies(user, server);
  }
};
</script>

<style scoped>
img {
  max-width: 250px;
  max-height: 250px;
}
</style>
```

Ok, so I figure the part where I get the movies is simple enough, but take note of `filteredMovies`, this is how I handle restricting movies. I do this based on the `duration` value, which is an array, which may seem weird, but that's how the Vuetify "double handed" range control needed to work. (Note, "double handed" is my own term and is probably wrong.) 

That's pretty much it. As I said, most of this was just to play around a bit more on CodeSandbox and to get more experience with a "full" Vue application. Don't forget I've got a GitHub [repo](https://github.com/cfjedimaster/plex-movie-duration-search/) available and if you want to see it on CodeSandbox as well, check it out below:

<iframe src="https://codesandbox.io/embed/744k1l0j9j?fontsize=14" title="plex-movie-duration-search" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>


<i>Header photo by <a href="https://unsplash.com/photos/GF8VvBgcJ4o?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Erik Witsoe</a> on Unsplash</i>