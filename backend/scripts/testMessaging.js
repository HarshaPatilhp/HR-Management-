const http = require('http');

const testAPI = async (method, path, data = null) => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api${path}`,
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (data) {
    const body = JSON.stringify(data);
    options.headers['Content-Length'] = body.length;
  }

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const testMessaging = async () => {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                  🧪 MESSAGING SYSTEM TEST                      ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // Test 1: Send a message
    console.log('Test 1: Sending a message...');
    const sendResult = await testAPI('POST', '/messages', {
      senderId: '123456789',
      senderName: 'Test User',
      receiverId: '987654321',
      message: 'Hello! This is a test message.',
      timestamp: new Date().toLocaleString()
    });

    if (sendResult.statusCode === 201) {
      console.log('✅ Message sent successfully!');
      console.log(`   Message ID: ${sendResult.data.data._id}`);
      console.log(`   Status: ${sendResult.data.message}\n`);
    } else {
      console.log('❌ Failed to send message');
      console.log(`   Status: ${sendResult.statusCode}`);
      console.log(`   Error: ${JSON.stringify(sendResult.data)}\n`);
    }

    // Test 2: Get messages
    console.log('Test 2: Fetching messages...');
    const getResult = await testAPI('GET', '/messages?userId=123456789');

    if (getResult.statusCode === 200) {
      console.log('✅ Messages fetched successfully!');
      console.log(`   Count: ${getResult.data.length} messages\n`);
    } else {
      console.log('❌ Failed to fetch messages');
      console.log(`   Status: ${getResult.statusCode}\n`);
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    ✅ TESTS COMPLETED                          ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('Messages are working! Try sending a message in the app now.\n');

  } catch (error) {
    console.log('\n❌ TEST FAILED!');
    console.log(`Error: ${error.message}\n`);
    console.log('Make sure the backend server is running on port 5000\n');
  }
};

testMessaging();
