const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to Local MongoDB...');
    console.log('📍 Connection URI:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🎯 Using LOCAL MongoDB (Persistent Data)`);
    
    // Create demo users
    await createDemoUsers();
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('');
    console.log('🔧 TROUBLESHOOTING:');
    console.log('1. Make sure MongoDB is running: mongod --dbpath /usr/local/var/mongodb --fork');
    console.log('2. Check connection: mongosh');
    console.log('3. Verify .env has: MONGODB_URI=mongodb://localhost:27017/insa_approval_system');
    console.log('');
    process.exit(1);
  }
};

const createDemoUsers = async () => {
  try {
    const User = require('../models/User');
    
    console.log('👥 Setting up demo users in LOCAL MongoDB...');
    
    // Clear existing demo users
    await User.deleteMany({
      employeeId: { $in: ['INSA-EMP-001', 'INSA-MGR-001', 'INSA-ADM-001'] }
    });
    
    // Create demo users
    const demoUsers = [
      {
        name: 'John Doe',
        email: 'employee@insa.gov.et',
        password: 'password123',
        role: 'requester',
        department: 'IT Department',
        employeeId: 'INSA-EMP-001'
      },
      {
        name: 'Jane Smith',
        email: 'manager@insa.gov.et',
        password: 'password123', 
        role: 'approver',
        department: 'IT Management',
        employeeId: 'INSA-MGR-001'
      },
      {
        name: 'Admin User',
        email: 'admin@insa.gov.et',
        password: 'password123',
        role: 'admin',
        department: 'System Administration',
        employeeId: 'INSA-ADM-001'
      }
    ];

    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }
    
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
    console.log('🎉 Demo users setup completed in LOCAL MongoDB!');
    
  } catch (error) {
    console.error('❌ Error creating demo users:', error.message);
  }
};

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to LOCAL MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📴 MongoDB connection closed');
  process.exit(0);
});

module.exports = connectDB;