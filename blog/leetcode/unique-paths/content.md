All hail the Leetcode! Today is the first day I actually felt progress. It felt like the last 6 days, I've been doing Leetcode but to no avail - it felt like a bunch of disjoint solutions, without any transferable knowledge.

Today proved me wrong :)

![1 for 1 on optimal submissions!](submission.png)

I thought back to the [Largest Divisible Subset](ants.place/blog/leetcode/largest-divisible-subset) problem, and realized that this was a hallmark DP problem. The problem could be broken down into subproblems: instead of worrying about the final step first, lets worry about each step individually, gradually building up an answer to the final step.

If a cell is along the x or y axis, then there is only one way to get there. This is trivial: if it is along the x axis (y = 0), then the only way to get there is by going only right and visa versa for the y axis.

Thus, our dp array generation can look like this:

```typescript
    const dp = Array.from({
        length: m
    }, (_, i) => {
        if (i === 0) {
            return Array.from({
                length: n
            }, () => 1)
        } else {
            return Array.from({
                length: n
            }, (_, i) => i === 0 ? 1 : 0)
        }
    })
```

What this is saying is that: generate a list. If it is the first list, it is all 1's; otherwise, it is a list where the first element is one. 

this creates a grid with the whole top row equal to ones and the whole left row equal to ones!

Now, it's important to note that to get to a cell $t$, there is two ways to get to it: from the cell above, and from the cell to the left. That means that we can add the ways to get to the cell above, and to get to the cell to the left, and thats the number of ways we can get to $t$!

Because we filled out the top and left row, we don't have to worry about there not being a top or left cell, as long as we start our iteration from the second row and column:

```typescript
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
        }
    }
```

We now have the table successfully filled out - now, we can return the bottom right and be done: `return dp[m - 1][n - 1]`

final solution:

```typescript
//O(m * n) space, O(m * n) runtime
function uniquePaths(m: number, n: number): number {
    const dp = Array.from({
        length: m
    }, (_, i) => {
        if (i === 0) {
            return Array.from({
                length: n
            }, () => 1)
        } else {
            return Array.from({
                length: n
            }, (_, i) => i === 0 ? 1 : 0)
        }
    })
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
        }
    }
    
    return dp[m - 1][n - 1]
};
```

But this isn't the optimal solution, unfortunately. There are some optimizations that can be make:

- First one is a little redundant, because we're going to cut it out compltetly, but we can actually skip all the initalization logic and just initalize the whole table to 1's, because we never read from a cell that we haven't written to yet.

- We can actually only use O(n) space by doing the following:

If we have an dp table like this:
|   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 
| 1 | ? | ? | ? | ? | ? | ? |

When filling out the bottom row, we completely ignore the first row - actually, we only read from the row above, meaning we're wasting a ton of space storing data that we only need for the subsequent iteration.

Instead, imagine we restrict our table to one row:

|   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 |

then, instead of doing `dp[i][j] = dp[i - 1][j] + dp[i][j - 1]`, we actually do `dp[j] = dp[j - 1] + dp[j]`, and just constantly overwrite the same array. the `dp[j]` is refering to the value "above" it (because it's at the same x, and the previous iteration put it there), and the `dp[j - 1]` refers to the element that we just inserted, to the left.

So our new final solution that just uses O(n) space is this:

```typescript
// O(n) space, O(n * m) runtime
function uniquePaths(m: number, n: number): number {
    const dp = Array.from({
        length: n
    }, () => 1)
    
    for (let i = 0; i < m - 1; i++) {
        for (let j = 1; j < n; j++) {
            dp[j] = dp[j - 1] + dp[j]
        }
    }
    
    return dp[n - 1]
};
```

Attempting to get the maths solution, here's a fun little code golf solution which is very sub-optimal:

```typescript
function uniquePaths(m: number, n: number): number {
    if (m === 1 || n === 1) {
        return 1
    } 

    return uniquePaths(n - 1, m) + uniquePaths(n, m - 1)    
};
```






