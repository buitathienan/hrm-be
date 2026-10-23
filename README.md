# HRM System — Human Resource Management API

**A backend-focused HRM system built with NestJS, Prisma, and PostgreSQL to manage employee information, attendance, leave requests, and payroll processing.**

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![API Documentation](https://img.shields.io/badge/API-Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)](https://swagger.io/)

## Overview

HRM System is a backend side project designed to explore how real-world Human Resource Management (HRM) systems handle employee data, attendance tracking, leave management, and payroll calculations.

Rather than focusing only on basic CRUD operations, this project emphasizes **business logic, relational data modeling, access control, and data consistency** across interconnected HR modules.

The project demonstrates practical backend development skills using a modular architecture, a relational database, RESTful APIs, and containerized development infrastructure.

## Key Features

### 1. Employee Management

- Manage employee information through RESTful APIs.
- Organize employee records and their relationships with other HR modules.
- Apply authentication and access-control rules to employee-related resources.

### 2. Attendance Management

- Manage employee attendance records and attendance statuses.
- Support attendance data used by payroll calculations.
- Integrate attendance information with leave records to avoid incorrect payroll deductions for approved leave.

### 3. Leave Management

- Manage employee leave records and leave-related information.
- Distinguish between paid leave and unpaid leave.
- Integrate leave information with attendance and payroll processing.
- Account for valid paid leave when determining payable working days.

### 4. Payroll Management

- Manage payroll periods and payroll processing.
- Support base salary and salary components.
- Associate salary components with employees through salary component assignments.
- Calculate payroll using relevant salary, attendance, and leave information.
- Handle payroll processing with database transactions to maintain data consistency.
- Manage payroll processing failures and restore the appropriate draft state when necessary.

### 5. Authentication & Authorization

- Use JWT-based authentication to identify authenticated users.
- Restrict access to protected endpoints.
- Apply resource-level access checks to prevent employees from accessing other employees' records where applicable.

### 6. API Documentation & Development Environment

- Generate interactive API documentation using Swagger.
- Use Docker to simplify the development environment.
- Use PostgreSQL as the relational database.
- Use Prisma ORM for database access, schema management, and migrations.

## Technical Stack

| Technology        | Purpose                                                |
| ----------------- | ------------------------------------------------------ |
| NestJS            | Backend framework and modular application architecture |
| TypeScript        | Type-safe application development                      |
| Prisma ORM        | Database access and schema management                  |
| PostgreSQL        | Relational database                                    |
| JWT               | Authentication                                         |
| Swagger / OpenAPI | API documentation and endpoint testing                 |
| Docker            | Containerized development environment                  |

## Architecture & Business Logic

One of the main goals of this project is to implement business rules across modules instead of treating each module as an isolated CRUD resource.

### Payroll Integration

Payroll processing considers information from multiple HR modules:

- **Employee:** Employee information and salary-related data.
- **Attendance:** Attendance records relevant to payable working days and deductions.
- **Leave:** Paid and unpaid leave records that affect payroll calculations.
- **Salary components:** Additional salary elements and their assigned calculation rules.
- **Payroll period:** The period for which payroll is calculated and processed.

For example, an approved paid-leave day should not be treated as an unpaid absence simply because the employee has no attendance record for that day. Payroll calculations must account for the applicable leave policy to avoid incorrect deductions.

### Data Consistency

Payroll operations may involve multiple related database changes. Prisma transactions are used where appropriate to ensure that related changes succeed or fail together.

Failure handling is also considered during payroll processing so that unsuccessful operations do not leave payroll records in an inappropriate state.

These workflows provide practical experience with transactional operations, business-rule enforcement, and data integrity in backend applications.

## Project Structure

The application follows a modular NestJS structure, with each business domain responsible for its own functionality.

```text
src/
├── employees/
├── attendance/
├── leave/
├── payroll/
├── app.module.ts
└── main.ts

prisma/
└── schema.prisma

docker-compose.yml
```

_Note: The structure above is illustrative. Adjust the folder names and configuration files to match the actual repository._

## Getting Started

### Prerequisites

- Node.js and npm
- Docker and Docker Compose
- Git

### 1. Clone the repository

```bash
git clone https://github.com/buitathienan/hrm-be
cd hrm-be
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and configure the database connection and any required authentication secrets.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/hrm?schema=public"
JWT_SECRET="replace-with-a-secure-secret"
```

Use the credentials and database name configured in your Docker Compose setup. Do not commit real credentials or secrets to GitHub.

### 4. Start PostgreSQL with Docker

```bash
docker compose up -d
```

Ensure the PostgreSQL service is running and that the database connection string matches its configuration.

### 5. Apply database migrations

```bash
npx prisma migrate deploy
```

For a local development database where migrations need to be created, use the appropriate Prisma development workflow instead.

### 6. Generate the Prisma Client

```bash
npx prisma generate
```

### 8. Seed the database

```bash
npx prisma db seed
```

### 9. Start the application

```bash
npm run start:dev
```

The application should now be available at the port configured in the project.

### 8. Explore the API documentation

Open the Swagger UI route configured in the application, commonly:

```text
http://localhost:3000/api/docs
```

Check the Swagger configuration in `main.ts` if your documentation uses a different route.

## API Testing

The REST API can be explored through Swagger UI or an API client such as Postman.

Recommended testing scenarios include:

- Creating and retrieving employee records.
- Verifying authentication and access restrictions.
- Managing attendance and leave records.
- Checking the interaction between attendance, paid leave, and payroll.
- Processing payroll and verifying the results.
- Verifying database consistency when payroll processing fails.

## What I Learned

Building this project has helped me practice:

- Designing modular backend applications with NestJS.
- Modeling relational databases for interconnected business domains.
- Implementing RESTful APIs with TypeScript and Prisma.
- Applying JWT authentication and resource-level authorization.
- Translating HR policies into explicit backend business rules.
- Managing database transactions and failure scenarios.
- Integrating multiple modules into a consistent payroll workflow.
- Documenting and testing APIs using Swagger.
- Running a PostgreSQL development environment with Docker.

## Future Improvements

Potential areas for further development include:

- Role-based access control for HR administrators, managers, and employees.
- More comprehensive automated unit and integration tests.
- Payroll approval workflows and audit logs.
- Advanced payroll reporting and payslip generation.
- Deployment to a cloud hosting platform.
- A frontend application for employee self-service and HR administration.

These are planned improvements, not necessarily features available in the current version.

## About the Project

**Project type:** Personal side project  
**Focus:** Backend development and business logic  
**Status:** Under active development

I built this project to strengthen my backend engineering skills and gain hands-on experience designing APIs that model real business processes.

I'm open to feedback, suggestions, and opportunities to learn and contribute as a software developer.

---

**Developed by:** [buitathienan](https://github.com/buitathienan)

**GitHub:** [View Repository](https://github.com/buitathienan/hrm-be)
