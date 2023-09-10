# ngulf
Based on the Fastify webframework. Integrate typeorm, ioredis, and class-validator

## Controller

``` js
// src/controller/DemoController.ts
import {Controller} from "ngulf";

@Controller("/demo")
export default class DemoController {

  @Get("/hello")
  async hello() {
    return "hello ngulf";
  }
}
```
## Listen
``` js
// src/app.ts
import Ngulf from "ngulf";
import * as path from "path"

const app = Ngulf.create({
  routePrefix: "/api",
  controllers: path.join(__dirname, "controller"),
});
app.listen({ port: 3737 }).then(() => {
  console.log("Ngulf listen on 3737");
});
```
 
``` Request http://localhost:3737/api/demo/hello ```

## Params
``` js
// src/controller/DemoController.ts
import {Controller} from "ngulf";

@Controller("/demo")
export default class DemoController {

  @Get("/hello")
  async hello() {
    return "hello ngulf";
  }

  @Get("/query")
  async query(@Query("name") name: string) {
    return `hello ${name}`;
  }

  @Post("/body")
  async body(@Body() data:any) {
    console.log(data)
    return data
  }

  @Post("/header")
  async header(@Headers("user-agent") userAgent?:string) {
    return userAgent
  }
}
```

## Zod
```js
import { z } from "zod";

export const ZodUser = z.object({
  username: z.string(),
  password: z
    .string({ required_error: "password is Required" })
    .nonempty("password is empty"),
  email: z.string().email().nullish(),
});

export type AddZodUser = z.infer<typeof ZodUser>;

```
Controller
```js
@Post("/api")
  async testZod(@Body(ZodUser) data: AddZodUser) {
    console.log(data);
    return data;
  }
```

## Validator

``` js
// src/dto/UserDto.ts
import { IsNotEmpty } from "ngulf/class-validator";

export default class UserDto {
  id?:string

  @IsNotEmpty({ groups: ["login", "add"] })
  name!: string;

  @IsNotEmpty({ groups: ["login"] })
  password!: string;
}

```
Controller
``` js
// src/controller/DemoController.ts
import {Controller} from "ngulf";

@Controller("/demo")
export default class DemoController {

  @Post("/login")
  async login(@Body(new Validation({ groups: ["login"] })) dto: UserDto){
    if(dto.name === "admin" && dto.password === "123456"){
      return true;
    }
    return false
  }

  @Post("/add")
  async add(@Body(new Validation({ groups: ["add"] })) dto: UserDto){
    // add user...
    return true
  }
}
```

## ORM
Add configuration
``` js
// src/app.ts
import Ngulf from "ngulf";
import * as path from "path"

const app = Ngulf.create({
  routePrefix: "/api",
  controllers: path.join(__dirname, "controller"),
  orm: {
      type: "mysql",
      port: 3306,
      host: "localhost",
      username: "root",
      password: "",
      database: "test",
      entityPrefix: "ng_",
      entities: [path.join(__dirname, "entity/*{.ts,.js}")],
      // The production environment must be false, otherwise data may be lost
      synchronize: true, 
    },
});
app.listen({ port: 3737 }).then(() => {
  console.log("Ngulf listen on 3737");
});
```
Create entity
``` js
// src/entity/UserEntity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from "ngulf/typeorm";

@Entity({ name: "user" })
export default class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;
}
```
Create servcie
``` js
// src/service/UserService.ts
import { Injectable, OrmModel, OrmModelType } from "ngulf";
import UserEntity from "../entity/UserEntity";

@Injectable()
export default class UserService {
  @OrmModel(UserEntity)
  private model!: OrmModelType<UserEntity>;

  async login(name: string, password:string) {
    return await this.model.findOneBy({ name, password });
  }

  async add(name: string, password?:string) {
    const data = this.model.create();
    data.name = name;
    data.password = password || "123456";
    return await this.model.save(data);
  }
}
```
Use servcie

```js
// src/controller/DemoController.ts
import {Controller} from "ngulf";

@Controller("/demo")
export default class DemoController {

  constructor(private readonly service: UserService){}

  @Post("/login")
  async login(@Body(new Validation({ groups: ["login"] })) dto: UserDto){
    const rel = await this.service.login(dto.name, dto.password!)
    return rel ? "Login success" : "Login fail"
  }

  @Post("/add")
  async add(@Body(new Validation({ groups: ["add"] })) dto: UserDto){
    return this.service.add(dto.name, dto.password)
  }
}
```

## Demo

[https://github.com/drinkjs/ngulf-demo](https://github.com/drinkjs/ngulf-demo)