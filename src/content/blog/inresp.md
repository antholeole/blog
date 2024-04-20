---
title: "Sane Software Incident Response Guidelines"
description: Lets deal with reality
pubDate: Mar 08 2024
---

Like any good question in software, the answer to "What is the optimal way to respond to an incident?" is "it depends". (I assume that "it depends" is really a good answer to any hard question, but I haven't lived much of a life outside software so I can't postulate on that.)  Despite this, I'm going to try to setup a working model of sustainable incident management.

Lets assume, for the purpose of this article, that we have some fixed amount of engineer time and the business goals are long term (there are cases where we only want to profit maximize in the short term, long term be damned - in that case, the optimal solution is to fix the issue as quickly as possible and continue complexity growth work) profit maximization. Further, assume that the incident should be handled immediately.

---

Across an infinite timeline, it is _always_ worth setting up incident mitigation ahead of time. Setting up incident mitigation takes some fixed `c_im`, which is a very small percentage of infinity. If incident `c` takes any finite amount of time to solve, in the infinite timeline it takes some smaller infinity time to solve. But most systems do not operate under an infinite timeline: even if the implicit goals of a business are to generate profit infinitely (also impossible in a free market), individual actors have their owntimelines: that is, people switch jobs, want to get promoted, retire, or die. Generally, we want to think in terms of some finite timeline that makes all actors happy - the business notwithstanding.
