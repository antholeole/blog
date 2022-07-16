Hello!

Today's LC was a competitive programming easy, so I'm not going to go into too much detail here.

My first through was to do something like 2-sum: but, realizing that we actually don't have a easy way to find the minimum, that was a dead end.

My second thought was that two elements, with minimum difference, are adjacent to eachother while in a sorted list: i.e. if the minimum distance between two elements `a, b` is `n`, then the elements must be right next to eachother in a list: otherwise, if in a sorted list, `a, b` have `n` distance and there was some element `c` between them, (so the sorted list is `a, c, b`) then the distance is no longer from `a` to `b`, but from `a` to `c` OR `c` to `b`.

We also know that if the two elements are `n` (remember, we defined `n` as the minimum distance) apart, that we can ignore any two elements more than `n` elements apart. Thus, we can scan a sorted list LTR: if the current and previous element difference is less than our current `n`, then we can replace our current `n` and our whole element pair list; otherwise, if it's equal, we can add.

Here's the code for that:

```typescript
//O(nlogn) (sorting) time, O(log n) space (as return array doesn't count as aux space, but JS sort uses logn space)
function minimumAbsDifference(arr: number[]): number[][] {
    arr.sort((a, b) => a - b)

    let minDiff = Number.POSITIVE_INFINITY
    let pairs: [number, number][] = []

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] - arr[i - 1] < minDiff) {
            minDiff = arr[i] - arr[i - 1]
            pairs = [[arr[i - 1], arr[i]]]
        } else if (arr[i] - arr[i - 1] === minDiff) {
            pairs.push([arr[i - 1], arr[i]])
        }
    }

    return pairs
};
```

Working on the first try! lots of array indexing going on. If I had to rewrite it for clarity, here's what V2 would look like:

```typescript
//O(nlogn) (sorting) time, O(log n) space (as return array doesn't count as aux space, but JS sort uses logn space)
function minimumAbsDifference(arr: number[]): number[][] {
    arr.sort((a, b) => a - b)

    let minDiff = Number.POSITIVE_INFINITY
    let pairs: [number, number][] = []

    for (let i = 1; i < arr.length; i++) {
        const prevElement = arr[i - 1]
        const currElement = arr[i]
        const currDiff = currElement - prevElement

        if (currDiff < minDiff) {
            minDiff = currDiff
            pairs = [[prevElement, currElement]]
        } else if (currDiff === minDiff) {
            pairs.push([prevElement, currElement])
        }
    }

    return pairs
};
```