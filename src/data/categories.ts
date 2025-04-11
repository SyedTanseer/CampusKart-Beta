export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: 'Textbooks',
    slug: 'textbooks',
    description: 'Buy and sell used textbooks for your courses'
  },
  {
    id: 2,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Laptops, phones, and other tech gadgets'
  },
  {
    id: 3,
    name: 'Dorm Supplies',
    slug: 'dorm-supplies',
    description: 'Everything you need for your dorm room'
  },
  {
    id: 4,
    name: 'Course Notes',
    slug: 'course-notes',
    description: 'Study materials and course notes'
  },
  {
    id: 5,
    name: 'Bikes',
    slug: 'bikes',
    description: 'Bicycles and accessories for campus commuting'
  },
  {
    id: 6,
    name: 'Accessories',
    slug: 'accessories',
    description: 'Fashion accessories and personal items'
  },
  {
    id: 7,
    name: 'Furniture',
    slug: 'furniture',
    description: 'Dorm and apartment furniture'
  },
  {
    id: 8,
    name: 'Clothing',
    slug: 'clothing',
    description: 'New and gently used clothing'
  },
  {
    id: 9,
    name: 'Event Tickets',
    slug: 'event-tickets',
    description: 'Tickets for campus events and activities'
  }
]; 