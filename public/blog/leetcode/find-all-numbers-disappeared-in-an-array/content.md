Nothing much to be said here for the first solution: it was a very easy problem. All that I did was store the values in a set (already upper bounded to `O(n)` in runtime and space), and remove them (`O(logn)`) as we progressed. 

Then, at the end, we just converted the remaining values into an array and returned it! This might be O(n) space if we count the set as aux space and the converted array as the return value, but that feels like such a detail I don't think it matters too much.

```typescript
function findDisappearedNumbers(nums: number[]): number[] {
    const set = new Set(nums.map((_, i) =>  i + 1))
    
    for (let num of nums) {
        set.delete(num)
    }
    
    return Array.from(set)
};
```

I honestly thought that there wasn't a way to do a faster solution, as `O(n)` runtime and `O(1)` space is as good as I thought it would be, so I decided to peek at the solutions. 

Apparently, there was a *real* O(1) space solution, that used a clever approach.

An array actually contains more value than it appears at face:
- The elements in the array, obviously
- The length, and corresponding indicies

And a single $x \in \mathbb{N}$ conveys multiple things:
- It's distance from 0
- It's sign

Point one is probably obvious in both those lists, but point two is actually something that takes a deeper dive.

We can mark elements that we have seen before by taking a value in the array (i.e. 5), and marking the index at that value by making it negative (`array[value] = Math.abs(array[value]) * -1`). Then, we just iterate back, adding all elements greater than 0 (because, if it's less than 0, that means it was marked as negative, and thus we have seen it) to the output and returning it!

we just need to make sure we're accounting for off-by-1, since the array contains $1..n$, not $0..n$ elements.

```typescript
//O(n) runtime, O(1) space
function findDisappearedNumbers(nums: number[]): number[] {
    for (let num of nums) {
        const idx = Math.abs(num) - 1
        nums[idx] = Math.abs(nums[idx]) * -1
    }
    
    const res = []
    
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0) {
           res.push(i + 1)
        }
    }
    
    return res
};
```

Very clever solution here! Glad I went to learn it.

Key takeaways:
- Don't stop after first solution; atleast spend a little time trying to optimize.
- There is more value than meets the eye; the arrays index and the negative number are a really clever solution to save space - utilize any value possible!