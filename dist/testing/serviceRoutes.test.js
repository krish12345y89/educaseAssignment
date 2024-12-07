import express from "express";
import supertest from "supertest";
import SchoolController from "../controllers/schoolController.js"; // SchoolController
const mockDb = {
    query: jest.fn(),
};
const app = express();
app.use(express.json());
// Initialize the SchoolController with the mock database
const schoolController = new SchoolController(mockDb);
// Define test routes
app.post("/api/schools", schoolController.addSchool);
app.get("/api/schools", schoolController.listSchools);
app.get("/api/schools/all", schoolController.getAllSchools);
const request = supertest(app);
describe("SchoolController Tests", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });
    describe("POST /api/schools", () => {
        it("should add a school successfully", async () => {
            mockDb.query.mockImplementation((query, values, callback) => {
                callback(null, { insertId: 1 });
            });
            const response = await request.post("/api/schools").send({
                name: "Test School",
                address: "123 Test Street",
                latitude: 40.7128,
                longitude: -74.0060,
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "School added successfully");
            expect(response.body).toHaveProperty("schoolId", 1);
            expect(mockDb.query).toHaveBeenCalledWith("INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)", ["Test School", "123 Test Street", 40.7128, -74.0060], expect.any(Function));
        });
    });
    describe("GET /api/schools", () => {
        it("should list schools sorted by distance", async () => {
            mockDb.query.mockImplementation((query, callback) => {
                callback(null, [
                    { id: 1, name: "School A", latitude: 40.7127, longitude: -74.0059 },
                    { id: 2, name: "School B", latitude: 40.7126, longitude: -74.0058 },
                ]);
            });
            const response = await request.get("/api/schools").query({
                latitude: 40.7128,
                longitude: -74.0060,
            });
            expect(response.status).toBe(200);
            expect(response.body.schools).toHaveLength(2);
            expect(response.body.schools[0].name).toBe("School A"); // Closest school
            expect(response.body.schools[1].name).toBe("School B");
            // Ensure DB query was called
            expect(mockDb.query).toHaveBeenCalledWith("SELECT * FROM schools", expect.any(Function));
        });
    });
    describe("GET /api/schools/all", () => {
        it("should return all schools", async () => {
            // Mock DB response for schools
            mockDb.query.mockImplementation((query, callback) => {
                callback(null, [
                    { id: 1, name: "School A" },
                    { id: 2, name: "School B" },
                ]);
            });
            const response = await request.get("/api/schools/all");
            expect(response.status).toBe(200);
            expect(response.body.schools).toHaveLength(2);
            expect(response.body.schools[0].name).toBe("School A");
            expect(response.body.schools[1].name).toBe("School B");
            // Ensure DB query was called
            expect(mockDb.query).toHaveBeenCalledWith("SELECT * FROM schools", expect.any(Function));
        });
    });
});
