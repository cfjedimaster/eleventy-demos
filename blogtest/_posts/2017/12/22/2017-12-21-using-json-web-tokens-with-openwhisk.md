---
layout: post
title: "Using JSON Web Tokens with Serverless OpenWhisk"
date: "2017-12-22"
categories: [development,serverless]
tags: [javascript,vuejs,openwhisk]
banner_image: 
permalink: /2017/12/22/using-json-web-tokens-with-openwhisk
---

Hey folks, before I begin, let me preface the entry with a warning that this is an example of something I wanted to play with and should *not* be copied wholesale for your applications without a thorough security review. I got - well - attacked pretty harshly in comments a few months ago for making a few mistakes in terms of security so I want to ensure folks know that I'm putting this out as something to share, but you should use with caution. As always, if you have some constructive feedback in regards to how good/bad/etc this demo is, I'm always happy to read your comments. Whew, sorry for the long disclaimer. Let's get started, shall we?

Back in April, I wrote up a quick demo of JSON Web Tokens (JWT) and [Auth0](https://auth0.com/) to lock down OpenWhisk ([OpenWhisk, Serverless, and Security - a POC ](https://www.raymondcamden.com/2017/04/17/openwhisk-serverless-and-security-a-poc/)). In that demo, I use Auth0 and social login. It worked pretty well. But it assumes you just want to verify a user, any user. What if you wanted to authenticate to a particular set of users? For example, maybe you're building an admin interface for a site and have one simple admin login. That's a common thing I did for a lot of the sites I built for clients. While there may be users for the front end, the admin was a simpler, separate user system. I decided to build a simple demo of what this could look like. 

I begin with the authentication action.

```js
const jwt = require('jsonwebtoken');
const creds = require('./creds.json');

function main(args) {
    return new Promise((resolve, reject) => {

        if(!args.username {% raw %}|| !args.password) reject({message:'Invalid auth'}{% endraw %});
        // hard coded auth
        if(args.username !== 'admin' {% raw %}|| args.password !== 'letmein') reject({message:'Invalid auth'}{% endraw %});

        let token = jwt.sign(args.username, creds.secret);
        resolve({
            token:token
        });

    });

}

exports.main = main;
```

It begins by doing basic validation of the arguments. Then it simply checks against hard coded values for username and password. Note that I'm using a promise for the action even though everything is synchronous. In a real application, I assume you would check the credentials against a service, or database, and therefore would not be using an entirely synchronous solution. After the credentials are verified, I then create a JSON web token via the npm package I included in the beginning. You can read more about the package here - https://www.npmjs.com/package/jsonwebtoken. Note that I'm not using the option to add a timeout to the token. I think - typically - you would want a reasonable value there. That could be added like so: `jwt.sign(args.username, creds.secret, {% raw %}{'expiresIn':'1h'}{% endraw %})`. Oh, and `creds` is just a JSON file containing a key to use for signing and verifying:

```js
{
    "secret":"mymilkshakeisbetterthanyoursdamnrightit"
}
```

Ok, so that's authentication. What about verification?

```js
const jwt = require('jsonwebtoken');
const creds = require('./creds.json');

function main(args) {

    return new Promise((resolve, reject) => {
        let decoded = jwt.verify(args.token, creds.secret, (err,decoded) => {
            if(err) {
                console.log('err',err);
                reject({
                    name:err.name,
                    message:err.message,
                    stack:err.stack
                });
            } else {
                //passthrough, except token
                delete args.token;
                resolve(args);
            }

        });


    });

}

exports.main = main;
```

Once again I'm using the `jsonwebtoken` package for the bulk of the work. I decode the token and if it fails, throw an error. If it succeeds, note that I pass on every argument sent to the function except token itself. Why? The plan here is to allow the verify action to be used in an OpenWhisk action. I can use it to lock down my actions and let the non-token arguments be passed along the sequence. How would that look? Consider this super simple 'helloWorld' action:

```js
function main(args) {
    if(!args.name) args.name = 'Nameless';

    return {% raw %}{ result: `Hello, ${args.name}{% endraw %}`};
    
}
```

Given that my verification action was called `verify` and this is `helloWorld`, I can expose a locked down version like so:

	wsk action update --sequence safeHelloWorld verify,helloworld --web true

Just to recap, let me go over what I built.

* I have an "auth" action that has a web API. It lets me login and get a JWT in response.
* I have a "verify" action that is meant to be used in a sequence with other OpenWhisk serverless actions.
* Finally, I built a demo action and tied it to the verification action in a sequence.

Putting It Together
===

In order to test this out, I whipped up a quick Vue.js front end. I built it all in one file (which I'd not normally do), so let's check it out:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>JWT Demo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

    <div id="app">

        <div v-if="needLogin">

            <h2>Login</h2>
            <p>
            <label for="username">Username</label>
            <input type="text" v-model="username" id="username" required>
            </p>
            <p>
            <label for="password">Password</label>
            <input type="password" v-model="password" id="password" required>
            </p>

            <p>
                <input type="submit" @click="login" value="Login">
            </p>

            <p v-if="invalidLogin">
                <b>Invalid Login.</b>
            </p>
                
        </div>
        <div v-else>
                <h2>Hello World Demo</h2>
                <p>
                <label for="name">Enter Name:</label>
                <input type="text" v-model="name" id="name" required>
                </p>

                <p>
                    <input type="submit" @click="helloWorld" value="Test">
                </p>

                <p v-if="nameResult"><b>Result: {% raw %}{{nameResult}}{% endraw %}</b></p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script>
    const AUTH = 'https://openwhisk.ng.bluemix.net/api/v1/web/rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space/safeToDelete/auth.json';
    const HELLO = 'https://openwhisk.ng.bluemix.net/api/v1/web/rcamden{% raw %}%40us.ibm.com_My%{% endraw %}20Space/safeToDelete/safeHelloWorld.json';

    const app = new Vue({
        el:'#app',
        data() {
            return {
                needLogin:true,
                username:null,
                password:null,
                invalidLogin:false,
                token:null,
                name:null,
                nameResult:null
            }
        },
        methods:{
            login() {
                this.invalidLogin = false;
                console.log('login');
                fetch(AUTH+'?username='+encodeURIComponent(this.username)+'&password='+encodeURIComponent(this.password))
                .then(res => res.json())
                .then(res => {
                    console.log('result',res);
                    if(res.message) {
                        this.invalidLogin = true;
                    } else if(res.token) {
                        this.token = res.token;
                        this.needLogin = false;
                    }
                });
            },
            helloWorld() {
                this.nameResult = '';
                if(this.name.trim() === '') return;
                fetch(HELLO+'?token='+encodeURIComponent(this.token)+'&name='+encodeURIComponent(this.name))
                .then(res => res.json())
                .then(res => {
                    console.log('result',res);
                    this.nameResult = res.result;
                });

            }
        }
    })
    </script>
</body>
</html>
```

Alright, so from the top, we've got a simple layout that uses `v-if` to dynamically show or hide a login screen. The second div handles a form that will interact with the "helloWorld" service created earlier. 

The JavaScript is mostly taken up by two methods, one for login and one for helloWorld. In both cases I simply take the results and update my data and let Vue handle updating the front end. Make note that `login()` will remember the token value and `helloWorld` passes it to the method. 

You can run this demo here: https://cfjedimaster.github.io/Serverless-Examples/jwtdemo/client.html

Remember the username is `admin` and the password is `letmein`. You can find the complete source code for all the actions and front end here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/jwtdemo

So - what do you think? Leave me a comment below.