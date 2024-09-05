export const userDocs = {
	"/api/user": {
		get: {
			tags: ["User"],
			summary: "Get user data",
			responses: {
				'200': {
					description: "User data retrieved successfully"
				},
				'400': {
					description: "Bad request, invalid parameters"
				},
				'401': {
					description: "Unauthorized, invalid or missing token"
				}
			},
			security: [
				{
					bearerAuth: []
				}
			]
		}
	},
	"/api/user/register": {
		post: {
			tags: ["User"],
			summary: "Register a new user",
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: { 
									type: "string",
									format: "email",
									example: "user@example.com",
									description: "Email of the user"
								},
								password: { 
									type: "string",
									minLength: 6,
									example: "password123",
									description: "Password of the user"
								},
								name: { 
									type: "string",
									example: "John Doe",
									description: "Name of the user"
								},
								role: { 
									type: "string",
									example: "user",
									description: "Role of the user"
								},
								isActive: { 
									type: "boolean",
									example: true,
									description: "Whether the user is active"
								}
							},
							required: ["email", "password", "name", "role", "isActive"]
						}
					}
				}
			},
			responses: {
				'201': {
					description: "User registered successfully"
				},
				'400': {
					description: "Bad request, invalid parameters"
				}
			}
		}
	}
};