const got = require('got');

const fs = require('fs');

const FormData = require('form-data');

const form = new FormData();
form.append('file', fs.createReadStream('file.zip'));


const init = {
  throwHttpErrors: false,
  headers: {
    'Content-Type': 'multipart/form-data',
    'User-Agent': 'runkod-cli-' + '1',
    'X-Runkod-Api-Key': 'abc'
  },
  method: 'POST',
  body: form
};

console.log(init)

const url = 'http://127.0.0.1:5001';

got(url, init).then(resp => {
  // console.log(resp)
})
