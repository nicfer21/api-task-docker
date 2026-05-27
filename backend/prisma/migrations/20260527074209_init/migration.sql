-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "task";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user";

-- CreateTable
CREATE TABLE "user"."person" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "birthday" DATE NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."session" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(100),
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task"."toDo" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "toDo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user"."session" ADD CONSTRAINT "session_personId_fkey" FOREIGN KEY ("personId") REFERENCES "user"."person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task"."toDo" ADD CONSTRAINT "toDo_personId_fkey" FOREIGN KEY ("personId") REFERENCES "user"."person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
