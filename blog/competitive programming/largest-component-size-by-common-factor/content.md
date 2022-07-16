Honestly, today I was *so* close to coming up with union find on my own. While I didn't get the solve today, I actually spent some time learning union find and I think that in general, that knowledge is perhaps more important than actually getting the big green checkmark. 

I was getting programmatic bugs over and over - real head scratchers, and I couldn't seem to figure them out. This is where I had stopped on my inital attempt:

```typescript
class FactorNode {
    factors: Set<number>
    parentValues: number[]
    
    constructor(initalFactors: number[], initalParent: number) {
        this.parentValues = [initalParent]
        this.factors = new Set(initalFactors)
        this.factors.add(initalParent)
    }

    public has(number: number) {
        return this.factors.has(number)
    }

    public join(factors: number[], parent: number) {
        this.factors.add(parent)
        this.parentValues.push(parent)
        
        for (let factor of factors) {
            this.factors.add(factor)
        }
    }
}

function findFactors(n: number): number[] {
    const ret = []
    for (let i = 2; i <= n; i++) {
        if (n % i === 0) {
            ret.push(i)
        }
    }
    
    return ret
}

function largestComponentSize(nums: number[]): number {
    const factorNodes = [new FactorNode(findFactors(nums[0]), nums[0])]
    
    for (let i = 1; i < nums.length; i++) {
        const num = nums[i]
        
        const currNumFactors = findFactors(num)
        
        prevNode:
        for (let prevFactorNode of factorNodes) {
            for (let factor of currNumFactors) {
                if (prevFactorNode.has(factor)) {
                    prevFactorNode.join(currNumFactors, num) 
                    break prevNode
                }
            }
            
            factorNodes.push(new FactorNode(currNumFactors, num))
        }
    }
    
    factorNodes.forEach(fn => console.log(fn.parentValues))
    
    
    let max = 0
    
    for (let factorNode of factorNodes) {
        max = Math.max(
            max, 
            factorNode.parentValues.length
        )
    }
    
    return max
};
```

Then, I went ahead and looked at the answers. Everyone was mentioning union find, so I found [a youtube video](https://www.youtube.com/watch?v=0jNmHPfA_yE) on the topic. Imagine my surprise when I had unknowingly implemented a broken union find! 

To let this algorithm sit in my brain, I didn't code it up, so there's no solution for me today - I'll mull over the union find algorithm and be able to come up with it out of my toolbelt the next time a disjoint set is needed.

You win some you lose some.