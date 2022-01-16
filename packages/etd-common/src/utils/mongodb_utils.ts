import { ObjectId } from "bson";

/**
 * Construct a new Object id based on the given [id]
 * If id is given, then use it as the object id.
 * If not, then random generate a new object id
 * @param id
 */
export function newObjectId(id?: string): ObjectId {
  if (id !== undefined) {
    return new ObjectId(id);
  }
  return new ObjectId();
}
