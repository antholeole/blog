import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Layout } from '../../../components/layout/layout'
import { getBlogCategories, getCategoriesPosts } from '../../../helpers/get_posts'
import { Breadcrumb } from 'react-bootstrap'
import { IMeta } from '../../../helpers/types'
import Link from 'next/link'
import { postTitle } from '../../../helpers/post_title'
import { capitalizeWords } from '../../../helpers/capitalize_words'
import ReactMarkdown from 'react-markdown'
import { MarkdownTransformer, imageTransformer } from '../../../helpers/md_transformer'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import CryptoJS from 'crypto-js'
import { useState } from 'react'
import { DECRYPT_PREFIX } from '../../../helpers/constants'
import DecryptBox from '../../../components/post/decrypt'

const BlogPost = ({ post, meta, titleSlug, category }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const title = postTitle(titleSlug, meta.title)

  const [content, setContent] = useState<string>(post)

  return (
    <Layout title={title}>
      <article className="w-100">
        <Breadcrumb>
          <Link href="/blog" passHref>
            <Breadcrumb.Item href="#">Blog</Breadcrumb.Item>
          </Link>
          <Link href={`/blog?category=${category}`} passHref>
            <Breadcrumb.Item href="#">{capitalizeWords(category)}</Breadcrumb.Item>
          </Link>
          <Link href={`/blog/${category}/${titleSlug}`} passHref>
            <Breadcrumb.Item href="#">{title}</Breadcrumb.Item>
          </Link>
        </Breadcrumb>
        <h1>{title}</h1>
        {meta.date && <sub>{meta.date}</sub>}
        {meta.password && <DecryptBox encryptedPost={post} onDecrypted={setContent} />}
        <ReactMarkdown
          components={MarkdownTransformer}
          transformImageUri={(src) => imageTransformer(src, titleSlug, category)}
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </Layout>
  )
}

export default BlogPost

export const getStaticProps: GetStaticProps<
  { post: string, category: string, titleSlug: string, meta: IMeta }
> = async ({ params }) => {
  const { category, title } = params as { category: string, title: string }

  const meta = JSON.parse(readFileSync(join(process.cwd(), 'blog', category, title, 'meta.json')).toString()) as IMeta

  let post: string
  const unencrypted = readFileSync(join(process.cwd(), 'blog', category, title, 'content.md')).toString()
  if (meta.password) {
    post = CryptoJS.AES.encrypt(DECRYPT_PREFIX + unencrypted, meta.password as unknown as string).toString()
  } else {
    post = unencrypted
  }

  return {
    props: {
      titleSlug: title,
      category,
      post,
      meta: {
        ...meta,
        password: !!meta.password
      }
    },
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  const categories = getBlogCategories()

  const paths = categories.flatMap((category) => getCategoriesPosts(category).map((title) => ({
    params: {
      category,
      title
    }
  })))

  return {
    paths,
    fallback: false
  }
}

