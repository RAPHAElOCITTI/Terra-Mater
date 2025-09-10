/**
 * Interface for the testimonials table.
 */
export interface Testimonial {
    id: number;
    quote: string;
    author: string;
    created_at: string;
    updated_at: string;
}
/**
 * Interface for the blogs table.
 */
export interface Blog {
    id: number;
    title: string;
    excerpt: string | null;
    content: string;
    link: string | null;
    created_at: string;
    updated_at: string;
}
/**
 * Interface for the faqs table.
 */
export interface Faq {
    id: number;
    question: string;
    answer: string;
    created_at: string;
    updated_at: string;
}
/**
 * Interface for the projects table.
 */
export interface Project {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    created_at: string;
    updated_at: string;
    created_by: string;
}
/**
 * Interface for the data_entries table.
 */
export interface DataEntry {
    id: string;
    project_id: string;
    data: any;
    metadata: any | null;
    created_at: string;
    updated_at: string;
    created_by: string;
}
export type ContentType = 'testimonials' | 'blogs' | 'faqs' | 'projects' | 'data_entries';
//# sourceMappingURL=index.d.ts.map