---
title: "Learning To Type on a 3x5: Charybdis Nano Review"
description: Adventures With the New Charybdis Nano
pubDate: June 19, 2024
---

Around 3 years ago, I started my adventures with ergonomic keyboards - I had felt the tiniest bit of wrist pain after working at my desktop on my laptop keyboard, and I managed to turn that wrist pain into a hobby.

It started out, for me, with a Kinesis Advantage 2 - I think for most office workers, this is where the ergo stops. A lot of my current co-workers are still using their Original Advantage, the one that is split but not ergo.

For me, it opened a world of non-standard keyboards. 

Learning to type on the Advantage 2 was hard. It took me roughly 3 weeks to get good enough to feel fine using it a work - I felt that the productivity hit of using it was just far too high, turning an 8 hour workday into a effectively 2 or 3, because of all the time I spent re-writing missed keys.

That original advantage treated me right, but I found myself looking for more: I wanted something split, so that I could hold my arms shoulder width apart. I have a +1.5 standard deviation wingspan (I made that stat up, but it feels right to me) at 6ft 3in. Using a non-split keyboard felt like I was constantly activating my back.

Fast forward roughly a year and a half (for those keeping track, that's a year and a half ago) Kinesis released the Advantage 360, which was a split version of the 2. After finally being able to justify the jarring ~$500 sticker price by joining a company that required significant office time, I finally made the switch over to the 360 in the office, keeping my Advantage 2 at home. 

I loved the 360. I had, and almost still have, absolutely no complaints. I had the basic version which is wired but doesn't use QMK. I loved it so much that when I flew back to my hometown from San Francisco over Thanksgiving break, I took it along with me.

It was not airport friendly.

Traveling with it was a massive pain. I typically am able to fly without checking bags - and a device of the heft of the 360 would immediately raise some eyebrows at TSA, so I took it with me in my personal item, a backpack. It is quite large, and it got me thinking... 

what if I used one of those smaller keyboards? I'd prefer for it to be ergo, so no ferris sweep. I also _hate_ touching my mouse: I've been meticulously adding key binds to everything I touch my mouse to do, even going as far as installing the Vimium chrome plugin so I could browse websites and chat with coworkers without having to move my mouse around. Despite all that, though, there were sites that I needed to use my mouse for: the world, unfortunately, is not a Bloomberg terminal and requires some level of pointing and clicking.

So if the keyboard had some mouse alternative that could keep my hands in the same place all day, I would be over the moon.

Enter the Charybdis Nano, by Bastard Keyboards.

## The Build

The parts for the keyboard came in at an excellent price, especially for someone who is used to paying $400+ for a keyboard; this one came in at around $250, shipping and all. For a device that I'd be spending at least the next year using (hopefully more, but I seem to be keyboard hopping!) that is not a bad price at all.

This price is without the 3d print included - I didn't end up printing the keyboard myself, I had an experienced friend print it out for me, but according to them the print went seamlessly and was a "set and forget" experience.

I'm going to post a build log later, but the jist of the build went like this: I am an unexperienced solderer, who has coordination issues. If I managed to assemble tke keyboard without much hiccups, then so can you. I purchased 2 practice PCB's off of Amazon and that was all the practice I needed before I felt comfortable tackling the real thing. It took me roughly 30 hours to get it fully built.

Here's a picture of my build:

TODO INSERT IMAGE

## Getting Used to the Keyboard 

The cnano is... exactly as it is named: a very small board. Even now, when I feel comfortable typing on it (if it wasn't clear, this whole article was written on the cnano), when not engaged, my pinky is off the outer edge of the keyboard. When I type something that requires the pinky, like the letter a or a tilde, it comes back onto the keyboard to re-activate, but immediately goes back to its resting position, floating off the edge. Granted, keep in mind that this review is coming from someone who just transitioned from the mega-large Advantage 360.

Before I start to talk about the key map and whatnot, some more odds and ends about the board: I need to go back into my local makerspace and redo some switches - sometimes, the tilde key doesn't work, and likewise for the A key, but that's a "my assembly" problem, and is nothing wrong with the board itself. 

On the 360, I believe my natural rate of typing (that is the WPM that I was typing when I was not hindered by pesky thinking) was roughly 70wpm. On typing tests I could do 100wpm after a couple warm ups. Typing as fast as I can on the cnano, I hit 70wpm with the massive asterisk that I have been using this board for 4 days now. This is a massive adjustment from regular keyboarding to heavily layered, so take my WPM with a grain of salt for now.

The reason I bring up my WPM, though, is because I wanted to mention that at faster speeds, it seems that there is some level of output lag from the board. That is, when I get to probably a natural 50wpm, it seems the text sometimes comes out in chunks. It's a little hard to describe what I'm talking about in words, and it's ever so subtle: I attempted to record a video but it just looks like a regular typing video. Nonetheless, I can feel it: I press a key and then quickly after the next, and it seems they come out together at the same time. It may have to do with hold tap: perhaps QMK is waiting to see if I'm going to hold or tap the key, so it gets outputted on the release of the key rather than the press-down. I'm not sure if it messes me up at all, since I'm reasonably sure that regardless of how fast I type, the characters come out in the correct order.

Despite that particular oddity, I don't have any other complaints! I love this thing. It feels so satisfying to use, and despite choosing the quietest switches I could find (Kalih Silent Browns), the click of a hand-built keyboard is so satisfying. It looks beautiful, too: the exposed circuit, while probably not waterproof, is so cool to see. 

I do intend to write some QMK, but currently I should take a break from fiddling with this thing since a significant chunk of my free time was dedicated to assembly over the last couple of weeks.

## Getting Used to Miryoku

I started writing the first draft of this article an hour ago; thinking, punctuating, cat petting, and typos all took roughly an hour of the above section. That isn't far off from what writing an article on a traditional layout for me takes, and it's been 4 days since I plugged the keyboard in for the first time. 

I will, without a doubt, write a piece on this again in a couple more months of using this layout, but I feel as if I already have gotten used to it to some significant extent.

The layout just _makes sense_. Home row mods are excellent, and an idea that I would never have thought of myself. Tap-hold is genius, and although it causes some slight problems, such as the inability to hold down e.g. j in vim to spam the button to go left letter by letter, it seems to fix a lot more issues than it produces, and most of the things it prevents me from doing are bad habits anyway.

I had initially set my desktop background to the key layout, so that if I ever forgot how to type some symbol, I would be able to go to an empty workspace and hunt for the key that I needed. This was helpful for around about 2 days: I soon realized that the keys were in intuitive locations. If you memorize where the layer keys are, e.g. which button you should click to get the SYM layer, then it becomes easy to memorize the rest. For instance, each of the symbol keys are where the corresponding num-keys are on a standard keyboard. For example, exclamation point is where the one is on the num layer. Shift plus backslash makes question mark, just as it does on the standard keyboard.



 





day one: 25wpm
day two: 50wpm
day three: 75wpm

keymap makes sense, but its hard to find the right keys sometimes
there seems to be some level of input lag on the tap hold keys
perfect spot for my cat
i dont have the trackball working yet
pinkys are now engaged
learning to use arrows over nav
link the buildlog
flakey keys a tilda
used for 3 days except one page
sometimes i feel myself reaching for old keys 
posture