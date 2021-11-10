import parse, { HTMLReactParserOptions } from 'html-react-parser'

export const contentHandler = (postContent: string) => {  
    return parse(postContent)
  }