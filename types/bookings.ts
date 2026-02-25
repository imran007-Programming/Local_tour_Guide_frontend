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
        id: string;
        amount: number;
        status: string;
        paymentIntentId?: string;
        transactionId?: string;
        paidAt?: string;
        createdAt: string;
    }[];
}