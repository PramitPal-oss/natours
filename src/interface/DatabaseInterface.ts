import { QueryRunner, Repository } from 'typeorm';
import User from '../Entites/User';
import Tours from '../Entites/Tours';
import Images from '../Entites/Image';
import Dates from '../Entites/Date';

export interface RepoInterface {
  USERREPO: Repository<User>;
  TOURREPO: Repository<Tours>;
  QUERYRUNNER: QueryRunner;
  TOURSQUERYREPO: Repository<Tours>;
  IMAGEQUERYREPO: Repository<Images>;
  DATEQUERYREPO: Repository<Dates>;
}
