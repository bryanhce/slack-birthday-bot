import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

import { Birthday } from "../types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE!;

export class BirthdayRepository {
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
      KeyConditionExpression: "user_id = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    });

    const result = await docClient.send(command);
    return result.Items as Birthday[];
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