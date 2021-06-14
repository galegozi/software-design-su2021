import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
const PROTO_PATH = __dirname + '/../../protos/helloworld.proto';
// import { ProtoGrpcType } from './protos/helloworld';
// import { GreeterHandlers } from './protos/helloworld/Greeter';
const SERVER_PORT = 50051;

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const hello_proto = grpc.loadPackageDefinition(packageDefinition)
  .helloworld as any;

/**
 * Implements the SayHello RPC method.
 */
const sayHello = (call, callback) => {
  callback(null, {
    message: 'Hello ' + call.request.name + ' for summer software design class',
  });
};

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
const main = () => {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {
    sayHello: sayHello,
  });
  server.bindAsync(
    `0.0.0.0:${SERVER_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
};

main();
