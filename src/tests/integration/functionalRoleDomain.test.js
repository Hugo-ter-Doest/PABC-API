const request = require("supertest");
const { app } = require("../../server"); // Ensure this path is correct
const { FunctionalRole, Domain, FunctionalRoleDomain, EntityType, TaskRole } = require("../../models/associations");
require("./setupTestDB");

describe("Functional Role-Domain Associations API", () => {
  let functionalRole, domain;

  describe("POST /api/functionalRoleDomains", () => {
    it("should create an association between a Functional Role and a Domain", async () => {
      functionalRole = await FunctionalRole.create({ name: "Admin" });
      domain = await Domain.create({ name: "Finance" });
      const response = await request(app)
      .post("/api/functionalRoleDomains")
      .send({ functionalRoleId: functionalRole.id, domainId: domain.id });

      console.log("Response Body:", response.body); // ✅ Add this to debug

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.functionalRoleId).toBe(functionalRole.id); // ✅ Fixes undefined error
      expect(response.body.domainId).toBe(domain.id);

      // Verify database entry
      const association = await FunctionalRoleDomain.findOne({
        where: { functionalRoleId: functionalRole.id, domainId: domain.id },
      });

      expect(association).not.toBeNull();
      expect(association.functionalRoleId).toBe(functionalRole.id);
      expect(association.domainId).toBe(domain.id);
    });

    it("should prevent duplicate associations", async () => {
      const response = await request(app)
        .post(`/api/functionalRoleDomains`)
        .send({ functionalRoleId: functionalRole.id, domainId: domain.id });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Functional Role is already assigned to this Domain");
    });

    it("should return an error if Functional Role or Domain does not exist", async () => {
      const nonexistsingUUID = "11111111-2222-3333-4444-555555555555"
      const response = await request(app)
        .post(`/api/functionalRoleDomains`)
        .send({ functionalRoleId: nonexistsingUUID, domainId: nonexistsingUUID });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Functional Role or Domain not found");
    });
  });

  describe("GET /api/functionalRoleDomains", () => {
    it("should retrieve all Functional Role-Domain associations", async () => {
      const response = await request(app).get(`/api/functionalRoleDomains`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("functionalRoleId", functionalRole.id);
      expect(response.body[0]).toHaveProperty("domainId", domain.id);
    });
  })

  describe("POST /api/functionalRoleDomains/allowed-task-roles-entity-types", () => {
    let functionalRole, domain, taskRole, entityType, functionalRoleDomain;

    it('Should create test data', async () => {
      // ✅ Create test data
      functionalRole = await FunctionalRole.create({ name: "Admin1" });
      domain = await Domain.create({ name: "Finance1" });
      entityType = await EntityType.create({ name: "Invoice" });
      taskRole = await TaskRole.create({ name: "Editor" });

      // ✅ Associate Entity Type with Domain
      await domain.addEntityType(entityType);

      // ✅ Create FunctionalRoleDomain association
      functionalRoleDomain = await FunctionalRoleDomain.create({
        functionalRoleId: functionalRole.id,
        domainId: domain.id,
      });

      // ✅ Assign Task Role to FunctionalRoleDomain association
      await functionalRoleDomain.setTaskRoles([taskRole]);
    })

    it("should return allowed Task Roles and Entity Types for given Functional Roles", async () => {
      console.log('functionalRole.id:'+ functionalRole.id)
      const response = await request(app)
        .post("/api/functionalRoleDomains/getAccessRights")
        .send({ functionalRoleIds: [functionalRole.id] });

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0); // ✅ Ensure at least one result

      const result = response.body[0]; // ✅ Get first result
      expect(result).toHaveProperty("taskRoles");
      expect(result).toHaveProperty("entityTypes");
      expect(Array.isArray(result.taskRoles)).toBe(true); // ✅ taskRoles must be an array
      expect(Array.isArray(result.entityTypes)).toBe(true); // ✅ entityTypes must be an array
      expect(result.taskRoles.length).toBeGreaterThan(0);
      expect(result.entityTypes.length).toBeGreaterThan(0);

      // ✅ Validate Task Role structure
      expect(result.taskRoles[0]).toHaveProperty("id", taskRole.id);
      expect(result.taskRoles[0]).toHaveProperty("name", taskRole.name);

      // ✅ Validate Entity Type structure
      expect(result.entityTypes[0]).toHaveProperty("id", entityType.id);
      expect(result.entityTypes[0]).toHaveProperty("name", entityType.name);
    });

    it("should return 400 Bad Request if functionalRoleIds is missing", async () => {
      const response = await request(app)
        .post("/api/functionalRoleDomains/getAccessRights")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("functionalRoleIds must be a non-empty array");
    });

    it("should return 400 Bad Request if functionalRoleIds is not an array", async () => {
      const response = await request(app)
        .post("/api/functionalRoleDomains/getAccessRights")
        .send({ functionalRoleIds: "not-an-array" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("functionalRoleIds must be a non-empty array");
    });

    it("should return an empty array if no associations exist", async () => {
      const newFunctionalRole = await FunctionalRole.create({ name: "Guest" });

      const response = await request(app)
        .post("/api/functionalRoleDomains/getAccessRights")
        .send({ functionalRoleIds: [newFunctionalRole.id] });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]); // ✅ Expect empty array
    });
  });
})