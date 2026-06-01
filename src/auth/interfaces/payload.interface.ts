export interface Payload {
  sub: string;
  email: string;
  role: string;
  employeeId: string | undefined;
  permissions: string[];
}
