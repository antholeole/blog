For today, going about my new plan of attack, I started walking through the first problem. It became apparent that we have *a lot* of lookups to do: we need to, for every course we:

1. have to check if it has any prereqs
2. if it does, see if we can take that prereq
3. if it doesn't, take that course and see if we are prereq to any courses


which is 3 lookups. My inital thought was to have a map called `courseToPrereq: Map<number, number[]>`, but that only gets us halfway there: we can now check if the course has any prereqs, but if it doesn't or we did them all, do we now have to iterate through all the other courses in that map, removing the prereq we just removed? 

My solution to that problem was to have... another map! called `prereqToCourse: Map<number, number[]>`. So the flow would look like this:

1. populate the maps; i.e. for every pair `[a, b]`, put into `courseToPrereq` `a: [b]`, and `prereqToCourse`, `b: [a]`. Here, we can also keep a running value of all the courses that don't have prereqs, and thus, we have an "entry" into the next step.
2. for every course `c` that doesn't have a prereq, check if it is a prereq to anything, in `prereqToCourse`. We can iterate through those course `f` that `c` is a prereq to, and remove it from `courseToPrereq`. if `f` no longer has any prereqs, we can add it to our return list, and then repeat step 2.
3. if `c` ever runs out of courses, there's two possibilities: 
   - we can't take any more courses: return an empty list
   - we are done and took all the courses.
   to determine the case, we can just check if `courseToPrereq` is now empty or not.

This solution is a little complicated, but damn is it fast: 98.9 percentile for speed! It does use a lot of space, though, falling into the roughly 25th percentile. 

Here's the solution, with comments:
```typescript
//runtime: O(n), where n is the length of array prerequisites. everything else is below that iteration cost.
//space: O(n), even though we do `n` a lot: courseToPrereq + prereqToCourse + nextCourses + takeableCourses + order. O(5n).
function findOrder(numCourses: number, prerequisites: [number, number][]): number[] {
    const courseToPrereq: Map<number, Set<number>> = new Map()
    const prereqToCourse: Map<number, number[]> = new Map()
    
    //first, we need a set of all the values; if this value has a prereq,
    //then we remove it from this set. If there remains something in this set,
    //then we can take it with no prereqs.
    const nextCourses: Set<number> = new Set()
    for (let i = 0; i < numCourses; i++) {
        nextCourses.add(i)
    }
    
    //just populate the two maps; nothing fancy going on here.
    for (let prereq of prerequisites) {
        nextCourses.delete(prereq[0])
        
        if (courseToPrereq.has(prereq[0])) {
            courseToPrereq.get(prereq[0]).add(prereq[1])
        } else {
            courseToPrereq.set(prereq[0], new Set([prereq[1]]))
        }
        
        if (prereqToCourse.has(prereq[1])) {
            prereqToCourse.get(prereq[1]).push(prereq[0])
        } else {
            prereqToCourse.set(prereq[1], [prereq[0]])
        }
    }
    
    
    const takeableCourses: number[] = Array.from(nextCourses)
    //this will hold our return value
    const order = []
    
    //while we can still take courses...
    while (takeableCourses.length) {
        //since we took the course, we can now add it to the order.
        const nextCourse = takeableCourses.pop()
        order.push(nextCourse)
        
        //this is the list of all course that the current course is a prereq for
        const afterCurrPrereq = prereqToCourse.get(nextCourse)
    

        //it's possible that we removed it in a previous iteration; if this is true, then skip the 
        //remaining steps, as they also have already been done
        if (!afterCurrPrereq) {
            continue
        }
        
        // remove the current prereq, as we just "Completed" it
        prereqToCourse.delete(nextCourse)
        
        // for each course that the current course is a prereq of...
        for (let courseAfter of afterCurrPrereq) {
            // delete the current course from the prereqs
            courseToPrereq.get(courseAfter).delete(nextCourse)
            

            // if there are no other courses that are prereqs, we can now take this course! add it to the takeable courses.
            if (!courseToPrereq.get(courseAfter).size) {
                courseToPrereq.delete(courseAfter)
                takeableCourses.push(courseAfter)
            }
        }
    }
    
    //if there are still courses we need to take, it is impossible. otherwise, we took all the courses in this order.
    return courseToPrereq.size ? [] : order
};
```

Post reflection: I did the optimal solution, with extra steps! That's pretty awesome. I didn't identify it as topo-sort, but it 100% is topological sort. 

I'm not even going to add the optimal solution here, since there really is only one optimization: instead of storing a whole set, we can just store a number, since we actually don't care what prereq we're remvoing; only that we're removing a prereq.



✅ **read the problem slower:** I think I did well today! I read slow and tried to make sure I understood the test cases.
✅ **Walk through before first submission:** I did walk through my solution.
✅ **Edge cases:** I didn't think there were really any edge cases here, besides the explicit one where there is no valid solution. Perhaps I should have checked on if we are garunteed to have each course etc. but I think that's obvious. I'll make sure to read the constraints tomorrow, but I think I'll call this a check.