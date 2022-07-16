For a long time now, I've been trying to create a mid-level tutorial on Actix Web, since it's a framework I have production experience in and have lessons I'd like to share. 

The tutorial example project was going to be a chatroom, since I find that the hardest part of the actors framework is creating long-lived connections. With a chatroom example project, I could include some authorization, websockets, and pagnation: a lot of the features that developers may stumble on, and may be good to include in a tutorial.

A tiny problem: A backend-only tutorial is very unsatisfying. You have to use command line tools like wscat or similar to connect, and manually refresh your tokens, etc. So first, before I start writing the tutorial, I'd like to write a frontend! But now we have a chicken and egg problem: if I want to write a frontend first, I need to hit some sort of backend... ofcourse, it's 2022, and we have a solution to every single problem. Spinning up a mock api on Postman is simple (i.e. takes 2-3 hours of looking through the docs and figuring out how everyhing works, and then endless tweaking of endpoints, variables, etc.) 

Whatsmore, I probably shouldn't stumble through live developing the API in the vidoes, I should probably code is to the side, and then talk over live-coding so that no one has to sit through my mistakes. 

So I need to build the whole backend before I build the backend on video! But I can feel it now: It's going to be a great tutorial once I'm done...

But no project is complete without tests, right? I can't, with full conscious, tell users to ship a chat app with no tests, that'd be heinous. At the end of every step, I'll add a quick testing step. 

---

I could go on forever. It seems as if everytime I sit down to write the tutorial, I get bogged down by details, like how I should do pagniation, if I should use uuid's, etc. All the while I'm pondering cursors, 8 tutorials advocating bad practices, strange idioms and lack of security has been pushed out the door. The consumers of tutorials are often very new to programming, and thus, don't know what they don't know: They don't understand that you probably should not send your password to the server with every API request, and they don't know that your API key should probably expire at some point. 

And yet, these tutorials are popular: despite their obvious flaws, they still have truth to them: they still teach a novice what a REST endpoint is and how to use it. The users get their dopamine hits faster, as they've built a backend and deployed it (using scp, of course).

Mathamatically, it makes sense. It takes 10x as long to make a tutorial with 10x as much detail, so it would make sense that there are 10x bad tutorials. 
