export interface Payload {
  sub: number;
  email: string;
  role: string;
  employeeId: number | undefined;
  permissions: string[];
}
