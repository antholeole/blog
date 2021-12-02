

import Image from 'react-bootstrap/Image'
import { randomColor } from '../../../helpers/random_color'

interface IMediumTestimonial {
    username: string
    likes: number
    date: Date
    via?: {
        href: string,
        platform: string
    }
}

export const MediumTestimonial = ({
    username, likes, children, date, via
}: React.PropsWithChildren<IMediumTestimonial>) => {
    const timeAgo = new Date().getMonth() - date.getMonth()

    return <div className="testimonial-container">
    <div className="medium-testimonial">
        <div className="picture">
            <div className="avatar" style={{backgroundColor: randomColor()}}>
                {username.charAt(0)}
            </div>
            <div className="nametag">
                <p className="name">{username}</p>
                <span className="date">{timeAgo} months ago</span>
            </div>
        </div>
        <div className="content">
            {children}
            <div className="icons">
            <Image src="/medium_clap.png" alt="medium.com clapping emoji" className="clap" width="32" height="32" />
            </div>
        </div>
    </div>
    {via && <small className="via">via <a href={via.href}>{via.platform}</a></small>}
    </div>
}