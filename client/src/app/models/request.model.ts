import { BookInstance } from "./book.model" 
import { User } from "./user.model"

export interface Request {
    id: number,
    bookInstance: BookInstance,
    requester: User,
    status: 'approved' | 'pending' | 'rejected',
    created_at: Date
}