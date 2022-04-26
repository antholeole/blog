import { monthDiff } from '../../../helpers/month_diff'
import { randomColor } from '../../../helpers/random_color'
import { ITestimonial } from './testimonial'


export const DiscordTestimonial = ({
    username, children, date, 
}: React.PropsWithChildren<ITestimonial>) => {
    return <div className="testimonial-container">
    <div className="youtube-testimonial">
        <div className="picture">
        <div style={{backgroundColor: randomColor()}}>
                {username.charAt(0)}
            </div>
        </div>
        <div className="content">
            <h3 className="name">{username}<span className="date">{monthDiff(date)} months ago</span></h3>
            {children}
        </div>
    </div>
    <small className="via">via Discord (with permission)</small>
    </div>
}