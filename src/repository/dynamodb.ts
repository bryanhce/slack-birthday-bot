import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

import { Birthday } from '../types';

const client = new DynamoDBClient({});
const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false,
};
const unmarshallOptions = {
  wrapNumbers: false,
};
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions,
  unmarshallOptions,
});
// const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE!;

/* eslint-disable class-methods-use-this */
class BirthdayRepository {
  private static instance: BirthdayRepository;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!BirthdayRepository.instance) {
      BirthdayRepository.instance = new BirthdayRepository();
    }
    return BirthdayRepository.instance;
  }

  async addBirthday(birthday: Birthday) {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: birthday,
    });

    return docClient.send(command);
  }

  async getBirthday(userId: string, name: string) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        user_id: userId,
        name,
      },
    });

    const result = await docClient.send(command);
    return result.Item as Birthday | undefined;
  }

  async getAllBirthdays(userId: string) {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'user_id = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    });

    const result = await docClient.send(command);
    return (result.Items as Birthday[]) || [];
  }

  async getBirthdaysByDate(date: string) {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'DateIndex',
      // where clause of query, #dt is a placeholder for attribute name, can't directly
      // use date here as date is a reserved keyword.
      // :dt is placeholder for value
      KeyConditionExpression: '#dt = :dt',
      ExpressionAttributeNames: {
        '#dt': 'date',
      },
      ExpressionAttributeValues: {
        ':dt': date,
      },
    });

    const result = await docClient.send(command);
    return (result.Items as Birthday[]) || [];
  }

  async removeBirthday(userId: string, name: string) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        user_id: userId,
        name,
      },
    });

    return docClient.send(command);
  }
}
/* eslint-enable class-methods-use-this */

// eslint-disable-next-line import/prefer-default-export
export const repository = BirthdayRepository.getInstance();
