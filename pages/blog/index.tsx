import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { FormEventHandler, useState } from 'react'
import { Layout } from '../../components/layout/layout'
import { getBlogCategories, getPosts } from '../../helpers/get_posts'
import { Form } from 'react-bootstrap'
import { LockFill } from 'react-bootstrap-icons'


const Home = ({ categories, posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const { query } = useRouter()
    const [category, setCategory] = useState(query.category ?? '')

    const submitted: FormEventHandler<HTMLSelectElement> = (event) => {
        event.preventDefault()
        console.log(event.currentTarget.value)
        setCategory(event.currentTarget.value)
    }

    return (
        <Layout>
            <h3>Welcome to the Blog!</h3>
            <Form.Select size="lg" className="me-2" onChange={submitted} aria-label="Select Category" defaultValue={category}>
                <option value="">Filter by Category...</option>
                {categories.map(category => <option key={category} value={category}>{category}</option>)}
            </Form.Select>
            {posts.sort((a, b) =>
                new Date(b.meta.date!).valueOf() - new Date(a.meta.date!).valueOf()
            ).filter((post) => category === '' || (post.category) === category)
                .map((post) => (
                    <div key={post.slug} className="py-3">
                        {
                            post.meta.password && <div className="d-inline me-1">
                                <LockFill />
                            </div>
                        }

                        <Link href={`/blog/${post.category}/${post.slug}`} passHref>
                            <a className="link-primary d-inline-block">{post.meta.title ?? post.slug}</a>
                        </Link>
                        {post.meta.date && <small className="text-muted d-block">{post.meta.date}</small>}
                    </div>))}
        </Layout>
    )
}

export default Home

export const getStaticProps: GetStaticProps<{
    posts: ReturnType<typeof getPosts>,
    categories: ReturnType<typeof getBlogCategories>,
}> = async () => ({
    props: {
        posts: getPosts(),
        categories: getBlogCategories()
    },
})



