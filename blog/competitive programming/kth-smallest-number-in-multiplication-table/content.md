One of my issues with JS is the fact that there is no out-of-the-box priority queue: Today, I learned that there's a PQ in competitive programming that we can use, which is very helpful.

I coded a simple PQ based approach. Due to the constraints, I knew it'd time out, but I felt happy enough with the solution to continue optimizing.

```typescript
function findKthNumber(m: number, n: number, k: number): number {
    const pq = new MinPriorityQueue({ priority: (n) => n })

    for (let i = 1; i < m + 1; i++) {
        for (let j = 1; j < n + 1; j++) {
            pq.enqueue(i * j)
        }

        if (pq.size() >= k * k) {
            break
        }
    }

    console.log(pq.toArray())

    for (let i = 0; i < k - 1; i++) {
        pq.dequeue()
    }

    console.log(pq.toArray())

    return pq.front().element
};
```

this works, although it uses more space + time than competitive programming gives us at big n and m.

My next intuition is that we don't need to precalc all elements; for instance, if we're looking for the 5th smallest element in a 3x3, we can safely remove the far-left column, because we know that it contains the 3 smallest elements, and now we're looking for the 2nd smallest element in the remainder.

Unfortunately, I couldn't manage to take this intuition to a solid endpoint, and gave up after around half an hour of reasoning.

The reason why, though, was because I was over-stating the intution: It's actually not true.

The real intution is this:

We still want to "remove" elements from the contest. In order to remove an element, though, it's important that we know we're removing something *less* than what we're searching for: thus, we want to remove `search / rowNum` elements. For instance, if we're searching for the number 5, and we're on `rowNum` 1, we can safely remove `5 / 1` elements... but wait! What if there's only 3 elements per row (i.e. cols = 3)? Then, we can only remove 3 - so now we know we remove `Math.min(search / rowNum, cols)` from the running.

so, we can iterate through the rows and find the amount of numbers less than a specific number! That's a very useful feature to have, because now, we can start with a random number (like 4):

- Q: How many elements less than or equal to 4?
- A: 6
- Q: how many elements less than or equal to 2?
- A: 3
- Q: how many elements less than or equal to 3?
- A: 5

5 is the answer! whoo! This is a binary search.

Unfortunately, I got stuck in the weeds with the binary search implementation, so no solution here.

Hopefully, better luck tomorrow!
