---
title: "To Figure out if this Project is Worthwhile, We Must First Model the Universe"
description: Timelines are Everything
pubDate: Apr 19 2024
---

A common playbook: business leaders request an estimate on a deadline. The estimate is made by non-engineering, then delivered both up and down the heigharchy. Business leaders are happy: the deadline, for some reason, sparks joy in their brains (What goals do C-suites have? Why do they care that some product that does not, in success or failure, matter to them _matter to them_?). Engineers are left scratching their heads: no one consulted them about the timeline; or if they did, it was totally ignored. Decicions to scrap components that are deemed essential to longterm maintinance are made - after all, customers do not run unit tests; why waste time writing them? 

Across an infinite timeline, it is _always_ worth setting up incident mitigation ahead of time. Setting up incident mitigation takes some fixed `c_im`, which is a very small percentage of infinity. If incident `c` takes any finite amount of time to solve, in the infinite timeline it takes some smaller infinity time to solve. But most systems do not operate under an infinite timeline: even if the implicit goals of a business are to generate profit infinitely (also impossible in a free market), individual actors have their own timelines: that is, people switch jobs, want to get promoted, retire, or die. Generally, we want to think in terms of some finite timeline that makes all actors happy - the business notwithstanding. 

No single human has to maintain a product over an infinite timeline: remember, we die, retire or... I forgot the other options, but they are there I presume. But for the meanwhile that my life and the life of the product overlap, we are intertwined: I do not want to be woken up in the middle of the night because our SSL certificates expired (an aside: why have I intertwined _myself_ with the product? why do I _care_?), so automated cert renewal is a must. 

But is automated cert renewal a must? Again: agents do not operate on an infinte timeline. manually renewing a certificate takes at most 15 minutes - hopefully someone prior has ran the calculation and decided that they should write down the process, that could save me another 5. If I'm working on this product for 2 years, taking a month to save 15 minutes every 2 months does not matter - the total time savings of my investment are 15 minutes * (24 months / 2 months), or 3 hours. If it takes me more than 3 hours to implement automated cert renewal, it isn't worth doing.

But do I care about my fellow man? Perhaps the total cost of implementing cert renewal is greater than 3 hours, but some poor engineer is going to have to figure out how to renew certs, or someone will have to teach them... damn. _I_ will have to teach them - I should factor that into the equation; the cost of _not_ implementing automated cert renewal is 15 minutes every 2 months for 2 years plus the overhead of teaching the next engineer how to do it. Still, it probably does not equal the month it takes to implement the automated cert renewal, so I make due: I will pay the cost of teaching the next poor soul when it comes around.

A step back is required: _why_ do I even need to renew certifica

