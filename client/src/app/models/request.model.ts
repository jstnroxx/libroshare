import { BookInstance } from "./book.model" 
import { User } from "./user.model"

export interface Request {
    id: number,
    bookInstance: BookInstance,
    requester: User,
    for_days: number,
    status: 'approved' | 'pending' | 'rejected',
    created_at: Date,
    resolved_at?: Date
}