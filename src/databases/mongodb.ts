import { connect, connection } from "mongoose";
import { mongodbConfig } from "../config";

function connectMongoDBDatabase(): Promise<Connect> {
  return new Promise((resolve, reject) => {
    connect(mongodbConfig.connection.url)
      .then(() =>
        resolve({
          status: true,
          message: "[+] - MongoDB Connected!",
        }),
      )
      .catch((error) =>
        reject({
          status: false,
          message: error,
        }),
      );
  });
}

export async function connectMongoDB() {
  try {
    const connect = await connectMongoDBDatabase();
    console.info(connect.message);
  } catch (error) {
    console.error(error);
  }
}

export async function disconnectMongoDB() {
  try {
    connection.close();
  } catch (error) {
    console.error(error);
  }
}

interface Connect {
  status: boolean;
  message: string;
}
