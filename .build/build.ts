process.env.NODE_ENV = 'production'

import { say } from 'cfonts'
import { deleteAsync } from 'del'
import chalk from 'chalk'
import { rollup, OutputOptions } from 'rollup'
import { Listr } from 'listr2'
import rollupOptions from './rollup.config'
import rollupOptionsBrowser from './rollup.config.browser'
import { okayLog, errorLog, doneLog } from './log'


const mainOpt = rollupOptions(process.env.NODE_ENV);
const mainOptBrowser = rollupOptionsBrowser(process.env.NODE_ENV);
async function clean() {
    await deleteAsync(['dist/*'])
    console.log(`\n${doneLog}clear done`)
    if (process.env.BUILD_TARGET === 'onlyClean') process.exit()
}

function unionBuild() {
    greeting()
    if (process.env.BUILD_TARGET === 'clean' || process.env.BUILD_TARGET === 'onlyClean') clean()

    const tasksLister = new Listr([
        {
            title: 'building main process',
            task: async () => {
                try {
                    const build = await rollup(mainOpt)
                    await build.write(mainOpt.output as OutputOptions)
                } catch (error) {
                    console.error(`\n${error}\n`)
                    console.log(`\n  ${errorLog}failed to build main process`)
                    process.exit(1)
                }
            }
        },
        {
            title: 'building browser process',
            task: async () => {
                try {
                    const build = await rollup(mainOptBrowser)
                    await build.write(mainOptBrowser.output as OutputOptions)
                } catch (error) {
                    console.error(`\n${error}\n`)
                    console.log(`\n  ${errorLog}failed to build browser process`)
                    process.exit(1)
                }
            }
        }
    ], {
        exitOnError: false
    })
    tasksLister.run()
}

function greeting() {
    const cols = process.stdout.columns
    let text: boolean | string = ''

    if (cols > 85) text = `let's-build`
    else if (cols > 60) text = `let's-|build`
    else text = false

    if (text) {
        say(text, {
            colors: ['yellow'],
            font: 'simple3d',
            space: false
        })
    } else console.log(chalk.yellow.bold(`\n  let's-build`))
    console.log()
}
unionBuild()
