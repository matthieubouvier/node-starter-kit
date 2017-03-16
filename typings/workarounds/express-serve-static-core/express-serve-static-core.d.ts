// Workaround on express typings, make user property available on Request object
declare module "express-serve-static-core" {
	export interface Request {
		user: any;
	}
}