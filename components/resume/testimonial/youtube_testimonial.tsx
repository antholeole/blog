

import { HandThumbsUpFill, HandThumbsDown } from 'react-bootstrap-icons'
import { randomColor } from '../../../helpers/random_color'

interface IYoutubeTestimonialProps {
    username: string
    likes: number
    date: Date
    via?: {
        href: string,
        platform: string
    }
}

export const YoutubeTestimonial = ({
    username, likes, children, date, via
}: React.PropsWithChildren<IYoutubeTestimonialProps>) => {
    const timeAgo = new Date().getMonth() - date.getMonth()

    return <div className="testimonial-container">
    <div className="youtube-testimonial">
        <div className="picture">
        <div style={{backgroundColor: randomColor()}}>
                {username.charAt(0)}
            </div>
        </div>
        <div className="content">
            <h3 className="name">{username}<span className="date">{timeAgo} months ago</span></h3>
            {children}
            <div className="icons">
                <HandThumbsUpFill />
                <p className='like-count'>{likes}</p>
                <HandThumbsDown />
                <p className='reply'>REPLY</p>
            </div>
        </div>
    </div>
    {via && <small className="via">via <a href={via.href}>{via.platform}</a></small>}
    </div>
}