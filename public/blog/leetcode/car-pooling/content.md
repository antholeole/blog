This is an interesting one! I thought of the solution right off the bat: I knew that what mattered was what we do at each distance. we can keep a running counter, and a list of things to do at each distance. keep the list sorted by the distance: if we add people, have a positive number. If we drop people off, have a negative number!

Here's the code for that (which doesn't work, and I'll explain why):

```typescript
//Nlogn space, n log n time (both bounded by the sort)
function carPooling(trips: number[][], capacity: number): boolean {
    const diffTrips: [number, number][] = []

    for (let stop of trips) {
        diffTrips.push([stop[0], stop[1]])
        diffTrips.push([-stop[0], stop[2]])
    }

    diffTrips.sort((a, b) => {
        
            return a[1] - b[1]
    })
    
    let carHas = 0
    for (let diffTrip of diffTrips) {
        carHas += diffTrip[0]
        
        if (carHas > capacity) {
            return false
        }
    }
    
    return true
};
```

The issue here is if we have a capacity of 2, and we have something like `[2, 1, 2], [2, 2, 3]` we get a `diffTrips` array like: `[2, 1], [2, 2], [-2, 2], [-2, 3]` which means that we'd be over capacity - but not in reality, since we can just drop the people off at first and then pick them up. This means we need to sort by distance first, but if they're the same distance, *then* sort by having the negative difference go first. so the only update is in the sort function: 

```typescript
    diffTrips.sort((a, b) => {
        if (a[1] !== b[1]) {
            return a[1] - b[1]
        }
        
        return a[0] - b[0]
    })
```

Ta-da! working solution!

It's not very fast, though. Here's a tricky part: using a min heap would be faster, but by virtue of the min heap implementation here, you actually can't do that! The min-heap doesn't allow a custom comparitor, only giving us the oppertunity to specify the priority.

What we can do, though, to garuntee that negatives come first, is to have the priority be set to `dist + (people > 0 ? 0.5 : 0.0)`, which means that at any stop, the negatives come *first*, because they have a lower priority because they don't have 0.5 added onto them.

So here's the min heap version: we now bound the time complexity by the time it takes to insert or remove, which in a heap is `log(n)`:

```typescript
function carPooling(trips: number[][], capacity: number): boolean {
    const tripQueue = new MinPriorityQueue({
        priority: (trip) => trip[1] + (trip[0] > 0 ? 0.5 : 0.0)
    })

    for (let stop of trips) {
        tripQueue.enqueue([stop[0], stop[1]])
        tripQueue.enqueue([-stop[0], stop[2]])
    }
    
    let carHas = 0
    while (!tripQueue.isEmpty()) {
        const diffTrip = tripQueue.dequeue()
        
        carHas += diffTrip.element[0]
        
        if (carHas > capacity) {
            return false
        }
    }
    
    return true
};
```

we're still not as fast as the bucket sort solution, but I think I like this solution a little bit better, even if it's runtime and space complexity are less: in a real world scenario, we aren't going to be told that the max distance is 1001: the bucket sort solution only works for distances below 1001.

Here's the bucket solution, for posterity's sake:

```typescript
//O(n) time, O(1) space
function carPooling(trips: number[][], capacity: number): boolean {
    const distances = Array.from({ length: 1000 }, () => 0)
    
    for (let [people, from, to] of trips) {
        distances[from] += people
        distances[to] -= people
    }
    
    let people = 0
    for (let distance of distances) {
        people += distance
        
        if (people > capacity) {
            return false
        }
    }
    
    return true
};
```

This is:
- faster, as we only iterate through the trips one time
- takes less space, because we have a constant amount of stops... but I have qualms with this!

here's the comment I left on leetcode: 

> I don't like the the space complexity for solution 2... it say's it's constant time, because there's always 1001 buckets, but by that reasoning, isn't solution 1 also "constant space" since the problem is bounded by 1000 trips at most?
> I don't think using the bounds counts as "constant space" because then everything is always constant space, since leetcode test case inputs are bounded. 

