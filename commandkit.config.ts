import { defineConfig } from 'commandkit/config';
import { ai } from '@commandkit/ai';

export default defineConfig({
  plugins: [ai()],
});
