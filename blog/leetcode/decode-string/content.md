Good morning! 

Today's problem was [Decode String](https://leetcode.com/problems/decode-string/solution/).

If you've seen any open bracket problem before, I think this one is pretty intuitive! Something like "tell me if this is a valid bracket (i.e. the same open as close): (())" - the solution is trivially to use a stack, and for every open bracket, push it on the stack; for every closed, pop. if you ever pop and the length is 0, return false; if at the end, we end up with brackets on the stack, return 0. 

I took a similar approach here. Because I knew that the brackets were valid, we don't have to worry about there being too many or too little brackets. 

We need to store both the multiplication number, and the string that we're building: after we hit a close bracket, pop the stack and concat the `builtString * multNumber` onto the previous string. For this reason, we need to start the stack with an empty string. 

Here was my first solution:

```typescript
//O(n) time, O(n) space
function decodeString(s: string): string {
    //start stack with empty string, so we always push everything onto this string at the end
    const wordStack: [string, number][] = [['', 1]]
    const letters = s.split('')
    
    for (let i = 0; i < letters.length; i++) {
        //if we hit an open bracket, push a new "word" onto the stack, and the number 
        //before the word is the mult number.
        if (s[i] === '[') {
            wordStack.push(['', parseInt(letters[i] - 1)])
        } else if (s[i] === ']') {
            //if we have a close, pop the word we're building,
            //build it by repeating it with it's mult,
            //then concat it onto the previous word. 
            const builtWord = wordStack.pop()
            const builtRepeatedWord = builtWord[0].repeat(builtWord[1])
            wordStack[wordStack.length - 1][0] += builtRepeatedWord
        } else {
            //otherwise it's just a letter and push it on the stack.
            wordStack[wordStack.length - 1][0] += s[i]
        }
    }
    
    //return the first word.
    return wordStack.pop()[0]
};
```

It works, mostly! There were two problems here.

1. We push numbers on the stack, which we don't want.
2. We fail for any number greater than 9, since it's two digits and the one digit look-back fails.

My solution is just to attempt to check if we're in a number; if we are, we can start building a number, and
not push it onto the stack, like this:

```typescript
//O(n) time, O(n) space
function decodeString(s: string): string {
    const wordStack: [string, number][] = [['', 1]]
    const letters = s.split('')
    
    let inNumber = '' //building a inNumber string
    for (let i = 0; i < letters.length; i++) {
        const maybeVal = parseInt(letters[i])
        
                
        if (!isNaN(maybeVal)) { //if we're a number, we push it on inNUmber and contniue
            inNumber += letters[i]
            continue
        }
        
        if (s[i] === '[') { //since numbers always are before open brackets,
            wordStack.push(['', parseInt(inNumber)]) //we can safely parseInt of inNumber without worrying about mismatch.
            inNumber = ''
        } else if (s[i] === ']') {
            const builtWord = wordStack.pop()
            const builtRepeatedWord = builtWord[0].repeat(builtWord[1])
            wordStack[wordStack.length - 1][0] += builtRepeatedWord
        } else {
            wordStack[wordStack.length - 1][0] += s[i]
        }
    }
    
    return wordStack.pop()[0]
};
```