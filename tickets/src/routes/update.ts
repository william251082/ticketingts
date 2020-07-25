import express, { Request, Response } from 'express';
import {NotAuthorizedError, NotFoundError, requireAuth} from "@iceshoptickets/common";
import {Ticket} from "../models/ticket";

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
        new NotAuthorizedError();
    }

    res.send(ticket);
});

export { router as updateTicket }