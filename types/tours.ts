export interface Tour {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: number;
    meetingPoint: string;
    maxGroupSize: number;
    city: string;
    itinerary: string;
    category: string;
    languages: string[];
    images: string[];
    slug: string;
}