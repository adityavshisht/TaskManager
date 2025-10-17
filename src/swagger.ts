import swaggerJSDoc from "swagger-jsdoc";

export const specs = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "TaskManager API", version: "1.0.0" },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        UserCreate: {
          type: "object",
          required: ["email", "name"],
          properties: {
            email: { type: "string", format: "email" },
            name: { type: "string" }
          }
        },
        Error: {
          type: "object",
          properties: { error: { type: "string" } }
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            description: { type: "string", nullable: true },
            isDone: { type: "boolean" },
            userId: { type: "integer" },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        TaskCreate: {
          type: "object",
          required: ["title", "userId"],
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            userId: { type: "integer" }
          }
        },
        TaskUpdate: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            isDone: { type: "boolean" }
          }
        }
      }
    }
  },
  apis: ["./src/**/*.ts"] // tells swagger-jsdoc to read JSDoc blocks in TS files
});
