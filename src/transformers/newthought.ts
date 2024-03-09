import type { Plugin } from 'unified'
import type { Node, Parent } from 'unist'
import type { Text } from 'mdast'
import { visit } from 'unist-util-visit'

// adds newthought class to anything between double bars,
// e.g. ||this is a new thought||. 
//
// This would make a good leetcode.
export const remarkNewthought: Plugin<any> = () => {
    return (tree: Node) => {
        visit(tree, 'paragraph', (paragraphNode: Parent) => {
            for (let child of paragraphNode.children) {
                if (child.type !== 'text') {
                    continue
                }

                const text = child as Text

                const out = parseTextWithBars(text.value)
                console.log(out)

                // if it DOES equal one, we don't want to touch it.
                if (out.length !== 1) {
                    paragraphNode.children = out as any
                }
            }
        })
    }
}

function parseTextWithBars(inputString: string) {
    const parsedSegments = [];
    let currentText = "";
    let insideBars = false;

    for (let i = 0; i < inputString.length; i++) {
        const char = inputString[i];

        if (char === '|' && inputString[i + 1] === '|' && !insideBars) {
            // Found the start of a double-bar segment
            if (currentText) {
                parsedSegments.push({
                    type: "text",
                    value: currentText
                });
                currentText = "";
            }
            insideBars = true;
            i++; // Skip the next '|'
        } else if (char === '|' && inputString[i + 1] === '|' && insideBars) {
            // Found the end of a double-bar segment
            parsedSegments.push({
                type: "element",
                data: {
                    hName: "span",
                    hProperties: {
                        className: ["newthought"]
                    }
                },
                children: [{ type: "text", value: currentText }]
            });
            currentText = "";
            insideBars = false;
            i++; // Skip the next '|'
        } else {
            currentText += char;
        }
    }

    // Add any remaining text segment
    if (currentText) {
        parsedSegments.push({ type: "text", value: currentText });
    }

    return parsedSegments;
}