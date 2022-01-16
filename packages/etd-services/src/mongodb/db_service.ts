import { Aggregate, Document, Model, Query } from "mongoose";
import { configs, enums, interfaces } from "@etherdata-blockchain/common";
import { BaseService } from "../general_service";

/**
 * Database service for mongoose database schema.
 * It will provide basic functionalities commonly used
 * in api system. For example, get, list, patch, delete, and search
 */
export abstract class BaseMongoDBService<
  T extends Document
> extends BaseService<enums.DBServiceName> {
  protected abstract model: Model<T>;

  /**
   * Get list of objects matched with the given query
   * @param query
   * @param pageNumber
   * @param pageSize
   */
  async filter(
    query: { [key: string]: any },
    pageNumber: number,
    pageSize: number
  ): Promise<interfaces.PaginationResult<T> | undefined> {
    const results = () => this.model.find(query as any);
    return this.doPagination(results as any, pageNumber, pageSize);
  }

  /**
   * Get document by id
   * @param id
   */
  async get(id: string): Promise<T | undefined> {
    const result = await this.performGet(id).exec();
    if (result) {
      return result;
    } else {
      return undefined;
    }
  }

  /**
   * Get list of documents by page number
   * @param pageNumber current page
   * @param pageSize items per page
   */
  async list(
    pageNumber: number,
    pageSize: number
  ): Promise<interfaces.PaginationResult<T> | undefined> {
    return this.doPagination(this.performList.bind(this), pageNumber, pageSize);
  }

  /**
   * Perform actual create operation
   * @param data
   */
  async performCreate(data: T): Promise<T> {
    return await this.model.create(data);
  }

  /**
   * Create an object
   * @param {any} data data
   * @param {boolean} upsert whether perform an upsert operation
   */
  async create(
    data: T,
    { upsert }: { upsert: boolean }
  ): Promise<T | undefined> {
    if (upsert) {
      return this.performPatch(data);
    } else {
      return this.performCreate(data);
    }
  }

  /**
   * Delete data
   * @param{any} id
   */
  async delete(id: any) {
    return this.model.findOneAndRemove({ _id: id }).exec();
  }

  /**
   * Perform patch operation
   * @param data
   */
  async performPatch(data: T): Promise<T> {
    return this.model.findOneAndUpdate(
      { _id: data._id },
      //@ts-ignore
      data,
      { upsert: true }
    );
  }

  /**
   * Update document by document's _id
   * @param{any} data
   */
  async patch(data: T) {
    return await this.performPatch(data);
  }

  /**
   * Return total number of documents
   */
  async count() {
    return this.model.countDocuments();
  }

  /**
   * Perform actual get operation
   * @param id
   * @protected
   */
  protected performGet(id: string): Query<T, T> {
    //@ts-ignore
    return this.model.findOne({ _id: id });
  }

  /**
   * Perform actual get operation
   * @protected
   */
  protected performList(): Query<T[], T[]> {
    //@ts-ignore
    return this.model.find({});
  }

  /**
   * Perform pagination operation
   * @param model
   * @param pageNumber current page number
   * @param pageSize items per page
   * @protected
   */
  protected async doPagination(
    model: () => Query<T[], T[]>,
    pageNumber: number,
    pageSize: number
  ): Promise<interfaces.PaginationResult<T>> {
    if (pageNumber === 0) {
      throw Error("Page number should be greater than 0");
    }
    const skip = Math.max(
      0,
      (pageNumber - 1) * (pageSize ?? configs.Configurations.numberPerPage)
    );
    const limit = pageSize ?? 20;
    const count = await model().countDocuments();
    const numPages = Math.ceil(count / pageSize);
    const results = await model().skip(skip).limit(limit).exec();

    return {
      count: count,
      currentPage: pageNumber,
      results: results,
      totalPage: numPages,
      pageSize: configs.Configurations.numberPerPage,
    };
  }

  /**
   * Perform pagination operation on aggregation results
   * @param aggregation
   * @param model
   * @param pageNumber current page number
   * @param pageSize items per page
   * @protected
   */
  protected async doPaginationForAgg(
    aggregation: () => Aggregate<any>,
    model: () => Query<T[], T[]>,
    pageNumber: number,
    pageSize: number
  ): Promise<interfaces.PaginationResult<T>> {
    if (pageNumber === 0) {
      throw Error("Page number should be greater than 0");
    }

    const skip = Math.max(
      0,
      (pageNumber - 1) * (pageSize ?? configs.Configurations.numberPerPage)
    );
    const limit = pageSize ?? 20;
    const count = await model().countDocuments();
    const numPages = Math.ceil(count / pageSize);
    const results = await aggregation().skip(skip).limit(limit).exec();

    return {
      count: count,
      currentPage: pageNumber,
      results: results,
      totalPage: numPages,
      pageSize: configs.Configurations.numberPerPage,
    };
  }
}
