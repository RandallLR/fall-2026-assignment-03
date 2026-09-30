import { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/auth.js';

// Allows functions from timeLogs.js to be seen and taken info from
import { insertTimeLog, getTotalHoursForTicket } from '../dal/timeLogs.js';
import { createTicket, getTicketById } from '../dal/tickets.js';
import { resolve } from 'path';


const router = Router();

// TODO: Student implementation - Part 1: Ticket Routes
// GET /tickets
	
	router.get('/', async (req, res) => {
		const limit = Number(req.query.limit) || 10;
		const offset = Number(req.query.offset) || 0;
		const status = req.query.status as string | undefined;
	res.status(200).json([]);
	});

// GET /tickets/:id

	router.get('/:id', async (req, res) => {
		const {id} = req.params;

	const ticket = await getTicketById(Number(id));

	if (!ticket) {
		return res.status(404).json({ error: 'TICKET NOT FOUND.'});
	}
	res.status(200).json({});
	});

// POST /tickets
	router.post('/', authMiddleware, async (req: Request, res: Response) => {
	try {
		let creator_id = res.locals.userId;

		if (!creator_id && res.locals.user) {
			creator_id = res.locals.user.id;
		}
		if (!creator_id) {
			creator_id = req.headers['x-user-id'];
		}

		const { title, description } = req.body;

		if (!title || typeof title != 'string') {
			res.status(400).json({error: 'TITLE NEEDED.'});
			return;
		}
		const newTicket = await createTicket({ title, description: description|| '', creator_id: Number(creator_id)});
		res.status(201).json(newTicket);
	} catch (error) {
		console.error('ERROR CREATING TICKET:', error);
		res.status(500).json({ error: 'FAILED TO CREATE TICKET.'});
	}
	});

// PATCH /tickets/:id/status
	router.patch('/:id/status', authMiddleware, async (req, res) => {
		const {id} = req.params;
		const {status} = req.body;
			if (!status) {
				res.status(400).json({ error: 'STATUS REQUIRED.' });
				return;
			}
		res.status(200).json({ id: Number(id), status });
	});

// TODO: Student implementation - Part 2: Time Log Routes
// POST /tickets/:id/time
	router.post('/:id/time', authMiddleware, async (req: Request, res: Response) => {
		const {id} = req.params;

		let userId = res.locals.userId;

		if (!userId && res.locals.user) {
			userId = res.locals.user.id;
		}
		if (!userId) {
			userId = req.headers['x-user-id'];
		}

		const {hours} = req.body;

		console.log('--TIME LOG DEBUG--');
		console.log('Ticket ID URL:', id);
		console.log('User ID:', userId);
		console.log('Hours sent:', hours);
		console.log('----');

		const newestLog = await insertTimeLog(Number(id), Number(userId), Number(hours));

		res.status(201).json(newestLog);
	});
// GET /tickets/:id/time
	router.get('/:id/time', async (req: Request, res: Response) => {
		const {id} = req.params;

		const totalHours = await getTotalHoursForTicket(Number(id));

		res.status(200).json({
			ticket_id: Number(id), total_hours: totalHours});
	});

export default router;
