import { Empty, JSONCodec, StringCodec, connect } from "nats";
import { AppError, HttpCode } from "./AppError";
import { v4 as uuidv4 } from "uuid"
import { ValidateNested } from "class-validator";


type RpcErrorType = {
  err: {
    error: string | object,
    status: HttpCode
  }
}

function isRpcError(obj: unknown): obj is RpcErrorType {
  return typeof obj === "object" &&
    obj !== null &&
    obj !== undefined &&
    "err" in obj &&
    (typeof obj.err === "string" || typeof obj.err === "object") &&
    "status" in obj &&
    (typeof obj.status === "number" && Object.values(HttpCode).includes(obj.status))
}

const jc = JSONCodec()

async function connectNats() {
  try {
    //connects to nats url
    const uri = `nats://${process.env.NATS_HOST}:${process.env.NATS_PORT}`
    const nc = await connect({ servers: uri })
    console.log(`nats: connected to ${nc.getServer()}`);

    // returns nats connection
    return nc
  } catch (error) {
    console.log(`error connecting to nats://${process.env.NATS_HOST}:${process.env.NATS_PORT}`);
  }
}

export async function emit(subject: string, data: any) {
  console.log("🚀 ~ emit ~ data:", data)
  console.log("🚀 ~ emit ~ subject:", subject)
  const nc = connectNats();
  (await nc).publish(subject, jc.encode(data))

}
export async function send(subject: string, data: any) {
  console.log("🚀 ~ send ~ data:", data)
  console.log("🚀 ~ send ~ subject:", subject)
  const nc = connectNats();
  const res = await (await nc).request(subject, jc.encode({ data, id: uuidv4() }), { timeout: 1000 })
    .then((m) => {
      const msReturn = jc.decode(m.data)
      console.log(`response: ${msReturn}`)

      if (isRpcError(msReturn)) {
        console.log(`return is RpcError: ${msReturn}`)
      }
      return msReturn
    })
    .catch((err) => {
      // ne catch pas les RpcError du microservice
      const message = err.message ? err.message : err
      console.log(`problem with request: ${message}`)
      throw new AppError(HttpCode.INTERNAL_SERVER_ERROR, message)
    })

  return res;

}
