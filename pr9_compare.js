const SIZES = [10000, 100000, 1000000, 10000000, 100000000];
const RUNS = 3;
const K = 6;

function generate(n) {
  const a = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    a[i] = Math.floor(Math.random() * 20001) - 10000;
  }
  return a;
}

function bySorting(arr) {
  const b = arr.slice();
  b.sort();
  return b[b.length - K];
}

function byTopArray(arr) {
  const top = new Array(K).fill(-Infinity);
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    if (v > top[K - 1]) {
      let j = K - 1;
      while (j > 0 && top[j - 1] < v) {
        top[j] = top[j - 1];
        j--;
      }
      top[j] = v;
    }
  }
  return top[K - 1];
}

function byRepeatedMax(arr) {
  const b = arr.slice();
  let result = 0;
  for (let k = 0; k < K; k++) {
    let best = 0;
    for (let i = 1; i < b.length; i++) {
      if (b[i] > b[best]) best = i;
    }
    result = b[best];
    b[best] = -2147483648;
  }
  return result;
}

function measure(fn, arr) {
  const start = Date.now();
  const value = fn(arr);
  const time = Date.now() - start;
  return { time, value };
}

function format(times) {
  const avg = Math.round(times.reduce((s, t) => s + t, 0) / times.length);
  return `${avg} (${times.join(" ")})`;
}

function main() {
  const args = process.argv.slice(2).map(Number).filter(Number.isFinite);
  const sizes = args.length ? args : SIZES;
  const methods = [bySorting, byTopArray, byRepeatedMax];
  const header = ["Розмір", "Спосіб 1 (Сортування)", "Спосіб 2 (Масив)", "Спосіб 3 (Максимуми)"];
  console.log(header.join(" | "));

  for (const n of sizes) {
    const times = methods.map(() => []);
    for (let r = 0; r < RUNS; r++) {
      const data = generate(n);
      const values = methods.map((fn, i) => {
        const res = measure(fn, data);
        times[i].push(res.time);
        return res.value;
      });
      if (new Set(values).size !== 1) {
        throw new Error(`Різні результати для n=${n}: ${values.join(", ")}`);
      }
    }
    console.log([String(n), ...times.map(format)].join(" | "));
  }
}

main();
