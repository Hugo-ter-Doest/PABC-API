const request = require("supertest");
const { app } = require("../../server"); // Import app, not starting a new server

// Import test database setup (ensures DB reset & server starts)
require("./setupTestDB");

describe("Task Role API", () => {
  let taskRoleId;

  it("should create a Task Role", async () => {
    const res = await request(app).post("/api/taskRoles").send({ name: "Viewer" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe("Viewer");
    taskRoleId = res.body.id; // Store for later tests
  });

  // 🔗 Create Functional Roles for Relationship Testing
  it("should create two Functional Roles", async () => {
    const res1 = await request(app).post("/api/functionalRoles").send({ name: "Manager" });
    expect(res1.statusCode).toEqual(201);
    functionalRoleId1 = res1.body.id;

    const res2 = await request(app).post("/api/functionalRoles").send({ name: "Editor" });
    expect(res2.statusCode).toEqual(201);
    functionalRoleId2 = res2.body.id;
  });

  // 🔗 Assign Task Role to Functional Roles
  it("should assign a Task Role to multiple Functional Roles", async () => {
    const res = await request(app)
      .post(`/api/functionalRoles/${functionalRoleId1}/taskRoles`)
      .send({ taskRoleIds: [taskRoleId] });

    expect(res.statusCode).toEqual(200);
    expect(res.body.functionalRoleId).toBe(functionalRoleId1);
  });

  it("should assign the same Task Role to another Functional Role", async () => {
    const res = await request(app)
      .post(`/api/functionalRoles/${functionalRoleId2}/taskRoles`)
      .send({ taskRoleIds: [taskRoleId] });

    expect(res.statusCode).toEqual(200);
    expect(res.body.functionalRoleId).toBe(functionalRoleId2);
  });

  // 🔍 Get Functional Roles Assigned to a Task Role
  it("should retrieve Functional Roles for a given Task Role", async () => {
    const res = await request(app).get(`/api/taskRoles/${taskRoleId}/functionalRoles`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.taskRoleId).toBe(taskRoleId);
    expect(res.body.functionalRoles.length).toBe(2);
  });

  it("should get all Task Roles", async () => {
    const res = await request(app).get("/api/taskRoles");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get a specific Task Role by ID", async () => {
    const res = await request(app).get(`/api/taskRoles/${taskRoleId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toBe(taskRoleId);
  });

  it("should update a Task Role", async () => {
    const res = await request(app).put(`/api/taskRoles/${taskRoleId}`).send({ name: "Editor" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("Editor");
  });

  it("should delete a Task Role", async () => {
    const res = await request(app).delete(`/api/taskRoles/${taskRoleId}`);
    expect(res.statusCode).toEqual(204); // No content response
  });

  it("should return 404 for a deleted Task Role", async () => {
    const res = await request(app).get(`/api/taskRoles/${taskRoleId}`);
    expect(res.statusCode).toEqual(404);
  });
});
