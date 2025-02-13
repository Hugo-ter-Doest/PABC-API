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
