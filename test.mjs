import * as fs from 'fs'

fs.read(
    fs.openSync("test.mjs", "r"),
    Buffer.alloc(10000),
    0,
    1,
    0,
    (err, bytesRead, buffer) => {
        console.log(bytesRead, buffer.toString());
    }
);