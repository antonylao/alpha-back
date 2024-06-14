import { Empty, JSONCodec, StringCodec, connect } from "nats";
import { AppError, HttpCode } from "./AppError";
import { v4 as uuidv4 } from "uuid"
import { ValidateNested } from "class-validator";


export type ErrorFromMs = {
  type: "ErrorFromMs"
  status: HttpCode;
  // use new Date().toISOString(),
  timestamp: string;
  message: string;
}

function isErrorFromMs(obj: unknown): obj is ErrorFromMs {
  return typeof obj === "object" && "type" in obj && obj.type === "ErrorFromMs"
}
// function isError(obj: unknown): obj is RpcErrorType {
//   return typeof obj === "object" &&
//     obj !== null &&
//     obj !== undefined &&
//     "err" in obj
// &&
// (typeof obj.err === "string" || typeof obj.err === "object") &&
// "status" in obj &&
// (typeof obj.status === "number" && Object.values(HttpCode).includes(obj.status))
// }

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
      console.log(`response: ${JSON.stringify(msReturn)}`)
      if (typeof msReturn !== "object") {
        console.log("something is wrong... correct your ms please")
        throw new AppError(HttpCode.INTERNAL_SERVER_ERROR, "wrong return in ms")
      }

      if (!("response" in msReturn)) {
        console.log("case not handled")
        throw new AppError(HttpCode.INTERNAL_SERVER_ERROR, "please implement case no response in nats.ts")
      }

      // custom error handling
      if ("response" in msReturn) {
        if (!isErrorFromMs(msReturn.response)) {
          console.log("something is wrong in the return of the error.. correct please")
          throw new AppError(HttpCode.INTERNAL_SERVER_ERROR, "wrong error return in ms or wrong identification in gateway")
        }
        throw new AppError(msReturn.response.status, msReturn.response.message)
        // const HttpStatusValues = Object.values(HttpCode).filter((entry) => Number(entry) === entry);

        // if (Object.keys(msReturn.err).includes("status") && HttpStatusValues.includes(msReturn.err.status)) {
        //   console.log("🚀 ~ .then ~ Object.values(HttpCode).filter((entry) => Number(entry) === entry):", Object.values(HttpCode).filter((entry) => Number(entry) === entry))

        // }
        // console.log("msReturn status", (msReturn).err.status)
      }
      return msReturn
    })
    .catch((err) => {
      console.log("error sometimes is catched here for unknown reasons ")
      const message = err.message ? err.message : err
      const status = err.httpCode ? err.httpCode : HttpCode.INTERNAL_SERVER_ERROR
      // throw new AppError(HttpCode.INTERNAL_SERVER_ERROR, message)
      // res.status(status).send(message)
      throw err
    })

  return res;

}

