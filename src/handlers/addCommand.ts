import { parseAddCommand } from '../helpers/commandParsers';
import BirthdayRepository from '../repository/dynamodb';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../responses/responses';
import { Birthday, SlackCommand } from '../types';

const repository = BirthdayRepository.getInstance();

const handleAddCommand = async (command: SlackCommand) => {
  const parsed = parseAddCommand(command.text);
  // TODO need to validate the dates

  if (!parsed) {
    return createErrorResponse('Invalid format. Use `/add name #MM-DD`');
  }

  const { date, name } = parsed;
  const existing = await repository.getBirthday(command.user_id, name);
  if (existing) {
    return createErrorResponse(`Birthday for ${name} is already registered.`);
  }

  const birthday: Birthday = {
    name,
    user_id: command.user_id,
    date,
  };

  try {
    await repository.addBirthday(birthday);
    return createSuccessResponse(
      `🎉 ${name}'s birthday has been added for ${date}!`
    );
  } catch (error) {
    console.error('Error adding birthday:', error);
    return createErrorResponse('Failed to add birthday. Please try again.');
  }
};

export default handleAddCommand;
