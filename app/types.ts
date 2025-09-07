// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  loyaltyPoints: number;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Product Types
export interface ProductVariant {
  color: string;
  images: string[];
  sizes: string[];
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  ratings: number;
  variants: ProductVariant[];
  onSale: boolean;
  discountPercentage: number;
  price: number;
  stock: number;
  type: "money" | "points" | "hybrid";
  category: string;
  loyaltyPoints: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Cart Types
export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    variants?: Array<{
      images: string[];
    }>;
  };
  quantity: number;
  color?: string;
  size?: string;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  user: string;
}

// Order Types
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface OrderItem {
  product: string; // product ID
  color?: string;
  size?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  user: string; // user ID
  items: OrderItem[];
  totalAmount: number;
  pointsUsed: number;
  discount: number;
  status: OrderStatus;
  updatedBy?: string; // user ID
  createdAt?: string;
  updatedAt?: string;
}

// Product Review Types
export interface ReviewUser {
  _id: string;
  name: string;
}

export interface ProductReview {
  _id: string;
  product: string;
  user: ReviewUser;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// API Request DTOs
export interface CreateProductReviewDto {
  rating: number;
  comment: string;
  product: string; // product ID
}

export interface UpdateProductReviewDto {
  rating?: number;
  comment?: string;
}

export interface AddToCartDto {
  product: string;
  quantity: number;
  variant: string; // color
  size: string;    // size
}

export interface UpdateCartItemDto {
  product: string;
  quantity: number;
  variant?: string;
  size?: string;
}


export interface CreateOrderDto {
  items: {
    productId: string;
    color?: string;
    size?: string;
    quantity: number;
  }[];
  pointsUsed?: number;
  discount?: number;
}

// Auth DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Auth Response
export interface AuthResponse {
  user: User;
  token: string;
}

// Query Params
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductQuery extends PaginationQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  type?: "money" | "points" | "hybrid";
  search?: string;
}