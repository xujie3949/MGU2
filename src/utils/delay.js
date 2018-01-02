export default function delay(value) {
    const promise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            resolve();
        }, value);
    });
    return promise;
}
