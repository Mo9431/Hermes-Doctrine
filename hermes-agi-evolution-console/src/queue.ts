import { Queue, ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

export const connection: ConnectionOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

export const llmQueue = new Queue('llm-tasks', { connection });

console.log(`BullMQ initialized with Redis at ${REDIS_HOST}:${REDIS_PORT}`);
