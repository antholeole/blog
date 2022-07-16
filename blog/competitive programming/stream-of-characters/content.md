This one is gonna mostly be a code dump... I figured out it was a trie pretty early (always is when running prefix matching) and then implemeneted a first approach. It came with a bug, unfortunately - because it was 99% the way there:

```typescript
class TrieNode {
    char?: string
    next: Map<string, TrieNode> = new Map()

    constructor(char?: string) {
        this.char = char
    }
}

class StreamChecker {
    trieRoot: TrieNode = new TrieNode()
    inProgressRuns: TrieNode[] = []

    constructor(words: string[]) {
        for (let word of words) {
            let currNode = this.trieRoot
            for (let letter of word.split('')) {
                if (currNode.next.has(letter)) {
                    currNode = currNode.next.get(letter)
                } else {
                    let newNode = new TrieNode(letter)
                    currNode.next.set(letter, newNode)
                    currNode = newNode
                }
            }
        }
    }

    query(letter: string): boolean {
        //for each in-progress run, if it doesn't continue,
        //remove it from the list. otherwise, replace the element
        //with the continued node
        this.inProgressRuns =
            this.inProgressRuns
            .map((trieNode) => this.checkTrie(trieNode, letter))
            .filter((inProgressRun) => !!inProgressRun)

        const fromRoot = this.checkTrie(this.trieRoot, letter)

        //every char needs to check the root too
        if (fromRoot) {
            this.inProgressRuns.push(fromRoot)
        }

        //now, if we have any runs that are at the end, that means we're good!
        //no need to worry about cleanup: either the node continues next char,
        //or it get cleaned up next run.
        for (let inProgressRun of this.inProgressRuns) {
            if (!inProgressRun.next.size) {
                return true
            }
        }

        return false
    }

    private checkTrie(node: TrieNode, letter: string): TrieNode | null {
        if (node.next.has(letter)) {
                return node.next.get(letter)
            } else {
                return null
            }
    }
}
```

I was checking if the node was a tip by doing `node.next.isEmpty`, which actually isn't true: a node in a trie can be the end of a word even if there's a next node!

All that was needed was a small update, which I'm not going to code dump because the diff is very small and obvious.

- Add a field to `TrieNode` that's called `isEnd`
- at the end of the iteration, do `currNode.isEnd = true`
- instead of checking if it has no children, check `isEnd`

and tada! A working competitive programming hard. Today's took me less than 45 minutes - a feat I am very proud of here.

----

## Optimization

First, I can cut out the overhead of the `TrieNode` class by using a fun trick I found in the solution. The `TrieNode` is just a nested map, and thus can be replaced by a data type. we can also say that the "word endings" contain some special char, and if the map contains that char, then it's an ending.

Another thing that can be done is a complete algorithmic rewrite! Before going, though, I should node that this solution isn't particularly ineffiecent: It's hard to put a runtime and space on, but I think it'd be, where `n` is the amount of input letters:

- worstcase time complexity: `O(n^2)`, because in a a trie that is a long chain of the same letters, for each new letter we have to iterate through all the previous letters.
- worstcase space complexity: `O(n * m^2)`, to store the trie and the max longest word pointers.

So it's exponential in both cases, which isn't horrible, but the reverse string solution is `O(m)` in both cases.

The reverse string is also intuitive: we know where each "word" ends, so we can just look up the trie backwards. if at any point we reach a node with the special char, that means we found an ending and we should return true - if we reach a node without children, then that means there's no word down this path and we should return false.

here's the final solution after some headscratching on the exit loop case of `query`:

```typescript
type Trie = Map<string, Trie>

class StreamChecker {
    trie: Trie  = new Map()
    stream: string[] = []

    constructor(words: string[]) {
        for (let word of new Set(words)) {
            let currNode = this.trie
            for (let letter of word.split('').reverse()) {
                if (!currNode.has(letter)) {
                    currNode.set(letter, new Map())
                }

                currNode = currNode.get(letter)
            }

            currNode.set('$', new Map())
        }
    }

    query(letter: string): boolean {
        this.stream.unshift(letter)

        let curr = this.trie
        for (let char of this.stream) {
            if (curr.has('$')) {
                return true
            }

            if (!curr.has(char)) {
                return false
            }

            curr = curr.get(char)
        }

        return curr.has('$') //duh! I just did return false first...
    }
}
```

Very, very elegant!