import { z } from 'zod';

export const userSchema = z.object({
	name: z.string().trim().min(1, 'Please complete all fields before submitting'),
	email: z
		.string()
		.trim()
		.min(1, 'Please complete all fields before submitting')
		.email('Invalid email format'),
	password: z
		.string()
		.trim()
		.nonempty('Please complete all fields before submitting')
		.min(8, 'Password must be at least 8 characters long.'),
	terms: z.literal('on', 'You must agree to the terms and conditions.')
});

export const userLoginSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Please complete all fields before submitting')
		.email('Invalid email format'),
	password: z.string().trim().nonempty('Please complete all fields before submitting')
});
