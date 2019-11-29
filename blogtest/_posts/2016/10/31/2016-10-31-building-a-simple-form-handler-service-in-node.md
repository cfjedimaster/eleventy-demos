---
layout: post
title: "Building a Simple Form Handler Service in Node"
date: "2016-10-31T10:03:00-07:00"
categories: [development]
tags: [nodejs]
banner_image: /images/banners/form_handler.jpg
permalink: /2016/10/31/building-a-simple-form-handler-service-in-node
---

From time to time, I'll re-build an app or service I think is cool just to give me a bit more practice in the language I'm learning. Today, I decided to build a simple version of the form handling service from [Formspree](https://formspree.io/). Just to be clear, what I'm sharing is *not* meant to be as good as Formspree. I'm a huge fan of their service (my [contact](/contact/) form uses it!) and I strongly recommend it. What follows is just a simple Node app having some of the same features.

The app I'm building is a general "forms processor" meant to be used by a static site. The idea is to take a form, point it to the service, and it will handle taking the form input and emailing to to you. That's it. These types of services are great for static sites that don't have a way to process form input. 

I began my little application by installing Express and defining a static directory pointing to my public folder. Here's that snippet of code.

<pre><code class="language-javascript">
var express = require('express');
var app = express();

// ... stuff here ...

app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));
</code></pre>

I then added a page in public called `index.html`. It basicaly just says "hello world", but in a real world version of this service I'd have text explaining how to use the service. See [Formspree](https://formspree.io) for an example.

So far so good. Now to begin the real meat - listening for form posts. Formspree uses a system where you simply set the action of your form to `//formspree.io/YOUREMAIL`. In Express, I know I could use a regex to define a route, so for the heck of it, I tried an email regex I fund from Stackoverflow:

<pre><code class="language-javascript">
app.get(/^[-a-z0-9~!${% raw %}%^&*_=+}{% endraw %}{% raw %}{\'?]+(\.[-a-z0-9~!$%{% endraw %}^&*_=+}{% raw %}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|{% endraw %}arpa{% raw %}|biz|{% endraw %}com{% raw %}|coop|{% endraw %}edu{% raw %}|gov|{% endraw %}info{% raw %}|int|{% endraw %}mil{% raw %}|museum|{% endraw %}name{% raw %}|net|{% endraw %}org{% raw %}|pro|{% endraw %}travel{% raw %}|mobi|{% endraw %}[a-z][a-z]){% raw %}|([0-9]{1,3}{% endraw %}\.[0-9]{% raw %}{1,3}{% endraw %}\.[0-9]{% raw %}{1,3}{% endraw %}\.[0-9]{% raw %}{1,3}{% endraw %}))(:[0-9]{% raw %}{1,5}{% endraw %})?$/i, function(req,res) {
    res.send(req.params);
});
</code></pre>

While this was a bit insane looking, it did load just fine, but I was never able to get it to match a request. My attempts to hit `/foo@foo.com` simply never matched the route. I decided to instead ose a simpler version:

<pre><code class="language-javascript">
app.post(/.+@.+/,function(req,res) {
</code></pre>

While certainly not perfect, it got the job done. I extracted the email by looking at the URL:

<pre><code class="language-javascript">
/*
begin by getting the email. 
req.originalUrl is /X, and we want X
*/
var email = req.originalUrl.substr(1);
</code></pre>

Alrighty then. So I knew how to get form data (load in `body-parser` and just look at `req.body`), but now I needed to handle emailing. 

I decided to use the simple [Nodemailer](https://nodemailer.com/) package. I've used it in the past and for the most part, it just plain works. To make things even easier though I decided to *not* try to setup a real email account for this. Instead I used the simple [Maildev](https://www.npmjs.com/package/maildev) program that I've [recommended in the past](https://www.raymondcamden.com/2016/08/09/need-a-test-smtp-server).  It lets you set up a simple SMTP server locally and even runs a nice little web server so you can see the emails being sent. 

With that out of the way, I got to work. In theory, all I need to do is create a string of the form values and then email it. But I wanted to emulate one of Formspree's features where certain form fields give you a bit more control over the processing. My service would look for these form fields:

* _from - Used to set the `from` part of the email.
* _subject - Used to set a specific subject (defaults to "Form Submission").
* _next - The URL to load after a form submission (defaults to a "thank you" page on my server).

Here's the entirety of the route.

<pre><code class="language-javascript">
app.post(/.+@.+/,function(req,res) {
    /*
    begin by getting the email. 
    req.originalUrl is /X, and we want X
    */
    var email = req.originalUrl.substr(1);

    /*
    now, create a simple text email of form key/value pairs
    */
    var emailBody = 'Form submission received at '+(new Date()) + '\n';
    emailBody += '-----------------------------------\n\n';

    var from = 'noone@raymondcamden.com';
    var subject = 'Form Submission';
    var next = '/thankyou.html';

    for(var key in req.body) {
        /*
        A few fields are special: _from and _subject
        */
        if(key === '_from') {
            from = req.body['_from'];
        } else if(key === '_subject') {
            subject = req.body['_subject'];
        } else if(key === '_next') {
            next = req.body['_next'];
        } else {
            emailBody += key + '='+req.body[key]+'\n';
        }
    }
    emailBody += '\n-----------------------------------\n';
    console.log(emailBody);

    /*
    now set up the mail options
    */
    var mailOptions = {
        from:from,
        to:email,
        subject:subject,
        text:emailBody
    };

    transporter.sendMail(mailOptions, function(error, info ) {
        if(error) {
            console.log('Error sending email: '+error);
            //should redirect to an error page
        } else {
            console.log('Email sent ' + info.response);
            res.redirect(next);
        }
    });
    
});
</code></pre>

To test this, I used the excellent [Postman](https://www.getpostman.com/) app and just created a few tests.

![Postman FTW](https://static.raymondcamden.com/images/2016/10/fs1.png)

And then I confirmed the emails using the web interface from Maildev:

![Maildev FTW](https://static.raymondcamden.com/images/2016/10/fs2.png)

All in all, not too terribly complex, but again, I just built a small subset of what a 'real' service like Formspree supports. The biggest thing missing of course is confirmation of email addresses used when sending the contents. Again, if this seems useful to you, check out [Formspree](https://formspree.io). For the full source code of my demo, see the repo: https://github.com/cfjedimaster/NodeDemos/tree/master/formspree_copy