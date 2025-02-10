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
cd authorization-api
```
### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Configure Environment Variables**
Create a `.env` file in the project root:

```bash
DB_NAME=auth_db
DB_USER=postgres
DB_PASS=secretpassword
DB_HOST=localhost
PORT=5000
```

### **4️⃣ Run PostgreSQL in Docker (Optional)**
If using Docker, create a `docker-compose.yml` and run:
```
docker-compose up -d
```

### **5️⃣ Start the API**
```bash
npm start
```	

# 🔌 **API Usage**

## **📌 Functional Roles**
### **1️⃣ Create a Functional Role**
```http
POST /api/functionalRoles
Content-Type: application/json
```

Request Body:

```json
{
  "name": "Admin"
}
```

Response:
```json
{
  "id": "uuid",
  "name": "Admin",
  "createdAt": "2024-02-05T12:00:00Z"
}
```

### **2️⃣ Get All Functional Roles**
```http
GET /api/functionalRoles
```
Response:
```json
[
  { "id": "uuid1", "name": "Admin" },
  { "id": "uuid2", "name": "Manager" }
]
```

### **3️⃣ Assign Task Roles to a Functional Role**
```http
POST /api/functionalRoles/{functionalRoleId}/taskRoles
Content-Type: application/json
```

Request Body:
```json
{
  "taskRoleIds": ["taskRoleId1", "taskRoleId2"]
}
```

Response:
```json
{
  "functionalRoleId": "uuid",
  "taskRoles": [
    { "id": "taskRoleId1", "name": "Editor" },
    { "id": "taskRoleId2", "name": "Viewer" }
  ]
}
```	

## **📌 Task Roles**

### **1️⃣ Create a Task Role**
```http
POST /api/taskRoles
Content-Type: application/json
```

Request Body:
```json
{
  "name": "Viewer"
}
```

Response:
```json
{
  "id": "uuid",
  "name": "Viewer"
}
```

### **2️⃣ Get Functional Roles Assigned to a Task Role**
```http
GET /api/taskRoles/{taskRoleId}/functionalRoles
```
Response:
```json
{
  "taskRoleId": "uuid",
  "functionalRoles": [
    { "id": "functionalRoleId1", "name": "Admin" },
    { "id": "functionalRoleId2", "name": "Manager" }
  ]
}
```

### **3️⃣ Get All Task Roles**
```http
GET /api/taskRoles
```
Response:
```json
[
  { "id": "uuid1", "name": "Viewer" },
  { "id": "uuid2", "name": "Editor" }
]
```

## **📌 Domains**

### **1️⃣ Create a Domain**
```http
POST /api/domains
Content-Type: application/json
```

Request Body:
```json
{
  "name": "Finance"
}
```

Response:
```json
{
  "id": "uuid",
  "name": "Finance"
}
```

### **2️⃣ Get All Domains**
```http
GET /api/domains
```

Response:
```json
[
  { "id": "uuid1", "name": "Finance" },
  { "id": "uuid2", "name": "HR" }
]
```

### **3️⃣ Assign Entity Types to a Domain**
```http
POST /api/domains/{domainId}/entityTypes
Content-Type: application/json
```

Request Body:
```json
{
  "entityTypeIds": ["entityTypeId1", "entityTypeId2"]
}
```

Response:
```json
{
  "domainId": "uuid",
  "entityTypes": [
    { "id": "entityTypeId1", "name": "Invoice" },
    { "id": "entityTypeId2", "name": "Receipt" }
  ]
}
```

### **3️⃣ Get Entity Types Assigned to a Domain**
```http
GET /api/domains/{domainId}/entityTypes
```

Response:
```json
{
  "domainId": "uuid",
  "entityTypes": [
    { "id": "entityTypeId1", "name": "Invoice" },
    { "id": "entityTypeId2", "name": "Receipt" }
  ]
}
```

## **📌 Entity Types**

### **1️⃣ Create an Entity Type**
```http
POST /api/entityTypes
Content-Type: application/json
```

Request Body:
```json
{
  "name": "Invoice"
}
```

Response:
```json
{
  "id": "uuid",
  "name": "Invoice"
}
```

### **2️⃣ Get All Entity Types**
```http
GET /api/entityTypes
```

Response:
```json
[
  { "id": "uuid1", "name": "Invoice" },
  { "id": "uuid2", "name": "Receipt" }
]
```

### **3️⃣ Get Domains assigned to an Entity Type**
```http
GET /api/entityTypes/{entityTypeId}/domains
```

Response:
```json
{
  "entityTypeId": "uuid",
  "domains": [
    { "id": "domainId1", "name": "Finance" },
    { "id": "domainId2", "name": "HR" }
  ]
}
```

# ✅ Running Tests

To run the tests, navigate to the root directory of the repository and run the following command:

```bash
NODE_ENV=test npm test
```
Tested Features: 
- CRUD operations for Functional Roles, Task Roles, Domains, Entity Types
- Assigning Task Roles to Functional Roles
- Assigning Entity Types to Domains
- Querying relationships between entities

# 📜 License
This project is licensed under the EUPL 1.2 License. Feel free to use and modify it! 🚀
