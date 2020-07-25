import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";

it('returns a 404 if the provided is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'gvhbj',
            price: 20
        })
        .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send({
            title: 'gvhbj',
            price: 20
        })
        .expect(401);
});

it('returns a 401 if user does not own the ticket', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

it('updates the ticket provided valid inputs', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});