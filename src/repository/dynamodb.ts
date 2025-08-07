import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  DynamoDBDocumentClient,
  QueryCommandInput,
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
        userId,
        name,
      },
    });

    const result = await docClient.send(command);
    return result.Item as Birthday | undefined;
  }

  async getAllBirthdays(userId: string) {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    });

    const result = await docClient.send(command);
    return (result.Items as Birthday[]) || [];
  }

  async getBirthdaysByDate(month: string, day?: string) {
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: 'MonthDayIndex',
      // where clause of query
      // #mt is a placeholder for attribute name
      // :mt is placeholder for value
      KeyConditionExpression: '#mt = :mt',
      ExpressionAttributeNames: {
        '#mt': 'month',
      },
      ExpressionAttributeValues: {
        ':mt': month,
      },
    };

    if (day) {
      params.KeyConditionExpression += ' AND #d = :d';
      params.ExpressionAttributeNames!['#d'] = 'day';
      params.ExpressionAttributeValues![':d'] = day;
    }
    const command = new QueryCommand(params);
    const result = await docClient.send(command);
    return (result.Items as Birthday[]) || [];
  }

  async removeBirthday(userId: string, name: string) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        userId,
        name,
      },
    });

    return docClient.send(command);
  }
}
/* eslint-enable class-methods-use-this */

// eslint-disable-next-line import/prefer-default-export
export const repository = BirthdayRepository.getInstance();
