I hate bit manipulation, so I'm going to go ahead and do another problem that I think is useful instead of today's bit manipulation problem.

I choose this one because it came up in someone's interview, and I thought it was worth knowing. Right off the bat, it smelled like dynamic programming: Instead of calculating getting to the target, we could instead calculate getting to each station.

FIrst, though, I wanted to do the simple solution: Test *all* paths:

```typescript
function minRefuelStops(target: number, startFuel: number, stations: [number, number][]): number {
    const visitableStack = [[0, startFuel, 0]]
    let currMin = Number.POSITIVE_INFINITY
    
    while (visitableStack.length) {
        const [currPos, currFuel, currSteps] = visitableStack.pop()
        

        if (currPos + currFuel >= target) {
            if (currSteps < currMin) {
                currMin = currSteps
            } 
            
            continue
        }
        
        for (let [dist, fuel] of stations) {
            if (dist - currPos <= currFuel && dist > currPos) {
                visitableStack.push([dist, currFuel - (dist - currPos) + fuel, currSteps + 1])
            }    
        }
    }
    
    return currMin === Number.POSITIVE_INFINITY ? -1 : currMin
};
```

It worked but timed out. I then, without thinking through it attempted to optimize it by pushing through greedy, by reversing the list, and returning the first solution. This isn't possible though: consider the case $[[1, 100], [50, 99], [99, 1]]$ with $50$ inital gas. We'd attempt to take the second; we can do that, and then it goes ontop of our stack. Then, we'd travel to the last gas station and our output would be 2. But, the first gas station has hella gas! We could just drive one mile and be done.

So greedy doesn't work.

Even after a series of other micro-optimization, I was still stuck with time limit exceeded. Here was the solution prior to switching approaches:

```typescript
function minRefuelStops(target: number, startFuel: number, stations: [number, number][]): number {
    stations.reverse()//talk to bigger elements first
    
    const visitableStack = [[0, startFuel, 0]]
    let currMin = Number.POSITIVE_INFINITY
    
    while (visitableStack.length) {
        const [currPos, currFuel, currSteps] = visitableStack.pop()
        
        if (currSteps > currMin) { //if we have more steps, then break
            continue
        }

        if (currPos + currFuel >= target) {
            if (currSteps < currMin) {
                currMin = currSteps
            } 
            
            continue
        }
        
        for (let [dist, fuel] of stations) {
            if (dist <= currPos) { //if we're now checking the stations lower then ours, break; it's redundant
                break
            }
            
            if (dist - currPos <= currFuel) {
                visitableStack.push([dist, currFuel - (dist - currPos) + fuel, currSteps + 1])
            } 
        }
    }
    
    return currMin === Number.POSITIVE_INFINITY ? -1 : currMin
};
```