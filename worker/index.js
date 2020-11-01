import redis from "redis";

import { redisHost, redisPort } from "./keys.js";

const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: (opts) => {
    console.log(opts);
    return 1000;
  },
});

const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});
sub.subscribe("insert");
