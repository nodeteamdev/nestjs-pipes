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

# #OrderByPipe

```typescript
@Query('orderBy', OrderByPipe) orderBy?: Pipes.Order,
```

### Examples:

* Sort the rows by the column `firstName` in ascending order
```
https://example.com/?sortBy=firstName:asc
```


# #WherePipe

## Operators realized:

**in** - `where=zipCode: in array(11111, 22222)`

**lt** - `where=age: lt int(12)`

**lt** - `where=age: lt int(12)`

**lte** - `where=age: lte int(12)`

**gt** - `where=age: gt int(12)`

**gte** - `where=age: gte int(12)`

**equals** - `where=age: equals int(12)`

**not** - `where=age: not int(12)`

**contains** - `where=firstName: contains string(John)` or `where=firstName: contains John`

**startsWith** - `where=firstName: startsWith string(John)` or `where=firstName: startsWith John`

**endsWith** - `where=firstName: endsWith string(John)` or `where=firstName: endsWith John`

**every** - `where=firstName: every string(John)` or `where=firstName: every John`

**some** - `where=firstName: some string(John)` or `where=firstName: some John`

**none** - `where=firstName: none string(John)` or `where=firstName: none John`

## Where types realized:

**string** - `where=firstName: contains string(John)`

**int** - `where=age: gt int(12)`

**float** - `where=age: gt float(12.5)`

**boolean** - `where=active: equals boolean(true)`

**bool** - `where=active: equals boolean(true)`

**date** - `where=createdAt: gt date(2019-01-01)`

**datetime** - `where=createdAt: gt datetime(2019-01-01 12:00:00)`

**array** - `where=zipCode: in array(int(111111), int(222222))`

**nested object** - `where=profile:{ firstName: contains string(Admin) }`

```typescript
@Query('where', WherePipe) where?: Pipes.Where
```

### Examples:

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

### Examples:

* Select all the rows where the column `firstName` is equal to `John` and sort the rows by the column `firstName` in ascending order
```
https://example.com/?where=firstName:John&sortBy=firstName:asc
```

# #SelectPipe

```typescript
@Query('select', SelectPipe) select?: Pipes.Select
```

### Examples:

* Select the columns `firstName` and `lastName`
```
https://example.com/?select=firstName,lastName
```

* Exclude the columns `firstName` and `lastName`

```
https://example.com/?select=-firstName,-lastName
```
