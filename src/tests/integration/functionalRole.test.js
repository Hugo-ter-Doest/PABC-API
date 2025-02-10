const request = require("supertest");
const { app } = require("../../server"); // Import app

// Import test database setup (ensures DB reset & server starts)
require("./setupTestDB");

describe("Functional Role API", () => {
  let functionalRoleId;
  let domainId1, domainId2;

  // 🟢 Create Functional Role
  it("should create a Functional Role", async () => {
    const res = await request(app).post("/api/functionalRoles").send({ name: "Admin" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe("Admin");
    functionalRoleId = res.body.id; // Store for later use
  });

  // 🔵 Get All Functional Roles
  it("should get all Functional Roles", async () => {
    const res = await request(app).get("/api/functionalRoles");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // 🟡 Get Functional Role by ID
  it("should get a specific Functional Role by ID", async () => {
    const res = await request(app).get(`/api/functionalRoles/${functionalRoleId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toBe(functionalRoleId);
  });

  // 🟠 Update Functional Role
  it("should update a Functional Role", async () => {
    const res = await request(app).put(`/api/functionalRoles/${functionalRoleId}`).send({ name: "SuperAdmin" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("SuperAdmin");
  });

  // 🔴 Delete Functional Role
  it("should delete a Functional Role", async () => {
    const res = await request(app).delete(`/api/functionalRoles/${functionalRoleId}`);
    expect(res.statusCode).toEqual(204); // No content response
  });

  // 🔴 Verify Deleted Functional Role
  it("should return 404 for a deleted Functional Role", async () => {
    const res = await request(app).get(`/api/functionalRoles/${functionalRoleId}`);
    expect(res.statusCode).toEqual(404);
  });

  // 🟢 Create Domains for Relationship Testing
  it("should create two Domains", async () => {
    const res1 = await request(app).post("/api/domains").send({ name: "Finance" });
    expect(res1.statusCode).toEqual(201);
    expect(res1.body.name).toBe("Finance");
    domainId1 = res1.body.id;

    const res2 = await request(app).post("/api/domains").send({ name: "HR" });
    expect(res2.statusCode).toEqual(201);
    expect(res2.body.name).toBe("HR");
    domainId2 = res2.body.id;
  });

  // 🔵 Re-create Functional Role for Relation Tests
  it("should re-create a Functional Role", async () => {
    const res = await request(app).post("/api/functionalRoles").send({ name: "Manager" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe("Manager");
    functionalRoleId = res.body.id; // Store for relation tests
  });

  // 🔗 Assign Domains to Functional Role
  it("should assign Domains to a Functional Role", async () => {
    const res = await request(app)
      .post(`/api/functionalRoles/${functionalRoleId}/domains`)
      .send({ domainIds: [domainId1, domainId2] });

    expect(res.statusCode).toEqual(200);
    expect(res.body.functionalRoleId).toBe(functionalRoleId);
    expect(res.body.domains.length).toBe(2);
  });

  // 🔍 Get Domains Assigned to a Functional Role
  it("should retrieve Domains for a Functional Role", async () => {
    const res = await request(app).get(`/api/functionalRoles/${functionalRoleId}/domains`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.functionalRoleId).toBe(functionalRoleId);
    expect(res.body.domains.length).toBe(2);
  });

  let taskRoleId1, taskRoleId2;

  // 🟢 Create Functional Role
  it("should create a Functional Role", async () => {
      const res = await request(app).post("/api/functionalRoles").send({ name: "Admin" });
      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toBe("Admin");
      functionalRoleId = res.body.id; // Store for later use
  });

  // 🟢 Create Task Roles for Relationship Testing
  it("should create two Task Roles", async () => {
      const res1 = await request(app).post("/api/taskRoles").send({ name: "Viewer" });
      expect(res1.statusCode).toEqual(201);
      expect(res1.body.name).toBe("Viewer");
      taskRoleId1 = res1.body.id;

      const res2 = await request(app).post("/api/taskRoles").send({ name: "Editor" });
      expect(res2.statusCode).toEqual(201);
      expect(res2.body.name).toBe("Editor");
      taskRoleId2 = res2.body.id;
  });

  // 🔗 Assign Task Roles to Functional Role
  it("should assign Task Roles to a Functional Role", async () => {
      const res = await request(app)
      .post(`/api/functionalRoles/${functionalRoleId}/taskRoles`)
      .send({ taskRoleIds: [taskRoleId1, taskRoleId2] });

      expect(res.statusCode).toEqual(200);
      expect(res.body.functionalRoleId).toBe(functionalRoleId);
      expect(res.body.taskRoles.length).toBe(2);
  });

  // 🔍 Get Task Roles Assigned to a Functional Role
  it("should retrieve Task Roles for a Functional Role", async () => {
      const res = await request(app).get(`/api/functionalRoles/${functionalRoleId}/taskRoles`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.functionalRoleId).toBe(functionalRoleId);
      expect(res.body.taskRoles.length).toBe(2);
  });
});
