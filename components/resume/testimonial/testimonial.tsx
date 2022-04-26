export interface ITestimonial {
    username: string
    likes?: number
    date: Date
    via?: {
        href: string,
        platform: string
    }
}