export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    full_content: string;
    category: string;
    featured_image: string;
    author: string;
    created_at: Date;
}