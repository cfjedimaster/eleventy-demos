---
layout: post
title: "My first native iOS app - Death Clock"
date: "2014-03-25T12:03:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/03/25/My-first-native-iOS-app-Death-Clock
guid: 5184
---

<p>
A few days ago I <a href="http://www.raymondcamden.com/index.cfm/2014/3/22/I-survived-Big-Nerd-Ranch-training">returned</a> from a week of Objective-C and iOS training. I wanted to build an app on my own just to see what I could do and how comfortable I felt with the technology away from the Nerd Ranch. While it isn't pretty and the code is probably wrong in <i>multiple</i> ways, I've been able to create a native version of the Death Clock.
</p>
<!--more-->
<p>
I used a UINavigationController to handle my views. I like the simple push, pop architecture and that you can disable the navigation bar. I wanted a "full screen" view for my application so that was important. The application is split into two sections. The initial screen is a simple config.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot17.png" />
</p>

<p>
For the application I decided to only use birthdate and not gender. I wish there was a bit more control over the data picker widget. It seems huge to me. I spent about 30 seconds on the button so pardon the low tech look. The application also makes use of NSUserDefaults to record your birthdate for future loads. Want to see what this screen looks like? Check it out:
</p>

<pre><code class="language-javascript">&#x2F;&#x2F;
&#x2F;&#x2F;  RKCConfigViewController.m
&#x2F;&#x2F;  Death Clock
&#x2F;&#x2F;
&#x2F;&#x2F;  Created by Raymond Camden on 3&#x2F;24&#x2F;14.
&#x2F;&#x2F;  Copyright (c) 2014 Raymond Camden. All rights reserved.
&#x2F;&#x2F;

#import &quot;RKCConfigViewController.h&quot;
#import &quot;RKCDeathClockViewController.h&quot;

@interface RKCConfigViewController()

@property (nonatomic, weak) IBOutlet UIDatePicker *birthdayPicker;
@property (nonatomic, weak) IBOutlet UIButton *startDeathClock;
@property (nonatomic, strong) NSDate *birthday;

@end

@implementation RKCConfigViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    
    if (self) {
        &#x2F;&#x2F;check for default
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        NSDate *defaultBD = [defaults objectForKey:@&quot;Birthday&quot;];
        NSLog(@&quot;%@&quot;, defaultBD);
        if(defaultBD) _birthday = defaultBD;
        else _birthday = [[NSDate alloc] init];
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    &#x2F;&#x2F;no times, just m&#x2F;d&#x2F;y
    _birthdayPicker.datePickerMode = UIDatePickerModeDate;
    _birthdayPicker.date = _birthday;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    &#x2F;&#x2F;you weren&#x27;t born in the future
    self.birthdayPicker.maximumDate = [[NSDate alloc] init];
    &#x2F;&#x2F;set an initial data
    _birthday = [[NSDate alloc] init];
}

- (IBAction)setBirthDay:(id)sender
{
    _birthday = self.birthdayPicker.date;
    NSLog(@&quot;Set bday for %@&quot;, self.birthday);

    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setObject:_birthday forKey:@&quot;Birthday&quot;];

}

- (IBAction)startDeathClock:(id)sender
{
    NSLog(@&quot;CLICK ME BABY&quot;);
    RKCDeathClockViewController *dvc = [[RKCDeathClockViewController alloc] init];
    dvc.birthday = _birthday;
    [self.navigationController pushViewController:dvc animated:NO];
}

@end
</code></pre>

<p>
The second view is the actual counter. This isn't terribly exciting. I've got the actual death date and then the number of seconds.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot27.png" />
</p>

<p>
And that's it. Want to see all the code? I created a new GitHub repo so I could store my examples. To be clear, do not <strong>consider</strong> this anything near "good" iOS programming. I just wanted to share. 
</p>

<p>
<a href="https://github.com/cfjedimaster/ObjectiveC-Examples">Objective-C Examples</a>
</p>

<p>
Later this week I think I may try to get this into the App Store. I figure I don't have much chance of it being accepted, but it can't hurt, right?
</p>