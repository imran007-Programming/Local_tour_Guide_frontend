export interface Booking {
    id: string;
    bookingDateTime: string;
    status: string;
    message?: string;
    cancelReason?: string;
    tour: {
        title: string;
        price: number;
        images: string[];
    };
    guide: {
        user: {
            name: string;
            email: string;
        };
    };
    tourist: {
        user: {
            name: string;
            email: string;
            profilePic?: string;
        };
    };
    payment?: {
        amount: number;
        status: string;
        paymentMethod?: string;
    };
}