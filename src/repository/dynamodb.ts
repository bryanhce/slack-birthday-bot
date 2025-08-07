import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  DynamoDBDocumentClient,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';

import {
  BirthdayQueryOptionsByDate,
  Birthday,
  BirthdayArraySchema,
  BirthdaySchema,
} from './types';
import ENV from '../env';
import safeParse from './parser';

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
const TABLE_NAME = ENV.DYNAMODB_TABLE;

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

  async upsert(birthday: Birthday) {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: birthday,
    });

    return docClient.send(command);
  }

  async findByKey(userId: string, name: string): Promise<Birthday | undefined> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        userId,
        name,
      },
    });

    const result = await docClient.send(command);
    return safeParse(result.Item, BirthdaySchema);
  }

  async findAllByUserId(userId: string) {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    });

    const result = await docClient.send(command);
    // typescript can infer type is Birthday[] | undefined, but I put
    // typing to remind myself
    const parsedBirthdays: Birthday[] | undefined = safeParse(
      result.Items,
      BirthdayArraySchema
    );
    return parsedBirthdays ?? [];
  }

  async findByUserAndMonth(userId: string, month: string) {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: '#mt = :mt',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':mt': month,
      },
      ExpressionAttributeNames: {
        '#mt': 'month',
      },
    });

    const result = await docClient.send(command);
    const parsedBirthdays: Birthday[] | undefined = safeParse(
      result.Items,
      BirthdayArraySchema
    );
    return parsedBirthdays ?? [];
  }

  async findByMonthDay(options: BirthdayQueryOptionsByDate) {
    const { month, day } = options;

    const keyConditions: string[] = [];
    const attributeNames: Record<string, string> = {};
    const attributeValues: Record<string, string> = {};

    // month is a required option
    keyConditions.push('#mt = :mt'); // where clause of query
    // #mt is a placeholder for attribute name month as month is reserved keyword
    attributeNames['#mt'] = 'month';
    // :mt is placeholder for value
    attributeValues[':mt'] = month;

    if (day) {
      keyConditions.push('#d = :d');
      attributeNames['#d'] = 'day';
      attributeValues[':d'] = day;
    }

    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: 'MonthDayIndex',
      KeyConditionExpression: keyConditions.join(' AND '),
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: attributeValues,
    };

    const command = new QueryCommand(params);
    const result = await docClient.send(command);
    const parsedBirthdays: Birthday[] | undefined = safeParse(
      result.Items,
      BirthdayArraySchema
    );
    return parsedBirthdays ?? [];
  }

  async delete(userId: string, name: string) {
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

const birthdayRepository = BirthdayRepository.getInstance();
export default birthdayRepository;
