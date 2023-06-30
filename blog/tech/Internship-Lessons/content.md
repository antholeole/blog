I've had an incredibly blessed career path. Success is where opportunity meets action: as in, if you don't act you will not be successful - and I'm fully aware of the opposite: people who are talented, but never get their lucky because the stars just never align.

So before I go and talk about what I wish I did better, or wish I had changed, I want to make it clear: I'm beyond thankful for everyone who's helped me grow into a better person. I'm a lucky human, and I do not take that for granted. 

All 3 of these internships, if I had to judge, were incredibly successful by all metrics. Still, the bar for an intern is not unttainably high, and mistakes, sometimes cataclysmic, were made. 

As I take the first steps as a newly full time software engineer, please enjoy this walk down memory lane. If you're just starting your own internship journey: Welcome. It's scary. You will make mistakes and you will learn more than you could ever imagine. If you're a full timer: Let this passage be a reminder of how far you've come. 


## Internship One: The Startup

In the first line of the first section, I will clear something up: I did get this internship though friends and family. This was a series C startup, so it was not incredibly small (50+) but I would be lying if I claimed I had gotten an interview without a weighty referral. I do think I was well qualified, and I contributed real, valuable work to the project I was working on.

That being said, the people I worked with were brilliant. The difference between a startup and a large company, in my infinite wisdom, is that the engineers at the startup know they have to cut corners, and they attempt to select the corners they cut wisely. The big tech engineers leave no stone unturned (that's not to say that there is no WIP: there is WIP everywhere you look - everywhere!).
### Mistake 1: Being Too Scared to Ask Questions

I knew what a dotenv file was coming though the door - I've used them in my personal projects and the value of them was not lost on me. This was a small company, so there was very minimal onboarding - it was actually basically just: 

1. Sign these legal documents. 
2. Create a Github account.
3. Get Grokking. 

(I jest a bit, but it's not very far from the truth) I pulled the codebase down to my work - supplied laptop. Intellij was the IDE of choice, the corperate download given to me. The SpringBoot application was not entirely forign to me; i've used the framework before. My first mission was to run locally. I stared at the green "run project" button and it stared back at me: a small button press for man, a large step for career. And with a wave of resolve, I pressed it: the springboot project whirred to life. 

SPRING in ascii art scrolled across my console. I take a step back. 

And then it crashes.

Confused, I run it again. And it crashes again. One last try and one crash later, I had to come to gripes with the fact that the project was not running. Something was wrong. I began inspecting the logs. Environment variables were not set.

This was the point where the mistake was made: "I can fix this." I thought to myself. No one wants the rookie asking stupid questions on the first day, so I opted to not ask any questions at all. Slowly, I worked my way though the .env file. Each time I updated a variable, a new variable was missing or invalid. 
This was my first job working as a software engineer -my last job was pushing carts in a parking lot. Let it be known that I sweat a lot more on the first day of software than I did on the first day pushing carts. 
Thoughts of inadequacy swirled in my head. I thought of all the nice people I met, and how I'd be letting them down: "Damn" - I thought they'd think - "And he looked competent, too. Too bad - he can't even get the project running!" 
Lunchtime came and passed: I was still wrestling with the program - but with each crash, a realization became more and more clear in my head: I was not going to get this working. I had to bite the bullet and ask for help.
But here comes a little aside about remote work: I believe remote work is great for the incumbents. They get to do what they need to do in the comfort and quiet of their own home. The barrier to disturb them is higher, and they get to build the mental mosaic with less risk of shattering. And for the intern, who is sweating in his bedroom, scared to fire off the slack message? Well  the fear is all in their head: they shouldn't be afraid to bother the senior principal architect VP of Technology CTO - they only have 100 more years of experience, their time is only thousands of times more valuable than yours. 
Again I exaggerate, but I do remember sending the Slack message, and quickly clicking away like I had just set a time bomb. And minutes later, I hear the then-unfamiliar-now-familiar chime of a slack message: "Oh sorry Anthony! We forgot to send you the local .env file." And then a second ping: a file download. With all the variables setup for a pristine run locally. And then a third: "Do you know where to put this? want to hop on a call and I can help you get it running?" 
No thanks, I had answered. Immediately I had resolved to ask more questions, and even quicker yet I had dropped that resolve, and began working on figuring out where to put that file.
But each message got less and less scary to send. Obviously, I try to do my own research before I bother someone else. But if the problem is taking me more than a hour and it really shouldn't be (in the sense that it's not triaging a bug, it's some basic prereq), then I no longer hesitate to ask.
Besides: That Super Senior Architect VP of Technology CTO? Their job is no longer to code - it is to help the silly intern and fix structural friction. 

---

I wrapped up that internship being a significant contributor to the codebase. I was really, genuinely proud of the work I did there - it helped that I had experience in the frameworks, but the contributions I made really were meaningful. In fact, I can go to the website right now and see my work. 

## Internship Two: The 'Zon

Internship two was a large step up. I had sucessfully completed my first internship, and it went onto the resume: I really had considered returning there - the experience was wonderful. Alas, a larger paycheck was waved in my face and I folded like a metal chair.

So off to the worlds largest package company I went: still remote - no worries from me, though. I was a remote pro - I had a whole 3 months under my belt. 

### Mistake 2: Diving in headfirst

I had let the lessons of internship one simmer in my head, and the result? Newfound confidence. Amazon has a culture of design reviews - one that I completely decided to forego. I was given a tour of the current infra for the project I was working on - the standard mesh of cloud services that, on paper, sounded like a rube goldberg machine with 100 different places data could snag or bugs could become cataclysmic. 

It's always easier to write new services than it is to edit old services: so I had choosen the cowards route. "Instead of modifying the existing services," I thought, "I would bolt on my new feature as a modification to the existing services" - curtesy of AWS Lambdas and Triggers.

Now I'm thinking with microservices.

I had weekly check-ins with my mentor, and attended the standup every morning: perhaps no one was really paying attention to what I was saying, but I was cranking on the lambda. One of the first mentor checkins was scheduled and I vividly remember my mentor asking me: "Hey - how are you doing? When do you think you'll be ready for a design review?" I blinked twice. The words did not register. Design review? this must be some fancy word for code review. "I'll have a PR out in a couple of days!" now their turn to blink twice: "Did you say code review? You're writing code?" a quick back and forth and we calibrated eachothers expectations. 
Luckily - or perhaps it was because I had already started, and they would have felt bad for making me start over - most of the design I had translated from my whiteboard to a quip doc was approved. Should it have been was a different story - knowing what I know now, I would have designed it entirely differently. It was not a piece of art to say the least. 

# 3. Foregoing tools entirely

A sorespot on the open source world is that private companies profit billions on the backs of free labor. While this is a problem, there is a balance to be struck: I don't think companies should just fork products and relabel them as their own, but I don't think not using open source code is the solution either. 

Code needed to be audited before it was added internally, and for good reason: the year I was working at Amazon was the year supply chain attacks went mainstream. 

I had asked about including third party code, and they said I would have to undergo an auditing process. Remember, this was my summer of "think little do much" and I had decided that such a slowdown would not be tolerated. I homerolled it all. 

In hindsight, this was a situation where one step back would have given me three steps forward. I should have utilized those tools, and my Frankenstein Monster was in part a Frankenstein Monster because of "having" to homeroll it all. 

---


Internship two wrapped up, and here's a quick justification of my gung-ho'ness: I would definately not have finished my project if I had not pulled the time-saving stunts I did. Perhaps it was poor scoping, or perhaps it was due to my lack of investment in time saving tools, but following my demo, I did not sleep - I was literally up all night making sure everything ran properly. There's something to be said here about how I had just created tech debt, but I did solve the problem, however held up by a paperclip it was.

## internship 3: The Googster

Last summer I was a Googler (And I took the fulltime offer - A Googler I will be!)
Honestly? Not too many regrets here. Perhaps it's because it's closer in the rearview mirror, or perhaps it's because I have no experience to learn from between the Google Internship and now, but I couldn't come up with something quite as impactful as the other 3. No having to change my shirt after ever meeting because I was sweating through them, no daily speed coding challenges and no skipped design reviews. I made connections I'm thankful for, met people that are brilliant, and contributed code I wasn't sure I'd be able to.

so here's a mini-lesson: Make the damn PR's small. I made my PR a monster, and it took far longer to review it than it did to code. It was disgusting and I feel bad for doing it to my reviewers!