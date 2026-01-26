export const MOCK_LISTINGS = [
    {
        id: 1,
        title: "iPhone 15 Pro Max - 256GB",
        price: 850000,
        location: "Akwa, Douala",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000&auto=format&fit=crop",
        category: "Electronics",
        isNew: true
    },
    {
        id: 2,
        title: "Modern Sofa Set - 5 Seater",
        price: 350000,
        location: "Bastos, Yaoundé",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop",
        category: "Furniture"
    },
    {
        id: 3,
        title: "Toyota Vitz 2015",
        price: 3500000,
        location: "Buea, South West",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop",
        category: "Vehicles"
    },
    {
        id: 4,
        title: "PS5 Console + 2 Controllers",
        price: 400000,
        location: "Bonapriso, Douala",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop",
        category: "Gaming",
        isNew: true
    },
    {
        id: 5,
        title: "MacBook Air M2",
        price: 750000,
        location: "Yaoundé",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop",
        category: "Electronics"
    },
    {
        id: 6,
        title: "Nike Air Jordan 1",
        price: 45000,
        location: "Limbe",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
        category: "Fashion"
    },
    {
        id: 7,
        title: "Samsung Galaxy S24 Ultra",
        price: 900000,
        location: "Bonamoussadi, Douala",
        image: "https://images.unsplash.com/photo-1706606893701-a185b30c90c7?q=80&w=1000&auto=format&fit=crop",
        category: "Electronics",
        isNew: true
    },
    {
        id: 8,
        title: "Office Chair Ergonomic",
        price: 85000,
        location: "Akwa, Douala",
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
        category: "Furniture"
    }
]

export const MOCK_REQUESTS = [
    {
        id: "req1",
        title: "Looking for a used iPhone 12 Pro",
        budgetMax: 250000,
        location: "Buea, Molyko",
        description: "Need a clean UK used iPhone 12 Pro. Battery health should be above 85%.",
        user: {
            name: "Sarah Kang",
            avatar: "https://i.pravatar.cc/150?u=sarah",
            isVerified: true
        },
        category: "Electronics",
        postedAt: "2h ago",
        urgency: "High"
    },
    {
        id: "req2",
        title: "Apartment needed in Bonapriso",
        budgetMax: 150000,
        location: "Bonapriso, Douala",
        description: "Looking for a studio or 1 bedroom apartment. Modern finishings preferred.",
        user: {
            name: "Jean Paul",
            avatar: "https://i.pravatar.cc/150?u=jean",
            isVerified: false
        },
        category: "Real Estate",
        postedAt: "5h ago",
        urgency: "Normal"
    },
    {
        id: "req3",
        title: "Gaming Laptop (RTX 3060)",
        budgetMax: 600000,
        location: "Yaoundé",
        description: "I need a gaming laptop with at least RTX 3060 graphics card. HP Omen or Lenovo Legion.",
        user: {
            name: "Tech Bro",
            avatar: "https://i.pravatar.cc/150?u=tech",
            isVerified: true
        },
        category: "Electronics",
        postedAt: "1d ago",
        urgency: "High"
    },
    {
        id: "req4",
        title: "Wedding Dress Rental",
        budgetMax: 50000,
        location: "Bamenda",
        description: "Looking for a white wedding dress for rent for a weekend. Size 10-12.",
        user: {
            name: "Marie Claire",
            avatar: "https://i.pravatar.cc/150?u=marie",
            isVerified: true
        },
        category: "Fashion",
        postedAt: "2d ago",
        urgency: "High"
    }
]

export const MOCK_CONVERSATIONS = [
    {
        id: "conv1",
        buyer_id: "user_me",
        seller_id: "user_sarah",
        product_id: 1, // iPhone 15
        request_id: null,
        status: "open",
        created_at: "2024-01-20T10:00:00Z",
        other_user: {
            name: "Sarah Kang",
            avatar: "https://i.pravatar.cc/150?u=sarah",
            isOnline: true
        },
        context: {
            type: "product",
            title: "iPhone 15 Pro Max",
            price: 850000
        },
        last_message: {
            text: "Is the price negotiable?",
            created_at: "10:30 AM",
            is_read: true,
            sender_id: "user_me"
        }
    },
    {
        id: "conv2",
        buyer_id: "user_me",
        seller_id: "user_jean",
        product_id: null,
        request_id: "req2", // Apartment
        status: "open",
        created_at: "2024-01-21T14:20:00Z",
        other_user: {
            name: "Jean Paul",
            avatar: "https://i.pravatar.cc/150?u=jean",
            isOnline: false
        },
        context: {
            type: "request",
            title: "Apartment in Bonapriso",
            budget: 150000
        },
        last_message: {
            text: "I have a studio available in Akwa, interested?",
            created_at: "Yesterday",
            is_read: false,
            sender_id: "user_jean"
        }
    }
]

export const MOCK_MESSAGES = {
    "conv1": [
        { id: "m1", sender_id: "user_me", message_text: "Hello, I saw your iPhone 15 listing.", created_at: "10:00 AM", is_read: true },
        { id: "m2", sender_id: "user_sarah", message_text: "Hi! Yes, it is still available.", created_at: "10:05 AM", is_read: true },
        { id: "m3", sender_id: "user_me", message_text: "Is the price negotiable?", created_at: "10:30 AM", is_read: true }
    ],
    "conv2": [
        { id: "m4", sender_id: "user_jean", message_text: "I have a studio available in Akwa, interested?", created_at: "Yesterday", is_read: false }
    ]
}
