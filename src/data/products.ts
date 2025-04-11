export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  seller: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  createdAt: string;
}

export const products: Product[] = [
  {
    id: 1,
    title: 'Calculus Early Transcendentals',
    price: 45.99,
    description: 'Eighth edition, perfect for Calculus I & II',
    category: 'textbooks',
    image: '/images/defaults/textbook.jpg',
    seller: 'John D.',
    condition: 'Good',
    createdAt: '2024-03-10'
  },
  {
    id: 2,
    title: 'MacBook Air M1',
    price: 750.00,
    description: '2020 Model, 8GB RAM, 256GB SSD',
    category: 'electronics',
    image: '/images/defaults/electronics.jpg',
    seller: 'Sarah M.',
    condition: 'Like New',
    createdAt: '2024-03-12'
  },
  {
    id: 3,
    title: 'Dorm Mini Fridge',
    price: 80.00,
    description: '3.3 Cu. Ft. Perfect for dorm rooms',
    category: 'dorm-supplies',
    image: '/images/defaults/dorm.jpg',
    seller: 'Mike R.',
    condition: 'Good',
    createdAt: '2024-03-11'
  },
  {
    id: 4,
    title: 'Physics 101 Notes',
    price: 15.00,
    description: 'Complete semester notes with practice problems',
    category: 'course-notes',
    image: '/images/defaults/notes.jpg',
    seller: 'Emma L.',
    condition: 'New',
    createdAt: '2024-03-13'
  },
  {
    id: 5,
    title: 'Mountain Bike',
    price: 200.00,
    description: 'Trek 820, perfect for campus commuting',
    category: 'bikes',
    image: '/images/defaults/bike.jpg',
    seller: 'Chris P.',
    condition: 'Good',
    createdAt: '2024-03-09'
  },
  {
    id: 6,
    title: 'Wireless Earbuds',
    price: 45.00,
    description: 'Samsung Galaxy Buds, great condition',
    category: 'accessories',
    image: '/images/defaults/accessories.jpg',
    seller: 'Lisa K.',
    condition: 'Like New',
    createdAt: '2024-03-12'
  },
  {
    id: 7,
    title: 'Study Desk',
    price: 65.00,
    description: 'IKEA desk, perfect condition',
    category: 'furniture',
    image: '/images/defaults/furniture.jpg',
    seller: 'Tom H.',
    condition: 'Like New',
    createdAt: '2024-03-10'
  },
  {
    id: 8,
    title: 'University Hoodie',
    price: 25.00,
    description: 'Size L, worn only a few times',
    category: 'clothing',
    image: '/images/defaults/clothing.jpg',
    seller: 'Anna W.',
    condition: 'Good',
    createdAt: '2024-03-11'
  },
  {
    id: 9,
    title: 'Concert Tickets',
    price: 40.00,
    description: '2 tickets for the Spring Festival',
    category: 'event-tickets',
    image: '/images/defaults/tickets.jpg',
    seller: 'David M.',
    condition: 'New',
    createdAt: '2024-03-13'
  }
]; 