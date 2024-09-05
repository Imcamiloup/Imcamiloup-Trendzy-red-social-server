import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";
import dotenv from "dotenv";
import {userDocs} from "./userDocs";

dotenv.config()
const { SERVER_URL } = process.env;


const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "Docs Blog API",
    version: "1.0.0",
    description: "API description",
  },
  servers: [
    {
      url: SERVER_URL as string,
      description: "Development server",
    },
  ],
  paths: {
    ...userDocs
},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        format: "JWT",
      },
    },
    schemas: {
        User: {
            type: "object",
            required: ["email", "name" , "password"],
            properties: {
                email: {
                    type: "string",
                    format: "email",
                    example: "user@mail.com",
                },
                name: {
                    type: "string",
                    example: "Carlos Galvis",
                },
                password: {
                    type: "string",
                    example: "@@Password123",
                },
            },
        },
    },
            
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./src/routes/*.ts"],
};

export default swaggerJSDoc(swaggerOptions);