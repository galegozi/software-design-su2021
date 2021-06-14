import { HelloRequest, HelloReply } from '../protos/helloworld_pb'
import { GreeterClient } from '../protos/HelloworldServiceClientPb'
import { useState } from 'react'
const client = new GreeterClient('http://localhost:8080')

const request = new HelloRequest()
request.setName('World')

const TestConnect: React.FC = () => {
  client.sayHello(request, {}, (err, response) => {
    const message = response.getMessage()
    console.log(message)
    setResponse(message)
  })

  const [response, setResponse] = useState('')
  return <div>gRPC Server Response: {response}</div>
}

export default TestConnect
