import type { CommandData, MessageCommand } from 'commandkit';
import type { AiCommand, AiConfig } from 'commandkit/ai';
import { PermissionsBitField } from 'discord.js';
import { z } from 'zod';

export const command: CommandData = {
  name: 'poll',
  description: 'Create a poll',
};

const pollMediaObject = z
  .object({
    text: z.string().trim().describe('The question text of the poll'),
    emoji: z
      .string()
      .trim()
      .optional()
      .describe('An optional emoji associated with the poll question. Eg: 👍'),
  })
  .describe(
    'An object representing the media for a poll question, containing the text of the question. Emoji cannot be used in question text.'
  );

export const aiConfig = {
  parameters: z
    .object({
      question: pollMediaObject,
      answers: z
        .array(pollMediaObject)
        .min(1)
        .max(10)
        .describe('An array of answers for the poll'),
      allow_multiselect: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether the poll allows multiple selections'),
      duration: z
        .number()
        .int()
        .min(1)
        .max(32)
        .optional()
        .default(24)
        .describe('The duration of the poll in hours'),
    })
    .describe('An object representing a poll to include in the message'),
} satisfies AiConfig;

export const message: MessageCommand = async (ctx) => {
  await ctx.message.reply('This command can only be used via AI');
};

export const ai: AiCommand<typeof aiConfig> = async (ctx) => {
  if (!ctx.message.inGuild()) {
    return {
      error: 'Poll can only be created in a server',
    };
  }

  const hasPermission = ctx.message.channel
    .permissionsFor(ctx.message.client.user!)
    ?.has(PermissionsBitField.Flags.SendMessages);

  if (!hasPermission) {
    return {
      error: 'Bot does not have the permission to send polls in this channel',
    };
  }

  const { question, answers, allow_multiselect, duration } = ctx.ai.params;

  await ctx.message.channel.send({
    poll: {
      allowMultiselect: !!allow_multiselect,
      answers: answers.map((answer) => ({
        text: answer.text,
        emoji: answer.emoji,
      })),
      duration: duration ?? 24,
      question: { text: question.text },
    },
  });
};
