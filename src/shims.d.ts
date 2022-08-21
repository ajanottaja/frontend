// https://github.com/windicss/windicss/pull/322

import { AttributifyAttributes } from 'windicss/types/jsx'

declare module 'react' {
  interface HTMLAttributes extends AttributifyAttributes {}
}

// https://www.npmjs.com/package/jest-extended#typescript

import 'jest-extended';