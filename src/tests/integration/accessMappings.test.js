const request = require("supertest");
const { app } = require("../../server") // Ensure this path is correct
const { sequelize, FunctionalRole, Domain, EntityType, ApplicationRole, FunctionalRoleDomain } = require("../../models/associations");
require("./setupTestDB")


describe("Access Mappings API", () => {
  let functionalRole, domain, entityType, applicationRole, frd;

  beforeAll(async () => {

    functionalRole = await FunctionalRole.create({ name: "Editor" });
    domain = await Domain.create({ name: "Finance" });
    entityType = await EntityType.create({ name: "Invoice" });
    applicationRole = await ApplicationRole.create({ name: "Approve", application: "ERP" });

    await domain.addEntityType(entityType);

    frd = await FunctionalRoleDomain.create({
      functionalRoleId: functionalRole.id,
      domainId: domain.id,
    });

    await frd.addApplicationRole(applicationRole);
  });

  describe("POST /api/getEntityTypesPerApplicationRole", () => {
    it("should return entity types mapped per application role", async () => {
      const response = await request(app)
        .post("/api/functionalRoleDomains/getEntityTypesPerApplicationRole")
        .send({ functionalRoleIds: [functionalRole.id] });

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);

      const appRole = response.body.find((ar) => ar.id === applicationRole.id);
      expect(appRole).toBeDefined();
      expect(appRole.entityTypes).toEqual(
        expect.arrayContaining([{ id: entityType.id, name: entityType.name }])
      );
    });

    it("should return 400 if no functionalRoleIds are provided", async () => {
      const response = await request(app)
        .post("/api/functionalRoleDomains/getEntityTypesPerApplicationRole")
        .send({});
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/getApplicationRolesPerEntityType", () => {
    it("should return application roles mapped per entity type", async () => {
      const response = await request(app)
        .post("/api/functionalRoleDomains/getApplicationRolesPerEntityType")
        .send({ functionalRoleIds: [functionalRole.id] });

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);

      const et = response.body.find((et) => et.id === entityType.id);
      expect(et).toBeDefined();
      expect(et.applicationRoles).toEqual(
        expect.arrayContaining([{ id: applicationRole.id, name: applicationRole.name }])
      );
    });

    it("should return 400 if no functionalRoleIds are provided", async () => {
      const response = await request(app)
        .post("/api/functionalRoleDomains/getApplicationRolesPerEntityType")
        .send({});
      expect(response.status).toBe(400);
    });
  });
});
