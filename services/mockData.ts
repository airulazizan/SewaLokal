
import { Item, ItemStatus, User, UserRole, AdBanner } from '../types';

// Helper to calculate score dynamically
const calculateTrustScore = (user: User): number => {
  let score = 40; // Base score for registration

  // Profile info bonus
  if (user.bio && user.bio.length > 10) score += 10;
  if (user.phone) score += 10;
  
  // Verification bonus
  if (user.hasSelfieVerified) score += 20;
  if (user.isVerified) score += 20; // Admin verify

  return Math.min(score, 100); // Max 100
};

// Mock Users
let users: User[] = [
  { 
    id: 'u1', 
    name: 'Admin User', 
    email: 'admin@sewalokal.com', 
    phone: '60199999999', 
    role: UserRole.ADMIN,
    joinDate: '2023-01-01',
    isVerified: true,
    hasSelfieVerified: true,
    trustScore: 100,
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=6b21a8&color=fff',
    bio: 'Official Admin Account'
  },
  { 
    id: 'u2', 
    name: 'Ali Hardware', 
    email: 'ali@gmail.com', 
    phone: '60123456789', 
    role: UserRole.OWNER,
    joinDate: '2023-05-15',
    isVerified: true,
    hasSelfieVerified: false,
    trustScore: 80, // 40 base + 10 bio + 10 phone + 20 admin
    avatarUrl: 'https://ui-avatars.com/api/?name=Ali+Hardware&background=0d9488&color=fff',
    bio: 'Menyediakan pelbagai alatan pertukangan dan hardware berkualiti. Lokasi di Precint 9.'
  },
  { 
    id: 'u3', 
    name: 'Siti Party', 
    email: 'siti@gmail.com', 
    phone: '60133344455', 
    role: UserRole.OWNER,
    joinDate: '2023-06-20',
    isVerified: false,
    hasSelfieVerified: false,
    trustScore: 60, // 40 base + 10 bio + 10 phone
    avatarUrl: 'https://ui-avatars.com/api/?name=Siti+Party&background=db2777&color=fff',
    bio: 'Sewa barang party, khemah dan PA system. Harga boleh bincang.'
  },
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
    isAvailable: true,
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
    isAvailable: true,
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
    isAvailable: true,
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
    isAvailable: true,
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

// --- User API ---
export const getUsers = (): User[] => users;

export const getUserById = (id: string): User | undefined => users.find(u => u.id === id);

export const registerUser = (name: string, email: string, phone: string): User => {
  const newUser: User = {
    id: `u${Date.now()}`,
    name,
    email,
    phone,
    role: UserRole.OWNER,
    joinDate: new Date().toISOString(),
    isVerified: false,
    hasSelfieVerified: false,
    trustScore: 40, // Base score
    bio: '',
    avatarUrl: undefined
  };
  newUser.trustScore = calculateTrustScore(newUser);
  users = [...users, newUser];
  return newUser;
};

export const updateUser = (updatedUser: User) => {
  const score = calculateTrustScore(updatedUser);
  const userWithScore = { ...updatedUser, trustScore: score };
  users = users.map(u => u.id === updatedUser.id ? userWithScore : u);
};

export const verifyUser = (userId: string, isVerified: boolean) => {
  users = users.map(u => {
    if (u.id === userId) {
      const updated = { ...u, isVerified };
      updated.trustScore = calculateTrustScore(updated);
      return updated;
    }
    return u;
  });
};

export const verifySelfie = (userId: string, selfieUrl: string) => {
  users = users.map(u => {
    if (u.id === userId) {
      const updated = { ...u, hasSelfieVerified: true, selfieUrl };
      updated.trustScore = calculateTrustScore(updated);
      return updated;
    }
    return u;
  });
};

// --- Item API ---
export const getItems = (): Item[] => items;

export const getItemById = (id: string): Item | undefined => items.find(i => i.id === id);

export const getItemsByUserId = (userId: string): Item[] => items.filter(i => i.userId === userId);

export const addItem = (item: Omit<Item, 'id' | 'createdAt' | 'status' | 'isFeatured' | 'isAvailable'>): Item => {
  const newItem: Item = {
    ...item,
    id: `i${Date.now()}`,
    status: ItemStatus.PENDING, // Always pending first
    isFeatured: false,
    isAvailable: true,
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

export const toggleAvailability = (id: string) => {
  items = items.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i);
};
