import { BookInstance } from "./book.model";

export interface Request {
    id: number;
    offer: number;
    bookInstance: {
        id: number;
    };
    requester: {
        id: number;
        name: string;
        rating: number;
    };
    for_days: number;
    status: 'approved' | 'pending' | 'rejected';
    created_at: Date;
    resolved_at?: Date;
}

export interface RequestsResponse {
    incoming: Request[];
    outgoing: Request[];
}