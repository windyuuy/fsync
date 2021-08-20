namespace lang.libs {

    /**
     * 日志参数
     */
    export interface ILogParam {
        time?: boolean
        tags?: string[]
    }

    export class Log {

        private static _enablePlainLog: boolean = false;
        public static get enablePlainLog(): boolean {
            return Log._enablePlainLog;
        }
        public static toPlainLog(args: any[]) {
            const plainTexts = []
            for (let info of args) {
                let ret = ''
                if (info instanceof Error) {
                    ret = `Error content: ${JSON.stringify(info)}\n${info.stack}`
                } else if (info instanceof Object) {
                    ret = JSON.stringify(info)
                } else {
                    ret = info
                }
                plainTexts.push(ret)
            }

            return plainTexts
        }

        public static set enablePlainLog(value: boolean) {
            Log._enablePlainLog = value;
            if (value) {
                const logOld = console.log
                const warnOld = console.warn
                const errorOld = console.error
                console['logOld'] = console['logOld'] || logOld
                console['warnOld'] = console['warnOld'] || warnOld
                console['errorOld'] = console['errorOld'] || errorOld
                console.log = function (...args) {
                    const plainTexts = Log.toPlainLog(args)
                    logOld.apply(console, plainTexts)
                }

                console.warn = function (...args) {
                    const plainTexts = Log.toPlainLog(args)
                    warnOld.apply(console, plainTexts)
                }

                console.error = function (...args) {
                    const plainTexts = Log.toPlainLog(args)
                    errorOld.apply(console, plainTexts)
                }
            } else {
                if (console['logOld']) {
                    console.log = console['logOld']
                }
                if (console['warnOld']) {
                    console.warn = console['warnOld']
                }
                if (console['errorOld']) {
                    console.error = console['errorOld']
                }
            }
        }

        protected static _instance: Log
        public static get instance(): Log {
            if (!this._instance)
                this._instance = new Log();
            return this._instance;
        }

        protected time?: boolean
        protected tags?: string[]

        constructor(x: ILogParam = {}) {
            this.setLogParams(x)
        }

        setLogParams({ time, tags }: ILogParam = {}) {
            this.time = time
            if (tags) {
                this.tags = tags.concat()
            }
        }


        protected getTagsStamp() {
            let tag = `[${this.tags.join('][')}]`
            if (this.time) {
                tag = tag + `[t/${Date.now()}]`
            }
            return tag
        }

        log(...args) {
            // if (this.tags) {
            //     args = this.tags.concat(args)
            // }
            // if (this.time) {
            //     args.push(new Date().getTime())
            // }
            console.log(' -', this.getTagsStamp(), ...args);
        }

        /**
         * 将消息打印到控制台，不存储至日志文件
         */
        debug(...args) {
            // if (this.tags) {
            //     args = this.tags.concat(args)
            // }
            // if (this.time) {
            //     args.push(new Date().getTime())
            // }
            console.debug(' -', this.getTagsStamp(), ...args);
        }

        /**
         * 将消息打印到控制台，不存储至日志文件
         */
        info(...args) {
            // if (this.tags) {
            //     args = this.tags.concat(args)
            // }
            // if (this.time) {
            //     args.push(new Date().getTime())
            // }
            console.info(' -', this.getTagsStamp(), ...args);
        }

        /**
         * 将消息打印到控制台，并储至日志文件
         */
        warn(...args) {
            // if (this.tags) {
            //     args = this.tags.concat(args)
            // }
            // if (this.time) {
            //     args.push(new Date().getTime())
            // }
            console.warn(' -', this.getTagsStamp(), ...args);
        }

        /**
         * 将消息打印到控制台，并储至日志文件
         */
        error(...args) {
            // if (this.tags) {
            //     args = this.tags.concat(args)
            // }
            // if (this.time) {
            //     args.push(new Date().getTime())
            // }
            console.error(' -', this.getTagsStamp(), ...args);
            for (let p of args) {
                if (p instanceof Error) {
                    console.log(p.stack)
                }
            }
            console.log('>>>error')
            console.log(new Error().stack)
        }

    }

    export var log = Log.instance

}