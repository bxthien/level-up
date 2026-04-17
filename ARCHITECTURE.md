# Architecture

## Muc tieu

Project nay duoc to chuc theo huong `feature-first modular clean architecture`.

Muc tieu cua cach to chuc nay:

- `app/` chi giu vai tro route entrypoint cua Next.js
- logic nghiep vu khong nam trong `page.tsx` hoac `actions.ts`
- database access duoc tach khoi application flow
- moi feature co ranh gioi ro rang, de mo rong va de doc

## Nguyen tac

### 1. `app/` la route layer

Thu muc `src/app` chi chua:

- `page.tsx`
- `layout.tsx`
- `actions.ts`
- metadata files cua Next.js

Muc dich:

- expose route
- nhan request tu form/server action
- goi use case cua feature
- `revalidatePath` sau khi mutation

`app/` khong nen chua:

- truy van Prisma truc tiep
- tinh toan nghiep vu phuc tap
- helper domain

### 2. `features/` la noi chua logic theo tung nghiep vu

Moi feature duoc tach rieng:

- `today`
- `habits`
- `templates`
- `journal`
- `dashboard`

Moi feature co 4 lop:

#### `domain/`

Chua:

- type nghiep vu
- helper thuần
- rule tinh toan

Khong phu thuoc vao:

- Next.js
- Prisma
- UI

#### `application/`

Chua:

- use case
- query builder cho page
- command xu ly luong nghiep vu

Trach nhiem:

- nhan input da duoc map
- goi repository
- ap dung rule domain
- tra ve view model cho presentation

#### `infrastructure/`

Chua:

- Prisma repository
- ham doc/ghi database

Trach nhiem:

- noi chuyen voi DB
- khong render UI
- khong chua workflow cua route

#### `presentation/`

Chua:

- React component
- page screen component
- client interaction component

Trach nhiem:

- render du lieu da duoc tinh san
- nhan action qua props neu can

### 3. `shared/` la noi dung chung toan project

`src/shared/db`

- singleton Prisma

`src/shared/lib`

- date helper
- recurrence helper

Chi dat vao `shared` nhung gi duoc dung boi nhieu feature.

## Cau truc thu muc

```txt
src/
  app/
    today/
      page.tsx
      actions.ts
    habits/
      page.tsx
      actions.ts
    templates/
      page.tsx
      actions.ts
    journal/
      page.tsx
      actions.ts
    dashboard/
      page.tsx
      actions.ts

  features/
    today/
      domain/
      application/
      infrastructure/
      presentation/
    habits/
      domain/
      application/
      infrastructure/
      presentation/
    templates/
      domain/
      application/
      infrastructure/
      presentation/
    journal/
      domain/
      application/
      infrastructure/
      presentation/
    dashboard/
      domain/
      application/
      infrastructure/
      presentation/

  shared/
    db/
    lib/
```

## Dong chay du lieu

### Query flow

`app/page.tsx`
-> `features/*/application/get-...`
-> `features/*/infrastructure/*repository`
-> `shared/db/prisma`

### Mutation flow

`form`
-> `app/*/actions.ts`
-> `features/*/application/*command`
-> `features/*/infrastructure/*repository`
-> `shared/db/prisma`
-> `revalidatePath()`

## Muc dich cua file

### Route files

- `src/app/*/page.tsx`
  - route entrypoint
  - lay data tu application layer
  - render screen component

- `src/app/*/actions.ts`
  - server action wrapper
  - map `FormData` sang input cua use case
  - trigger `revalidatePath`

### Feature files

- `domain/*.ts`
  - rule nghiep vu thuần

- `application/*.ts`
  - use case/query orchestration

- `infrastructure/*repository.ts`
  - Prisma access theo feature

- `presentation/*.tsx`
  - UI component cua feature

### Shared files

- `src/shared/db/prisma.ts`
  - singleton Prisma client

- `src/shared/lib/day.ts`
  - helper xu ly ngay

- `src/shared/lib/recurrence.ts`
  - helper bitmask weekday, week range, recurrence

## Quy uoc khi phat trien tiep

1. Khong goi Prisma truc tiep trong `page.tsx`
2. Khong viet rule nghiep vu trong `actions.ts`
3. Neu logic chi thuoc mot feature, dat trong `features/<name>`
4. Neu logic dung chung nhieu feature, dat trong `shared`
5. Client component chi nen giu interaction state, khong giu business workflow

## Tai sao khong dung clean architecture qua nang

Project nay la Next.js app quy mo nho-den-vua, nen khong can:

- DI container
- generic repository pattern cho moi model
- interface abstraction day dac

Kien truc hien tai uu tien:

- de doc
- de scale
- de test
- khong over-engineer
