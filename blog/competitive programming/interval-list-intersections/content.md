It was pretty clear right off the bat that two pointers was the way to go here - you could increment a pointer if it ended before the it's opposite, as we know that the opposite is "ahead". 

I think I took that idea and ran with it, dealing with the edge cases as we went along. I had decided to track the one that ended last and the one that ended first in pointers so I didn't have to worry about case work. I also decided to have a callback `incList` that allowed me to increment the pointer after we were done with it without actually caring about which pointer it was.

```typescript
// O(n) runtime O(1) space
function intervalIntersection(
    firstList: [number, number][], 
    secondList: [number, number][]
): number[][] {
    
    let l1Ptr = 0
    let l2Ptr = 0
    
    let res = []
    while (l1Ptr < firstList.length && l2Ptr < secondList.length) {
        let endedFirst: [number, number]
        let endedLast: [number, number]
        let incList
        
        if (firstList[l1Ptr][1] > secondList[l2Ptr][1]) {
            endedFirst = secondList[l2Ptr]
            endedLast = firstList[l1Ptr]
            incList = () => l2Ptr++
        } else  {
            endedFirst = firstList[l1Ptr]
            endedLast = secondList[l2Ptr]
            incList = () => l1Ptr++
        }
        
        if (endedFirst[1] >= endedLast[0] && endedLast[0] > endedFirst[0]) {
            res.push([endedLast[0], endedFirst[1]])    
        } else if (endedFirst[1] >= endedLast[0] && endedLast[0] <= endedFirst[0]) { //lists are equal or endedFirst is a subset of ended last
            res.push(endedFirst)
        }
        
        
        incList()
    }

    return res
};
```

This solution works, but I think it's a little difficult to read, and the solutions came up with a far better algorithm that skips the case work at the end.

It used the same idea I had where you can increment the one that ends first, but it's intersection finding method was much simpler: it just kept two values, `hi` and `lo`, where `hi` is the endpoint of the potential intersection (where the one that ends first ends) and `lo` is the start point of the potential intersection (where the one that starts last starts). I almost stumbled across this solution on my own, but what stumped me was figuring out how to tell if there even was an intersection: turns out, it's super easy with `lo <= hi`.

So, sightly modifying my solution to get rid of the case work, here's the finalized version:

```typescript
// O(n) runtime O(1) space
function intervalIntersection(
    firstList: [number, number][], 
    secondList: [number, number][]
): number[][] {
    let l1Ptr = 0
    let l2Ptr = 0
    
    let res = []
    while (l1Ptr < firstList.length && l2Ptr < secondList.length) {
         const lo = Math.max(firstList[l1Ptr][0], secondList[l2Ptr][0])
         const hi = Math.min(firstList[l1Ptr][1], secondList[l2Ptr][1])
         
         if (lo <= hi) {
             res.push([lo, hi])
         }
        
        if (firstList[l1Ptr][1] > secondList[l2Ptr][1]) {
            l2Ptr++
        } else if (secondList[l2Ptr][1] > firstList[l1Ptr][1]) {
            l1Ptr++
        } else { //slight optimization: if they both end at the same place, increment both
            l1Ptr++
            l2Ptr++
        }
    }

    return res
};
```

Much, much simpler. I even managed to beat 100% of TS submissions for runtime and 69% of submissions for space! 

What I learned:
- Getting a solve feels good; get the solve, then optimize! 
- If your answer is getting too complex (lots of ifs, complex ifs) then there's probably an easier way. Regardless, get the solution first, then simplify.
- Don't fall in love with an idea: I might have hit the optimal solution earlier if I didn't try to hack my way (increment function...) to the solution. It ended up working, but it might have been easier to just sit back and realize the intuition behind an intersection (hi / lo thinking.)