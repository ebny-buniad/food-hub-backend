export interface ProviderProfile {
    image: string
    restaurentName: string,
    description: string,
    address: string,
    isOpen: boolean
}

// * Categories type
export interface Categories {
    cuisine: string
}

// * Meal type
export interface Meal {
    name: string,
    description: string,
    price: number,
    thumbnail: string,
    isAvailable: boolean,
    categoryId: string
}