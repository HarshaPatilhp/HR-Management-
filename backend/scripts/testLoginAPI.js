const http = require('http');

const testLoginAPI = async (email, password) => {
  const data = JSON.stringify({
    email: email,
    password: password
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

const runTests = async () => {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                    🧪 LOGIN API ENDPOINT TEST                  ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const testCases = [
    { email: 'harsha@company.com', password: 'password123', expected: 'success' },
    { email: 'priya@company.com', password: 'password123', expected: 'success' },
    { email: 'rahul@company.com', password: 'password123', expected: 'success' },
    { email: 'harsha@company.com', password: 'wrongpassword', expected: 'fail' },
  ];

  for (const test of testCases) {
    console.log(`Testing: ${test.email}`);
    console.log(`Password: ${test.password}`);
    console.log(`Expected: ${test.expected}\n`);

    try {
      const result = await testLoginAPI(test.email, test.password);
      
      console.log(`Status Code: ${result.statusCode}`);
      
      if (result.statusCode === 200) {
        console.log('✅ LOGIN SUCCESSFUL!');
        console.log(`User: ${result.data.user.name}`);
        console.log(`Role: ${result.data.user.role}`);
        console.log(`Token: ${result.data.token ? 'Generated ✓' : 'Missing ✗'}\n`);
      } else {
        console.log('❌ LOGIN FAILED!');
        console.log(`Error: ${result.data.error || result.data}\n`);
      }
    } catch (error) {
      console.log('❌ API REQUEST FAILED!');
      console.log(`Error: ${error.message}`);
      console.log('💡 Make sure the backend server is running on port 5000\n');
    }
    
    console.log('─────────────────────────────────────────────────────────────\n');
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                         TEST COMPLETE                          ');
  console.log('═══════════════════════════════════════════════════════════════\n');
};

runTests();
