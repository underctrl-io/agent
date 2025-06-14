import { Client } from 'discord.js';
import './ai.ts';

const client = new Client({
  intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});

export default client;
