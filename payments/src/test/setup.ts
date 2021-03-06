import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[];
        }
    }
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51HBh0dCWSvCsvAUq9BNEOMpf5v0uetzOO1HdypYluoygxdAxdBte01ClwXiEQL5fPRBVQ35gITWHd5aeQqRO5OrA00Hbgz8yHA';

let mongo: any;
beforeAll(async () => {
    // not an ideal solution yet
    process.env.JWT_KEY = 'gfgsdfgsfd';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    // Build a jsonwebtoken payload. {id, email}
    const payload = {
        id,
        email: 'test@test.com'
    };
    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into json
    const sessionJSON = JSON.stringify(session);

    // Take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string that's the cookie with the encoded data
    // supertest expectation is an array
    // console.log(base64)
    return [`express:sess=${base64}`];
};