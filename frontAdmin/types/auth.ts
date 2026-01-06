export interface LoginCredentials {
	email: string;
	password: string;
}

export interface AdminUser {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	role: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}
