import * as crypt from 'bcrypt';

export function hashData(data: string): Promise<string> {
  return crypt.hash(data, 10);
}
