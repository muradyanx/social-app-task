import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { UserInterface } from '@common/interface/user.interface';

@Injectable()
export class UserRepository {
  constructor(
    // @Inject('PG_CLIENT') private readonly pgClient: Pool
    private readonly pgClient: Pool
  ) {}

  async createUser(
    user: UserInterface,
    password: string,
    roleId: number,
    securityStamp: string,
  ) {
    const { firstName, lastName, email, age } = user;
    return await this.pgClient.query(
      `
  INSERT INTO users (first_name, last_name, email, age, password, role_id, security_stamp)
  VALUES  ($1, $2, $3, $4, $5, $6, $7)
    `,
      [firstName, lastName, email, age, password, roleId, securityStamp],
    );
  }

  async findUserById(id: number) {
    const user = await this.pgClient.query(
      'SELECT id, first_name, last_name, age, email, role_id  FROM users WHERE id = $1',
      [id],
    );
    return user.rows[0];
  }

  async findUserByEmail(email: string) {
    const user = await this.pgClient.query(
      'SELECT *  FROM users WHERE email = $1',
      [email],
    );
    return user.rows[0];
  }

  async getUsers(
    limit: number = 10,
    page: number = 1,
    firstName?: string,
    lastName?: string,
    age?: number,
  ) {
    const safePageValue = page > 0 ? page : 1;
    const offset = (safePageValue - 1) * limit;
    const conditions: string[] = [];
    const values: (string | number)[] = [];
    if (firstName) {
      values.push(`%${firstName}%`);
      conditions.push(`first_name ILIKE $${values.length}`);
    }
    if (lastName) {
      values.push(`%${lastName}%`);
      conditions.push(`last_name ILIKE $${values.length}`);
    }
    if (age !== undefined) {
      values.push(age);
      conditions.push(`age = $${values.length}`);
    }
    const whereCondition = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';
    const totalUsers = await this.pgClient.query(
      `SELECT count(*) FROM users ${whereCondition}`,
      values,
    );
    const totalCount = totalUsers.rows[0].count;
    values.push(limit);
    values.push(offset);
    const query = `SELECT first_name, last_name, age, email, role_id FROM users ${whereCondition} LIMIT $${values.length - 1} OFFSET $${values.length}`;
    const users = await this.pgClient.query(query, values);
    return {
      users: users.rows,
      page: page,
      limit: limit,
      total: totalCount,
    };
  }
}