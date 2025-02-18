const request = require("supertest")
const { app } = require("../../server") // Import app

// Import test database setup (ensures DB reset & server starts)
require("./setupTestDB")

describe("Functional Role API", () => {
  let functionalRoleId

  // 🟢 Create Functional Role
  it("should create a Functional Role", async () => {
    const res = await request(app).post("/api/functionalRoles").send({ name: "Admin" })
    expect(res.statusCode).toEqual(201)
    expect(res.body.name).toBe("Admin")
    functionalRoleId = res.body.id // Store for later use
  })

  // 🔵 Get All Functional Roles
  it("should get all Functional Roles", async () => {
    const res = await request(app).get("/api/functionalRoles")
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toBeGreaterThan(0)
  })

  // 🟡 Get Functional Role by ID
  it("should get a specific Functional Role by ID", async () => {
    const res = await request(app).get(`/api/functionalRoles/${functionalRoleId}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.id).toBe(functionalRoleId)
  })

  // 🟠 Update Functional Role
  it("should update a Functional Role", async () => {
    const res = await request(app).put(`/api/functionalRoles/${functionalRoleId}`).send({ name: "SuperAdmin" })
    expect(res.statusCode).toEqual(200)
    expect(res.body.name).toBe("SuperAdmin")
  })

  // 🔴 Delete Functional Role
  it("should delete a Functional Role", async () => {
    const res = await request(app).delete(`/api/functionalRoles/${functionalRoleId}`)
    expect(res.statusCode).toEqual(204) // No content response
  })

  // 🔴 Verify Deleted Functional Role
  it("should return 404 for a deleted Functional Role", async () => {
    const res = await request(app).get(`/api/functionalRoles/${functionalRoleId}`)
    expect(res.statusCode).toEqual(404)
  })
})