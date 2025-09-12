const mongoose = require('mongoose');

// Replace with your actual MongoDB connection string
const MONGODB_URI = "mongodb://localhost:27017/BasefinanceTrackApp";
 ;
console.log(MONGODB_URI);

async function fixCategoryIndexes() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully!');

        const db = mongoose.connection.db;
        const categoriesCollection = db.collection('Category');

        // First, let's see what indexes currently exist
        console.log('\n--- Current Indexes ---');
        const indexes = await categoriesCollection.indexes();
        indexes.forEach((index, i) => {
            console.log(`${i + 1}. ${index.name}:`, index.key);
        });

        // Check if the problematic name_1 index exists
        const hasNameIndex = indexes.some(index => index.name === 'name_1');
        
        if (hasNameIndex) {
            console.log('\n--- Dropping name_1 index ---');
            await categoriesCollection.dropIndex('name_1');
            console.log('✅ Successfully dropped name_1 index!');
        } else {
            console.log('\n--- name_1 index not found ---');
            console.log('The problematic index might already be removed or never existed.');
        }

        // Show indexes after the operation
        console.log('\n--- Indexes After Fix ---');
        const finalIndexes = await categoriesCollection.indexes();
        finalIndexes.forEach((index, i) => {
            console.log(`${i + 1}. ${index.name}:`, index.key);
        });

        console.log('\n✅ Fix completed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
}

// Run the fix
fixCategoryIndexes();