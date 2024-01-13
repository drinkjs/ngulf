import awsLambdaFastify from "@fastify/aws-lambda";
import app from "./";
const proxy = awsLambdaFastify(app);
exports.handler = proxy;