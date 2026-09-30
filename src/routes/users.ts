import { Router, Request, Response } from 'express';
import { createUser } from '../dal/users.js';
const router = Router();

// TODO: Student implementation - Part 1: User Routes
// Added in error 500 for any unhandled database crashes.
// GET /users
	
	router.get('/', async (req: Request, res: Response) => {
		try {

			const userList: [] = [];
			
			res.status(200).json(userList);
			} catch (error) {
				res.status(500).json  ({ error: 'INTERNAL SERVER ERROR...' });
		}
	});

// GET /users/:id
	
	router.get('/:id', async (req: Request, res: Response) => {
		try {
			const {id} = req.params;
			const user = null;
			if (!user) {
				res.status(404).json({ error: 'USER NOT FOUND.' });
				return;
			}
			res.status(200).json(user);
			} catch (error) {
				res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
				}
			});
// POST /users

	router.post('/', async (req: Request, res: Response) => {
		try {
			const {name, email} = req.body;
			if (!name || !email) {
				res.status(400).json ({ error: 'NAME AND EMAIL ARE REQUIRED' });
				return;
			}
			const newUser = await createUser({name, email});
			res.status(201).json(newUser);
			} catch (error) {
				res.status(500).json ({ error: 'INTERNAL SERVER ERROR' });
			}
		});
export default router;
