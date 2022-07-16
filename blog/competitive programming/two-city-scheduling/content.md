Whenever you see the words "maximize" or "minimize", you should make a mental note that eventually we're going down a DP route.

This problem is interesting because it does _not_ go down the DP route - although you could, if you'd like. I did for a little, and then while thinking of the DP solution, realized that we were following a very simple rule. But first, the recursive solution.

### Recursive Solution

For every person, we either have to put them in city A, or city B. there is no passing on anyone. During a single pass, though, we aren't sure if perhaps there will be a person that more deserves a seat in the city we placed the current person at. The solution to this is to brute-force test everything!

The base case is easy; if there's no one in the queue anymore, it will take 0 cost to fly everyone out; base case:

```typescript
if (!costs.length) {
    return 0
}
```

easy! The other thing that we need to do is keep track of the amount of people in each city; unfortunatly, there's no super intuitive way to do this (I don't think, although I didn't put too much though into it). My solution was to add two paramaters to the function, and default them to 0, like this:

```typescript
function twoCitySchedCost(
    costs: [number, number][],
    aCount = 0,
    bCount = 0,
): number {
```

(sidenote: competitive programming doesn't actually know about TS tuple syntax, so it'll give you `costs: number[][]`. I changed it to tuple for a little more readability.)

The other "base case" is when we literally cannot put enough people in a city to make it even. We can avoid these cases by catching the cases where $|cityA| = |cityB| + |costs|$.

```typescript
    //we have to put the remaining people in group B
    if (aCount - bCount >= costs.length) {
        return citySum(costs, 1)
    }

    //we have to put the reminainig people in group A
    if (bCount - aCount >= costs.length) {
        return citySum(costs, 0)
    }
```

City sum is just a small helper:

```typescript
function citySum(costs: [number, number][], cityIndex: number): number {
    let counter = 0

    for (const cost of costs) {
        counter += cost[cityIndex]
    }

    return counter
}
```

I tried to do this with "reduce" but reduce is really annoying in TS since it makes you return the same output type as input type; i.e. `List<T>.reduce<A>((A, T) => A)` does not work.

All we have to handle here now is the recursive case. The two options on the "current" person are to put them in group A or group B. we can `Math.min` the result of recursion of both options:

```typescript
///get the last person
    const currentPerson = costs.at(-1)

///get all the other people
    const allOthers = costs.slice(0, -1)

    //min of..
    return Math.min(
        //putting them in city A
        twoCitySchedCost(
            allOthers,
            aCount + 1,
            bCount
        ) + currentPerson[0],
        //putting them in city B
        twoCitySchedCost(
            allOthers,
            aCount,
            bCount + 1
        ) + currentPerson[1],
    )
```

This actually gets you the answer! Unfortunatly, it gives time limit exceeded. There are modes of optimization. Things like:

- we are calculating the sum of the remaining people many times; this is redundant work.
- we can cache the min possible at a certain point by using a map; think of it like `dp[aPpl][bPpl] = minCost`. This should, although hasn't been tested, lead to a solution at `dp[n][n]` where n is the amount of people we want in both cities.

### Sorting solution

DP is nice here, but lets do some critical thinking.

We're given a case where the input array looks like this: `[[1000, 5], [5, 4]]`. If we send the second person to city B, we'd end up paying 4, which is cheaper than sending the first person to city B. _but_, since we have to send everyone _somewhere_, we'd end up paying the 1000 to get that person to city A, which is obviously not the correct answer. What's the heuristic we should use to determine what city we send what person to?

The _savings_ of sending that person to either city. We'll use city A without loss of generality. In this case, the savings of sending person 1 to city A is 995. This person is _probably_ going to end up at city B... unless someone costs more than 995 to get to city B. For instance: `[[1000, 5], [1000, 4]]`. savings are [995, 996]. Sort that ascending, and then send the first `n` people to city A, and the second `n` people to city B. We pay the 1000 either way, but we're paying a 4 for the second person, which saves us a dollar.

Consider a bigger example:

```typescript
//input
[[10,20],[30,200],[400,50],[30,20]]

//savings
[-10, -170, 350, 10]

//now sort:
[[30, 200], [10, 20], [30, 20], [400, 50]]
```

we can see that on the output, we're definatly going to want to send the person who pays 400 for a ticket to city A to city B. that's why he's at the right end; and we definantly want to send the person who pays 200 for a ticket to city B to city A. That's why he's on the left!

Note that we're paying the costs, not the savings, so we can't calculate the savings and sort that. Instead, we need to in-place sort the array, and then calculate the price we're paying with another traversal.

Here's the sort:

```typescript
costs.sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]))
```

and here's some very simple accumulator code:
```typescript
    const n = costs.length / 2

    let accum = 0
    for (let i = 0; i < costs.length; i++) {
        if (i < n) {
            //first half goes to city A...
            accum += costs[i][0]
        } else {
            //second half goes to city B!
            accum += costs[i][1]
        }
    }

    return accum
```

And that's it! That's our whole solution.

```typescript
function twoCitySchedCost(
    costs: [number, number][],
): number {
    costs.sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]))

    const n = costs.length / 2

    let accum = 0
    for (let i = 0; i < costs.length; i++) {
        if (i < n) {
            accum += costs[i][0]
        } else {
            accum += costs[i][1]
        }
    }

    return accum
};
```

Very simple and fast. O(nlogn) speed, O(1) space.

Elegance is a single out of the box thought away. Sorting was something that became clear after I realized that we were using a simple, hidden heuristic that became clear after running through some examples. I do like that I saw that it was DP for a little, but then pivoted when I saw a better direction.