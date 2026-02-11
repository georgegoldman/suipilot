import { SuiGrpcClient } from "@mysten/sui/grpc";

export async function selectObject(
  client: SuiGrpcClient,
  owner: string,
  type: string,
) {
  const res = await client.listOwnedObjects({ owner, type });
  const objectId = res.objects?.[0]?.objectId;

  if (!objectId)
    throw new Error(`No object of type ${type} found for owner ${owner}`);
  console.log;
  return objectId;
}
