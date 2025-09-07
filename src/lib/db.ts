import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

let cachedConnection: typeof mongoose | null = null

export async function connectDB() {
  if (cachedConnection) {
    return cachedConnection
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI!)
    cachedConnection = connection
    console.log('✅ Connected to MongoDB')
    return connection
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

export default connectDB
