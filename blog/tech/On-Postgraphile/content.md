Man I really wanted to like Postgraphile!

It felt like it was solving a ton of problems with very little tradeoffs on the surface. In reality, I couldn't get it to do what I needed it to. Perhaps it could do what I needed it to, but I did give it a very solid try, and had to switch back to Hasura in the end.

### RLS
For one, if we write our DB security in the application layer, any other user who gets the DB string connection string can still do heavy damage. We have to test our authentication logic at every single application; for instance, if we write service A that connects to our database, we should write logic to make sure only the correct users can do certain things. If we write service B that connects to the database, and we accidently leave a hole in the logic, then service's A security flaw can severely affect service A's security. We have to worry and consider security for every layer of the application.

### PGSQL As the Backend Language
Perhaps my editor setup just isn't good enough for writing raw SQL, or perhaps there is not many supported ways to do it, but man was it a pain to write SQL as application code.

- The functions felt very strange, and while they worked, it was always hard to reason about who could invoke them and if we have any tricky edge cases.
- The discoverability was very poor. I'd write something and then forget I wrote it because it got buried in a 1000 line SQL file. Very hard to organize SQL.
- Testing was a disaster! We threw away the last 15 years of automated testing innovation. We now had to write manual functions and scripts that `exit 1/0` when the test failed or passed.


### Unsecure by default
By default, if we were to spin up a postgres database, we would have to lock down every single table manually. Not that difficult, but if we forget to lock down any table, then by default any malicous actor can see anything in it.

### Lots of repetition
There's no way to inhereit "updated_at" and "created_at" triggers for every table. You can inhereit the actual fields, but when it came time to the trigger, you have to reapply it to every table. This leads to a ton of boilerplate.

----

Unfortunately, Postgraphile disappointed me. Perhaps I didn't spend enough time setting it up and building out infra around it (boilerplate tables, tests, etc.) but for a single person writing free time projects, I just don't have time to write out a bunch of DevOps style code for my personal project.

