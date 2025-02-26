import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const orm = await MikroORM.init({
    metadataProvider: TsMorphMetadataProvider,
    driver: PostgreSqlDriver,
    dbName:'task-management',
    user:'postgres',

});
console.log(orm.em); 
console.log(orm.schema);