
import { Item, ItemStatus, User, UserRole, AdBanner } from '../types';

// Mock Users
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@sewalokal.com', phone: '60199999999', role: UserRole.ADMIN },
  { id: 'u2', name: 'Ali Hardware', email: 'ali@gmail.com', phone: '60123456789', role: UserRole.OWNER },
  { id: 'u3', name: 'Siti Party', email: 'siti@gmail.com', phone: '60133344455', role: UserRole.OWNER },
];

// Mock Items
let items: Item[] = [
  {
    id: 'i1',
    userId: 'u2',
    title: 'Heavy Duty Drill Bosch',
    description: 'Sesuai untuk tebuk dinding konkrit. Datang sekali mata drill set.',
    category: 'Tools & Hardware',
    location: 'Precint 9',
    pricePerDay: 30,
    contactPhone: '60123456789',
    imageUrl: 'https://picsum.photos/id/1/400/300',
    status: ItemStatus.ACTIVE,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'i2',
    userId: 'u2',
    title: 'Tangga Lipat 12 Kaki',
    description: 'Tangga aluminium heavy duty. Boleh lipat masuk kereta sedan.',
    category: 'Tools & Hardware',
    location: 'Lot kedai 1 (Shell)',
    pricePerDay: 15,
    contactPhone: '60123456789',
    imageUrl: 'https://picsum.photos/id/2/400/300',
    status: ItemStatus.ACTIVE,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'i3',
    userId: 'u3',
    title: 'Khemah Camping 4 Orang',
    description: 'Waterproof, mudah pasang. Sekali dengan ground sheet.',
    category: 'Camping & Outdoor',
    location: 'Tasek',
    pricePerDay: 25,
    contactPhone: '60133344455',
    imageUrl: 'https://picsum.photos/id/3/400/300',
    status: ItemStatus.ACTIVE,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'i4',
    userId: 'u3',
    title: 'PA System Portable',
    description: 'Speaker + 2 Mic Wireless. Bateri tahan 4 jam. Sesuai untuk kenduri kecil.',
    category: 'Party & Events',
    location: 'Precint 15',
    pricePerDay: 80,
    contactPhone: '60133344455',
    imageUrl: 'https://picsum.photos/id/4/400/300',
    status: ItemStatus.PENDING,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_ADS: AdBanner[] = [
  {
    id: 'ad1',
    position: 'top',
    title: 'Kedai Hardware Ah Chong - Diskaun 10%',
    imageUrl: 'https://picsum.photos/id/20/800/200',
    linkUrl: '#'
  },
  {
    id: 'ad2',
    position: 'list_insert',
    title: 'Perkhidmatan Lori Sewa Kuantan',
    imageUrl: 'https://picsum.photos/id/21/400/300',
    linkUrl: '#'
  }
];

// Helper functions to simulate API calls
export const getItems = (): Item[] => items;

export const getItemById = (id: string): Item | undefined => items.find(i => i.id === id);

export const addItem = (item: Omit<Item, 'id' | 'createdAt' | 'status' | 'isFeatured'>): Item => {
  const newItem: Item = {
    ...item,
    id: `i${Date.now()}`,
    status: ItemStatus.PENDING, // Always pending first
    isFeatured: false,
    createdAt: new Date().toISOString()
  };
  items = [newItem, ...items];
  return newItem;
};

export const updateItemStatus = (id: string, status: ItemStatus) => {
  items = items.map(i => i.id === id ? { ...i, status } : i);
};

export const deleteItem = (id: string) => {
  items = items.filter(i => i.id !== id);
};

export const toggleFeatured = (id: string) => {
  items = items.map(i => i.id === id ? { ...i, isFeatured: !i.isFeatured } : i);
};
