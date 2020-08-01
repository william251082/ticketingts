import {Listener, OrderCreatedEvent, Subjects} from "@iceshoptickets/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from 'node-nats-streaming';
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";
import {natsWrapper} from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        // If no ticket. throw error
        if ( !ticket) {
            throw new Error('Ticket not found');
        }

        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: data.id });

        // save the ticket
        await ticket.save();
        new TicketUpdatedPublisher(natsWrapper.client);

        // ack the message
        msg.ack();
    }
}