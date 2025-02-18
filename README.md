# 📌 **Authorization API**  
### **Role-Based Access Control (RBAC) API for Managing Functional Roles, Task Roles, Domains, and Entity Types**  

This API provides a **structured authorization model** where:  
- **Functional Roles** are assigned **Task Roles**.  
- **Functional Roles** have access to **Domains**.  
- **Domains** consist of **Entity Types**.  
- **If a Functional Role has access to a Domain, its Task Roles inherit access to that Domain's Entity Types.**  

---

## ⚡ **Features**
✔ **Manage Functional Roles** (`Create`, `Read`, `Update`, `Delete`)  
✔ **Manage Task Roles** (`Create`, `Read`, `Update`, `Delete`)  
✔ **Assign Task Roles to Functional Roles**  
✔ **Manage Domains & Entity Types** (`Create`, `Read`, `Update`, `Delete`)  
✔ **Assign Entity Types to Domains**  
✔ **Query relationships between roles, domains, and entity types**  

---

# 🚀 **Installation Guide**
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/yourusername/authorization-api.git
cd pabc-api
```
### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Configure Environment Variables**
There are three `.env` files in the root of the project, for testing, development and production. Variables are as follows:

```bash
DB_NAME=auth_db
DB_USER=postgres
DB_PASS=secretpassword
DB_HOST=localhost
PORT=5000
```

`PORT` is the port of the API server.

### **4️⃣ Run PostgreSQL in Docker (Optional)**
To start up Postgres and pgAdmin you can use Docker Compose:
```
docker-compose up -d
```

### **5️⃣ Start the API**
```bash
npm start:dev
```
or
```bash
npm start:prod
```

# 🔌 **API Usage**

Overview of available operations:

## 📌 API Endpoints Overview
## 📌 API Endpoints Overview

| **Resource**                      | **Create (C)**                          | **Read (R)**                              | **Update (U)**                          | **Delete (D)**                          | **Additional Calls** |
|------------------------------------|-----------------------------------------|-------------------------------------------|-----------------------------------------|-----------------------------------------|----------------------|
| **Functional Roles**               | `POST /api/functionalRoles`             | `GET /api/functionalRoles/:id`            | `PUT /api/functionalRoles/:id`          | `DELETE /api/functionalRoles/:id`       | `GET /api/functionalRoles` (List) |
| **Domains**                        | `POST /api/domains`                     | `GET /api/domains/:id`                    | `PUT /api/domains/:id`                  | `DELETE /api/domains/:id`               | `GET /api/domains` (List) |
| **Entity Types**                    | `POST /api/entityTypes`                 | `GET /api/entityTypes/:id`                | `PUT /api/entityTypes/:id`              | `DELETE /api/entityTypes/:id`           | `GET /api/entityTypes` (List) |
| **Application Roles (Task Roles)**  | `POST /api/applicationRoles`            | `GET /api/applicationRoles/:id`           | `PUT /api/applicationRoles/:id`         | `DELETE /api/applicationRoles/:id`      | `GET /api/applicationRoles` (List) |
| **Data Roles**                      | `POST /api/dataRoles`                   | `GET /api/dataRoles/:id`                  | `PUT /api/dataRoles/:id`                | `DELETE /api/dataRoles/:id`             | `GET /api/dataRoles` (List) |
| **Functional Role-Domain Associations** | `POST /api/functionalRoleDomains`       | `GET /api/functionalRoleDomains`          | ❌ Not updatable                        | `DELETE /api/functionalRoleDomains/:id` | `GET /api/functionalRoleDomains` (List) |
| **Assign Application Roles**        | ❌ N/A                                   | ❌ N/A                                     | ❌ N/A                                   | ❌ N/A                                   | `POST /api/functionalRoleDomains/assign-role` |
| **Get Access Rights**               | ❌ N/A                                   | `POST /api/access/getAccessRights`        | ❌ N/A                                   | ❌ N/A                                   | Returns Application & Data Roles for `(FunctionalRole, Domain)` pairs |
| **Domain-EntityType Relationship**  | `POST /api/domains/:id/entityTypes`     | `GET /api/domains/:id/entityTypes`       | ❌ Not updatable                        | ❌ N/A                                   | Assigns multiple Entity Types to a Domain |
| **Get Application Roles for (FunctionalRole, Domain)** | ❌ N/A | `GET /api/functionalRoleDomains/:id/applicationRoles` | ❌ N/A | ❌ N/A | Retrieves all Application Roles for a specific Functional Role-Domain association |


# ✅ Running Tests
To run the tests, navigate to the root directory of the repository and run the following command:

```bash
npm run test
```
Tested Features: 
- CRUD operations for Functional Roles, Task Roles, Domains, Entity Types
- Assigning Task Roles to Functional Roles
- Assigning Entity Types to Domains
- Querying relationships between entities

# ✅ Developing
For development you can run the development server:

```bash
npm run start:dev
```

It starts the server with `nodemon` which restarts the server with every change.

# ✅ Production
For production the server is started as follows:

```bash
npm run start:prod
```

Alternatively, there is a Dockerfile included to create a Docker image.

# 📜 License
This project is licensed under the EUPL 1.2 License. Feel free to use and modify it! 🚀
