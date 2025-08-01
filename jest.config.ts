import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({

  
  dir: './',
});



const config: Config = {
  
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  
  
  testEnvironment: 'jest-environment-jsdom',


  
  preset: 'ts-jest',


  moduleNameMapper: {
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/components/(.*)$': '<rootDir>/app/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/service/(.*)$': '<rootDir>/app/service/$1',
  },
};


export default createJestConfig(config);