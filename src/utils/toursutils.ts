import { FindOperator, FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, LessThan, MoreThan } from 'typeorm';
import { Request } from 'express';
import Tours from '../Entites/Tours';
import { DifficultyType, QueryObject, QueryParams } from '../interface/ToursInterface';

const objectHandler = (value: string | object | undefined): FindOperator<number> | undefined | number => {
  if (typeof value === 'object') {
    const values: [string, any] = Object.entries(value)[0];
    return values[0] === 'more' ? MoreThan(+values[1]) : LessThan(+values[1]);
  }
  return Number(value);
};

const createWherObject = (req: Request): FindOptionsWhere<Tours> | FindOptionsWhere<Tours>[] | undefined => {
  const obj: QueryObject | any = {};
  const keys: string[] = Object.keys(req.query);
  keys.forEach((key: string) => {
    if (key === 'duration') {
      obj.duration = objectHandler(req.query.duration) && objectHandler(req.query.duration);
    } else if (key === 'difficulty') {
      const { difficulty }: QueryParams = req.query;
      if (typeof difficulty === 'string') {
        obj.difficulty = difficulty as DifficultyType;
      }
    } else if (key === 'price') {
      obj.price = objectHandler(req.query.price) && objectHandler(req.query.price);
    }
  });
  return obj;
};

const createOrderObj = (req: Request): FindOptionsOrder<Tours> | undefined => {
  const { sort }: string | string[] | any = req.query;

  let obj: { [key: string]: string } = {};

  const sorrteddata: string[] = sort?.split(',');

  sorrteddata?.forEach((el: string) => {
    const splitEl: string[] = el.split('-');
    const property: string = splitEl[1];
    const order: string = splitEl[0] === 'asc' ? 'ASC' : 'DESC';
    obj = { ...obj, [property]: order };
  });
  return obj;
};

const createFieldsObj = (req: Request): FindOptionsSelect<Tours> | undefined => {
  const { fields }: string | any = req.query;
  if (fields) {
    const fieldsArray: string[] = fields.split(',');
    const selectObject: { [key: string]: string | boolean } = { id: true };
    fieldsArray.forEach((field: string) => {
      selectObject[field] = true;
    });
    return selectObject;
  }
  return undefined;
};

export { createFieldsObj, createOrderObj, createWherObject };
