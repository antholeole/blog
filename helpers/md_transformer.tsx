import React from 'react'
import Gist from 'react-gist'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/cjs/styles/prism'

export const MarkdownTransformer = {
  code({inline, className, children, ...props} : React.PropsWithChildren<{ className?: string, inline?: boolean }>) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
    <SyntaxHighlighter 
      style={dracula} 
      language={match[1]} 
      PreTag="div" {...props}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>

    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  img(props: React.ImgHTMLAttributes<{}>) {
    return <div className="w-100 text-center">
    <img src={props.src!} alt={props.alt} className={'mw-100'}  />
    {props.alt && <figcaption className="text-muted">{props.alt}</figcaption>}
    </div>
  },
  a(props: React.LinkHTMLAttributes<{}>) {
    if (props.href?.replace('https://', '').startsWith('gist.github.com')) {
      return <Gist id={props.href.split('/').pop()!} />
    } else {
      return <a {...props} />
    }
  }
}

export const imageTransformer = (src: string, postSlug: string, postCategory: string) => {
  if (!src.startsWith('http')) {
      return `/blog/${postCategory}/${postSlug}/${src}`
  } else {
    return src
  }
}