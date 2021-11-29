I didn't finish today, but here was my thought process through my working:

----

Trying a new strategy today: I'll write it out as I think about the problem, so that these journals are not so much reflections but more living thought processes.

My first thought was to keep some object like this:

```typescript
class Account {
    constructor(name: string) {
        this.name = name
        this.emails = new Set()
    }

    addEmail(email: string): void {
        this.emails.add(email)
    }
}
```

but then I realized that this would be an issue in the case of merging accounts: we can't do so much as

```typescript
function accountsMerge(accounts: string[][]): string[][] {
    const nameMap: Map<string, string[]> = new Map()
    
    for (let i = 0; i < accounts.length; i++) {
        const account = new Account(accounts[i][0])
        
        for (let j = 1; j < accounts[i].length; i++) {
            const email = accounts[i][j]

            if (nameMap.has(email)) {
                nameMap.get(email).add(account)
            } else {
                nameMap.set(email, account)
            }
        }
    }
};
```

because in the case of the merge happening on the last email, we would have already populated the rest of the emails: then, we'd have to backtrack the whole way resetting all the map refrences.

This could work, but I'd like to explore another path first: **union find**! (I do think the above was a rudimentary union find, but we can do a little better now that we can stand on the shoulders of the union find giants, rather than rolling my own)

This feels like a good usecase for union find, as we have a bunch of sets of emails, where we merge groups of sets on collision. It's worth nothing that the problem specifies that if an email is attached to a name, the persons entire account has the same name: thus, we can take the root node's name and it will necessarily be the name of the entire tree.

The first thing is we need a DSU (disjoint set universe? I know DS is correct, not sure about the U) class. 

One interesting thing about a DSU for me is that we actually use the index of the element to pick the "representitive" (each DS has a representitive, which is the "parent" element. The representitive distincted in any way, but a lot of the time the index is used, because it's a good way to make sure that all children point the the same parent). But, first I'll just implement a simple solution and work to a more optimal one (using path compression / ranking) later.

```typescript
class DSU {
    parents: Map<number, number>
        
    constructor(startingNumAccounts: number) {
        this.parents = new Map()
        
        for (let accountIndex = 0; i < startingNumAccounts; i++) {
            this.parents.set(i, i)
        }
    }

    find(index: number): number {
        if (parents.get(index) === index) {
            return index
        }
        
        return find(parents.get(index))
    }

    union(indices: [number, number]) {
        const [first, second] = [find[indicies[0], indicies[1]]]
        
        parents.add(first, second)
    }
}
```

This is the generic union find universe, now I'm going to make it problem specific. Here's the first DSU, with comments:

```typescript
class DSU {
    //map email -> parentEmail
    parents: Map<string, string>
        
    constructor() {
        this.parents = new Map()
    }

    find(email: string): string {
        if (this.parents.get(email) === email) {
            return email
        }
        
        return this.find(this.parents.get(email))
    }

    union(indicies: [string, string]) {
        const [first, second] = [
            this.find(indicies[0]), 
            this.find(indicies[1])
        ]
        
        this.parents.set(first, second)
    }
}
```

running a basic insert actually works, with all the elements unioning to a parent! pretty awesome, I think - a beautiful algorith. The next step is to group all the emails together with the same parent, so lets add to our DSU a `group` function:

```typescript
class DSU {
    ...
    group(): string[][] {
        const identities: Map<string, string[]> = new Map()
        
        for (let [child, parent] of this.parents) {
            if (identities.has(parent)) {
              identities.get(parent).push(child)
          } else {
              identities.set(parent, [child])
          }
        }
        
      
        return Array.from(identities, ([name, value]) => value)
    }
}
```

-------

I continued down this path for another hour and was unable to get a solution. Here is the code that I more or less copied from the actual solution, with comments about my thought process and whatnot:

```typescript
/*
I thought that using the indexes as the DSU groups was not good code, but I think it's way too hard to
do otherwise. Learning point here: use the indexies in a DSU. it doesn't matter if it's now "weakly linked"
it's much easier to mentally track, and uses a lot less space than strongly linking them.

The other point here is that if we use indexes, we can also index into the array O(1). The final point here is that
we can actually use a parrellel array instead of a map to track the indexes - for instance, instead of Map<i, parent>, 
we can instead do number[] where the ith index has a value of the parent index.

Good learning here - will try to take this further.
*/
class DSU {
    parents: number[]
    size: number[]
        
    constructor(size: number) {
        this.parents = []
        this.size = []
        
        for (let i = 0; i < size; i++) {
            this.parents[i] = i
            this.size[i] = 1
        }
    }

    find(index: number): number {
        /*
        Here's the awesome intution of the index value thing up top: we use the index
        to keep track of the element position, and the value to keep track of its parent.

        ex. parents[2] = 5 means the 2nd element has a parent of 5! 
        */
        if (this.parents[index] === index) {
            return index
        }
        
        /*
        if we go 8 elements deep, there's no point in going 8 elements deep next time - for
        each element we traverse, just set it's refrence to whatever parent we found!
        */
        this.parents[index] = this.find(this.parents[index])
        return this.parents[index]
    }

    union(indicies: [number, number]) {
        const [first, second] = [
            this.find(indicies[0]), 
            this.find(indicies[1])
        ]
        
        if (first === second) {
            return;
        }
        
        //I think this is intuitive enough :) 
        if (this.size[first] >= this.size[second]) {
            this.size[first] += this.size[second]
            this.parents[second] = first
        } else {
            this.size[second] += this.size[first]
            this.parents[first] = second
        }
    }
}

function accountsMerge(accounts: string[][]): string[][] {
    const size = accounts.length
    const disjointSet = new DSU(size)
    const emailGroup: Map<string, number> = new Map()
    
    /*
    this is pretty cool: instead of iterating like I did, we can use this to create a inital grouping
    of each element. So, the first iteration it points to itself, but if we've seen the email before, this
    email now points to the parent
    */
    for (let i = 0; i < size; i++) {
        const accountSize = accounts[i].length
        
        for (let j = 1; j < accountSize; j++) {
            const email = accounts[i][j]
            const name = accounts[i][0]
            
            if (!emailGroup.has(email)) {
                emailGroup.set(email, i)
            } else {
                disjointSet.union([i, emailGroup.get(email)])
            }
        }
    }
    
    const components: Map<number, string[]> = new Map()
    
    //components now creates a map like <repIndex, [emails]>. This is similar to what I did,
    //but it fixes an issue in my implemntation where there was a possibility for a non-rep
    //to be the key of the components array by having the path compression mean they all point
    // to the same parent necessarily.
    for (let email of emailGroup.keys()) {
        const group = emailGroup.get(email)
        const groupRep = disjointSet.find(group)
        
        if (!components.has(groupRep)) {
            components.set(groupRep, [])
        }
        
        components.get(groupRep).push(email)
    }
    
    //intuitive
    const mergedAccounts: string[][] = []
    for (let group of components.keys()) {
        const component: string[] = components.get(group)
        component.sort()
        component.unshift(accounts[group][0])
        mergedAccounts.push(component)
    }
    
    return mergedAccounts
};
```

Hopefully, writing out what I learned from the solution and then commenting each intution / learning out
allowed me to learn enough to solve a similar problem next time. I guess only time will tell!
