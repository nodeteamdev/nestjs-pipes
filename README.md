# Installation

```bash
npm install --save @nodeteam/nestjs-pipes
```

# Usage

```typescript
// import pipes
import { WherePipe, OrderByPipe } from '@nodeteam/nestjs-pipes';
// import types
import { Pipes } from '@nodeteam/nestjs-pipes/index';
```

# OrderByPipe

```typescript
@Query('orderBy', OrderByPipe) orderBy?: Pipes.Order,
```

## Examples:

* Sort the rows by the column `firstName` in ascending order
```
https://example.com/?sortBy=firstName:asc
```


# WherePipe
```typescript
@Query('where', WherePipe) where?: Pipes.Where
```

## Examples:

* Select all the rows where the column `firstName` is equal to `John`
```
https://example.com/?where=firstName:John
```

* Select all the rows where createdAt is greater than 2023-01-13 12:04:27.689
```
https://example.com/?where=createdAt: gt date(2023-01-13 12:04:27.689)
```

* Select all rows where id is not equal to 1
```
https://example.com/?where=id: not int(12)
```

* Select all rows where id is greater than 1 and email contains `@gmail.com`
```
https://example.com/?where=id: gt int(1), email: contains @gmail.com
```

# WherePipe vs OrderByPipe

## Examples:

* Select all the rows where the column `firstName` is equal to `John` and sort the rows by the column `firstName` in ascending order
```
https://example.com/?where=firstName:John&sortBy=firstName:asc
```
