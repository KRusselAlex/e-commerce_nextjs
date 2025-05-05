// lib/dbConnect.ts
import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DB = process.env.MONGODB_DB as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}


interface CachedConnection {
    client: MongoClient;
    db: Db;
}

// Use a module-level variable to cache the connection
let cachedConnection: CachedConnection | null = null;

export async function connectToDatabase(): Promise<CachedConnection> {
    // Return the cached connection if it exists
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        // Create a new connection if it doesn't exist
        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(MONGODB_DB);

        // Cache the connection
        cachedConnection = { client, db };

        return cachedConnection;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('Failed to connect to MongoDB');
    }
}