This is an easy problem - but I didn't find it so easy!

There's a lot going on here, and a lot to miss if you don't read carefully....

here's things I missed on the first pass that tripped me up:
- There doesn't have to be a judge: My inital plan was to return the first person that hit `n - 1` trusts. When I relized that there doesn't have to be a judge, I tried to throw on `return -1` as the final case.
- This also doesn't work: That's because it's possible for more than one person to hit the trust treshold, and thus, neither of them are judges.
- We can't return the first judge we find (by getting `n - 1 trusts`): It's possible he will trust someone else later, and thus is no longer a judge.

So, here's the hacky solution I came up with first:

```typescript

function findJudge(n: number, trust: number[][]): number {
    //special case: one person means that they are the judge
    if (n === 1) {
        return n
    }
    
    //holds potentialJudgeId -> #of trusters. initalize all to 0
    let potentialJudge: Map<number, number> = new Map()
    for (let i = 1; i <= n; i++) {
        potentialJudge.set(i, 0)
    }
    
    

    //start with this as null; we can store the first judge we find here.
    //if we ever find a second judge (i.e. second person who is in the judge list, and trusts nobody)
    //then we can exit - so no point using a list or anything here.
    let foundJudge: number | null = null
    
    for (let [fromTrust, toTrust] of trust) {
        //if the judge we have trusts somebody, dump him: he's not the judge!
        if (foundJudge === fromTrust) {
            foundJudge = null
        }

        //if our judge trusts somebody, he is disqualified
        potentialJudge.delete(fromTrust)
        

        //if we still don't trust anyone, we can:
        if (potentialJudge.has(toTrust)) {
            //increment his trust count, i.e. more people trust him
            potentialJudge.set(toTrust, potentialJudge.get(toTrust) + 1)
            
            //if we hit the required trust threshold, then he's a potential judge
            if (potentialJudge.get(toTrust) === n - 1) {
                //but that means if we already have a judge, we can exit.
                if (foundJudge !== null) {
                    return -1
                } 
                
                //otherwise, first judge: set him to found
                foundJudge = toTrust
            }
        }
    }

    //if we found a judge, return him
    if (foundJudge !== null) {
        return foundJudge
    }
    

    //if we never did, return -1
    return -1
};
```

In truth, I'm not even sure how this works: why is it that we can never have more than one possible judge at a time? This feels like maximum element...

Not very happy about today, because I couldn't even find a very good optimization! Oh well - you live and learn. After looking through the solution, my mistakes became apparent: 

 - Instead of using some sort of hashmap, we can instead use an array, which we can index into just as easily. Note to self: if we're mapping a through b, use an array!
 - I got so caught up in maps and sets that I lost track of what we were trying to do... over and over. work from a problem, not a solution.

 Maybe tomorrow will be better!

 Here's my post solution answer:

 ```typescript
 function findJudge(n: number, trust: number[][]): number {
    const trusts = Array.from({ length: n + 1 }, () => 0)
    
    for (let [fromTrust, toTrust] of trust) {
        trusts[fromTrust]--
        trusts[toTrust]++
    }
    
    for (let i = 1; i < trusts.length; i++) {
        const trust = trusts[i]
        
        if (trust === n - 1) {
            return i
        }
    }
    
    return -1
};
 ```