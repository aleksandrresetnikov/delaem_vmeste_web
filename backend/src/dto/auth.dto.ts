import {t} from "elysia";
import {UserRole} from "../../generated/prisma";


// Body для /api/auth/login
export const LoginBodyDto = t.Object(
    {
      email: t.String({
        minLength: 3,
        maxLength: 96,
        pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
      }),

    }
)

// Body для /api/auth/register
export const RegBodyDto = t.Object(
    {
      username: t.String({
        minLength: 3,
        maxLength: 32
      }),
      email: t.String({
        minLength: 3,
        maxLength: 96,
        pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
      }),
      birthDate: t.Date()
    }
)

export const VerifyBodyDto = t.Object(
    {
      email: t.String({
        minLength: 3,
        maxLength: 96,
        pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
      }),
      otp: t.Number({
        minimum: 1000,
        maximum: 9999
      })
    }
)

export const ProfilePostBodyDto = t.Object(
    {
      username: t.String({
        minLength: 3,
        maxLength: 32
      }),
      fullname: t.String({
        minLength: 3,
        maxLength: 32
      }),
      birthDate: t.Date(),
      role: t.Optional(t.Enum(UserRole)),

      address: t.Optional(t.String()),
      phone: t.Optional(t.String()),
      skills: t.Optional(t.String()),
      categories: t.Optional(t.Array(t.String())),
    }
)