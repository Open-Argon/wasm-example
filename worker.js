importScripts("argon_wasm.js");

ArgonWASMRuntime({
    console: {
        log: (...msg) => {
            self.postMessage(msg.join(" ") + "\r\n");
        },
        write: (...msg) => {
            console.log(msg.join(" "));
            self.postMessage(msg.join(" "));
        },
        warn: (...msg) => {
            self.postMessage(
                "\x1B[1;3;31mWARN:" + msg.join(" ") + "\x1B[0m\r\n"
            );
        },
        error: (...msg) => {
            self.postMessage(
                "\x1B[1;3;31mERROR:" + msg.join(" ") + "\x1B[0m\r\n"
            );
        },
    },
});

self.onmessage = async (e) => {
    if (e.data.type === "run") {
        const { source, args } = e.data;
        try {
            await Ar.eval(source, args);
        } catch (e) {
            self.postMessage(
                "\x1B[1;3;31mERROR:WASM still booting up (" + e + ")\x1B[0m\r\n"
            );
        }
    } else if (e.data.type === "input") {
        const { input, key } = e.data;
        Ar.input(input, key);
    }
};

const wait = setInterval(() => {
    if (self.Ar&&self.Ar.eval) {
        self.postMessage({
            type: "ready",
        });
        clearTimeout(wait);
    }
});
