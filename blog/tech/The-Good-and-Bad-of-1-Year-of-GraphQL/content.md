This morning I got an email from Google Domains, telling me my domain is about to expire (I never set auto - renew on domains I'm not sure if I'll keep or not, so thanks for the email, Google!). Time flies, and I tried a lot of new things on that project, including publishing my first open source package. 

For now, though, here's a reflection on a single (large) aspect of that project: GraphQL, the API langauge I decided to use.

## Some Context

First, some context: this is a solo build, for me and me alone. It is a learning project through and though (GraphQL, Pulumi, a bunch of cloud services like Fargate, workers, frontend testing) It's a feature rich chat application, with admin permissions, threads in groups, web support, polls, reactions, calandar events, etc. I never launched, so there's going to be absolutely nothing in this article about scaling or actually going to an end user.

That being said, it's a respectibly large and feature rich application, and is compareable in size and complete-ness to actual applications (code wise) I've worked on professionally, so I wouldn't say that it's comparing some sort of "toy" application.

The final note here is that I used Hasura, so a lot of work on the backend was completed for me before I ever needed to think about it. This means that a lot of the things that I say are free or easy do require some overhead actually building it on the backend - that is overhead I passed over completely. My recommendation is to use something like Postgraphile or GraphQL, because it's somewhat painful to setup a graphQL server on your own. My biggest fear about using Hasura was the inability to perform custom logic, but that was a non-issue with events & webhooks.

## The Good 

### Amazing Productivity

There's no doubt about it: the only reason I was able to build so much was because of GraphQL. Things that are multi-step in REST paradigm are single step in GraphQL - and quite the fluid single step! There's always talk about GraphQL's danger of poor security, but I found Hasura's permission management system to be very intuitive, and query whitelists are great. 

Creating entire new sections of the application was very easy - create the table, define the relationships, define the permissions (I found the approach of defining all the permissions ahead of time to be the most practical - even if you don't need a user to query another users name right now, you might need to in the future, so you should set up that permission while you're working on the backend anyway), and then you're done! You can go back and be a frontend developer. Whenever you need to read from that table, feel free to write out a query and get exactly the data you need. If you end up needing more or less data, modifying that query to get what you need is a simple task.

There's a lot of things in REST that you need to worry about when doing simple things - for instance, continuing on the example previously given, if we wanted to also add the user's name to a query, we'd have to add it to every DTO on the backend, and make sure that we query it every time. It doesn't sound like that much, but this is a small change. What if you need an enitirely new set of data? What if you needed to permission-ize a route, only allowing admins to query the amount of messages sent, but allow everyone to query the individual messages? Engineering in general is the sum of many small tasks, so minimizing the amount of tasks required is a huge, huge boost to productivity.

### Free Reactive State

One of the things I worked on during the project was adding threads to groups. When I'm using apps, and someone tells me they changed something from another machine, often times the solution to actually see it on my machine is to refresh the page or cold boot the app again - it already made the API call, and it's not going to make it again until the next time it doesn't have the data.

The solution to this problem could be a "pull to refresh" type thing, or allowing the user to manually refresh somehow. The solution that GraphQL affords you is the change the word `query` into `subscription` in your query, effectively letting the server tell you when a change is made, as opposed to the client having to refetch it. To do something like this in a REST application, you would need to do some serious architectural changes (given you're a typical Express / Spring REST application) on the backend.

Instead, GraphQL gives it to you for free.

### Type Safety

below, in the cons section, I talk about code generation. Generally, it's a con. but the large benefit you get out of it is type safety. HTTP Clients usually just return a JSON body that you need to parse into your object, and sometimes that's a pain. With GraphQL code generation on the frontend, I was given an object with the correct types every time, just based off of the query I wrote. This is one of the most useful features of code generation, and I can't say I'll miss doing a `fromJson` on every HTTP request.

### Incredibly Descriptive API's

Playgrounds are awesome. I built my entire schema myself, and wrote every permission by hand, but that doesn't mean there were no dark corners: It's easy to forget what part of each model is exposed without actually going and checking manually, and GraphQL playgrounds allow you to go and check manually easily. I find that it's much more productive than even something like swagger documentation, since it's interactive and there's less "search time" and less reading to be done. If I'm not sure if a query has the right permissions, I'll just steal an API token and try by executing! Exploring and learning API's with GraphQL are great.


### Low Context Switching

I've already talked a little bit on this front, but I think that GraphQL allows for very low developer context switching. I'm personally a believer that the biggest hits to productivity is context switching - it isn't the 5 minutes you spend on your phone, it's the 10 minutes you need to get back in to the flow state that is the issue.

GraphQL makes it easy to avoid having to context switch, because there's rarely a reason to have to go to the backend or DB layer, unless you seriously messed something up during design or permissions handling stages. Writing the queries on the frontend is intuitive enough that I don't think it counts as a context switch, and when you get a good setup (the proper hooks or widgets to consume the queries) entire sections of my app were completed very quickly.

## The Bad

### Code Generation Everywhere

Herein lies the core issue of GraphQL in statically typed langauges. You need to code generate everything, based on the schema pull. It's a massive amount of code getting generated for each schema pull. The requests need to get generated, the responses, each fragment... It's a lot of code generation! I'd rather have it generated than having to write it by hand, but it just feels like GraphQL was designed with JS in mind. I can't help but feel that GraphQL in statically typed languages is an afterthought.

There's no alternative, though, and it is a pretty good solution to the problem of how to handle the massive amounts of flexibility that GraphQL affords you. I wish there was a way around it, but I don't want to give up type safety and this seems to be the best solution by far.

### Actually Setting Everything Up

I'm not sure if the Flutter ecosystem for GraphQL is just lacking people willing to create packages for it, or this problem exists in all graphQL ecosystems, but it felt like I did a lot of stuff by hand that I usually get done for my when using HTTP clients.

Writing my own hooks / widgets that use my own custom client that automatically refreshes tokens and re-links subscriptions when tokens expire and routes subscriptions to a subscription handler... that took like a week to set up! once it was set up, though, it was super nice to use. TODO here: publish it as a package! These kinds of clients and components are written in every project - I should just save a bunch of developer time!

### Some Use Cases Aren't Supported

I think this is just a Hasura thing, because if you're building your own resolvers I think you can design around this, so maybe skip this section if you're evaluating GraphQL without Hasura.

Subscriptions are returned in batches: every time a change to that query is found on the server, it gets pushed down a websocket - but not that change individually, the result of the whole query. That means that if you have a subscription for the last 5 messages, you will get the one new message and four old ones every time (you also have to do the last 5 messages instead only the newest message because the subscription is pushed every 5 seconds, meaning if there's two messages in less than 5 seconds, it doesn't go into the subscription). You can't show duplicates in the UI, so you need some logic to de-dupe them, all while remaining sorted.

That was a headache! It was a large portion of the apps code, and going down the rabbit hole of managing that subscription was not a great time. In the end, I pushed the logic to a frontend controller, and there the de-dupe was happening as well as the reaction logic. 

In a self-coded REST based application, you can decide exactly what data goes down for exactly what use case. While the bulk of use cases require more work than GraphQL, the minority of the time, being able to hand write every controller query on the backend will reap it's benefits.

### A Little Difficult To Test

This falls down the code generation woe, but I found myself having issues testing the queries. Becuase each response / request is it's own object, instatiating fakes of them was a little challenging and it lead to a lot of "runtime" debugging of the tests - I didn't know exactly what data is supposed to come out of that specific object, so I need to go to the backend and find the result of the query in a lot of different use cases. 

Not the worst thing in the world, but it made one of the things I enjoy, writing tests, an activity that I felt like pushing off when it came time to test for different query results.

## Summary

All in all, I'd 100% use graphql again. I don't think I would ever roll a GraphQL backend on my own unless I had some serious engineering hours to work with, but whenever I'm going to work on a greenfield project, GraphQL will be my first go-to unless there's a real reason not to use it.

It's the most productive I've ever been working with and building API's, and if you're looking for a way to accelerate your personal project development I'd highly recommend it.