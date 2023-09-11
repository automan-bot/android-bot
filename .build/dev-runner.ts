process.env.NODE_ENV = 'development'

import chalk from 'chalk';
import { watch } from 'rollup';
import rollupOptions from './rollup.config'
import rollupOptionsBrowser from './rollup.config.browser'


const mainOpt =process.env.BUILD_TARGET === 'browser'? rollupOptionsBrowser(process.env.NODE_ENV):rollupOptions(process.env.NODE_ENV)

function logStats(proc: string, data: any) {
    let log = ''

    log += chalk.yellow.bold(`┏ 编译过程 ${new Array((19 - proc.length) + 1).join('-')}`)
    log += '\n\n'

    if (typeof data === 'object') {
        data.toString({
            colors: true,
            chunks: false
        }).split(/\r?\n/).forEach((line: string) => {
            log += '  ' + line + '\n'
        })
    } else {
        log += `  ${data}\n`
    }

    log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'
    console.log(log)
}


function startMain(): Promise<void> {
    return new Promise((resolve, reject) => {
        const MainWatcher = watch(mainOpt);
        MainWatcher.on('change', filename => {
            // 主进程日志部分
            logStats(`主进程文件变更`, filename)
        });
        MainWatcher.on('event', event => {
            if (event.code === 'END') {
                resolve()
            } else if (event.code === 'ERROR') {
                reject(event.error)
            }
        })
    })
}


function greeting() {
    console.log(chalk.blue(` 准备启动...`) + '\n')
}

async function init() {
    greeting()

    try {
        await startMain()
    } catch (error) {
        console.error(error)
        process.exit(1)
    }

}

init()
