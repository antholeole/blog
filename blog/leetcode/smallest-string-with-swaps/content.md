[The problem!](https://leetcode.com/problems/smallest-string-with-swaps/)

Essentially, the problem here is that you're given a string, and you can swap any paired characters. You should return the lexicographically smallest string. 

The first thing, right off the bat, that should be noted is that we actually do not care, nor do we have to track, how many swaps we actually do. We can, if we so desire, swap the same two characters a million times, and it will make no difference to our end result. This is important because this is information we do not want to track: if we constrain our solution space to a solution that tracks swaps, we will probably not be optimal.

Remember: do the least amount of work possible!

The second thing that is important to see here is that we can consider groups much larger than just their pairs: for instance, take a `pairs` array that looks like this:  `[1, 2], [2, 3]`. Even though 1 and 3 are not directly paired, we can swap 1 and 3 by swapping 1 and 2 first, and then 2 (where 1 now lies) and 3, and then resetting 2 if need be. So we can actually go though and create great big union groups!

Our solution is beginning to take shape and we haven't even written a line of code; we just reasoned about the problem. Still before we code, we should think about what 'grouping' will afford us. If we just take string like this: `leetcode` and then we create as big 'union groups' as possible, and label what union group each letter came from, we can end up with something like this (**NOTE** that the groups are arbitrary, I just placed random numbers for demonstration):  `l: 1, e: 1, e: 2, t: 3, c: 2, o: 1, d: 3, e: 1`. We can then sort the letters within each 'group' lexicographically. For instance, if we sort group 1, we get: `eelo` - we can just replace the letters in union group 1 in the string: `eeetcldo`! We now know that group 1 is entirely lexicographically sorted. We can repeat the process for all the other groups, and then we end up with the smallest string we can get!

It's amazing how much we can reason out without writing any code at all. Now time to talk about the data structures we'll use for this.

We know that the best way group and add to groups is a simple `UnionFind` data structure. At this point, we've done DSU's so many times that I won't write it up again. Here it is in (most) of it's glory:

```typescript
class UnionFind {
    chars: number[] = []
    // weights is optional, but it allows us to do path compression optimization so we'll use it!
    weights: number[] = []
    
    // since initally all groups are unlinked, we just make strLen groups
    constructor(strLen: number) {
        for (let i = 0; i < strLen; i++) {
            this.chars.push(i)
            this.weights.push(1)
        }
    }

    // union two indexes. We should always try to union the smaller group onto the bigger group, 
    // so we end up with shorter chains.
    union(a: number, b: number) {
        const aParent = this.find(a)
        const bParent = this.find(b)
        
        if (aParent === bParent) {
            return aParent
        }
        
        if (this.weights[aParent] < this.weights[bParent]) {
            this.chars[aParent] = bParent
            this.weights[aParent] += this.weights[bParent]
        } else {
            this.chars[bParent] = aParent
            this.weights[bParent] += this.weights[aParent]
        }
    }

    find(idx: number): number {
        if (this.chars[idx] != idx) {
            this.chars[idx] = this.find(this.chars[idx])
        }
        
        return this.chars[idx]
    }
}
```

Cool, classic union find. Since we have all the relevant context in the UnionFind, we can just add a new method that returns the smallest string. Without even implementing most of the logic, we know that our entry-function will look like this:

```typescript
function smallestStringWithSwaps(s: string, pairs: [number, number][]): string {
    const uf = new UnionFind(s.length)
    
    for (const [a, b] of pairs) {
        uf.union(a, b)
    }
    
    return uf.smallestString(s)
};
```

Amazing! Now if only we didn't need to write `smallestString`...

The first thing that needs to be done is figure out how we're going to store the groups, as well as the letter order. (The groups are just going to be the "indexing" we did in the leetcode string, i.e. what "group" each letter belongs to.) The letter order is a sorted list for each group: i.e. if we were still using the `leetcode` string example, we should have some way to say group 1 sorted letter order is `eelo`. I'll use a MinHeap here: this is because I can't be bothered attempting to maintain a sorted array - especially when the only relevant part of the sorted array is the smallest char at the time - I'll have the heap do it for me. LetterOrder is easy, and it is just a string array.

So, here's what smallest string looks like now:


```typescript
 smallestString(s: string): string {
        const groups: Map<number, typeof MinPriorityQueue> = new Map()
        const letterOrder: number[] = []
        ...
 }
```
    
Okay, let's go ahead and do some population! We can get each characters group trivially (now) with `find(charIndex)`. the group should literally be the letter order, so we can just find and then immediately push it onto letter order. Then, we need to push that letter onto the heap. Not too tricky: 

```typescript
for (let charIndex = 0; charIndex < this.chars.length; charIndex++) {
    const charGroup = this.find(charIndex)

    letterOrder.push(charGroup)
    
    //create or get a group
    const currCharGroup = groups.get(charGroup) ?? new MinPriorityQueue({ 
        priority: (char) => char.charCodeAt(0) 
    })
    //push the letter into the group
    currCharGroup.enqueue(s.charAt(charIndex))
    //add it to the groups, if it doesn't already exist in the map
    groups.set(charGroup, currCharGroup)
}
```

Finally, we need to build the string. We can build the string by just dequeuing the correct index group and pushing it onto a string:

```typescript
let retStr = ''

for (const needLetterIdx of letterOrder) {
    retStr += groups.get(needLetterIdx).dequeue().element
}
```

boom! done!

Full code:

```typescript
class UnionFind {
    chars: number[] = []
    weights: number[] = []
    
    constructor(strLen: number) {
        for (let i = 0; i < strLen; i++) {
            this.chars.push(i)
            this.weights.push(1)
        }
    }

    union(a: number, b: number) {
        const aParent = this.find(a)
        const bParent = this.find(b)
        
        if (aParent === bParent) {
            return aParent
        }
        
        if (this.weights[aParent] < this.weights[bParent]) {
            this.chars[aParent] = bParent
            this.weights[aParent] += this.weights[bParent]
        } else {
            this.chars[bParent] = aParent
            this.weights[bParent] += this.weights[aParent]
        }
    }

    find(idx: number): number {
        if (this.chars[idx] != idx) {
            this.chars[idx] = this.find(this.chars[idx])
        }
        
        return this.chars[idx]
    }

    smallestString(s: string): string {
        const groups: Map<number, typeof MinPriorityQueue> = new Map()
        const letterOrder: number[] = []
        
        for (let charIndex = 0; charIndex < this.chars.length; charIndex++) {
            const charGroup = this.find(charIndex)
            
            letterOrder.push(charGroup)
            
            const currCharGroup = groups.get(charGroup) ?? new MinPriorityQueue({ 
                priority: (char) => char.charCodeAt(0) 
            })
            currCharGroup.enqueue(s.charAt(charIndex))
            groups.set(charGroup, currCharGroup)
        }
        
       
    let retStr = ''
    
    for (const needLetterIdx of letterOrder) {
        retStr += groups.get(needLetterIdx).dequeue().element
    }
    
    return retStr
    }
}


function smallestStringWithSwaps(s: string, pairs: [number, number][]): string {
    const uf = new UnionFind(s.length)
    
    for (const [a, b] of pairs) {
        uf.union(a, b)
    }
    
    return uf.smallestString(s)
};
```